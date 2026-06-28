'use client'

import { type CSSProperties, useState } from 'react'
import Preview from '@/components/mdx/preview'
import Slider from '@/components/mdx/preview-controls/slider'

const GAP = 8
const STUB = 0

// Two axis masks, intersected, keep only the four corner squares: the
// concentric outline survives at the corners and vanishes along each edge,
// leaving bracket crop-marks that trace the curve.
const BRACKET_MASK =
  'linear-gradient(to right, #000 var(--arm), #0000 var(--arm), #0000 calc(100% - var(--arm)), #000 calc(100% - var(--arm))),' +
  'linear-gradient(to bottom, #000 var(--arm), #0000 var(--arm), #0000 calc(100% - var(--arm)), #000 calc(100% - var(--arm)))'

export default function CornerDemo() {
  const [strength, setStrength] = useState(2)
  const [radius, setRadius] = useState(40)

  return (
    <>
      <div className="flex flex-col gap-8 items-center justify-center px-8 pb-16 pt-8">
        <span className="font-mono font-medium text-foreground/30">
          superellipse({strength.toFixed(2)})
        </span>
        <div className="relative">
          <div
            className="squircle size-48 bg-muted outline -outline-offset-1 outline-border"
            style={
              {
                borderRadius: `${radius}px`,
                '--squircle': strength,
              } as CSSProperties
            }
          />
          <div
            aria-hidden
            className="squircle pointer-events-none absolute border-2 border-indigo-500"
            style={
              {
                inset: `-${GAP}px`,
                borderRadius: `${radius + GAP}px`,
                '--squircle': strength,
                '--arm': `${radius + GAP + STUB}px`,
                maskImage: BRACKET_MASK,
                WebkitMaskImage: BRACKET_MASK,
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in',
              } as CSSProperties
            }
          />
        </div>
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
