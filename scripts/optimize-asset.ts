// Run: bun run optimize:asset   (prompts for the file/folder + rendered size)
//   or: bun run scripts/optimize-asset.ts <input...> --width <css-px> [--height <css-px>]
//       [--dpr 2] [--quality 90] [--out-dir <dir>]
//
// Encodes article/artifact images to a SINGLE WebP at dpr × rendered size, with
// the same settings as scripts/optimize-photos.ts (q90, full chroma, sRGB,
// metadata stripped). One variant only: these sit in fixed-width layouts
// (article max-w-prose, artifact tiles), so unlike the photography canvas the
// rendered size never changes across screens and a responsive srcset would be
// dead weight. Bunny serves the file as-is, so there is no Optimizer cost.
//
// Pass --height to cover-crop to a fixed box (square artifact tiles); omit it to
// preserve aspect. Inputs may be files or a folder (all images encoded at the
// same size). The output keeps each input's basename: name inputs `cover.jpg`,
// `poster.jpg`, … to get upload-ready `cover.webp`, `poster.webp`.

import { mkdir, readdir, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, extname, join, resolve } from 'node:path'
import sharp from 'sharp'
import { createProgress } from './progress'
import { createPrompter, isInteractive, type Prompter } from './prompt'

const DEFAULT_QUALITY = 90
const DEFAULT_DPR = 2
const IMAGE_EXT = new Set([
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

type Options = {
  inputs: string[]
  outDir: string | null
  width: number
  height: number | null
  dpr: number
  quality: number
}
type RawArgs = {
  inputs: string[]
  outDir: string | null
  width: number | null
  height: number | null
  dpr: number | null
  quality: number | null
}

function parseArgs(argv: string[]): RawArgs {
  const inputs: string[] = []
  let width: number | null = null
  let height: number | null = null
  let dpr: number | null = null
  let quality: number | null = null
  let outDir: string | null = null
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--width') width = Number(argv[++i])
    else if (arg === '--height') height = Number(argv[++i])
    else if (arg === '--dpr') dpr = Number(argv[++i])
    else if (arg === '--quality') quality = Number(argv[++i])
    else if (arg === '--out-dir') outDir = argv[++i] ?? null
    else inputs.push(arg ?? '')
  }
  return { inputs, outDir, width, height, dpr, quality }
}

async function expandInputs(paths: string[]): Promise<string[]> {
  const files: string[] = []
  for (const p of paths) {
    const info = await stat(p).catch(() => null)
    if (!info) {
      process.stderr.write(`not found: ${p}\n`)
      continue
    }
    if (info.isDirectory()) {
      const entries = await readdir(p, { withFileTypes: true })
      for (const e of entries) {
        if (e.isFile() && IMAGE_EXT.has(extname(e.name).toLowerCase())) files.push(join(p, e.name))
      }
    } else {
      files.push(p)
    }
  }
  return files.sort()
}

function usage(): never {
  process.stderr.write(
    'usage: bun run optimize:asset <input...> --width <css-px> [--height <css-px>] [--dpr 2] [--quality 90] [--out-dir <dir>]\n',
  )
  process.exit(2)
}

async function resolveOptions(raw: RawArgs, prompter: Prompter | null): Promise<Options> {
  let inputPaths = raw.inputs
  if (inputPaths.length === 0 && prompter) {
    const answer = await prompter.ask('Image file(s) or folder')
    inputPaths = answer.split(/\s+/).filter(Boolean)
  }
  if (inputPaths.length === 0) usage()
  const inputs = await expandInputs(inputPaths.map((p) => resolve(p)))
  if (inputs.length === 0) {
    process.stderr.write('no images found\n')
    process.exit(1)
  }

  let width = raw.width
  if (width === null && prompter) width = Number(await prompter.ask('Rendered width (CSS px)'))
  if (width === null || !Number.isFinite(width) || width < 1) usage()

  let height = raw.height
  if (height === null && prompter) {
    const answer = await prompter.ask('Rendered height (CSS px, blank = keep aspect)')
    height = answer ? Number(answer) : null
  }
  if (height !== null && (!Number.isFinite(height) || height < 1)) usage()

  let dpr = raw.dpr
  if (dpr === null && prompter)
    dpr = Number(await prompter.ask('Device pixel ratio', String(DEFAULT_DPR)))
  dpr ??= DEFAULT_DPR
  if (!Number.isFinite(dpr) || dpr < 1) usage()

  let quality = raw.quality
  if (quality === null && prompter) {
    quality = Number(await prompter.ask('WebP quality', String(DEFAULT_QUALITY)))
  }
  quality ??= DEFAULT_QUALITY
  if (!Number.isFinite(quality) || quality < 1 || quality > 100) usage()

  let outDir = raw.outDir
  if (outDir === null && prompter) {
    outDir = (await prompter.ask('Output directory (blank = ./optimized beside input)')) || null
  }

  return { inputs, outDir: outDir ? resolve(outDir) : null, width, height, dpr, quality }
}

function kb(bytes: number): string {
  return `${Math.round(bytes / 1024)}KB`
}

type Encoded = { out: string; width: number; height: number; bytes: number }

async function encode(input: string, opts: Options): Promise<Encoded> {
  const targetW = Math.round(opts.width * opts.dpr)
  const targetH = opts.height !== null ? Math.round(opts.height * opts.dpr) : null

  const resized =
    targetH !== null
      ? // Fixed box (e.g. square tile): cover-crop the center to match object-cover.
        sharp(input, { failOn: 'none' })
          .rotate()
          .resize(targetW, targetH, { fit: 'cover', position: 'centre', withoutEnlargement: true })
      : sharp(input, { failOn: 'none' })
          .rotate()
          .resize(targetW, null, { withoutEnlargement: true })

  const { data, info } = await resized
    .withIccProfile('srgb', { attach: false })
    .webp({ quality: opts.quality, smartSubsample: true, effort: 6 })
    .toBuffer({ resolveWithObject: true })

  const dir = opts.outDir ?? join(dirname(input), 'optimized')
  await mkdir(dir, { recursive: true })
  const out = join(dir, `${basename(input, extname(input))}.webp`)
  await writeFile(out, data)
  return { out, width: info.width, height: info.height, bytes: data.byteLength }
}

async function main() {
  const prompter = isInteractive ? createPrompter() : null
  const opts = await resolveOptions(parseArgs(process.argv.slice(2)), prompter)
  prompter?.close()

  const box = opts.height !== null ? `${opts.width}×${opts.height}` : `${opts.width}w`
  process.stdout.write(
    `Encoding ${opts.inputs.length} asset(s) at ${box} CSS × ${opts.dpr} DPR (q${opts.quality})\n`,
  )
  const progress = createProgress(opts.inputs.length)
  for (const input of opts.inputs) {
    const name = basename(input)
    progress.start(name)
    try {
      const { out, width, height, bytes } = await encode(input, opts)
      const { size: inBytes } = await stat(input)
      progress.succeed(name, `→ ${basename(out)} ${width}×${height} ${kb(inBytes)}→${kb(bytes)}`)
    } catch (error) {
      progress.fail(name, error instanceof Error ? error.message : String(error))
      process.exitCode = 1
    }
  }
  progress.stop()
}

await main()
