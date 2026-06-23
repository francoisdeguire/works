import type { Photo } from '@/lib/photography'

// Mobile uses a fixed cell — phones run a "look at one photo at a time"
// ergonomic mode where a continuous scale would just compute the same number.
// 440 makes one photo the clear focus on a ~390px phone (a portrait photo
// fills ~55% of the width, a landscape one ~80%) with neighbors peeking in.
export const CELL_MOBILE = 440

// Desktop scales continuously with viewport width so the photo-to-viewport
// ratio stays constant across screens: a photo's long edge is ~0.72 / 2.2 ≈
// 33% of viewport width, which is the density that reads well on a 2.5k+
// screen. Below the cap every width gets that same ratio (so a 13" laptop and
// a 27" display show the same "wall" feel); above ~2640px the cap freezes the
// cell so photos don't grow cartoonish and the wall just gets denser.
const DESKTOP_TARGET_VISIBLE = 2.2
const DESKTOP_CELL_MAX = 1200
const MOBILE_BREAKPOINT = 640

export function pickCellSize(viewportWidth: number): number {
  if (viewportWidth < MOBILE_BREAKPOINT) return CELL_MOBILE
  return Math.min(DESKTOP_CELL_MAX, Math.floor(viewportWidth / DESKTOP_TARGET_VISIBLE))
}
// Subtle drift to break the grid without making photos look scattered.
// Constraint: PHOTO_RATIO + 2 * JITTER_RATIO <= 1 (in cell.tsx) so cells
// never overlap their neighbors at worst case.
export const JITTER_RATIO = 0.05
export const BUFFER = 1

export type CellRange = {
  colMin: number
  colMax: number
  rowMin: number
  rowMax: number
}

export type CellPlacement = {
  photo: Photo
  x: number
  y: number
}

// Wang-style 32-bit integer hash. Three inputs so the per-load session seed
// mixes in without a separate combine step.
export function hash3(a: number, b: number, c: number): number {
  let h = a * 374761393 + b * 668265263 + c * 2147483647
  h = (h ^ (h >>> 13)) * 1274126177
  return (h ^ (h >>> 16)) >>> 0
}

// 9-color tiling: bucket = (col mod 3, row mod 3) → 9 buckets. Any two
// cells within Chebyshev distance < 3 fall in different buckets, so the
// minimum same-photo recurrence distance is 3 cells in any direction.
// That's beyond the visible viewport on desktop (~2 cells across) so
// duplicates surface during pan, never on a static view. Within each
// bucket, the hash picks which photo from the bucket's slice of the
// manifest; the seed mixes in so the same coordinate yields a different
// photo across sessions.
export function cellPhotoIndex(col: number, row: number, seed: number, photoCount: number): number {
  if (photoCount <= 0) return 0
  if (photoCount < 9) return hash3(col, row, seed) % photoCount
  const colMod = ((col % 3) + 3) % 3
  const rowMod = ((row % 3) + 3) % 3
  const bucket = colMod * 3 + rowMod
  const baseSize = Math.floor(photoCount / 9)
  const remainder = photoCount % 9
  const bucketStart = bucket * baseSize + Math.min(bucket, remainder)
  const bucketLen = baseSize + (bucket < remainder ? 1 : 0)
  return bucketStart + (hash3(col, row, seed) % bucketLen)
}

// Output in [-1, 1]. Caller scales by JITTER_RATIO × cellSize.
export function cellJitter(col: number, row: number, seed: number, axis: 'x' | 'y'): number {
  const h = hash3(col + (axis === 'x' ? 1 : 0), row + (axis === 'y' ? 1 : 0), seed ^ 0x5a5a5a5a)
  return (h / 0xffffffff) * 2 - 1
}

export function visibleCells(
  offset: { x: number; y: number },
  viewport: { w: number; h: number },
  cellSize: number,
  buffer: number = BUFFER,
): CellRange {
  const colMin = Math.floor(-offset.x / cellSize) - buffer
  const colMax = Math.floor((-offset.x + viewport.w) / cellSize) + buffer
  const rowMin = Math.floor(-offset.y / cellSize) - buffer
  const rowMax = Math.floor((-offset.y + viewport.h) / cellSize) + buffer
  return { colMin, colMax, rowMin, rowMax }
}

export function sameRange(a: CellRange | null, b: CellRange): boolean {
  return (
    a !== null &&
    a.colMin === b.colMin &&
    a.colMax === b.colMax &&
    a.rowMin === b.rowMin &&
    a.rowMax === b.rowMax
  )
}

export function cellAt(
  col: number,
  row: number,
  seed: number,
  photos: Photo[],
  cellSize: number,
): CellPlacement {
  const photo = photos[cellPhotoIndex(col, row, seed, photos.length)] ?? photos[0]
  if (!photo) throw new Error('cellAt called with empty photos array')
  const jx = cellJitter(col, row, seed, 'x') * JITTER_RATIO * cellSize
  const jy = cellJitter(col, row, seed, 'y') * JITTER_RATIO * cellSize
  return {
    photo,
    x: col * cellSize + jx,
    y: row * cellSize + jy,
  }
}
