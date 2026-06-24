// Run: bun run optimize:photos   (prompts for the originals dir + quality)
//   or: bun run scripts/optimize-photos.ts <input-dir> [output-dir] --quality <1-100>
//
// Prepares raw photos for upload to images.francois.works. Encode from your
// ORIGINALS, never from anything already on the CDN: the whole point is a single
// lossy pass instead of the old original -> JPEG q85 4:2:0 -> Bunny WebP path,
// which threw away quality across two generations plus chroma subsampling.
//
// For each photo it emits three pre-sized WebP variants (960 / 1440 / 1920 wide,
// auto-oriented, sRGB, metadata stripped, full chroma) plus a tiny base64 blur
// for blur-up. Bunny then serves these as static files with no edge processing,
// so there is no per-request Optimizer cost and the browser picks a width by DPR
// through srcset. Widths trace the canvas sizing in lib/photography-math.ts.

import { mkdir, readdir, stat, writeFile } from 'node:fs/promises'
import { basename, extname, join, resolve } from 'node:path'
import sharp from 'sharp'
import { createProgress } from './progress'
import { createPrompter, isInteractive, type Prompter } from './prompt'

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
const DEFAULT_QUALITY = 90
// Keep in sync with PHOTO_WIDTHS in lib/photography.ts.
const VARIANT_WIDTHS = [960, 1440, 1920] as const
const BLUR_WIDTH = 20
const CONCURRENCY = 4
// Bunny-relative path prefix (no leading slash) so the manifest src resolves
// against images.francois.works rather than serving from /public. Matches where
// the live photos sit (the images zone's /photos folder).
const PHOTO_DIR = 'photos'

type Options = { inputDir: string; outputDir: string; quality: number }
type RawArgs = { inputDir: string | null; outputDir: string | null; quality: number | null }
type Variant = { width: number; height: number; bytes: number }
type Result = {
  slug: string
  input: string
  srcWidth: number
  srcHeight: number
  variants: Variant[]
  blur: string
  inBytes: number
  outBytes: number
}

function parseArgs(argv: string[]): RawArgs {
  const positional: string[] = []
  let quality: number | null = null
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--quality') quality = Number(argv[++i])
    else positional.push(arg ?? '')
  }
  return { inputDir: positional[0] ?? null, outputDir: positional[1] ?? null, quality }
}

async function resolveOptions(raw: RawArgs, prompter: Prompter | null): Promise<Options> {
  let inputDir = raw.inputDir
  if (!inputDir && prompter) inputDir = await prompter.ask('Originals directory')
  if (!inputDir) {
    process.stderr.write('usage: bun run optimize:photos <input-dir> [output-dir] [--quality 90]\n')
    process.exit(2)
  }
  inputDir = resolve(inputDir)

  let outputDir = raw.outputDir
  if (!outputDir && prompter)
    outputDir = await prompter.ask('Output directory', join(inputDir, 'optimized'))
  outputDir = resolve(outputDir ?? join(inputDir, 'optimized'))

  let quality = raw.quality
  if (quality === null && prompter) {
    quality = Number(await prompter.ask('WebP quality', String(DEFAULT_QUALITY)))
  }
  quality ??= DEFAULT_QUALITY
  if (!Number.isFinite(quality) || quality < 1 || quality > 100) {
    process.stderr.write(`invalid quality ${quality} (expected 1-100)\n`)
    process.exit(2)
  }

  return { inputDir, outputDir, quality }
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
  const meta = await sharp(input, { failOn: 'none' }).metadata()
  const srcWidth = meta.width ?? 0
  const srcHeight = meta.height ?? 0

  const variants: Variant[] = []
  let outBytes = 0
  for (const target of VARIANT_WIDTHS) {
    const { data, info } = await sharp(input, { failOn: 'none' })
      // .rotate() bakes EXIF orientation into pixels before metadata is stripped,
      // otherwise sideways phone shots stay sideways once the orientation tag is gone.
      .rotate()
      .resize(target, null, { withoutEnlargement: true })
      // Convert wide-gamut input (iPhone Display P3, Adobe RGB) to sRGB and drop the
      // profile; browsers assume sRGB, so this prevents a color shift.
      .withIccProfile('srgb', { attach: false })
      // smartSubsample keeps full chroma where it matters at high quality, which
      // is the whole reason we moved off Bunny's 4:2:0 edge transform.
      .webp({ quality: opts.quality, smartSubsample: true, effort: 6 })
      .toBuffer({ resolveWithObject: true })
    await writeFile(join(opts.outputDir, `${slug}-${target}.webp`), data)
    variants.push({ width: info.width, height: info.height, bytes: data.byteLength })
    outBytes += data.byteLength
  }

  const blurBuf = await sharp(input, { failOn: 'none' })
    .rotate()
    .resize(BLUR_WIDTH, null, { withoutEnlargement: true })
    .webp({ quality: 50 })
    .toBuffer()
  const blur = `data:image/webp;base64,${blurBuf.toString('base64')}`

  const { size: inBytes } = await stat(input)
  return { slug, input, srcWidth, srcHeight, variants, blur, inBytes, outBytes }
}

