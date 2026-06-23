import Link from 'next/link'
import LogoMark from './logo-mark'

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="Home"
      className="logo inline-flex size-10 items-center justify-center rounded-full bg-pill-background text-pill-foreground"
    >
      <LogoMark size={20} />
    </Link>
  )
}
