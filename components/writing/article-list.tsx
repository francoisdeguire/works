import Link from "next/link";
import { formatShortDate } from "@/lib/date";
import type { Article } from "@/lib/writing";

type ArticleListProps = {
  articles: Article[];
};

export default function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <p className="mt-16 text-center font-display text-xs uppercase text-foreground-muted">
        First piece in progress.
      </p>
    );
  }

  const years = groupByYear(articles);
  return (
    <div className="mt-16 sm:mt-32">
      {years.map(([year, items]) => (
        <section key={year} className="mt-12 first:mt-0">
          <h2 className="mb-4 font-display text-base text-foreground-muted">
            {year}
          </h2>
          <hr className="my-2" />
          <ul>
            {items.map((article) => (
              <li key={article.slug}>
                <ArticleRow article={article} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function ArticleRow({ article }: { article: Article }) {
  return (
    <Link
      href={`/writing/${article.slug}`}
      className="-mx-2 group flex items-center duration-200 ease-standard justify-between gap-6 rounded px-4 py-5 transition-colors hover:bg-surface-2 focus-visible:bg-surface-2"
    >
      <h3 className="font-sans text-lg font-medium tracking-tight text-foreground-muted group-focus-visible:text-foreground group-hover:text-foreground">
        {article.title}
      </h3>
      <time
        dateTime={article.date}
        className="whitespace-nowrap font-display text-xs uppercase text-foreground-muted"
      >
        {formatShortDate(article.date)}
      </time>
    </Link>
  );
}

// Groups by the calendar year parsed from the ISO date string. We slice the string directly
// rather than constructing a Date — `new Date('2026-01-01').getFullYear()` returns 2025 in
// negative-UTC offsets because the string is interpreted as UTC midnight.
function groupByYear(articles: Article[]): [string, Article[]][] {
  const map = new Map<string, Article[]>();
  for (const article of articles) {
    const year = article.date.slice(0, 4);
    const bucket = map.get(year);
    if (bucket) bucket.push(article);
    else map.set(year, [article]);
  }
  return [...map.entries()].sort(([a], [b]) => b.localeCompare(a));
}
