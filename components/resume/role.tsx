import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface RoleProps {
  company: string
  title: string
  meta: string
  context: string
  className?: string
  headerClassName?: string
  children: ReactNode
}

export default function Role({
  company,
  title,
  meta,
  context,
  className,
  headerClassName,
  children,
}: RoleProps) {
  return (
    <div
      className={cn('mt-8 break-inside-avoid', 'paper:mt-4 paper:break-inside-avoid', className)}
    >
      <div className={cn('flex items-baseline justify-between gap-4', headerClassName)}>
        <h3 className="font-medium">
          {company}
          <span className="font-normal text-foreground-muted"> / {title}</span>
        </h3>
        <p className="shrink-0 text-foreground-muted">{meta}</p>
      </div>
      <p className={cn('mt-2 text-foreground-muted text-sm', 'paper:mt-0 paper:text-[8pt]')}>
        {context}
      </p>
      <ul
        className={cn(
          'mt-5 list-none space-y-3 text-foreground-muted',
          'paper:mt-4 paper:space-y-2 paper:text-[8pt] paper:mb-6',
        )}
      >
        {children}
      </ul>
    </div>
  )
}
