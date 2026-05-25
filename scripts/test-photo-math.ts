// Run: bun run scripts/test-photo-math.ts
// Asserts the lib/photography-math invariants. Exits non-zero on any failure
// so this can be wired into bun verify later without a test framework.

import {
  cellAt,
  cellJitter,
  cellPhotoIndex,
  hash3,
  JITTER_RATIO,
  pickCellSize,
  visibleCells,
} from '../lib/photography-math'
import type { Photo } from '../lib/photography'

const failures: string[] = []

function check(label: string, cond: boolean, detail?: string) {
  if (!cond) failures.push(`${label}${detail ? ` — ${detail}` : ''}`)
}

// --- hash3 ----------------------------------------------------------------
const h_123_a = hash3(1, 2, 3)
const h_123_b = hash3(1, 2, 3)
const h_99_2_3 = hash3(99, 2, 3)
const h_1_99_3 = hash3(1, 99, 3)
const h_1_2_99 = hash3(1, 2, 99)
check('hash3 deterministic', h_123_a === h_123_b)
check('hash3 sensitive to a', h_123_a !== h_99_2_3)
check('hash3 sensitive to b', h_123_a !== h_1_99_3)
check('hash3 sensitive to c (seed)', h_123_a !== h_1_2_99)
const h_0 = hash3(0, 0, 0)
const h_neg = hash3(-1, -1, -1)
check('hash3 result is uint32', Number.isInteger(h_0) && h_0 >= 0 && h_neg >= 0)

// --- cellPhotoIndex stability + de-dupe -----------------------------------
const SEED = 12345
const N = 20
const pickA = cellPhotoIndex(3, -1, SEED, N)
const pickB = cellPhotoIndex(3, -1, SEED, N)
const pickSeed1 = cellPhotoIndex(3, -1, 1, N)
const pickSeed99k = cellPhotoIndex(3, -1, 99999, N)
check('cellPhotoIndex deterministic', pickA === pickB)
check('cellPhotoIndex seed-sensitive', pickSeed1 !== pickSeed99k)

// Stronger invariant from the 9-color tiling: no same-photo within Chebyshev
// distance < 3 (i.e., no duplicates in any cell of the 5x5 box around (col,row)
// except the center). Subsumes the original 4-neighbor check.
let dupes = 0
for (let row = -10; row <= 10; row++) {
  for (let col = -10; col <= 10; col++) {
    const pick = cellPhotoIndex(col, row, SEED, N)
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        if (dx === 0 && dy === 0) continue
        if (cellPhotoIndex(col + dx, row + dy, SEED, N) === pick) {
          dupes++
        }
      }
    }
  }
}
check('no same-photo within Chebyshev distance 2 across [-10..10]² with N=20', dupes === 0, `${dupes} dupes found`)

// --- Tiny-N fallback: N<9 uses direct hash (9-color tiling doesn't apply).
// No distance guarantee in this regime — manifestSchema enforces N>=5 in
// production, so this is a defensive-only path. Just check valid output.
for (const testN of [3, 5, 8]) {
  for (let row = -5; row <= 5; row++) {
    for (let col = -5; col <= 5; col++) {
      const pick = cellPhotoIndex(col, row, SEED, testN)
      check(`cellPhotoIndex(${col},${row}) returns valid index with N=${testN}`, pick >= 0 && pick < testN)
    }
  }
}

// --- Larger N values all produce in-range picks ------------------------
for (const N of [5, 6, 7, 8, 20, 21, 22, 23, 24, 30]) {
  let outOfRange = 0
  for (let row = -20; row <= 20; row++) {
    for (let col = -20; col <= 20; col++) {
      const pick = cellPhotoIndex(col, row, SEED, N)
      if (pick < 0 || pick >= N) outOfRange++
    }
  }
  check(`cellPhotoIndex picks always in [0, ${N})`, outOfRange === 0, `${outOfRange} out-of-range`)
}

