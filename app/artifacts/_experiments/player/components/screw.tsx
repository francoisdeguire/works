'use client'

import { type MotionValue, motion } from 'motion/react'
import { cn } from '@/lib/cn'

export function Screw({
  className,
  rotate,
}: {
  className?: string
  // counter-rotation so the highlight stays world-aligned while the screw orbits
  rotate: MotionValue<number>
}) {
  return (
    <motion.div
      style={{ x: '-50%', y: '-50%', rotate }}
      className={cn('absolute size-1.5 rounded-full bg-zinc-400 player-shadow-screw', className)}
    />
  )
}
