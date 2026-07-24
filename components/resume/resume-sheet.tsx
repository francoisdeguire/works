import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export default function ResumeSheet({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <main
      className={cn(
        'min-h-svh bg-background px-4 pt-48 pb-16',
        'paper:min-h-0 paper:bg-white paper:p-0',
      )}
    >
      <article
        className={cn(
          'resume-sheet mx-auto max-w-xl bg-background text-base leading-[1.8] font-[425] text-foreground underline-offset-4',
          'paper:max-w-3/4 paper:mx-0 paper:rounded-none paper:p-0 paper:text-[9pt] paper:leading-snug paper:text-black paper:underline-offset-2',
          'paper:font-(family-name:--font-mona-sans-static) paper:font-normal',
          className,
        )}
      >
        {children}
      </article>
    </main>
  )
}
