import Image, { type ImageProps } from 'next/image'
import type { ReactNode } from 'react'
import { isAnimatedImage } from '@/lib/cdn'
import Caption from './caption'

type FigureProps = ImageProps & {
  caption?: string
  children?: ReactNode
}

export default function Figure({ caption, children, ...props }: FigureProps) {
  const animated = typeof props.src === 'string' && isAnimatedImage(props.src)
  return (
    <figure className="relative -mx-2">
      <Image unoptimized={animated} {...props} />
      {children}
      {caption && <Caption>{caption}</Caption>}
    </figure>
  )
}
