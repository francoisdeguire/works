// Run: bun run optimize:video   (prompts for the file(s) + mode)
//   or: bun run scripts/optimize-video.ts <input...> [--mode tile|article] [--crf 23]
//       [--social] [--out-dir <dir>]
//
// Wraps the CLAUDE.md ffmpeg recipes (H.264, CRF 23, lanczos, audio stripped,
// faststart) so clips land upload-ready without retyping flags. Two modes:
// `tile` pins width to exactly 720 px (every artifact tile shares one encode
// width; height follows the source aspect), `article` caps width at 720 without
// upscaling shorter clips. Each clip also gets a frame-0 poster JPG from the
// ENCODED output, so the poster→video swap on the page is invisible.
//
// Folders are scanned recursively, so a videos/ tree with one folder per
// artifact works as a single input. Outputs land flat BESIDE each source
// (loop.mov → loop.mp4 + loop-poster.jpg in the same folder), and a re-run
// treats an .mp4 next to a same-named source as a previous output, never an
// input. An .mp4 source with no sibling would collide with its own output —
// rename it or pass --out-dir. --out-dir merges everything into one flat
// folder; same-named clips from different artifact folders clobber there.
//
// --social additionally emits <base>-social.mp4 for X/Threads. Platforms
// re-encode everything server-side, so unlike the CDN cut it keeps headroom:
// 1080 px wide, near-lossless CRF 18, forced yuv420p, and a silent AAC track
// (X is known to reject or mangle audio-less MP4s). Post it, never upload it.
//
// Encode from your original recordings, never from a previously encoded MP4 —
// that would stack a second lossy pass. Upload MP4s to videos.francois.works
// and posters to images.francois.works.

import { execFile } from 'node:child_process'
import { mkdir, readdir, stat } from 'node:fs/promises'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { promisify } from 'node:util'
import { createProgress } from './progress'
import { createPrompter, isInteractive, type Prompter } from './prompt'

const run = promisify(execFile)

const DEFAULT_CRF = 23
// Past this, raise CRF instead of shipping — Bunny bills per GB egress.
const SIZE_WARN_BYTES = 1.5 * 1024 * 1024
const VIDEO_EXT = new Set(['.mov', '.mp4', '.m4v', '.webm', '.mkv', '.avi'])

// The '...' quoting inside the filter is ffmpeg's own escaping (a bare comma
// would end the scale filter), not shell quoting — pass it through verbatim.
const FILTERS = {
  tile: 'scale=720:-2:flags=lanczos',
  article: "scale='min(720,iw)':-2:flags=lanczos",
} as const

const SOCIAL_CRF = 18
const SOCIAL_FILTER = "scale='min(1080,iw)':-2:flags=lanczos"

type Mode = keyof typeof FILTERS
type Options = {
  inputs: string[]
  mode: Mode
  crf: number
  social: boolean
  outDir: string | null
}
type RawArgs = {
  inputs: string[]
  mode: string | null
  crf: number | null
  social: boolean | null
  outDir: string | null
}

function parseArgs(argv: string[]): RawArgs {
  const inputs: string[] = []
  let mode: string | null = null
  let crf: number | null = null
  let social: boolean | null = null
  let outDir: string | null = null
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--mode') mode = argv[++i] ?? null
    else if (arg === '--crf') crf = Number(argv[++i])
    else if (arg === '--social') social = true
    else if (arg === '--out-dir') outDir = argv[++i] ?? null
    else inputs.push(arg ?? '')
  }
  return { inputs, mode, crf, social, outDir }
}

async function expandInputs(paths: string[]): Promise<string[]> {
  const files: string[] = []
  for (const p of paths) {
    const info = await stat(p).catch(() => null)
    if (!info) {
      process.stderr.write(`not found: ${p}\n`)
      continue
    }
    if (info.isDirectory()) files.push(...(await collectDir(p)))
    else files.push(p)
  }
  return files.sort()
}

