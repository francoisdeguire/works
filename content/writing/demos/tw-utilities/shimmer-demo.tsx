'use client'

import { type CSSProperties, useState } from 'react'
import Preview from '@/components/mdx/preview'
import Slider from '@/components/mdx/preview-controls/slider'

export default function ShimmerDemo() {
  const [speed, setSpeed] = useState(1.5)

  const style = { '--shimmer-duration': `${speed}s` } as CSSProperties

  return (
    <>
      <div className="flex justify-center px-8 py-12">
        <div className="flex w-72 items-center gap-4 rounded-2xl bg-surface-2 p-4 outline outline-border-subtle -outline-offset-1">
          <div className="shimmer size-12 shrink-0 rounded-full bg-foreground/10" style={style} />
          <div className="flex-1 space-y-2.5">
            <div className="shimmer h-3 w-3/4 rounded bg-foreground/10" style={style} />
            <div className="shimmer h-3 w-full rounded bg-foreground/10" style={style} />
            <div className="shimmer h-3 w-1/2 rounded bg-foreground/10" style={style} />
          </div>
        </div>
      </div>
      <Preview.Controls>
        <Slider
          label="Speed"
          min={0.5}
          max={3}
          step={0.5}
          value={speed}
          onValueChange={setSpeed}
          formatValue={(value) => `${value}s`}
        />
      </Preview.Controls>
    </>
  )
}
