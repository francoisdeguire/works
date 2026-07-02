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
  text: string
  id: string
}

export type Article = ArticleMeta & {
  slug: string
  source: string
  readingTimeMinutes: number
  headings: Heading[]
}

// We extract h2 only — articles use a single heading level by convention (see CLAUDE.md).
// Bumping to h2+h3 means matching `^#{2,3}\s+...` and tracking depth in `Heading`.
const H2_RE = /^##\s+(.+)$/gm
const FENCED_CODE_RE = /^```[\s\S]*?^```$/gm
// Strip paired uppercase-tagged JSX blocks (Preview, Note, Figure with children, etc.)
// so markdown headings nested inside MDX components don't leak into the TOC.
const JSX_BLOCK_RE = /^<([A-Z][\w.]*)\b[^>]*>[\s\S]*?^<\/\1>\s*$/gm
const IMPORT_RE = /^import\s.+$/gm
const MDX_COMMENT_RE = /\{\/\*[\s\S]*?\*\/\}/g

export function extractHeadings(source: string): Heading[] {
  const stripped = source.replace(FENCED_CODE_RE, '').replace(JSX_BLOCK_RE, '')
  const slugger = new GithubSlugger()
  const headings: Heading[] = []
  for (const [, captured] of stripped.matchAll(H2_RE)) {
    if (!captured) continue
    const text = captured.trim()
    headings.push({ text, id: slugger.slug(text) })
  }
  return headings
}

function computeReadingTime(content: string): number {
  const prose = content
    .replace(FENCED_CODE_RE, '')
    .replace(JSX_BLOCK_RE, '')
    .replace(IMPORT_RE, '')
    .replace(MDX_COMMENT_RE, '')
  const words = prose.trim().split(/\s+/).filter(Boolean).length
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
  return visible.sort((a, b) => b.date.localeCompare(a.date))
})

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getAllArticles()
  return articles.find((a) => a.slug === slug) ?? null
}
