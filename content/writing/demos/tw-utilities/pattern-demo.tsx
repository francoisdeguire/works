'use client'

import { Libre_Baskerville } from 'next/font/google'
import { type CSSProperties, useState } from 'react'
import Preview from '@/components/mdx/preview'
import Slider from '@/components/mdx/preview-controls/slider'
import { Switch } from '@/components/mdx/preview-controls/switch'
import { cn } from '@/lib/cn'

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

export default function PatternDemo() {
  const [grid, setGrid] = useState(false)
  const [size, setSize] = useState(16)

  return (
    <>
      <div className="flex justify-center p-8 h-96">
        <div
          className={cn(
            'grid size-full place-items-center rounded-4xl shadow-sm bg-taupe-50/50 text-taupe-200 outline outline-taupe-500/10',
            grid ? 'pattern-grid' : 'pattern-dots',
          )}
          style={{ '--pattern': `${size}px` } as CSSProperties}
        >
          <p
            className={cn(grid === false && libreBaskerville.className, 'text-4xl text-taupe-400')}
          >
            Specimen №6
          </p>
        </div>
      </div>
      <Preview.Controls className="max-md:flex-col">
        <Slider
          label="Tile Size"
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
