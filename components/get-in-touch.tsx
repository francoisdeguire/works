import { site } from "@/lib/site";

export default function GetInTouch() {
  return (
    <a
      href={`mailto:${site.email}`}
      className="flex h-10 items-center rounded-full border-[0.5px] border-foreground/10 bg-background/85 surface-dark:bg-zinc-800/85 surface-dark:border-foreground/15 px-6 font-display font-medium text-[15px] uppercase tracking-tight backdrop-blur-md text-foreground/60 hover:text-foreground transition-colors duration-100"
    >
      Get In Touch
    </a>
  );
}
