"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

type NavPillProps = {
  withContact?: boolean;
};

export default function NavPill({ withContact = false }: NavPillProps) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      aria-label="Primary"
      className="flex h-10 items-center gap-5 rounded-full border-[0.5px] border-foreground/10 bg-background/85 surface-dark:bg-zinc-800/85 surface-dark:border-foreground/15 px-6 font-display font-medium text-[15px] uppercase tracking-tight backdrop-blur-md *:text-foreground/60 *:hover:text-foreground *:aria-[current=page]:text-foreground *:transition-colors *:duration-100"
    >
      <Link
        href="/writing"
        aria-current={isActive("/writing") ? "page" : undefined}
      >
        Writing
      </Link>
      <Link
        href="/artifacts"
        aria-current={isActive("/artifacts") ? "page" : undefined}
      >
        Artifacts
      </Link>
      {withContact ? <a href={`mailto:${site.email}`}>Hi</a> : null}
    </nav>
  );
}
