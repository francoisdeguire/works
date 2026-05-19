import { site } from '@/lib/site'
import type { Article } from '@/lib/writing'

const AUTHOR = {
  '@type': 'Person',
  name: site.name,
  url: site.url,
} as const

export function blogPostingJsonLd(article: Article, path: string): string {
  const url = `${site.url}${path}`
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
  // Escape `<` so a value containing `</script>` cannot terminate the surrounding tag.
  return JSON.stringify(payload).replace(/</g, '\\u003c')
}
