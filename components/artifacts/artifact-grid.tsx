import ArtifactTile from '@/components/artifacts/artifact-tile'
import type { Artifact } from '@/lib/artifacts'

type ArtifactGridProps = {
  artifacts: Artifact[]
}

const HIDDEN_PAGE_STATE = true

export default function ArtifactGrid({ artifacts }: ArtifactGridProps) {
  if (HIDDEN_PAGE_STATE === true)
    return (
      <p className="mt-16 sm:mt-32 text-center font-display text-sm uppercase text-foreground-muted">
        Coming soon
      </p>
    )
  else
    return (
      <ul className="mt-16 grid grid-cols-1 -mx-2 gap-3 sm:mt-24 sm:grid-cols-2">
        {artifacts.map((artifact) => (
          <li key={artifact.slug}>
            <ArtifactTile artifact={artifact} />
          </li>
        ))}
      </ul>
    )
}
