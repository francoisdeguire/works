'use client'

import { type ReactNode, useRef } from 'react'
import CardTilt from './card-tilt'
import HoverTrail from './hover-trail'

type TerminalCardSurfaceProps = {
  className?: string
  children: ReactNode
}

export default function TerminalCardSurface({ className, children }: TerminalCardSurfaceProps) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div ref={ref} className={className}>
      <CardTilt targetRef={ref} />
      <HoverTrail targetRef={ref} />
      {children}
    </div>
  )
}
