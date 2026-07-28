'use client'

import { RiCheckLine, RiClipboardLine } from '@remixicon/react'
import { type ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

type CodeBlockProps = ComponentPropsWithoutRef<'pre'> & { 'data-language'?: string }

// rehype-pretty-code renders `figure > pre > code`; mdx-components maps `pre` here so every
// prose code block gets a copy button. The button is a sibling of `<pre>`, so it stays pinned
// while the code scrolls, and the copyable text is read straight from the rendered DOM.
export default function CodeBlock({ className, children, ...props }: CodeBlockProps) {
  const ref = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)
  const [scrollable, setScrollable] = useState(false)
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Safari doesn't focus scroll containers on its own, so a snippet that overflows
  // becomes a tab stop. Snippets that fit stay out of the tab order.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      setScrollable(el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => {
      observer.disconnect()
    }
  }, [])

  async function copy() {
    const text = ref.current?.textContent
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      return
    }
    setCopied(true)
    if (resetRef.current) clearTimeout(resetRef.current)
    resetRef.current = setTimeout(() => setCopied(false), 2000)
  }

  const language = props['data-language']
  const scrollProps = scrollable
    ? ({
        tabIndex: 0,
        role: 'region',
        'aria-label': `${language ?? 'Code'} snippet, scrollable`,
      } satisfies ComponentPropsWithoutRef<'pre'>)
    : {}

  return (
    <div className="relative -mx-2">
      <pre
        ref={ref}
        className={cn(
          'scrollbar-thumb-foreground/10 scrollbar-track-transparent text-xs sm:text-sm',
          className,
        )}
        {...props}
        {...scrollProps}
      >
        {children}
      </pre>
      <span role="status" className="sr-only">
        {copied ? 'Copied' : ''}
      </span>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy code"
        className={cn(
          'absolute cursor-pointer right-3.5 top-3.5 grid size-7 place-items-center rounded-md border bg-background',
          'transition-colors duration-100 ease-standard',
          'hover:text-foreground',
          copied ? 'text-foreground' : 'text-foreground-muted/70',
        )}
      >
        <RiClipboardLine
          aria-hidden
          className={cn(
            'size-4 col-start-1 row-start-1 transition duration-150 ease-standard motion-reduce:transition-none',
            copied ? 'scale-75 opacity-0' : 'scale-100 opacity-100',
          )}
        />
        <RiCheckLine
          aria-hidden
          className={cn(
            'size-4 col-start-1 row-start-1 transition duration-150 ease-standard motion-reduce:transition-none',
            copied ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
          )}
        />
      </button>
    </div>
  )
}
