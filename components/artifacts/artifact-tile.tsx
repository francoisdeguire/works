import type { Route } from 'next'
import Link from 'next/link'
import ArtifactMedia from '@/components/artifacts/artifact-media'
import type { Artifact } from '@/lib/artifacts'
import { cn } from '@/lib/cn'

type ArtifactTileProps = {
  artifact: Artifact
}

export default function ArtifactTile({ artifact }: ArtifactTileProps) {
  const textColor = artifact.mode === 'light' ? 'text-background' : 'text-foreground'

  return (
    <article
      className="relative overflow-hidden rounded-lg bg-surface-2"
      style={{
        aspectRatio: 1,
        viewTransitionName: artifact.kind === 'demo' ? `artifact-${artifact.slug}` : undefined,
      }}
    >
      <ArtifactMedia video={artifact.video} poster={artifact.poster} alt={artifact.title} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-black/30"
      />
      <h3
        className={cn(
          'pointer-events-none leading-none absolute bottom-3 left-3 font-display text-sm uppercase',
          textColor,
        )}
      >
        {artifact.title}
      </h3>
      <TileAction artifact={artifact} />
    </article>
  )
}

function TileAction({ artifact }: { artifact: Artifact }) {
  const className = cn(
    'absolute right-2.5 bottom-2.5 inline-flex leading-none items-center rounded-full px-2.5 py-1.5 font-display text-xs uppercase transition-opacity hover:opacity-90',
    artifact.mode === 'light' ? 'bg-background text-foreground' : 'bg-foreground text-background',
  )

  if (artifact.kind === 'demo') {
    return (
      <Link
        href={`/artifacts/${artifact.slug}` as Route}
        aria-label={`Open demo: ${artifact.title}`}
        className={className}
      >
        Test
      </Link>
    )
  }

  const isExternal = /^https?:\/\//.test(artifact.href)
  if (isExternal) {
    return (
      <a
        href={artifact.href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Visit external project: ${artifact.title}`}
        className={className}
      >
        Visit
      </a>
    )
  }

  return (
    <Link
      href={artifact.href as Route}
      aria-label={`Visit: ${artifact.title}`}
      className={className}
    >
      Visit
    </Link>
  )
}
