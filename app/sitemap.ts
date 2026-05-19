import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/writing'

const SITE_URL = 'https://francois.works'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles()
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/writing`, lastModified: new Date() },
    { url: `${SITE_URL}/artifacts`, lastModified: new Date() },
    { url: `${SITE_URL}/photography`, lastModified: new Date() },
  ]
  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/writing/${a.slug}`,
    lastModified: new Date(a.updated ?? a.date),
  }))
  return [...staticRoutes, ...articleRoutes]
}
