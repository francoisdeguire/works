'use client'

import { type MotionValue, motion, useTransform } from 'motion/react'
import type { ScrubHandlers } from '../use-turntable'
import { Screw } from './screw'

// screws are shadowed as if lit from straight up; this re-aims them at the
// scene's 140°/320° light axis
const SCREW_LIGHT_OFFSET = -40
// equilateral: r=32% from center, at 90° / 210° / 330°
const SCREW_POSITIONS = ['top-[18%] left-1/2', 'top-[66%] left-[22.3%]', 'top-[66%] left-[77.7%]']

// Reel disc: chamfered well, hairline gap, grabbable platter. Platter and hub
// ride `rotation`; the screws counter-rotate to keep highlights world-aligned.
export function Reel({ rotation, scrub }: { rotation: MotionValue<number>; scrub: ScrubHandlers }) {
  const counterRotation = useTransform(rotation, (r) => -r + SCREW_LIGHT_OFFSET)
  return (
    <div className="player-bevel player-bevel-well absolute bottom-36 left-1/2 size-88 -translate-x-1/2 rounded-full">
      {/* platter, flush with the body; grab it to scratch */}
      <div
        className="player-bevel absolute inset-px cursor-grab touch-none rounded-full [--player-bevel-width:2px] active:cursor-grabbing"
        {...scrub}
      >
        {/* printed details ride the reel */}
        <motion.div
          className="absolute inset-1 overflow-clip rounded-full"
          style={{ rotate: rotation }}
        >
          {/* hairline across the platter, with a gap around the hub */}
          <div className="absolute top-1/2 right-0 left-0 h-px player-gap-mask bg-zinc-400/70" />
          <span className="absolute top-1/6 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 select-none text-xs text-zinc-400 tracking-widest">
            96 / 24
          </span>
          <span className="absolute bottom-1/8 left-1/2 flex -translate-x-1/2 -translate-y-1/2 rotate-90 select-none items-center gap-1 text-xs text-zinc-400">
            3
            <span className="flex w-min">
              <span className="size-2.5 rounded-full border border-zinc-400" />{' '}
              <span className="-ml-1 size-2.5 rounded-full border border-zinc-400" />
            </span>
            <span className="ml-1 border border-zinc-400 px-[2px] py-px leading-none">M</span>
          </span>
        </motion.div>
        {/* hub: static polished cap, only the screws rotate */}
        <div className="player-bevel player-bevel-hub absolute top-1/2 left-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full ring ring-black/15">
          <motion.div className="absolute inset-1" style={{ rotate: rotation }}>
            {SCREW_POSITIONS.map((position) => (
              <Screw key={position} rotate={counterRotation} className={position} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
