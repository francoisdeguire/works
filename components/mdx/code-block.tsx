'use client'

import { RiCheckLine, RiClipboardLine } from '@remixicon/react'
import { type ComponentPropsWithoutRef, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

// rehype-pretty-code renders `figure > pre > code`; mdx-components maps `pre` here so every
// prose code block gets a copy button. The button is a sibling of `<pre>`, so it stays pinned
// while the code scrolls, and the copyable text is read straight from the rendered DOM.
export default function CodeBlock({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'pre'>) {
  const ref = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  return (
    <div className="relative -mx-2">
      <pre
        ref={ref}
        className={cn(
          'scrollbar-thumb-foreground/10 scrollbar-track-transparent text-xs sm:text-sm',
          className,
        )}
        {...props}
      >
        {children}
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Copied' : 'Copy code'}
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
