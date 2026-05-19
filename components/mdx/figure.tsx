import Image from 'next/image'
import type { ReactNode } from 'react'
import { isAnimatedImage } from '@/lib/cdn'

type FigureProps = {
  src: string
  alt: string
  width: number
  height: number
  children?: ReactNode
}

export default function Figure({ src, alt, width, height, children }: FigureProps) {
  const animated = isAnimatedImage(src)
  return (
    <figure>
      <Image src={src} alt={alt} width={width} height={height} unoptimized={animated} />
      {children}
    </figure>
  )
}
