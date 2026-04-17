import { site } from '@/lib/site'

export default function GetInTouch() {
  return (
    <a
      href={`mailto:${site.email}`}
      className="inline-flex h-10 items-center rounded-pill bg-pill-background/90 px-5 text-body font-medium text-pill-foreground transition-opacity duration-fast hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
    >
      Get In Touch
    </a>
  )
}