async function collectDir(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const sourceBases = new Set<string>()
  for (const e of entries) {
    const ext = extname(e.name).toLowerCase()
    if (e.isFile() && ext !== '.mp4' && VIDEO_EXT.has(ext)) {
      sourceBases.add(basename(e.name, extname(e.name)))
    }
  }
  const files: string[] = []
  for (const e of entries) {
    const ext = extname(e.name).toLowerCase()
    if (e.isDirectory()) {
      files.push(...(await collectDir(join(dir, e.name))))
    } else if (VIDEO_EXT.has(ext)) {
      // An .mp4 (or -social.mp4) next to a same-named source is a previous
      // output, not an input.
      const base = basename(e.name, extname(e.name))
      if (ext === '.mp4' && sourceBases.has(base.replace(/-social$/, ''))) continue
      files.push(join(dir, e.name))
    }
  }
  return files
}

function usage(): never {
  process.stderr.write(
    'usage: bun run optimize:video <input...> [--mode tile|article] [--crf 23] [--social] [--out-dir <dir>]\n',
  )
  process.exit(2)
}

function isMode(value: string): value is Mode {
  return value in FILTERS
}

async function resolveOptions(raw: RawArgs, prompter: Prompter | null): Promise<Options> {
  let inputPaths = raw.inputs
  if (inputPaths.length === 0 && prompter) {
    const answer = await prompter.ask('Video file(s) or folder')
    inputPaths = answer.split(/\s+/).filter(Boolean)
  }
  if (inputPaths.length === 0) usage()
  const inputs = await expandInputs(inputPaths.map((p) => resolve(p)))
  if (inputs.length === 0) {
    process.stderr.write('no videos found\n')
    process.exit(1)
  }

  let mode = raw.mode
  if (mode === null && prompter) {
    mode = await prompter.ask('Mode — tile (pin 720 wide) or article (cap at 720)', 'tile')
  }
  mode ??= 'tile'
  if (!isMode(mode)) usage()

  let crf = raw.crf
  if (crf === null && prompter) crf = Number(await prompter.ask('CRF', String(DEFAULT_CRF)))
  crf ??= DEFAULT_CRF
  if (!Number.isFinite(crf) || crf < 0 || crf > 51) usage()

  let social = raw.social
  if (social === null && prompter) {
    social = /^y/i.test(await prompter.ask('Social cut for X/Threads? (y/N)', 'n'))
  }
  social ??= false

  let outDir = raw.outDir
  if (outDir === null && prompter) {
    outDir = (await prompter.ask('Output directory (blank = ./optimized beside input)')) || null
  }

  return { inputs, mode, crf, social, outDir: outDir ? resolve(outDir) : null }
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
  return `${Math.round(bytes / 1024)}KB`
}

function ffmpegError(error: unknown): string {
  if (error && typeof error === 'object' && 'stderr' in error) {
    const stderr = String((error as { stderr: unknown }).stderr).trim()
    const last = stderr.split('\n').at(-1)
    if (last) return last
  }
  if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
    return 'ffmpeg not found — install it first (brew install ffmpeg)'
  }
  return error instanceof Error ? error.message : String(error)
}

async function probeDimensions(file: string): Promise<string | null> {
  try {
    const { stdout } = await run('ffprobe', [
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-show_entries',
      'stream=width,height',
      '-of',
      'csv=s=x:p=0',
      file,
    ])
    const dims = stdout.trim()
    return dims || null
  } catch {
    return null
  }
}

async function encodeVideo(input: string, out: string, opts: Options): Promise<void> {
  await run('ffmpeg', [
    '-hide_banner',
    '-loglevel',
    'error',
    '-y',
    '-i',
    input,
    '-c:v',
    'libx264',
    '-crf',
    String(opts.crf),
    '-preset',
    'slow',
    '-an',
    '-movflags',
    '+faststart',
    '-vf',
    FILTERS[opts.mode],
    out,
  ])
}

