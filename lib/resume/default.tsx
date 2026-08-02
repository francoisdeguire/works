import Bullet from '@/components/resume/bullet'
import Header from '@/components/resume/header'
import Muted from '@/components/resume/muted'
import ResumeSheet from '@/components/resume/resume-sheet'
import Role from '@/components/resume/role'
import Section from '@/components/resume/section'

const links = [
  { label: 'francois.works', href: 'https://www.francois.works' },
  {
    label: 'linkedin.com/in/francois-deguire',
    href: 'https://www.linkedin.com/in/francois-deguire/',
  },
  { label: 'github.com/francoisdeguire', href: 'https://www.github.com/francoisdeguire' },
]

export default function DefaultResume() {
  return (
    <ResumeSheet>
      <Header
        name="François Deguire"
        title="Design Engineer"
        location="Montreal, QC"
        email="hey@francois.works"
        links={links}
      />

      <p className="mt-8 text-pretty paper:mt-4">
        Design engineer with six years of experience in enterprise software. I take complex and
        novel ideas all the way to production, owning the outcome through every stage of the
        creative process. My curiosity and wide skill set allow me to work across both design and
        engineering to deliver the last 10% that makes an interface feel truly considered.
      </p>

      <p className="mt-8 text-pretty paper:mt-2">
        Explore my selected work and writing on{' '}
        <a
          href="https://www.francois.works"
          className="underline decoration-border hover:text-foreground hover:decoration-foreground transition-colors"
        >
          www.francois.works
        </a>
      </p>

      <Section title="Skills">
        <div className="space-y-3 paper:space-y-2">
          <p className="text-pretty">
            <Muted>
              <span className="underline decoration-border">AI</span> /
            </Muted>{' '}
            Agentic Coding & Workflows, Skills Authoring, Streaming & Generative UI, LLM
            documentation, AI-assisted tooling
          </p>
          <p className="text-pretty">
            <Muted>
              <span className="underline decoration-border">Engineering</span> /
            </Muted>{' '}
            React (Next.js, Vite, TanStack), TypeScript, Tailwind, CSS Modules, Motion, WebGL &
            Canvas, Accessibility, Performance optimization, Developer tooling, Git
          </p>
          <p className="text-pretty">
            <Muted>
              <span className="underline decoration-border">Design</span> /
            </Muted>{' '}
            Design Systems & Tokens, UI & UX design, Interaction design, System Documentation,
            Prototyping, Visual Accessibility
          </p>
        </div>
      </Section>

      <Section title="Experience">
        <Role
          company="Volume7"
          title="Design Engineer"
          meta="Sep 2022 – Present"
          context="Fullstack product agency shipping for enterprise and high-growth clients"
        >
          <Bullet>
            Lead design for a 20-person fullstack engineering team, owning products from discovery
            and visual direction through production React frontends
          </Bullet>
          <Bullet>
            Shipped design and frontend code for 10+ enterprise web applications and 10+ marketing
            websites across B2B and B2C industries
          </Bullet>
          <Bullet>
            Built the frontend of the agency's fullstack Vite monorepo starter: a composable
            component library and design system that cut project setup from days to hours and keep
            design consistent across projects
          </Bullet>
          <Bullet>
            Designed and built internal AI design tooling that pairs interface creation with design
            review, helping developers ship higher-quality interfaces independently
          </Bullet>
        </Role>

        <Role
          company="Ubisoft"
          title="UI Designer"
          meta="Jan 2021 – Sep 2022"
          context="Internal developer tooling and design system for AAA game production"
        >
          <Bullet>
            Owned the internal-tools design system, designing and maintaining 50+ core components
            and patterns adopted by 6 tool teams to improve consistency and reduce UI errors
          </Bullet>
          <Bullet>
            Prototyped and designed developer-facing web and IDE interfaces for debugging and
            profiling alongside UX and UR, turning complex troubleshooting into AI-enhanced bug
            matching and resolution
          </Bullet>
          <Bullet>
            Championed design system adoption across tool teams through onboarding, training, and
            internal conferences
          </Bullet>
        </Role>
      </Section>

      <Section title="Education">
        <div className="space-y-1.5 paper:space-y-0.5">
          <p>
            Bachelor of Arts, Industrial Design <Muted>/ Université de Montréal, 2016–2020</Muted>
          </p>
          <p>
            Interaction Design Specialization <Muted>/ UC San Diego (Online), 2020</Muted>
          </p>
        </div>
      </Section>
    </ResumeSheet>
  )
}
