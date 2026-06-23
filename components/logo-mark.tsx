import type { CSSProperties } from 'react'

type LogoMarkProps = {
  size: number
}

function getDelay(index: number): number {
  const ROWS = 5
  const STEPS = 3
  const BASE_DELAY = 240 * (ROWS / STEPS)
  const DECAY = BASE_DELAY / ROWS

  return BASE_DELAY - index * DECAY
}

const PIXELS = [
  { x: 8, y: 0, delay: getDelay(0) },
  { x: 4, y: 4, delay: getDelay(1) },
  { x: 12, y: 4, delay: getDelay(1) },
  { x: 0, y: 8, delay: getDelay(2) },
  { x: 16, y: 8, delay: getDelay(2) },
  { x: 4, y: 12, delay: getDelay(3) },
  { x: 12, y: 12, delay: getDelay(3) },
  { x: 8, y: 16, delay: getDelay(4) },
]

export default function LogoMark({ size }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="currentColor" aria-hidden="true">
      {PIXELS.map(({ x, y, delay }) => {
        const style: CSSProperties & { '--ripple-delay': string } = {
          '--ripple-delay': `${delay}ms`,
        }
        return (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="4"
            height="4"
            className="logo-pixel"
            style={style}
          />
        )
      })}
    </svg>
  )
}
