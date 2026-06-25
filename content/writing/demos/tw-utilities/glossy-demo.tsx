'use client'

import { type CSSProperties, useState } from 'react'
import Preview from '@/components/mdx/preview'
import Slider from '@/components/mdx/preview-controls/slider'
import { Switch } from '@/components/mdx/preview-controls/switch'
import { cn } from '@/lib/cn'

export default function GlossyDemo() {
  const [shine, setShine] = useState(60)
  const [height, setHeight] = useState(50)
  const [fromBottom, setFromBottom] = useState(false)

  return (
    <>
      <div className="flex items-center justify-center px-8 py-16 min-h-72">
        <div className="scale-150">
          <button
            type="button"
            className={cn(
              'glossy flex h-12 items-center justify-center rounded-full bg-linear-to-b from-rose-500 to-red-800 cursor-pointer px-8 ring-1 ring-rose-900/70',
              'inset-shadow-[0_0_4px_3px_rgba(225,29,72,1)]',
              'text-xl font-extrabold tracking-wide leading-none text-white text-shadow-xs',
              'hover:-translate-y-px shadow-md hover:shadow-lg shadow-rose-800/40 active:translate-y-0 active:shadow-md transition-all duration-150',
            )}
            style={
              {
                '--glossy-color': `rgb(255 255 255 / ${shine / 100})`,
                '--glossy-h': `${height}%`,
                '--glossy-y': fromBottom ? '100%' : '0%',
              } as CSSProperties
            }
          >
            <span className="mb-0.5">JELLY</span>
          </button>
        </div>
      </div>
      <Preview.Controls className="max-md:flex-col">
        <Slider
          label="Shine"
          min={0}
          max={100}
          step={5}
          value={shine}
          onValueChange={setShine}
          formatValue={(value) => `${value}%`}
        />
        <span className="h-6 w-px shrink-0 bg-foreground/10 max-md:hidden" />
        <Slider
          label="Height"
          min={20}
          max={100}
          step={5}
          value={height}
          onValueChange={setHeight}
          formatValue={(value) => `${value}%`}
        />
        <span className="h-6 w-px shrink-0 bg-foreground/10 max-md:hidden" />
        <Switch checked={fromBottom} onCheckedChange={setFromBottom}>
          Invert
        </Switch>
      </Preview.Controls>
    </>
  )
}
