import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export default function Muted({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return <span className={cn('text-foreground-muted', className)}>{children}</span>
}
