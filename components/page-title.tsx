type PageTitleProps = {
  title: string
  subtitle?: string
}

export default function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div className="text-center">
      <h1 className="font-display text-display uppercase">{title}</h1>
      {subtitle ? (
        <p className="mt-2 font-display text-small text-foreground-muted">{subtitle}</p>
      ) : null}
    </div>
  )
}
