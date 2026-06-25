'use client'

import { type CSSProperties, useState } from 'react'
import Preview from '@/components/mdx/preview'
import Slider from '@/components/mdx/preview-controls/slider'
import { Tabs, TabsList, TabsTrigger } from '@/components/mdx/preview-controls/tabs'

type Blend = 'overlay' | 'soft-light' | 'normal'

export default function GrainToggle() {
  const [opacity, setOpacity] = useState(80)
  const [size, setSize] = useState(256)
  const [blend, setBlend] = useState<Blend>('overlay')

  return (
    <>
      <Preview.Controls className="max-md:flex-col">
        <Tabs value={blend} onValueChange={(value) => setBlend(value as Blend)}>
          <TabsList>
            <TabsTrigger value="overlay">Overlay</TabsTrigger>
            <TabsTrigger value="soft-light">Soft light</TabsTrigger>
            <TabsTrigger value="normal">Normal</TabsTrigger>
          </TabsList>
        </Tabs>
      </Preview.Controls>
      <div className="flex flex-col items-center gap-4 p-8">
        <div
          className="h-48 w-96 rounded-2xl flex shadow-md grain ring-1 ring-neutral-200 overflow-clip"
          style={
            {
              '--grain-opacity': String(opacity / 100),
              '--grain-size': `${size}px`,
              '--grain-blend': blend,
            } as CSSProperties
          }
        >
          <div className="bg-amber-950 flex-1 h-full" />
          <div className="bg-amber-900 flex-1 h-full" />
          <div className="bg-amber-800 flex-1 h-full" />
          <div className="bg-amber-700 flex-1 h-full" />
          <div className="bg-amber-600 flex-1 h-full" />
          <div className="bg-amber-500 flex-1 h-full" />
          <div className="bg-amber-600 flex-1 h-full" />
          <div className="bg-amber-700 flex-1 h-full" />
          <div className="bg-amber-800 flex-1 h-full" />
          <div className="bg-amber-900 flex-1 h-full" />
          <div className="bg-amber-950 flex-1 h-full" />
        </div>
      </div>
      <Preview.Controls className="max-md:flex-col">
        <Slider
          label="Opacity"
          min={0}
          max={100}
          step={5}
          value={opacity}
          onValueChange={setOpacity}
          formatValue={(value) => `${value}%`}
        />
        <span className="max-md:hidden h-6 w-px shrink-0 bg-foreground/10" />
        <Slider
          label="Tile size"
          min={64}
          max={512}
          step={64}
          value={size}
          onValueChange={setSize}
          formatValue={(value) => `${value}px`}
        />
      </Preview.Controls>
    </>
  )
}
