import Link from 'next/link'
import { site } from '@/lib/site'

type NavPillProps = {
  withContact?: boolean
}

export default function NavPill({ withContact = false }: NavPillProps) {
  return (
    <nav
      aria-label="Primary"
      className="pill *:text-foreground/60 *:hover:text-foreground *:transition-colors *:duration-100"
    >
      <Link href="/writing">Writing</Link>
      <Link href="/artifacts">Artifacts</Link>
      {withContact ? <a href={`mailto:${site.email}`}>Hi</a> : null}
    </nav>
  )
}
