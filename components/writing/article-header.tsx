import { formatLongDate } from '@/lib/date'
import type { Article } from '@/lib/writing'

type ArticleHeaderProps = {
  article: Article
}

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  const minutes = article.readingTimeMinutes
  const showUpdated = article.updated && article.updated !== article.date
  return (
    <header className="mb-12">
      <h1 className="font-display text-3xl uppercase leading-tight sm:text-4xl">{article.title}</h1>
      <p className="mt-4 font-display text-xs uppercase text-foreground-muted">
        {formatLongDate(article.date)}
        {' - '}
        {minutes} min read
        {showUpdated ? ` · Updated ${formatLongDate(article.updated as string)}` : ''}
      </p>
    </header>
  )
}
