import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { formatLongDate } from '@/lib/date'
import { getArticleBySlug } from '@/lib/writing'

export const runtime = 'nodejs'
export const contentType = 'image/png'
export const size = { width: 1200, height: 630 }
export const alt = 'francois.works article'

const FONT_PATH = join(process.cwd(), 'app/fonts/departure-mono/DepartureMono-Regular.woff')

type RouteParams = Promise<{ slug: string }>

export default async function Image({ params }: { params: RouteParams }) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  const title = article?.title ?? 'Writing'
  const dateLabel = article ? formatLongDate(article.date) : ''
  const fontData = await readFile(FONT_PATH)

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
        {title}
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 18,
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        {dateLabel}
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
