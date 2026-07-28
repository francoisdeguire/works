import type { Viewport } from 'next'
import type { ReactNode } from 'react'

export const viewport: Viewport = {
  themeColor: 'black',
}

export default function PhotographyLayout({ children }: { children: ReactNode }) {
  return (
    <main id="main" data-surface="dark" className="min-h-screen">
      {children}
    </main>
  )
}