function kb(bytes: number): string {
  return `${Math.round(bytes / 1024)}KB`
}

type CarriedMeta = { alt: string; location: string }

// Best-effort: carry hand-written alt/location forward when re-encoding files
// whose slugs match the existing manifest. Misses (e.g. camera-named originals)
// just fall back to empty TODO fields, same as a first run.
async function loadExistingMeta(): Promise<Map<string, CarriedMeta>> {
  const map = new Map<string, CarriedMeta>()
  try {
    const mod = (await import('../content/photography/manifest')) as {
      photographyManifest: Array<{ slug: string; alt: string; location: string }>
    }
    for (const p of mod.photographyManifest) map.set(p.slug, { alt: p.alt, location: p.location })
  } catch {
    // no existing manifest to merge from
  }
  return map
}

function manifestStub(results: Result[], existing: Map<string, CarriedMeta>): string {
  const entries = results
    .map((r) => {
      const largest = r.variants.at(-1) ?? { width: r.srcWidth, height: r.srcHeight }
      const carry = existing.get(r.slug)
      const alt = carry?.alt ?? ''
      const location = carry?.location ?? ''
      return `  {
    slug: '${r.slug}',
    src: '${PHOTO_DIR}/${r.slug}',
    alt: ${JSON.stringify(alt)},${alt ? '' : ' // TODO'}
    location: ${JSON.stringify(location)},${location ? '' : ' // TODO'}
    width: ${largest.width},
    height: ${largest.height},
    blur: '${r.blur}',
  },`
    })
    .join('\n')
  return `// Paste into content/photography/manifest.ts, fill any empty alt/location,
// then run 'bun run format'. src is the Bunny-relative base path (no extension);
// lib/photography appends -<width>.webp per variant.
${entries}\n`
}

async function main() {
  const prompter = isInteractive ? createPrompter() : null
  const opts = await resolveOptions(parseArgs(process.argv.slice(2)), prompter)
  prompter?.close()
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

  process.stdout.write(
    `Encoding ${planned.length} photo(s) → ${VARIANT_WIDTHS.length} WebP variants each (q${opts.quality})\n`,
  )
  const progress = createProgress(planned.length)
  const failures: string[] = []
  const results = (
    await mapPool(planned, CONCURRENCY, async ({ file, slug }) => {
      progress.start(slug)
      try {
        const r = await encode(file, slug, opts)
        const sizes = r.variants.map((v) => `${v.width}w ${kb(v.bytes)}`).join(' ')
        progress.succeed(slug, `${r.srcWidth}×${r.srcHeight} → ${sizes}`)
        return r
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        failures.push(`${file}: ${message}`)
        progress.fail(slug, message)
        return null
      }
    })
  ).filter((r): r is Result => r !== null)
  progress.stop()

  let savedIn = 0
  let savedOut = 0
  for (const r of results) {
    savedIn += r.inBytes
    savedOut += r.outBytes
  }

  const existing = await loadExistingMeta()
  await writeFile(join(opts.outputDir, 'manifest-stub.txt'), manifestStub(results, existing))

  process.stdout.write(
    `\n${results.length}/${files.length} encoded → ${opts.outputDir}\n` +
      `originals ${kb(savedIn)} → variants ${kb(savedOut)} (${VARIANT_WIDTHS.length} WebP each)\n` +
      `manifest entries → ${join(opts.outputDir, 'manifest-stub.txt')}\n`,
  )

  if (failures.length > 0) {
    process.stderr.write(`\n${failures.length} failed:\n`)
    for (const f of failures) process.stderr.write(`  - ${f}\n`)
    process.exit(1)
  }
}

await main()
