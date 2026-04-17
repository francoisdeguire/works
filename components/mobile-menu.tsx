'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { site } from '@/lib/site'

type MobileMenuProps = {
  showGetInTouch?: boolean
}

export default function MobileMenu({ showGetInTouch = true }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run when route changes to dismiss the menu after navigation
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    const id = window.setTimeout(() => {
      document.addEventListener('click', onClick)
    }, 0)
    return () => {
      document.removeEventListener('keydown', onKey)
      window.clearTimeout(id)
      document.removeEventListener('click', onClick)
    }
  }, [open])

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="inline-flex items-center justify-center rounded-pill bg-pill-background p-3 text-pill-foreground transition-opacity duration-fast hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? <path d="M6 6l12 12M6 18l12-12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open ? (
        <div
          ref={menuRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="absolute top-full right-0 z-50 mt-2 flex w-56 flex-col gap-1 rounded-card border border-border bg-background p-2 shadow-xl"
        >
          <nav aria-label="Mobile primary" className="flex flex-col">
            <Link
              href="/writing"
              className="rounded-input px-4 py-3 text-foreground transition-colors duration-fast hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              Writing
            </Link>
            <Link
              href="/artifacts"
              className="rounded-input px-4 py-3 text-foreground transition-colors duration-fast hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              Artifacts
            </Link>
          </nav>
          {showGetInTouch ? (
            <a
              href={`mailto:${site.email}`}
              className="mt-1 rounded-pill bg-pill-background px-4 py-3 text-center text-pill-foreground transition-opacity duration-fast hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              Get In Touch
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
