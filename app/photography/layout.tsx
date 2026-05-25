import type { ReactNode } from 'react'

export default function PhotographyLayout({ children }: { children: ReactNode }) {
  return (
    <div data-surface="dark" className="min-h-screen">
      {children}
    </div>
  )
}
