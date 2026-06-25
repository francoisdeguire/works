'use client'

import { type CSSProperties, useState } from 'react'
import Preview from '@/components/mdx/preview'
import Slider from '@/components/mdx/preview-controls/slider'

export default function DrawPathDemo() {
  const [duration, setDuration] = useState(700)
  const [run, setRun] = useState(0)

  return (
    <>
      <div className="flex justify-center px-8 py-12">
        <div className="grid size-24 place-items-center rounded-3xl bg-emerald-500">
          <svg
            key={run}
            viewBox="0 0 24 24"
            className="draw-path size-12"
            fill="none"
            stroke="white"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-label="checkmark"
            style={{ '--draw-duration': `${duration}ms` } as CSSProperties}
          >
            <path pathLength={1} d="M5 13l4 4L19 7" />
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
        <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          className="flex h-9 select-none items-center justify-center rounded-lg bg-background px-3 font-medium text-foreground text-sm shadow-sm transition-[scale,background-color] duration-200 ease-standard hover:bg-gray-100 active:scale-[0.97]"
        >
          Replay
        </button>
      </Preview.Controls>
    </>
  )
}
