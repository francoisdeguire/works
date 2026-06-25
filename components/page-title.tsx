type PageTitleProps = {
  title: string
  subtitle?: string
}

export default function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <header>
      <h1 className="font-display text-3xl tracking-tighter leading-none uppercase sm:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <h2 className="mt-4 text-pretty font-display text-base leading-[1.6] text-foreground-muted sm:text-2xl">
          {subtitle}
        </h2>
      ) : null}
    </header>
  )
}
