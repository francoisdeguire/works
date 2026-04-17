import Link from 'next/link'
import LogoMark from './logo-mark'

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="Home"
      className="inline-flex size-10 items-center justify-center rounded-pill bg-pill-background text-pill-foreground transition-opacity duration-fast hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
    >
      <LogoMark size={20} />
    </Link>
  )
}
