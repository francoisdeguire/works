// Run: bun run scripts/optimize-photos.ts <input-dir> [output-dir]
//   --quality <1-100>   master JPEG quality (default 85)
//   --max-edge <px>     long-edge cap (default 1440 = largest srcset width)
//
// Prepares raw photos for upload to images.francois.works. Produces ONE master
// per photo: long edge capped, auto-oriented, converted to sRGB, metadata
// stripped, re-encoded with mozjpeg. Bunny does per-width resizing + webp at the
// edge, so a local srcset would only duplicate that and waste storage. We ship
// a single high-quality master and let the CDN derive delivery variants.
//
// Master quality (85) sits above delivery quality (Bunny serves 65-75) on
// purpose: the master is a re-encode source, so headroom here avoids compounding
// loss when Bunny produces the webp the browser actually downloads.

import { mkdir, readdir, stat, writeFile } from 'node:fs/promises'
import { basename, extname, join, resolve } from 'node:path'
import sharp from 'sharp'

const INPUT_EXT = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
  '.tif',
  '.tiff',
  '.heic',
  '.heif',
])
const DEFAULT_QUALITY = 85
const DEFAULT_MAX_EDGE = 1440
const CONCURRENCY = 4
// Bunny-relative path prefix (no leading slash) so the manifest src resolves
// against images.francois.works rather than serving from /public.
const PHOTO_DIR = 'photography'

type Options = { inputDir: string; outputDir: string; quality: number; maxEdge: number }
type Result = {
  slug: string
  input: string
  srcWidth: number
  srcHeight: number
  outWidth: number
  outHeight: number
  inBytes: number
  outBytes: number
}

function parseArgs(argv: string[]): Options {
  const positional: string[] = []
  let quality = DEFAULT_QUALITY
  let maxEdge = DEFAULT_MAX_EDGE
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--quality') quality = Number(argv[++i])
    else if (arg === '--max-edge') maxEdge = Number(argv[++i])
    else positional.push(arg ?? '')
  }
  const inputDir = positional[0]
  if (!inputDir) {
    process.stderr.write('usage: bun run scripts/optimize-photos.ts <input-dir> [output-dir]\n')
    process.exit(2)
  }
  if (!Number.isFinite(quality) || quality < 1 || quality > 100) {
    process.stderr.write(`invalid --quality ${quality} (expected 1-100)\n`)
    process.exit(2)
  }
  if (!Number.isFinite(maxEdge) || maxEdge < 1) {
    process.stderr.write(`invalid --max-edge ${maxEdge}\n`)
    process.exit(2)
  }
  return {
    inputDir: resolve(inputDir),
    outputDir: resolve(positional[1] ?? join(inputDir, 'optimized')),
    quality,
    maxEdge,
  }
}

function slugify(name: string): string {
  const base = name
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base || 'photo'
}

async function collect(dir: string, skip: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (resolve(full) === skip) continue
    if (entry.isDirectory()) files.push(...(await collect(full, skip)))
    else if (INPUT_EXT.has(extname(entry.name).toLowerCase())) files.push(full)
  }
  return files.sort()
}

async function mapPool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length)
  // One iterator shared across workers: each .next() is atomic in single-threaded
  // JS, so no two workers ever pull the same item, and `item` stays T (not T | undefined).
  const queue = items.entries()
  const worker = async () => {
    for (const [index, item] of queue) {
      results[index] = await fn(item)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

async function encode(input: string, slug: string, opts: Options): Promise<Result> {
  const pipeline = sharp(input, { failOn: 'none' })
  const { width = 0, height = 0 } = await pipeline.metadata()
  const { data, info } = await pipeline
    // .rotate() bakes EXIF orientation into pixels before metadata is stripped,
    // otherwise sideways phone shots stay sideways once the orientation tag is gone.
    .rotate()
    .resize(opts.maxEdge, opts.maxEdge, { fit: 'inside', withoutEnlargement: true })
    // Convert wide-gamut input (iPhone Display P3, Adobe RGB) to sRGB and drop the
    // profile; browsers and Bunny assume sRGB, so this prevents a color shift.
    .withIccProfile('srgb', { attach: false })
    .jpeg({ quality: opts.quality, mozjpeg: true, chromaSubsampling: '4:2:0' })
    .toBuffer({ resolveWithObject: true })

  const outPath = join(opts.outputDir, `${slug}.jpg`)
  await writeFile(outPath, data)
  const { size: inBytes } = await stat(input)
  return {
    slug,
    input,
    srcWidth: width,
    srcHeight: height,
    outWidth: info.width,
    outHeight: info.height,
    inBytes,
    outBytes: data.byteLength,
  }
}

function kb(bytes: number): string {
  return `${Math.round(bytes / 1024)}KB`
}

function manifestStub(results: Result[]): string {
  const entries = results
    .map(
      (r) => `  {
    slug: '${r.slug}',
    src: '${PHOTO_DIR}/${r.slug}.jpg',
    alt: '', // TODO
    location: '', // TODO
    width: ${r.outWidth},
    height: ${r.outHeight},
  },`,
    )
    .join('\n')
  return `// Paste into content/photography/manifest.ts and fill alt + location.
// src is the Bunny-relative form (no leading slash) so assetUrl() resolves it
// against images.francois.works. A leading slash would serve from /public unoptimized.
${entries}\n`
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  await mkdir(opts.outputDir, { recursive: true })
  const files = await collect(opts.inputDir, opts.outputDir)
  if (files.length === 0) {
    process.stderr.write(`no images found in ${opts.inputDir}\n`)
    process.exit(1)
  }

  const seen = new Set<string>()
  const planned = files.map((file) => {
    let slug = slugify(basename(file, extname(file)))
    let suffix = 2
    while (seen.has(slug)) slug = `${slugify(basename(file, extname(file)))}-${suffix++}`
    seen.add(slug)
    return { file, slug }
  })

  const failures: string[] = []
  const results = (
    await mapPool(planned, CONCURRENCY, async ({ file, slug }) => {
      try {
        return await encode(file, slug, opts)
      } catch (error) {
        failures.push(`${file}: ${error instanceof Error ? error.message : String(error)}`)
        return null
      }
    })
  ).filter((r): r is Result => r !== null)

  let savedIn = 0
  let savedOut = 0
  for (const r of results) {
    savedIn += r.inBytes
    savedOut += r.outBytes
    const dims = `${r.srcWidth}×${r.srcHeight} → ${r.outWidth}×${r.outHeight}`
    process.stdout.write(
      `  ${r.slug.padEnd(20)} ${dims.padEnd(22)} ${kb(r.inBytes)} → ${kb(r.outBytes)}\n`,
    )
  }

  await writeFile(join(opts.outputDir, 'manifest-stub.txt'), manifestStub(results))

  process.stdout.write(
    `\n${results.length}/${files.length} encoded → ${opts.outputDir}\n` +
      `total ${kb(savedIn)} → ${kb(savedOut)} (${Math.round((1 - savedOut / savedIn) * 100)}% smaller)\n` +
      `manifest entries → ${join(opts.outputDir, 'manifest-stub.txt')}\n`,
  )

  if (failures.length > 0) {
    process.stderr.write(`\n${failures.length} failed:\n`)
    for (const f of failures) process.stderr.write(`  - ${f}\n`)
    process.exit(1)
  }
}

await main()
