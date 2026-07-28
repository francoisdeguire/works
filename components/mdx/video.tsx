'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'
import { assetUrl, imagesHost, videoUrl } from '@/lib/cdn'

type VideoProps = {
  src: string
  width?: number
  height?: number
  poster?: string
  controls?: boolean
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  playsInline?: boolean
  children?: ReactNode
}

export default function Video({
  src,
  width,
  height,
  poster,
  controls = false,
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  children,
}: VideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Playback starts here rather than via the autoplay attribute so a reduced-motion
  // visitor gets the poster plus controls instead of an unstoppable loop.
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      setReducedMotion(mql.matches)
      if (autoPlay && !mql.matches) void ref.current?.play().catch(() => {})
    }
    sync()
    mql.addEventListener('change', sync)
    return () => {
      mql.removeEventListener('change', sync)
    }
  }, [autoPlay])

  return (
    <figure>
      <video
        ref={ref}
        src={videoUrl(src)}
        poster={poster ? assetUrl(poster, imagesHost()) : undefined}
        width={width}
        height={height}
        controls={controls || (autoPlay && reducedMotion)}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
      />

      {children}
    </figure>
  )
}
