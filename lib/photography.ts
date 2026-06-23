import { cache } from 'react'
import { z } from 'zod'
import { photographyManifest } from '@/content/photography/manifest'
import { assetUrl, imagesHost } from '@/lib/cdn'

const photoSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  src: z.string().min(1),
  alt: z.string().min(1),
  location: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
})

// N >= 5 keeps the 4-neighbor de-dupe in lib/photography-math.ts satisfiable.
// Smaller manifests would let neighbor picks exhaust every available index
// and silently break the no-touch invariant; this fails loudly instead.
const manifestSchema = z.array(photoSchema).min(5)

export type PhotoInput = z.input<typeof photoSchema>
export type Photo = z.output<typeof photoSchema>

export const getAllPhotos = cache(async (): Promise<Photo[]> => {
  return manifestSchema.parse(photographyManifest)
})

const DEFAULT_QUALITY = 80

// Cache-key stability matters more than it looks. URL.searchParams.set preserves
// *insertion* order, not lexical order — so two call sites that set the same
// params in different orders produce different URL strings, which the browser
// treats as different cache keys. Build the query string by hand in a fixed
// `format → quality → width` sequence and the disk cache hits on remount.
// Do not mix with lib/cdn-image-loader.ts (different insertion order).
export function photoUrl(src: string, width: number, quality: number = DEFAULT_QUALITY): string {
  if (isExternal(src)) return src
  const absolute = assetUrl(src, imagesHost())
  return `${absolute}?format=webp&quality=${quality}&width=${width}`
}

const DEFAULT_WIDTHS = [480, 720, 1080, 1440] as const
// Per the requirements: lower quality at higher widths. At 3× the eye can't
// see the difference and we save ~20–30% bytes.
const DEFAULT_QUALITIES = [82, 80, 78, 75] as const

export function photoSrcset(
  src: string,
  widths: readonly number[] = DEFAULT_WIDTHS,
  qualities: readonly number[] = DEFAULT_QUALITIES,
): string | undefined {
  if (isExternal(src)) return undefined
  return widths
    .map((w, i) => `${photoUrl(src, w, qualities[i] ?? DEFAULT_QUALITY)} ${w}w`)
    .join(', ')
}

function isExternal(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://')
}
