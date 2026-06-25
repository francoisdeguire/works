import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type CaptionProps = {
  children: ReactNode
  className?: string
}

export default function Caption({ children, className }: CaptionProps) {
  return <figcaption className={cn('mdx-caption', className)}>{children}</figcaption>
}
