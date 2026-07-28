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
      className="relative rounded-lg bg-surface-2"
      style={{
        aspectRatio: artifact.width / artifact.height,
        viewTransitionName: artifact.kind === 'demo' ? `artifact-${artifact.slug}` : undefined,
      }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <ArtifactMedia video={artifact.video} poster={artifact.poster} alt={artifact.title} />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10"
      />
      <h3
        className={cn(
          'pointer-events-none leading-none absolute bottom-3 left-3 text-sm font-[475] ml-0.75 mb-0.5',
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
  if (artifact.kind === 'showcase') return null

  const className =
    'absolute inset-0 flex items-end justify-end p-2.5 rounded-lg transition-opacity hover:opacity-90'

  const pill = (label: string) => (
    <span
      className={cn(
        'inline-flex leading-none items-center rounded-full px-2.5 py-1.5 text-xs font-semibold',
        artifact.mode === 'light'
          ? 'bg-background text-foreground'
          : 'bg-foreground text-background',
      )}
    >
      {label}
    </span>
  )

  if (artifact.kind === 'demo') {
    return (
      <Link
        href={`/artifacts/${artifact.slug}` as Route}
        aria-label={`Open demo: ${artifact.title}`}
        className={className}
      >
        {pill(artifact.cta ?? 'Try ↗')}
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
        {pill(artifact.cta ?? 'Visit ↗')}
      </a>
    )
  }

  return (
    <Link
      href={artifact.href as Route}
      aria-label={`Visit: ${artifact.title}`}
      className={className}
    >
      {pill(artifact.cta ?? 'Read ↗')}
    </Link>
  )
}
