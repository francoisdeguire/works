'use client'

import { type CSSProperties, useState } from 'react'
import Preview from '@/components/mdx/preview'
import Slider from '@/components/mdx/preview-controls/slider'
import { Switch } from '@/components/mdx/preview-controls/switch'
import { cn } from '@/lib/cn'

export default function PatternDemo() {
  const [grid, setGrid] = useState(false)
  const [size, setSize] = useState(16)

  return (
    <>
      <div className="flex justify-center p-8 h-96">
        <div
          className={cn(
            'size-full rounded-4xl shadow-sm bg-taupe-50/50 text-taupe-200 outline outline-taupe-500/10',
            grid ? 'pattern-grid' : 'pattern-dots',
          )}
          style={{ '--pattern': `${size}px` } as CSSProperties}
        />
      </div>
      <Preview.Controls className="max-md:flex-col">
        <Slider
          label="Tile"
          min={8}
          max={40}
          step={4}
          value={size}
          onValueChange={setSize}
          formatValue={(value) => `${value}px`}
        />
        <span className="h-6 w-px shrink-0 bg-foreground/10 max-md:hidden" />
        <Switch checked={grid} onCheckedChange={setGrid}>
          Grid
        </Switch>
      </Preview.Controls>
    </>
  )
}