async function encodeSocial(input: string, out: string): Promise<void> {
  await run('ffmpeg', [
    '-hide_banner',
    '-loglevel',
    'error',
    '-y',
    '-i',
    input,
    '-f',
    'lavfi',
    '-i',
    'anullsrc=channel_layout=stereo:sample_rate=44100',
    '-map',
    '0:v:0',
    '-map',
    '1:a:0',
    '-c:v',
    'libx264',
    '-crf',
    String(SOCIAL_CRF),
    '-preset',
    'slow',
    '-pix_fmt',
    'yuv420p',
    '-c:a',
    'aac',
    '-b:a',
    '128k',
    '-shortest',
    '-movflags',
    '+faststart',
    '-vf',
    SOCIAL_FILTER,
    out,
  ])
}

async function encodePoster(video: string, out: string): Promise<void> {
  await run('ffmpeg', [
    '-hide_banner',
    '-loglevel',
    'error',
    '-y',
    '-ss',
    '0',
    '-i',
    video,
    '-frames:v',
    '1',
    '-q:v',
    '3',
    out,
  ])
}

async function main() {
  const prompter = isInteractive ? createPrompter() : null
  const opts = await resolveOptions(parseArgs(process.argv.slice(2)), prompter)
  prompter?.close()

  const extras = opts.social ? ' + social cut' : ''
  process.stdout.write(
    `Encoding ${opts.inputs.length} clip(s) — ${opts.mode} mode, CRF ${opts.crf} + frame-0 poster${extras} each\n`,
  )
  const progress = createProgress(opts.inputs.length * (opts.social ? 3 : 2))
  for (const input of opts.inputs) {
    const dir = opts.outDir ?? dirname(input)
    await mkdir(dir, { recursive: true })
    const base = basename(input, extname(input))
    const outVideo = join(dir, `${base}.mp4`)
    const outPoster = join(dir, `${base}-poster.jpg`)
    const outSocial = join(dir, `${base}-social.mp4`)

    // Clips in per-artifact folders are often all named the same (loop.mov),
    // so label progress lines with the parent folder.
    const label = (file: string) => join(basename(dirname(input)), basename(file))
    const videoName = label(outVideo)
    // No poster/social without a video — count the skipped steps so n/total stays honest.
    const skipRest = (detail: string) => {
      progress.fail(videoName, detail)
      progress.fail(label(outPoster), 'skipped')
      if (opts.social) progress.fail(label(outSocial), 'skipped')
      process.exitCode = 1
    }
    if (outVideo === input) {
      skipRest('output would overwrite the source — rename it or use --out-dir')
      continue
    }
    progress.start(videoName)
    try {
      await encodeVideo(input, outVideo, opts)
      const [{ size: inBytes }, { size: outBytes }, dims] = await Promise.all([
        stat(input),
        stat(outVideo),
        probeDimensions(outVideo),
      ])
      const warn = outBytes > SIZE_WARN_BYTES ? '  ⚠ over 1.5MB — raise --crf' : ''
      progress.succeed(
        videoName,
        `${dims ?? '?'} ${formatSize(inBytes)}→${formatSize(outBytes)}${warn}`,
      )
    } catch (error) {
      skipRest(ffmpegError(error))
      continue
    }

    const posterName = label(outPoster)
    progress.start(posterName)
    try {
      await encodePoster(outVideo, outPoster)
      const { size } = await stat(outPoster)
      progress.succeed(posterName, formatSize(size))
    } catch (error) {
      progress.fail(posterName, ffmpegError(error))
      process.exitCode = 1
    }

    if (!opts.social) continue
    // The social cut encodes from the ORIGINAL, not the CDN encode — one lossy pass.
    const socialName = label(outSocial)
    progress.start(socialName)
    try {
      await encodeSocial(input, outSocial)
      const [{ size }, dims] = await Promise.all([stat(outSocial), probeDimensions(outSocial)])
      progress.succeed(socialName, `${dims ?? '?'} ${formatSize(size)}`)
    } catch (error) {
      progress.fail(socialName, ffmpegError(error))
      process.exitCode = 1
    }
  }
  progress.stop()

  process.stdout.write(
    '\nUpload MP4s to videos.francois.works, posters to images.francois.works.\n' +
      'Manifest width/height must match the encoded dimensions above.\n' +
      (opts.social ? 'Social cuts (-social.mp4) are for posting, not the CDN.\n' : ''),
  )
}

await main()
