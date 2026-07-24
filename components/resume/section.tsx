import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export default function Section({
  title,
  className,
  titleClassName,
  children,
}: {
  title: string
  className?: string
  titleClassName?: string
  children: ReactNode
}) {
  return (
    <section
      className={cn('mt-13 border-t border-border-subtle pt-3', 'paper:mt-4 paper:pt-1', className)}
    >
      <h2
        className={cn(
          'mb-8 text-sm text-foreground-muted',
          'paper:mb-3 paper:text-[8pt]',
          titleClassName,
        )}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
