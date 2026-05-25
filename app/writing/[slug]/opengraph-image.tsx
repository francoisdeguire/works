import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'
import { formatLongDate } from '@/lib/date'
import { getArticleBySlug } from '@/lib/writing'

// `nodejs` runtime is required for the local font read below; `next/og` defaults to `edge`,
// which has no filesystem access.
export const runtime = 'nodejs'
export const contentType = 'image/png'
export const size = { width: 1200, height: 630 }
export const alt = 'francois.works article'

const FONT_PATH = join(process.cwd(), 'app/fonts/departure-mono/DepartureMono-Regular.woff')
// Hoisted so the font is read once per process, not per request.
const fontDataPromise = readFile(FONT_PATH)

type RouteParams = Promise<{ slug: string }>

export default async function Image({ params }: { params: RouteParams }) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()
  const fontData = await fontDataPromise

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#ffffff',
        color: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 80,
        fontFamily: 'Departure',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 18,
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        FRANCOIS.WORKS / WRITING
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 72,
          lineHeight: 1.1,
          textTransform: 'uppercase',
          maxWidth: '90%',
        }}
      >
        {article.title}
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 18,
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        {formatLongDate(article.date)}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: 'Departure',
          data: fontData,
          style: 'normal',
          weight: 400,
        },
      ],
    },
  )
}
