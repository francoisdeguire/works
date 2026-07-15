import ArtifactTile from '@/components/artifacts/artifact-tile'
import type { Artifact } from '@/lib/artifacts'

type ArtifactGridProps = {
  artifacts: Artifact[]
}

export default function ArtifactGrid({ artifacts }: ArtifactGridProps) {
  return (
    <>
      <ul className="mt-16 sm:mt-32 columns-1 -mx-2 gap-3 sm:columns-2 lg:-mx-16 xl:-mx-32">
        {artifacts.map((artifact) => (
          <li key={artifact.slug} className="mb-3 break-inside-avoid">
            <ArtifactTile artifact={artifact} />
          </li>
        ))}
      </ul>
      <p className="mt-16 text-center font-display text-sm uppercase text-foreground-muted">
        More coming soon
      </p>
    </>
  )
}
