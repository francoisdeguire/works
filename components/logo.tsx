import Link from "next/link";
import { cn } from "@/lib/cn";
import LogoMark from "./logo-mark";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="Home"
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full bg-pill-background text-pill-foreground transition-opacity duration-100",
        "hover:opacity-80 surface-dark:hover:opacity-90",
        "surface-dark:bg-white surface-dark:text-black",
      )}
    >
      <LogoMark size={20} />
    </Link>
  );
}
