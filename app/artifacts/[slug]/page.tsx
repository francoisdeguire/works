import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { artifactModules } from '@/lib/artifact-modules'
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
  if (!artifact || artifact.kind !== 'demo') return {}
  return {
    title: artifact.title,
    openGraph: { title: artifact.title, type: 'website' },
    twitter: { card: 'summary_large_image', title: artifact.title },
  }
}

export default async function ArtifactPage({ params }: PageProps<'/artifacts/[slug]'>) {
  const { slug } = await params
  const artifact = await getArtifactBySlug(slug)
  if (!artifact || artifact.kind !== 'demo') notFound()
  const loader = artifactModules[artifact.slug]
  if (!loader) notFound()
  const { default: Demo } = await loader()
  return (
    <main
      id="main"
      style={{ viewTransitionName: `artifact-${slug}` }}
      className="mx-auto flex min-h-screen w-full max-w-page flex-col items-center justify-center px-6 pt-32 pb-16"
    >
      <Demo />
    </main>
  )
}
