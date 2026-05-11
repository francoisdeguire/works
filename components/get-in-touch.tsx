import { site } from '@/lib/site'

export default function GetInTouch() {
  return (
    <a
      href={`mailto:${site.email}`}
      target="_blank"
      className="flex h-10 font-display uppercase bg-background/85 backdrop-blur-md tracking-tight text-[15px] items-center gap-7 rounded-full px-8 border-[0.5px] border-foreground/10 font-medium text-foreground/60 hover:text-foreground transition-colors duration-100"
      rel="noopener"
    >
      Get In Touch
    </a>
  )
}
