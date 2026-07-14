import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { artifactDemos } from '@/app/artifacts/_experiments/registry'
import { getAllArtifacts, getArtifactBySlug } from '@/lib/artifacts'

export const dynamicParams = false

export async function generateStaticParams() {
  const artifacts = await getAllArtifacts()
  return artifacts.filter((a) => a.kind === 'demo').map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/artifacts/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const artifact = await getArtifactBySlug(slug)
  if (artifact?.kind !== 'demo') return {}
  const path = `/artifacts/${slug}`
  return {
    title: artifact.title,
    alternates: { canonical: path },
    openGraph: { title: artifact.title, type: 'website', url: path },
    twitter: { card: 'summary_large_image', title: artifact.title },
  }
}

export default async function ArtifactPage({ params }: PageProps<'/artifacts/[slug]'>) {
  const { slug } = await params
  const artifact = await getArtifactBySlug(slug)
  if (artifact?.kind !== 'demo') notFound()
  const load = artifactDemos[slug]
  if (!load) notFound()
  const { default: Demo } = await load()
  return (
    <main
      id="main"
      style={{ viewTransitionName: `artifact-${slug}` }}
      className="mx-auto flex min-h-full w-full max-w-page flex-col items-center justify-center px-3 sm:px-6 pt-32 pb-16"
    >
      <Demo />
    </main>
  )
}
