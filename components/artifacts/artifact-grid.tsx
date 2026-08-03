import ArtifactTile from '@/components/artifacts/artifact-tile'
import type { Artifact } from '@/lib/artifacts'

type ArtifactGridProps = {
  artifacts: Artifact[]
}

export default function ArtifactGrid({ artifacts }: ArtifactGridProps) {
  const columns: Artifact['column'][] = [1, 2]

  return (
    <>
      <div className="mt-16 -mx-2 grid gap-3 sm:mt-32 sm:grid-cols-2 lg:-mx-16 xl:-mx-32">
        {columns.map((column) => (
          <ul key={column} className="flex flex-col gap-3">
            {artifacts
              .filter((artifact) => artifact.column === column)
              .map((artifact) => (
                <li key={artifact.slug}>
                  <ArtifactTile artifact={artifact} />
                </li>
              ))}
          </ul>
        ))}
      </div>
      <p className="mt-16 text-center font-display text-sm uppercase text-foreground-muted">
        More coming soon
      </p>
    </>
  )
}
