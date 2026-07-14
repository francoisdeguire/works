import { type MotionValue, motion, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

const WINDOW = 8 // characters visible on the display
const STEP_MS = 500 // marquee advance interval
const HOLD_MS = 2000 // dwell on the name's start before scrolling again
const SEPARATOR = '   ' // gap before the name wraps around

const pad2 = (n: number) => String(n).padStart(2, '0')
const formatTime = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds))
  return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`
}

export function Screen({
  name,
  position,
  duration,
  ff = false,
  className,
}: {
  name: string
  position: MotionValue<number>
  duration: MotionValue<number>
  ff?: boolean
  className?: string
}) {
  // marquee: slide an 8-char window around the looped name, one char per step,
  // dwelling on the start each time it comes around
  const loop = name + SEPARATOR
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    if (name.length <= WINDOW) return
    const id = setTimeout(
      () => setOffset((o) => (o + 1) % loop.length),
      offset === 0 ? HOLD_MS : STEP_MS,
    )
    return () => clearTimeout(id)
  }, [offset, name.length, loop.length])

  // MotionValue child: the counter redraws without re-rendering the component
  const time = useTransform(() => `${formatTime(position.get())}/${formatTime(duration.get())}`)

  return (
    <div
      className={cn(
        'player-bevel player-bevel-screen h-11.5 w-24 select-none space-y-0.5 overflow-clip rounded-md p-1.5 font-display text-sky-100 leading-none',
        className,
      )}
    >
      <div className="absolute top-0 right-0 -bottom-1 left-0 bg-linear-150 from-30% from-white to-38% to-transparent opacity-20" />
      <div className="absolute top-0 -right-0.5 -bottom-1 left-0 rounded-sm border border-black/50 bg-transparent blur-[1px]" />

      {/* whitespace-pre keeps the separator gap from collapsing mid-scroll */}
      <p className="whitespace-pre">
        {ff ? 'FF 2x' : name.length > WINDOW ? (loop + loop).slice(offset, offset + WINDOW) : name}
      </p>
      <motion.span className="text-[10px]">{time}</motion.span>
    </div>
  )
}
