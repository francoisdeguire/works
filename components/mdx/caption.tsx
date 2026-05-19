import type { ReactNode } from 'react'

type CaptionProps = {
  children: ReactNode
}

export default function Caption({ children }: CaptionProps) {
  return <figcaption className="mdx-caption">{children}</figcaption>
}
