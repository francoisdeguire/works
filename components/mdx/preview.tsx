import { Children, isValidElement, type ReactNode } from 'react'
import Caption from '@/components/mdx/caption'

type PreviewProps = {
  children: ReactNode
}

export default function Preview({ children }: PreviewProps) {
  const captions: ReactNode[] = []
  const content: ReactNode[] = []
  for (const item of Children.toArray(children)) {
    if (isValidElement(item) && item.type === Caption) {
      captions.push(item)
    } else {
      content.push(item)
    }
  }
  return (
    <figure>
      <div className="mdx-preview-card">{content}</div>
      {captions}
    </figure>
  )
}
