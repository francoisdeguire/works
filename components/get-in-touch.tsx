import { mailtoLinkProps } from '@/lib/site'

export default function GetInTouch() {
  return (
    <a
      {...mailtoLinkProps}
      className="flex group h-10 items-center rounded-full border-[0.5px] border-foreground/15 bg-pill-glass/85 px-6 font-display font-medium text-[15px] uppercase tracking-tight backdrop-blur-md text-foreground/50 hover:text-foreground transition-colors duration-100 backdrop-saturate-150"
    >
      Get In Touch
    </a>
  )
}
