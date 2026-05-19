import { site } from '@/lib/site'

export default function GetInTouch() {
  return (
    <a
      href={`mailto:${site.email}`}
      className="pill text-foreground/60 hover:text-foreground transition-colors duration-100"
    >
      Get In Touch
    </a>
  )
}
