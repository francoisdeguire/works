import { promises as fs } from 'node:fs'
import path from 'node:path'
import GithubSlugger from 'github-slugger'
import matter from 'gray-matter'
import { cache } from 'react'
import { z } from 'zod'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'writing')
const WORDS_PER_MINUTE = 220

export const articleMetaSchema = z.object({
  title: z.string(),
  date: z.iso.date(),
  summary: z.string().max(200),
  published: z.boolean().default(true),
  updated: z.iso.date().optional(),
  tags: z.array(z.string()).optional(),
})

export type ArticleMeta = z.infer<typeof articleMetaSchema>

export type Heading = {
  depth: 2 | 3
  text: string
  id: string
}

export type Article = ArticleMeta & {
  slug: string
  source: string
  readingTimeMinutes: number
  headings: Heading[]
}

const HEADING_RE = /^(#{2,3})\s+(.+)$/gm
const FENCED_CODE_RE = /^```[\s\S]*?^```$/gm

export function extractHeadings(source: string): Heading[] {
  const stripped = source.replace(FENCED_CODE_RE, '')
  const slugger = new GithubSlugger()
  const headings: Heading[] = []
  for (const match of stripped.matchAll(HEADING_RE)) {
    const depth = match[1].length as 2 | 3
    const text = match[2].trim()
    headings.push({ depth, text, id: slugger.slug(text) })
  }
  return headings
}

function computeReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

// gray-matter parses unquoted ISO dates as Date objects; quoted as strings. Normalize to string.
function coerceDateString(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return value
}

async function loadArticle(filePath: string): Promise<Article> {
  const raw = await fs.readFile(filePath, 'utf8')
  const parsed = matter(raw)
  const data = {
    ...parsed.data,
    date: coerceDateString(parsed.data.date),
    updated: coerceDateString(parsed.data.updated),
  }
  let meta: ArticleMeta
  try {
    meta = articleMetaSchema.parse(data) satisfies ArticleMeta
  } catch (error) {
    const where = path.relative(process.cwd(), filePath)
    const why = error instanceof Error ? error.message : String(error)
    throw new Error(`Invalid frontmatter in ${where}: ${why}`)
  }
  return {
    ...meta,
    slug: path.basename(filePath, '.mdx'),
    source: parsed.content,
    readingTimeMinutes: computeReadingTime(parsed.content),
    headings: extractHeadings(parsed.content),
  }
}

export const getAllArticles = cache(async (): Promise<Article[]> => {
  let files: string[]
  try {
    files = await fs.readdir(CONTENT_DIR)
  } catch {
    return []
  }
  const articles = await Promise.all(
    files.filter((f) => f.endsWith('.mdx')).map((f) => loadArticle(path.join(CONTENT_DIR, f))),
  )
  const visible =
    process.env.NODE_ENV === 'production' ? articles.filter((a) => a.published) : articles
  return visible.sort((a, b) => (a.date < b.date ? 1 : -1))
})

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getAllArticles()
  return articles.find((a) => a.slug === slug) ?? null
}
