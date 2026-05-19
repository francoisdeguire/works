'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import type { Heading } from '@/lib/writing'

type TocProps = {
  headings: Heading[]
}

export default function Toc({ headings }: TocProps) {
  const h2Count = headings.filter((h) => h.depth === 2).length
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

  if (h2Count < 3) return null

  return (
    <nav aria-label="Table of contents" className="-left-56 absolute top-48 hidden w-48 xl:block">
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className="group flex h-6 items-center rounded-sm focus-visible:outline focus-visible:outline-foreground"
        >
          <span
            className={cn(
              'h-px transition-all',
              h.depth === 2 ? 'w-6' : 'ml-3 w-3',
              activeId === h.id
                ? 'w-8 bg-foreground'
                : 'bg-foreground-muted group-hover:bg-foreground',
            )}
          />
          <span
            className={cn(
              'ml-3 whitespace-nowrap font-display text-xs uppercase transition-colors',
              activeId === h.id ? 'text-foreground' : 'text-foreground-muted group-hover:text-foreground',
            )}
          >
            {h.text}
          </span>
        </a>
      ))}
    </nav>
  )
}
