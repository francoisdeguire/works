import Link from 'next/link'
import { site } from '@/lib/site'

type NavPillProps = {
  withContact?: boolean
}

export default function NavPill({ withContact = false }: NavPillProps) {
  return (
    <nav
      aria-label="Primary"
      className="flex h-10 font-display bg-background/85 backdrop-blur-md uppercase tracking-tight text-[15px] items-center gap-7 rounded-full px-8 border-[0.5px] border-foreground/10 font-medium *:text-foreground/60 *:hover:text-foreground *:transition-colors *:duration-100"
    >
      <Link href="/writing">Writing</Link>
      <Link href="/artifacts">Artifacts</Link>
      {withContact ? <a href={`mailto:${site.email}`}>Hi</a> : null}
    </nav>
  )
}
