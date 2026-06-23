'use client'

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
    <div className="relative -mx-2 my-8">
      <pre
        ref={ref}
        className={cn('scrollbar-thumb-foreground/10 scrollbar-track-transparent', className)}
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
          'hover:text-foreground focus-visible:outline focus-visible:outline-foreground',
          copied ? 'text-foreground' : 'text-foreground-muted/70',
        )}
      >
        {/* Both icons share one grid cell and cross-fade with a small scale pop on swap. */}
        <CopyIcon
          className={cn(
            'col-start-1 row-start-1 transition duration-150 ease-standard motion-reduce:transition-none',
            copied ? 'scale-75 opacity-0' : 'scale-100 opacity-100',
          )}
        />
        <CheckIcon
          className={cn(
            'col-start-1 row-start-1 transition duration-100 ease-standard motion-reduce:transition-none',
            copied ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
          )}
        />
      </button>
    </div>
  )
}

function CopyIcon({ className }: { className?: string }) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: decorative; the button carries the label
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn('size-3.5', className)}
    >
      <rect x="8" y="8" width="14" height="14" rx="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: decorative; the button carries the label
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn('size-3.5', className)}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
