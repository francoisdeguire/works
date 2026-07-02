'use client'

import Image from 'next/image'
import { type CSSProperties, useState } from 'react'
import Preview from '@/components/mdx/preview'
import Slider from '@/components/mdx/preview-controls/slider'

export default function BlurDemo() {
  const [blur, setBlur] = useState(0)

  return (
    <>
      <div className="p-1.5 overflow-clip">
        <Image
          src="writing/better-dashboards/notion-dashboard.webp"
          width="1200"
          height="728"
          alt="Wise Insights Dashboard"
          className="rounded-sm shadow-lg"
          style={{ filter: `blur(${blur}px)` } as CSSProperties}
        />
      </div>
      <Preview.Controls>
        <Slider
          label="Blur"
          min={0}
          max={12}
          step={1}
          value={blur}
          onValueChange={setBlur}
          formatValue={(value) => `${value}px`}
        />
      </Preview.Controls>
    </>
  )
}
