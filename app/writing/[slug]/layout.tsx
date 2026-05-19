import type { ReactNode } from 'react'
import SiteHeader from '@/components/site-header'

export default function WritingArticleLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader variant="back" label="Writing" href="/writing" />
      <main id="main" className="relative mx-auto w-full max-w-prose px-5 pt-48 pb-24">
        {children}
      </main>
    </>
  )
}
