// Run: bun run generate:icons
//
// Renders every app icon from the single source of truth, app/icon.svg:
//
//   app/favicon.ico             16/32/48 · transparent · the fallback every
//                               browser without SVG-favicon support reaches for
//   app/apple-icon.png          180 · iOS home screen and Safari bookmarks
//   public/icon-192.png         192 · manifest, purpose "any"
//   public/icon-512.png         512 · manifest, purpose "any"
//   public/icon-maskable.png    512 · manifest, purpose "maskable"
//
// The glyph is pixel art on a 5×5 grid, so rasterizing the 20px source SVG
// straight to 16px would land cell edges on fractional pixels and blur it. The
// script instead reads the cell coordinates out of the SVG and re-emits the
// squares at an integer cell size per target, which keeps every edge crisp.
//
// The PNGs are opaque white: iOS composites a transparent apple-icon onto black,
// and Android crops maskable icons to a circle or squircle, so both need a
// full-bleed background. The glyph sits at ~55–62% so it survives that crop.

import { readFile, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { createProgress } from './progress'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SOURCE = join(ROOT, 'app/icon.svg')
const FOREGROUND = '#000000'
const BACKGROUND = '#ffffff'

const ICO_ENTRIES = [
  { size: 16, cell: 3 },
  { size: 32, cell: 6 },
  { size: 48, cell: 9 },
]

const PNG_TARGETS = [
  { file: 'app/apple-icon.png', size: 180, cell: 20 },
  { file: 'public/icon-192.png', size: 192, cell: 24 },
  { file: 'public/icon-512.png', size: 512, cell: 64 },
  { file: 'public/icon-maskable.png', size: 512, cell: 56 },
]

type Glyph = { cells: [number, number][]; span: number }

const RECT =
  /<rect\b[^>]*?width="([\d.]+)"[^>]*?transform="translate\(([\d.]+)(?:[\s,]+([\d.]+))?\)"/g

async function readGlyph(): Promise<Glyph> {
  const svg = await readFile(SOURCE, 'utf8')
  const viewBox = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)
  if (!viewBox) throw new Error(`${basename(SOURCE)}: missing a "0 0 w h" viewBox`)

  const matches = [...svg.matchAll(RECT)]
  const first = matches[0]
  if (!first) throw new Error(`${basename(SOURCE)}: no <rect> with a translate()`)

  const unit = Math.round(Number(first[1]))
  const span = Math.round(Number(viewBox[1]) / unit)
  if (!Number.isInteger(unit) || unit < 1 || !Number.isInteger(span) || span < 1) {
    throw new Error(`${basename(SOURCE)}: cannot derive a cell grid`)
  }

  const cells = matches.map(
    ([, , x, y]) =>
      [Math.round(Number(x) / unit), Math.round(Number(y ?? 0) / unit)] as [number, number],
  )
  return { cells, span }
}

function render(glyph: Glyph, size: number, cell: number, background: string | null): string {
  const offset = Math.round((size - cell * glyph.span) / 2)
  const squares = glyph.cells
    .map(
      ([col, row]) =>
        `<rect x="${offset + col * cell}" y="${offset + row * cell}" width="${cell}" height="${cell}" fill="${FOREGROUND}"/>`,
    )
    .join('')
  const fill = background ? `<rect width="${size}" height="${size}" fill="${background}"/>` : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">${fill}${squares}</svg>`
}

function png(glyph: Glyph, size: number, cell: number, background: string | null): Promise<Buffer> {
  return sharp(Buffer.from(render(glyph, size, cell, background)))
    .png({ compressionLevel: 9, palette: true })
    .toBuffer()
}

// ICO container: 6-byte header, one 16-byte directory entry per image, then the
// payloads. Entries are PNG rather than BMP — supported everywhere since Vista.
function buildIco(images: { size: number; data: Buffer }[]): Buffer {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)

  const directory = Buffer.alloc(16 * images.length)
  let offset = header.length + directory.length
  images.forEach(({ size, data }, i) => {
    const at = 16 * i
    directory.writeUInt8(size >= 256 ? 0 : size, at)
    directory.writeUInt8(size >= 256 ? 0 : size, at + 1)
    directory.writeUInt16LE(1, at + 4)
    directory.writeUInt16LE(32, at + 6)
    directory.writeUInt32LE(data.length, at + 8)
    directory.writeUInt32LE(offset, at + 12)
    offset += data.length
  })

  return Buffer.concat([header, directory, ...images.map((image) => image.data)])
}

function kb(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)}KB`
}

async function main() {
  const glyph = await readGlyph()
  process.stdout.write(
    `Rendering icons from ${basename(SOURCE)} (${glyph.cells.length} cells on a ${glyph.span}×${glyph.span} grid)\n`,
  )

  const progress = createProgress(PNG_TARGETS.length + 1)

  progress.start('favicon.ico')
  const entries = await Promise.all(
    ICO_ENTRIES.map(async ({ size, cell }) => ({ size, data: await png(glyph, size, cell, null) })),
  )
  const ico = buildIco(entries)
  await writeFile(join(ROOT, 'app/favicon.ico'), ico)
  progress.succeed(
    'favicon.ico',
    `${ICO_ENTRIES.map((e) => e.size).join('/')} ${kb(ico.byteLength)}`,
  )

  for (const { file, size, cell } of PNG_TARGETS) {
    const name = basename(file)
    progress.start(name)
    try {
      const data = await png(glyph, size, cell, BACKGROUND)
      await writeFile(join(ROOT, file), data)
      progress.succeed(name, `${size}² glyph ${cell * glyph.span}px ${kb(data.byteLength)}`)
    } catch (error) {
      progress.fail(name, error instanceof Error ? error.message : String(error))
      process.exitCode = 1
    }
  }

  progress.stop()
}

await main()
