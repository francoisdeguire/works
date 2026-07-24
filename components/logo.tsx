'use client'

import Link from 'next/link'
import type { AnimationEvent, FocusEvent } from 'react'
import { useRef, useState } from 'react'
import LogoMark, { PIXEL_COUNT } from './logo-mark'

export default function Logo() {
  const [rippling, setRippling] = useState(false)
  const endedCount = useRef(0)

  function start() {
    setRippling(true)
  }

  function handleFocus(event: FocusEvent<HTMLAnchorElement>) {
    if (event.currentTarget.matches(':focus-visible')) start()
  }

  function handleAnimationEnd(event: AnimationEvent<HTMLAnchorElement>) {
    if (event.animationName !== 'pixel-ripple') return
    endedCount.current += 1
    if (endedCount.current === PIXEL_COUNT) {
      endedCount.current = 0
      setRippling(false)
    }
  }

  return (
    <Link
      href="/"
      aria-label="Home"
      data-rippling={rippling || undefined}
      onPointerEnter={start}
      onFocus={handleFocus}
      onAnimationEnd={handleAnimationEnd}
      className="logo inline-flex size-10 items-center justify-center rounded-full bg-pill-background text-pill-foreground"
    >
      <LogoMark size={20} />
    </Link>
  )
}
