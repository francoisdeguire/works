import { Fragment } from 'react'
import { cn } from '@/lib/cn'

interface HeaderProps {
  name: string
  title: string
  location: string
  email: string
  links: { label: string; href: string }[]
  className?: string
  nameClassName?: string
  titleClassName?: string
  contactClassName?: string
}

export default function Header({
  name,
  title,
  location,
  email,
  links,
  className,
  nameClassName,
  titleClassName,
  contactClassName,
}: HeaderProps) {
  return (
    <header className={cn('leading-none', className)}>
      <h1 className={cn('font-medium', 'paper:text-[11pt]', nameClassName)}>{name}</h1>
      <p className={cn('mt-3 text-foreground-muted', 'paper:mt-4', titleClassName)}>{title}</p>
      <p className={cn('mt-8 text-foreground-muted', 'paper:mt-2', titleClassName)}>
        Based in {location}
      </p>
      <a
        href={`mailto:${email}`}
        target="_blank"
        className={cn(
          'mt-3 block text-foreground-muted underline decoration-border hover:text-foreground hover:decoration-foreground transition-colors',
          'paper:mt-2',
        )}
        rel="noopener"
      >
        {email}
      </a>
      <p
        className={cn(
          'mt-8 text-foreground-muted flex text-sm flex-wrap gap-x-6 gap-y-3',
          'paper:mt-4 paper:gap-x-4 paper:text-[9pt]',
          contactClassName,
        )}
      >
        {links.map((link) => (
          <Fragment key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-border hover:text-foreground hover:decoration-foreground transition-colors"
            >
              {link.label}
            </a>
          </Fragment>
        ))}
      </p>
    </header>
  )
}
