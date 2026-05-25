import ArtifactGrid from '@/components/artifacts/artifact-grid'
import PageTitle from '@/components/page-title'
import { getAllArtifacts } from '@/lib/artifacts'

export default async function ArtifactsPage() {
  const artifacts = await getAllArtifacts()
  return (
    <main id="main" className="mx-auto w-full max-w-[90ch] px-5 pt-[30svh] sm:px-6 sm:pb-48">
      <PageTitle title="Artifacts" subtitle="Snippets exploring code, design and craft" />
      <ArtifactGrid artifacts={artifacts} />
    </main>
  )
}
