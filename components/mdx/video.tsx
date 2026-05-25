import type { ReactNode } from 'react'
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
  return (
    <figure>
      <video
        src={videoUrl(src)}
        poster={poster ? assetUrl(poster, imagesHost()) : undefined}
        width={width}
        height={height}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
      />

      {children}
    </figure>
  )
}
