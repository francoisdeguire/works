import { RiArrowRightUpLine } from '@remixicon/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import TerminalCard from '@/components/terminal-card'
import { cn } from '@/lib/cn'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { url: '/' },
}

export default function HomePage() {
  return (
    <main id="main" className="mx-auto w-full max-w-[90ch] px-5 pt-[30svh] sm:px-6">
      <header>
        <h1 className="stagger-0 font-display text-3xl sm:text-5xl tracking-tight leading-none text-balance uppercase">
          Francois Deguire
        </h1>
        <p className="stagger-1 mt-4 text-pretty tracking-tight text-lg sm:text-2xl sm:leading-loose font-[475] leading-[1.6] text-foreground-muted">
          Design Engineer / Creative Developer
        </p>
      </header>

      <div
        className={cn(
          'mt-16 sm:mt-32',
          'space-y-12 sm:space-y-24 *:space-y-6 *:sm:space-y-12',
          'text-lg sm:text-2xl leading-[1.8] sm:leading-loose font-[475] tracking-tight text-pretty text-foreground-muted',
        )}
      >
        <div>
          <p className="stagger-3">
            <strong className="font-medium text-foreground">
              My work lives between design and engineering.
            </strong>{' '}
            I compose interfaces, components, and the quiet systems underneath it all.
          </p>
          <p className="stagger-4">
            I studied industrial design, so the way I think about software is shaped by how I was
            taught to design objects within constraints: every part has purpose.
          </p>
        </div>

        <div>
          <p className="stagger-5">
            Since 2022, I've been at{' '}
            <a
              href="https://www.volume7.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-3 transition-[text-decoration-color] duration-200 underline decoration-foreground/30 hover:decoration-foreground focus-visible:decoration-foreground"
            >
              Volume7
            </a>
            , where I now lead design for the 20-person fullstack engineering team. We ship for
            enterprise and high-growth clients. My work spans systems, tooling, and UI.
          </p>
          <p className="stagger-6">
            Before that, I worked two years at{' '}
            <a
              href="https://www.ubisoft.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-3 transition-[text-decoration-color] duration-200 underline decoration-foreground/30 hover:decoration-foreground focus-visible:decoration-foreground"
            >
              Ubisoft
            </a>{' '}
            building developer interfaces, shipping the internal tools design system, and weaving
            design into engineering workflows.
          </p>
        </div>

        <div>
          <p className="stagger-7">
            When I'm not working you'll find me stress-testing baking recipes, writing code for fun,
            or deep in some seemingly random new hobby.
          </p>
          <p className="stagger-8">
            Current hobby: the endless money pit that is film photography.
            <br />
            <Link
              href="/photography"
              className="text-foreground underline-offset-3 transition-[text-decoration-color] duration-200 underline decoration-foreground/30 hover:decoration-foreground focus-visible:decoration-foreground"
            >
              View some of my shots
            </Link>
          </p>
        </div>
      </div>

      <nav
        aria-label="Elsewhere"
        className="stagger-9 mt-12 sm:mt-24 flex items-center gap-6 sm:gap-10 text-lg sm:text-2xl font-[475] tracking-tight text-foreground"
      >
        {[
          { label: 'GitHub', href: 'https://github.com/francoisdeguire' },
          { label: 'X', href: 'https://x.com/madebyfrancois' },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 rounded-xs"
          >
            <span className="underline underline-offset-3 decoration-foreground/30 transition-[text-decoration-color] duration-200 group-hover:decoration-foreground group-focus-visible:decoration-foreground">
              {label}
            </span>
            <RiArrowRightUpLine
              aria-hidden
              className="size-4 sm:size-5 transition-transform duration-200 ease-standard group-hover:-translate-y-px group-hover:translate-x-px"
            />
          </a>
        ))}
      </nav>

      <footer className="sm:h-svh sm:flex sm:flex-col">
        <div className="stagger-10 mt-12 sm:my-auto w-full max-w-180 mx-auto">
          <TerminalCard />
        </div>
      </footer>
    </main>
  )
}