// --- Chebyshev-distance-2 guarantee holds across multiple seeds, N>=9 ---
for (const testSeed of [1, 42, 12345, 987654321, 2147483646]) {
  for (const N of [9, 18, 24, 30]) {
    let dupesAtSeed = 0
    for (let row = -8; row <= 8; row++) {
      for (let col = -8; col <= 8; col++) {
        const pick = cellPhotoIndex(col, row, testSeed, N)
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            if (dx === 0 && dy === 0) continue
            if (cellPhotoIndex(col + dx, row + dy, testSeed, N) === pick) {
              dupesAtSeed++
            }
          }
        }
      }
    }
    check(`no Chebyshev-2 dupes (seed=${testSeed}, N=${N})`, dupesAtSeed === 0, `${dupesAtSeed} dupes`)
  }
}

// --- cellJitter bounds ---------------------------------------------------
let jxMin = Infinity, jxMax = -Infinity
for (let row = -20; row <= 20; row++) {
  for (let col = -20; col <= 20; col++) {
    const jx = cellJitter(col, row, SEED, 'x')
    const jy = cellJitter(col, row, SEED, 'y')
    jxMin = Math.min(jxMin, jx, jy)
    jxMax = Math.max(jxMax, jx, jy)
  }
}
check('cellJitter bounded in [-1, 1]', jxMin >= -1 && jxMax <= 1, `range was [${jxMin}, ${jxMax}]`)

// --- visibleCells --------------------------------------------------------
const r0 = visibleCells({ x: 0, y: 0 }, { w: 1440, h: 900 }, 720, 1)
check(
  'visibleCells at origin covers expected range',
  r0.colMin === -1 && r0.colMax === 3 && r0.rowMin === -1 && r0.rowMax === 2,
  JSON.stringify(r0),
)

const r1 = visibleCells({ x: -720, y: 0 }, { w: 1440, h: 900 }, 720, 1)
check(
  'visibleCells shifts with positive offset (panned right)',
  r1.colMin === 0 && r1.colMax === 4,
  JSON.stringify(r1),
)

// --- cellAt composition --------------------------------------------------
const fakePhotos: Photo[] = Array.from({ length: N }, (_, i) => ({
  slug: `p${i}`,
  src: `/photography/p${i}.jpg`,
  alt: `photo ${i}`,
  location: 'Test',
  width: 1200,
  height: 800,
}))
const TEST_CELL = 1100
const placement = cellAt(0, 0, SEED, fakePhotos, TEST_CELL)
check('cellAt returns a photo', placement.photo != null)
check(
  'cellAt jitter bounded within cell',
  Math.abs(placement.x) <= TEST_CELL * JITTER_RATIO + 1 &&
    Math.abs(placement.y) <= TEST_CELL * JITTER_RATIO + 1,
)

// --- pickCellSize ---------------------------------------------------------
check('pickCellSize mobile (<640) returns CELL_MOBILE', pickCellSize(375) === 320)
check('pickCellSize mobile boundary just under', pickCellSize(639) === 320)
check('pickCellSize 640 enters desktop scaling', pickCellSize(640) === Math.floor(640 / 1.3))
check('pickCellSize 1440 laptop', pickCellSize(1440) === Math.floor(1440 / 1.3))
check('pickCellSize clamps at 1200 on wide screens', pickCellSize(1920) === 1200)
check('pickCellSize stays clamped at 4K', pickCellSize(3840) === 1200)
check('pickCellSize monotonic across desktop range', pickCellSize(1280) < pickCellSize(1440))

// --- report --------------------------------------------------------------
if (failures.length === 0) {
  process.stdout.write('All photography-math checks passed.\n')
  process.exit(0)
}
process.stderr.write(`Failures (${failures.length}):\n`)
for (const f of failures) process.stderr.write(`  - ${f}\n`)
process.exit(1)
