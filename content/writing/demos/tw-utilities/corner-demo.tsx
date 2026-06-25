'use client'

import { type CSSProperties, useState } from 'react'
import Preview from '@/components/mdx/preview'
import Slider from '@/components/mdx/preview-controls/slider'

export default function CornerDemo() {
  const [strength, setStrength] = useState(2)
  const [radius, setRadius] = useState(40)

  return (
    <>
      <div className="flex justify-center px-8 py-12">
        <div
          className="squircle size-40 bg-orange-500"
          style={
            {
              borderRadius: `${radius}px`,
              '--squircle': strength,
            } as CSSProperties
          }
        />
      </div>
      <Preview.Controls className="max-md:flex-col">
        <Slider
          label="Strength"
          min={1}
          max={2}
          step={0.05}
          value={strength}
          onValueChange={setStrength}
          formatValue={(value) => value.toFixed(2)}
        />
        <span className="h-6 w-px shrink-0 bg-foreground/10 max-md:hidden" />
        <Slider
          label="Radius"
          min={8}
          max={72}
          step={4}
          value={radius}
          onValueChange={setRadius}
          formatValue={(value) => `${value}px`}
        />
      </Preview.Controls>
    </>
  )
}
