import { Children, isValidElement, type ReactNode } from 'react'
import Caption from '@/components/mdx/caption'
import { cn } from '@/lib/cn'

function PreviewRoot({ children }: { children: ReactNode }) {
  const items = Children.toArray(children)
  const isCaption = (c: ReactNode) => isValidElement(c) && c.type === Caption

  return (
    <figure>
      <div className="mdx-preview-card">{items.filter((c) => !isCaption(c))}</div>
      {items.filter(isCaption)}
    </figure>
  )
}

function PreviewControls({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex justify-center items-center gap-6 border-border bg-muted px-6 py-4 not-last:border-b not-first:border-t',
        className,
      )}
    >
      {children}
    </div>
  )
}

const Preview = Object.assign(PreviewRoot, {
  Controls: PreviewControls,
})

export default Preview
