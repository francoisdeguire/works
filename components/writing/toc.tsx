'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import type { Heading } from '@/lib/writing'

type TocProps = {
  headings: Heading[]
}

export default function Toc({ headings }: TocProps) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null)

  useEffect(() => {
    if (headings.length === 0) return
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 },
    )

    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 3) return null

  return (
    <nav
      aria-label="Table of contents"
      className="fixed top-48 my-4 left-8 pr-2 hidden max-w-64 xl:flex flex-col gap-6"
    >
      <h3 className="font-display text-xs uppercase">Table of contents</h3>

      <div className="flex flex-col gap-1">
        {headings.map((h) => {
          const isActive = activeId === h.id
          return (
            <a
              key={h.id}
              href={`#${h.id}`}
              className="group flex h-6 items-center gap-3 rounded-sm focus-visible:outline focus-visible:outline-foreground"
            >
              <span
                aria-hidden
                className={cn(
                  'h-px shrink-0 transition-all',
                  isActive ? 'w-6' : 'w-3',
                  isActive ? 'bg-foreground' : 'bg-foreground-muted/30 group-hover:bg-foreground',
                )}
              />
              <span
                className={cn(
                  'font-sans font-[450] tracking-wide text-xs transition-colors',
                  isActive
                    ? 'text-foreground'
                    : 'text-foreground-muted/50 group-hover:text-foreground',
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
