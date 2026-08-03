import { cache } from 'react'
import { z } from 'zod'
import { artifactsManifest } from '@/content/artifacts/manifest'

const baseSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  date: z.iso.date(),
  updated: z.iso.date().optional(),
  /** Overlay text color over the video. 'light' renders white text, 'dark' renders gray-950. */
  mode: z.enum(['light', 'dark']),
  /** Column the tile sits in on the two-column grid. Order within a column follows manifest order. */
  column: z.union([z.literal(1), z.literal(2)]),
  /** Overrides the auto-derived action label (Try ↗ / Read ↗ / Visit ↗), rendered verbatim. */
  cta: z.string().optional(),
  video: z.string().optional(),
  poster: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  published: z.boolean().default(true),
})

const demoSchema = baseSchema.extend({ kind: z.literal('demo') })

const visitSchema = baseSchema.extend({
  kind: z.literal('visit'),
  // External URL or internal path. Internal paths render <Link>; externals render <a target="_blank">.
  href: z.union([z.url(), z.string().startsWith('/')]),
})

// Plain video tile: no action, no link — the clip is the whole artifact.
const showcaseSchema = baseSchema.extend({ kind: z.literal('showcase') })

export const artifactSchema = z.discriminatedUnion('kind', [
  demoSchema,
  visitSchema,
  showcaseSchema,
])
export type ArtifactInput = z.input<typeof artifactSchema>
export type Artifact = z.output<typeof artifactSchema>

export const getAllArtifacts = cache(async (): Promise<Artifact[]> => {
  const parsed = artifactsManifest.map((entry, index) => {
    try {
      return artifactSchema.parse(entry) satisfies Artifact
    } catch (error) {
      const why = error instanceof Error ? error.message : String(error)
      const id = 'slug' in entry && typeof entry.slug === 'string' ? entry.slug : `index ${index}`
      throw new Error(`Invalid artifact (${id}): ${why}`)
    }
  })
  return process.env.NODE_ENV === 'production' ? parsed.filter((a) => a.published) : parsed
})

export async function getArtifactBySlug(slug: string): Promise<Artifact | null> {
  const artifacts = await getAllArtifacts()
  return artifacts.find((a) => a.slug === slug) ?? null
}
