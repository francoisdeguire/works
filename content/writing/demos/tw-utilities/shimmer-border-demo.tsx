'use client'

import { type CSSProperties, useState } from 'react'
import Preview from '@/components/mdx/preview'
import Slider from '@/components/mdx/preview-controls/slider'

export default function ShimmerBorderDemo() {
  const [speed, setSpeed] = useState(3)
  const [width, setWidth] = useState(2)

  return (
    <>
      <div className="flex justify-center px-8 py-12">
        <div
          className="shimmer-border grid h-32 w-56 place-items-center rounded-2xl bg-surface-2 text-violet-500"
          style={
            {
              '--shimmer-border-duration': `${speed}s`,
              '--shimmer-border-width': `${width}px`,
            } as CSSProperties
          }
        >
          <span className="font-display text-foreground-muted text-sm">shimmer-border</span>
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
        <span className="h-6 w-px shrink-0 bg-foreground/10 max-md:hidden" />
        <Slider
          label="Width"
          min={1}
          max={6}
          step={1}
          value={width}
          onValueChange={setWidth}
          formatValue={(value) => `${value}px`}
        />
      </Preview.Controls>
    </>
  )
}
