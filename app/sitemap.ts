import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'
import { getAllArticles } from '@/lib/writing'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles()
  const now = new Date()
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now },
    { url: `${site.url}/writing`, lastModified: now },
    { url: `${site.url}/artifacts`, lastModified: now },
    { url: `${site.url}/photography`, lastModified: now },
  ]
  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${site.url}/writing/${a.slug}`,
    lastModified: new Date(a.updated ?? a.date),
  }))
  return [...staticRoutes, ...articleRoutes]
}
