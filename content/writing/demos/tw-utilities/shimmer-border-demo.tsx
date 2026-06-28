'use client'

import { type CSSProperties, useState } from 'react'
import Preview from '@/components/mdx/preview'
import Slider from '@/components/mdx/preview-controls/slider'

export default function ShimmerBorderDemo() {
  const [speed, setSpeed] = useState(3)

  return (
    <>
      <div className="flex justify-center px-8 py-12 bg-linear-to-b from-orange-50/50 to-orange-50">
        <div
          className="w-96 bg-orange-100 shimmer-border shimmer-border-orange-600 shimmer-border-2 text-white p-0.5 rounded-3xl flex flex-col"
          style={
            {
              '--shimmer-border-duration': `${speed}s`,
            } as CSSProperties
          }
        >
          <div className="bg-white rounded-[calc(1.5rem-2px)] flex-1 flex flex-col gap-3 p-5 text-foreground ">
            <div className="space-y-4 block w-full">
              <p className="text-lg tracking-tighter text-zinc-400">SuperNova Premium</p>
              <p className="text-5xl tracking-tighter">
                $13.99<span className="ml-2 text-xl tracking-tight opacity-60">/mo</span>
              </p>
            </div>
            <div className="mt-4 space-y-2">
              <div className="bg-zinc-100 rounded h-4 max-w-60" />
              <div className="bg-zinc-100 rounded h-4 max-w-64" />
              <div className="bg-zinc-100 rounded h-4 max-w-48" />
            </div>

            <button
              type="button"
              className="bg-linear-to-b mt-6 from-orange-400 to-orange-500 text-white font-semibold tracking-tight text-lg h-12 rounded-lg"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>

      <Preview.Controls className="max-md:flex-col">
        <Slider
          label="Speed"
          min={1}
          max={6}
          step={0.5}
          value={speed}
          onValueChange={setSpeed}
          formatValue={(value) => `${value}s`}
        />
      </Preview.Controls>
    </>
  )
}
