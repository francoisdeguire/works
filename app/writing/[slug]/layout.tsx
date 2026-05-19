import type { ReactNode } from 'react'

export default function WritingArticleLayout({ children }: { children: ReactNode }) {
  return (
    <main id="main" className="mx-auto w-full max-w-prose px-5 py-48">
      {children}
    </main>
  )
}
