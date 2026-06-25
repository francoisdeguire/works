'use client'

import { type CSSProperties, useEffect, useRef, useState } from 'react'
import Preview from '@/components/mdx/preview'
import Slider from '@/components/mdx/preview-controls/slider'
import { cn } from '@/lib/cn'

const TILES = [
  { id: 'Tangerine', gradient: 'from-amber-300 to-orange-400' },
  { id: 'Berry', gradient: 'from-rose-400 to-red-500' },
  { id: 'Lemon', gradient: 'from-amber-400 to-yellow-200' },
  { id: 'Sesame', gradient: 'from-stone-400 to-stone-800' },
  { id: 'Mango', gradient: 'from-amber-400 to-rose-500' },
  { id: 'Lime', gradient: 'from-green-500 to-lime-300' },
]

export default function FadeDemo() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [reach, setReach] = useState(80)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const animation = track.animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }],
      { duration: 20000, iterations: Number.POSITIVE_INFINITY, easing: 'linear' },
    )
    return () => animation.cancel()
  }, [])

  // Doubled so a -50% translate lands the second copy exactly where the first
  // began; the trailing margin on every tile keeps that seam gapless.
  const tiles = [
    ...TILES.map((tile) => ({ ...tile, key: `a-${tile.id}` })),
    ...TILES.map((tile) => ({ ...tile, key: `b-${tile.id}` })),
  ]

  return (
    <>
      <div className="py-12 sm:px-8 flex items-center">
        <div className="fade-x overflow-hidden" style={{ '--fade': `${reach}px` } as CSSProperties}>
          <div ref={trackRef} className="flex w-max gap-8 py-8">
            {tiles.map((tile) => (
              <div
                key={tile.key}
                className={cn(
                  'bg-linear-to-b select-none from-zinc-50 to-zinc-100 outline outline-black/5 shadow flex flex-col items-center justify-between py-8 rounded-3xl aspect-3/4 px-4 w-48 h-auto',
                )}
              >
                <div
                  className={cn(
                    'size-24 rounded-full outline-2 outline-black/10 -outline-offset-2 inset-shadow-[0_0_16px_8px_rgba(255,255,255,0.5)] bg-linear-30',
                    tile.gradient,
                  )}
                />
                <span className="capitalize font-medium text-3xl text-zinc-300 ">{tile.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Preview.Controls>
        <Slider
          label="Fade Width"
          min={0}
          max={192}
          step={8}
          value={reach}
          onValueChange={setReach}
          formatValue={(value) => `${value}px`}
        />
      </Preview.Controls>
    </>
  )
}
