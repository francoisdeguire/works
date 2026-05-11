import Link from 'next/link'

type BackPillProps = {
  label: string
  href: string
}

export default function BackPill({ label, href }: BackPillProps) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 items-center gap-3 rounded-full bg-black/5 pr-6 pl-5 text-base font-medium text-foreground transition-colors duration-100 hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
    >
      <BackArrow />
      {label}
    </Link>
  )
}

function BackArrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 5L2 8l3 3" />
      <path d="M2 8h7c2 0 3 1 3 3v1" />
    </svg>
  )
}
