import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export default function Bullet({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return <li className={cn('text-pretty', className)}>{children}</li>
}
