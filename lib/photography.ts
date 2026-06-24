import { cache } from 'react'
import { z } from 'zod'
import { photographyManifest } from '@/content/photography/manifest'
import { assetUrl, imagesHost } from '@/lib/cdn'

const photoSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  // Bunny-relative base path, no extension or width suffix (e.g. 'photos/photo-01').
  // photoUrl appends `-<width>.webp` to reach a pre-encoded variant; a full URL
  // passes through untouched via isExternal().
  src: z.string().min(1),
  alt: z.string().min(1),
  location: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  // Tiny base64 WebP for blur-up. Optional so the manifest still parses before
  // the encode script (scripts/optimize-photos.ts) has populated it.
  blur: z.string().min(1).optional(),
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

// Pre-encoded WebP variant widths uploaded to images.francois.works. The encode
// script emits one file per width as `<src>-<width>.webp` and the browser hits
// them directly: no Bunny edge processing, no per-request transform cost. Widths
// come from the canvas sizing (lib/photography-math.ts): a cell's long edge is
// cellSize * 0.72, so real demand runs ~950px (phone at DPR 3) up to ~1728px
// (5K desktop at DPR 2). srcset plus the per-cell `sizes` pick one by DPR.
export const PHOTO_WIDTHS = [960, 1440, 1920] as const

const FALLBACK_WIDTH = 1440

export function photoUrl(src: string, width: number = FALLBACK_WIDTH): string {
  if (isExternal(src)) return src
  return assetUrl(`${src}-${width}.webp`, imagesHost())
}

export function photoSrcset(
  src: string,
  widths: readonly number[] = PHOTO_WIDTHS,
): string | undefined {
  if (isExternal(src)) return undefined
  return widths.map((w) => `${photoUrl(src, w)} ${w}w`).join(', ')
}

function isExternal(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://')
}
