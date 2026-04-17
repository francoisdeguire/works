import Link from 'next/link'

export default function NavPill() {
  return (
    <nav
      aria-label="Primary"
      className="flex h-10 items-center gap-5 rounded-pill bg-pill-background/90 px-6 text-body font-medium text-pill-foreground"
    >
      <Link
        href="/writing"
        className="transition-opacity duration-fast hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        Writing
      </Link>
      <Link
        href="/artifacts"
        className="transition-opacity duration-fast hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        Artifacts
      </Link>
    </nav>
  )
}
