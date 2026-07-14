import { type MotionValue, motion, useTransform } from 'motion/react'
import { cn } from '@/lib/cn'
import type { MeterLevels } from '../use-tape-deck'

const LED_COUNT = 14
const CLIP_COUNT = 4 // top of the meter, red

// Channel geometry in px: the single source for both the rendered box (via
// inline style below) and the printed clip hairline, so the two can't drift.
const CHANNEL_HEIGHT = 102
const CHANNEL_PADDING = 2
const LED_GAP = 2
const LED_HEIGHT = (CHANNEL_HEIGHT - 2 * CHANNEL_PADDING - (LED_COUNT - 1) * LED_GAP) / LED_COUNT
// where the printed hairline crosses: the red/green boundary
const CLIP_LINE_TOP = CHANNEL_PADDING + CLIP_COUNT * (LED_HEIGHT + LED_GAP) - LED_GAP / 2

// stable keys so the LED stack avoids array-index keys
const LED_KEYS = Array.from({ length: LED_COUNT }, (_, i) => `led-${i}`)

function Led({ index, level }: { index: number; level: MotionValue<number> }) {
  // LED 0 sits at the bottom; LEDs switch instantly, no fade
  const opacity = useTransform(level, (v) => (v * LED_COUNT >= index + 0.5 ? 1 : 0))
  const clips = index >= LED_COUNT - CLIP_COUNT
  return (
    <div className="relative -mx-0.5 w-2 flex-1 rounded-[1px] bg-zinc-700/40">
      <motion.div
        style={{ opacity }}
        className={cn(
          'absolute inset-0 rounded-[1px]',
          clips ? 'player-glow bg-red-300 text-rose-600' : 'player-glow bg-white text-zinc-100',
        )}
      />
    </div>
  )
}

function MeterChannel({ level }: { level: MotionValue<number> }) {
  // slim slot recessed into the body, LED stack diffused behind frosted glass.
  // height/padding/gap come from the geometry constants (not Tailwind sizes) so
  // the clip hairline stays aligned with the LEDs by construction.
  return (
    <div
      className="relative w-1.25 overflow-clip rounded-full bg-zinc-500/50 player-shadow-slot"
      style={{ height: CHANNEL_HEIGHT, padding: CHANNEL_PADDING }}
    >
      <div className="player-frost flex h-full w-full flex-col-reverse" style={{ gap: LED_GAP }}>
        {LED_KEYS.map((key, i) => (
          <Led key={key} index={i} level={level} />
        ))}
      </div>
    </div>
  )
}

export function Meter({
  levels: [left, right],
  className,
}: {
  levels: MeterLevels
  className?: string
}) {
  return (
    <div className={className}>
      {/* hairline crossing both slots at the clip boundary; first in the tree
          so the slots paint over it */}
      <div style={{ top: CLIP_LINE_TOP }} className="absolute -inset-x-5 h-px bg-zinc-500/70" />
      <div className="flex gap-5">
        <MeterChannel level={left} />
        <MeterChannel level={right} />
      </div>
    </div>
  )
}
