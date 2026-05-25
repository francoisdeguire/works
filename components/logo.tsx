import Link from 'next/link'
import LogoMark from './logo-mark'

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="Home"
      className="inline-flex size-10 items-center justify-center rounded-full bg-pill-background text-pill-foreground transition-opacity duration-100 hover:opacity-80 surface-dark:hover:opacity-90"
    >
      <LogoMark size={20} />
    </Link>
  )
}
