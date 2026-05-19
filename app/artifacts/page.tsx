import PageTitle from '@/components/page-title'
import SiteHeader from '@/components/site-header'

export default function ArtifactsPage() {
  return (
    <>
      <SiteHeader variant="default" />
      <main id="main" className="mx-auto w-full max-w-page px-6 pt-48 pb-24">
        <PageTitle title="Artifacts" subtitle="Snippets exploring code, design and craft" />
        <p className="mt-12 text-center text-foreground-muted">Phase 5 lights up the bento grid.</p>
      </main>
    </>
  )
}
