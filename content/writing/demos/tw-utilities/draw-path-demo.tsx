'use client'

import { RiResetLeftLine } from '@remixicon/react'
import { type CSSProperties, useState } from 'react'
import Preview from '@/components/mdx/preview'
import { Button } from '@/components/mdx/preview-controls/button'
import Slider from '@/components/mdx/preview-controls/slider'

export default function DrawPathDemo() {
  const [duration, setDuration] = useState(700)
  const [run, setRun] = useState(0)

  return (
    <>
      <div className="flex justify-center px-8 py-12">
        <div className="grid size-18 place-items-center rounded-2xl bg-sky-50 outline-2 -outline-offset-2 outline-sky-700/5">
          <svg
            key={run}
            viewBox="0 0 24 24"
            className="draw-path size-16 motion-safe:animate-[draw-settle_500ms_var(--ease-emphasized)_both] stroke-sky-700"
            fill="none"
            stroke="white"
            strokeWidth={2.5}
            aria-label="checkmark"
            style={{ '--draw-duration': `${duration}ms` } as CSSProperties}
          >
            <path pathLength={1} d="M5 11l5 5L19 7" />
          </svg>
        </div>
      </div>
      <Preview.Controls className="max-md:flex-col">
        <Slider
          label="Duration"
          min={300}
          max={1500}
          step={100}
          value={duration}
          onValueChange={setDuration}
          formatValue={(value) => `${value}ms`}
        />
        <span className="h-6 w-px shrink-0 bg-foreground/10 max-md:hidden" />
        <Button type="button" onClick={() => setRun((n) => n + 1)}>
          <RiResetLeftLine /> Replay
        </Button>
      </Preview.Controls>
    </>
  )
}
