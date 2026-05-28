import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticleHeader from '@/components/writing/article-header'
import Toc from '@/components/writing/toc'
import { blogPostingJsonLd } from '@/lib/json-ld'
import { getAllArticles, getArticleBySlug } from '@/lib/writing'

export async function generateStaticParams() {
  const articles = await getAllArticles()
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/writing/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}
  const path = `/writing/${slug}`
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: path },
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      url: path,
      publishedTime: article.date,
      modifiedTime: article.updated ?? article.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
    },
  }
}

export default async function WritingArticlePage({ params }: PageProps<'/writing/[slug]'>) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()
  const { default: MDX } = await import(`@/content/writing/${slug}.mdx`)

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: payload is JSON-stringified and script-tag-escaped in blogPostingJsonLd
        dangerouslySetInnerHTML={{ __html: blogPostingJsonLd(article, `/writing/${slug}`) }}
      />
      <Toc headings={article.headings} />
      <article>
        <ArticleHeader article={article} />
        <div className="prose-body article-body">
          <MDX />
        </div>
      </article>
    </>
  )
}
