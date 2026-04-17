import Link from 'next/link'
import TerminalCard from '@/components/terminal-card'

export default function HomePage() {
  return (
    <main id="main" className="mx-auto w-full max-w-page px-6 pt-48 pb-24">
      <header>
        <h1 className="font-display text-display tracking-tight uppercase">François Deguire</h1>
        <p className="font-display text-subtitle tracking-tight text-foreground-muted">
          Design Engineer / Creative Developer
        </p>
      </header>

      <div className="mt-32 flex flex-col gap-16 text-h2 font-medium tracking-[-0.01em] text-foreground-muted [font-variation-settings:'wdth'_105]">
        <p>
          I design systems, build components, and obsess over the details that{' '}
          <strong className="font-medium text-foreground">
            make complex products feel effortless
          </strong>
          .
        </p>

        <div className="flex flex-col gap-8">
          <p>
            Currently at <strong className="font-medium text-foreground">Volume7</strong>, a
            20-person digital agency where I now run the design side of things (systems, tooling,
            UI) for a team of fullstack devs building for enterprise and high-growth clients.
          </p>
          <p>
            Previously, spent two years at{' '}
            <strong className="font-medium text-foreground">Ubisoft</strong> working on developer
            interfaces, the internal tools design system, and championing design adoption across
            technical teams.
          </p>
          <p>
            I studied industrial design, where every decision means considering material choices,
            manufacturing tolerances, and real-world interactions. Turns out, now I just do the same
            but inside a screen.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <p>
            When I'm not working you'll find me{' '}
            <strong className="font-medium text-foreground">writing code for fun</strong>,
            stress-testing baking recipes, or deep in some seemingly random new hobby.
          </p>
          <p>
            Current hobby: the endless money pit that is film photography.{' '}
            <Link
              href="/photography"
              className="font-medium text-foreground underline-offset-4 transition-opacity duration-fast hover:underline hover:opacity-80 focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              View some of my shots
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-32">
        <TerminalCard />
      </div>
    </main>
  )
}
