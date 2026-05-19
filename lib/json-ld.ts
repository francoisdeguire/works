import type { Article } from '@/lib/writing'

const SITE_URL = 'https://francois.works'
const AUTHOR = {
  '@type': 'Person',
  name: 'François Deguire',
  url: SITE_URL,
} as const

export function blogPostingJsonLd(article: Article, path: string): string {
  const url = `${SITE_URL}${path}`
  const payload = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.summary,
    datePublished: article.date,
    dateModified: article.updated ?? article.date,
    author: AUTHOR,
    url,
    image: `${url}/opengraph-image.png`,
  }
  // JSON.stringify does not escape `/`, so a title containing `</script>` could break out.
  return JSON.stringify(payload).replace(/</g, '\\u003c')
}
