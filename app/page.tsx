import Link from "next/link";
import TerminalCard from "@/components/terminal-card";

export default function HomePage() {
  return (
    <main
      id="main"
      className="mx-auto w-full max-w-[90ch] px-4 sm:px-6 sm:pb-48"
    >
      <header className="mt-[30svh]">
        <h1 className="stagger-0 font-display text-3xl sm:text-4xl leading-none uppercase">
          Francois Deguire
        </h1>
        <h2 className="stagger-1 text-pretty font-display text-base sm:text-2xl leading-[1.6] mt-4 text-foreground-muted">
          Design Engineer / Creative Developer
        </h2>
      </header>

      <div className="mt-16 sm:mt-32 space-y-12 *:space-y-6 *:sm:space-y-12 sm:space-y-24 text-lg sm:text-2xl leading-loose font-medium tracking-tight text-foreground-muted [font-variation-settings:'wdth'_103]">
        <div>
          <p className="stagger-3">
            <strong className="font-medium text-foreground">
              My work lives between design and engineering.
            </strong>{" "}
            I compose interfaces, components, and the quiet systems underneath
            it all.
          </p>
          <p className="stagger-4">
            I studied industrial design, so the way I think about software is
            shaped by how I was taught to design objects within constraints:
            every part has purpose.
          </p>
        </div>

        <div>
          <p className="stagger-5">
            Since 2022, I've been at Volume7, where I now lead design for the
            20-person fullstack engineering team. We ship for enterprise and
            high-growth clients. My work spans systems, tooling, and UI.
          </p>
          <p className="stagger-6">
            Before that, I worked two years at Ubisoft building developer
            interfaces, shipping the internal tools design system, and weaving
            design into engineering workflows.
          </p>
        </div>

        <div>
          <p className="stagger-7">
            When I'm not working you'll find me stress-testing baking recipes,
            writing code for fun, or deep in some seemingly random new hobby.
          </p>
          <p className="stagger-8">
            Current hobby: the endless money pit that is film photography.{" "}
            <Link
              href="/photography"
              className="font-medium text-foreground underline-offset-4 transition-opacity duration-100 hover:underline hover:opacity-80 focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              View some of my shots
            </Link>
          </p>
        </div>
      </div>

      <footer className="stagger-9 mt-12 sm:mt-72 sm:px-10 -mx-4">
        <TerminalCard />
      </footer>
    </main>
  );
}
