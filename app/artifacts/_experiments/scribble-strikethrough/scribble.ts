// Stroke geometry, pure. One wobbly line per wrapped row of text.

// stroke shape; [min, max] ranges, sampled per stroke
const OVERSHOOT = [-2, 6] as const // px past each end of the text
const AMPLITUDE = [2, 4] as const // wobble height, px
const WAVELENGTH = [32, 80] as const // px between wobble peaks (bigger = lazier)
const TILT = [-0.03, 0.03] as const // overall slope
const JITTER = [0.6, 1.8] as const // per-point hand-tremble, px

export type Line = { x0: number; x1: number; y: number }

// stroke path + the text width that paces its draw
export type ScribbleLine = { d: string; width: number }

type Point = { x: number; y: number }
type Range = readonly [min: number, max: number]

const TWO_PI = Math.PI * 2

// seeded so a resize redraws the same scribble
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pick = (rng: () => number, [min, max]: Range) => min + (max - min) * rng()

// 2-decimal coord, keeps the path string short
const n = (v: number) => v.toFixed(2)

// points for one stroke from x0→x1 at height y, overshooting each end a bit
function strokePoints(x0: number, x1: number, y: number, rng: () => number): Point[] {
  const startX = x0 - pick(rng, OVERSHOOT)
  const endX = x1 + pick(rng, OVERSHOOT)
  const span = endX - startX
  if (span <= 0) return []

  const amp = pick(rng, AMPLITUDE)
  const wavelength = pick(rng, WAVELENGTH)
  const tilt = pick(rng, TILT)
  const jitter = pick(rng, JITTER)
  const phase = rng() * TWO_PI

  // fixed step count so the last point lands exactly on endX
  const steps = Math.max(2, Math.round(span / Math.max(10, wavelength / 3)))
  const pts: Point[] = []
  for (let i = 0; i <= steps; i++) {
    const t = (span * i) / steps
    const wobble = Math.sin((t / wavelength) * TWO_PI + phase) * amp
    const tremble = (rng() * 2 - 1) * jitter
    pts.push({ x: startX + t, y: y + tilt * t + wobble + tremble })
  }
  return pts
}

// Catmull-Rom → bezier smoothing over the points
function smoothPath(pts: Point[]): string {
  const first = pts[0]
  if (!first || pts.length < 2) return ''
  let d = `M ${n(first.x)} ${n(first.y)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = pts[i]
    const p2 = pts[i + 1]
    if (!p1 || !p2) continue
    const p0 = pts[i - 1] ?? p1
    const p3 = pts[i + 2] ?? p2
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }
    d += ` C ${n(c1.x)} ${n(c1.y)}, ${n(c2.x)} ${n(c2.y)}, ${n(p2.x)} ${n(p2.y)}`
  }
  return d
}

// one stroke per line
export function buildScribble(lines: Line[], seed: number): ScribbleLine[] {
  const rng = mulberry32(seed)
  return lines
    .map((line) => ({
      d: smoothPath(strokePoints(line.x0, line.x1, line.y, rng)),
      width: line.x1 - line.x0,
    }))
    .filter((line) => line.d !== '')
}
