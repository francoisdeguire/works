import type { Viewport } from 'next'
import type { ReactNode } from 'react'

// matches --dotted-background; cover paints under the toolbars
export const viewport: Viewport = {
  themeColor: 'oklch(96.7% 0.003 264.542)',
  viewportFit: 'cover',
}

export default function ArtifactDemoLayout({ children }: { children: ReactNode }) {
  // scrolls in place of the pinned document (see globals.css)
  return (
    <div data-surface="dotted" className="fixed inset-0 overflow-y-auto overscroll-contain">
      {children}
    </div>
  )
}
