'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import type { Heading } from '@/lib/writing'

type TocProps = {
  headings: Heading[]
}

// Active line sits below the fixed header — matches `scroll-mt-20` on h2.
const ACTIVE_OFFSET_PX = 96

// useLayoutEffect on the server warns; fall back to useEffect during SSR. The browser
// pass picks up the real layout effect so the deep-link correction lands before paint.
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

export default function Toc({ headings }: TocProps) {
  // SSR renders no active item. We can't see the URL hash on the server, and the
  // browser paints the SSR HTML before JS hydrates — picking h0 here would flash to
  // the wrong item on deep-link loads. The layout effect below assigns the right
  // one synchronously, before the first post-hydration paint.
  const [activeId, setActiveId] = useState<string | null>(null)
  // Transitions stay off until after the first measurement-driven paint so the
  // initial selection lands instantly, not as an animation from nothing.
  const [transitionsEnabled, setTransitionsEnabled] = useState(false)

  useBrowserLayoutEffect(() => {
    if (headings.length === 0) return
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    // Pick the last heading whose top has crossed the active line. This keeps the
    // current section highlighted even after scrolling past, instead of clearing
    // every time the heading leaves the viewport.
    const update = () => {
      let crossed: string | null = null
      for (const el of elements) {
        if (el.getBoundingClientRect().top - ACTIVE_OFFSET_PX <= 0) {
          crossed = el.id
        } else {
          break
        }
      }
      setActiveId(crossed ?? elements[0]?.id ?? null)
    }

    let rafId: number | null = null
    const schedule = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        update()
      })
    }

    update()
    const enableId = requestAnimationFrame(() => setTransitionsEnabled(true))
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(enableId)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [headings])

  if (headings.length < 3) return null

  return (
    <nav
      aria-label="Table of contents"
      className="fixed top-48 my-4 left-8 pr-2 hidden w-64 xl:flex flex-col gap-6"
    >
      <h3 className="font-display text-xs uppercase text-foreground-muted/80">Table of contents</h3>

      <div className="flex flex-col gap-1">
        {headings.map((h) => {
          const isActive = activeId === h.id
          return (
            <a
              key={h.id}
              href={`#${h.id}`}
              className="group flex h-6 items-center gap-3 rounded-sm"
            >
              <span
                aria-hidden
                className={cn(
                  'h-px shrink-0',
                  transitionsEnabled && 'transition-all',
                  isActive ? 'w-6' : 'w-3',
                  isActive ? 'bg-foreground' : 'bg-foreground-muted/50 group-hover:bg-foreground',
                )}
              />
              <span
                className={cn(
                  'block w-[calc(100%-2.25rem)] shrink-0 truncate font-sans font-[450] tracking-wide text-xs',
                  transitionsEnabled && 'transition-colors',
                  isActive
                    ? 'text-foreground'
                    : 'text-foreground-muted/80 group-hover:text-foreground',
                )}
              >
                {h.text}
              </span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
