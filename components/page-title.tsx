type PageTitleProps = {
  title: string
  subtitle?: string
}

export default function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div className="text-center">
      <h1 className="font-display text-6xl leading-[1.4] uppercase">{title}</h1>
      {subtitle ? (
        <p className="mt-2 font-display text-sm leading-[1.6] text-foreground-muted">{subtitle}</p>
      ) : null}
    </div>
  )
}
