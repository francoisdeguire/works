import { RiArrowRightUpLine } from '@remixicon/react'
import type { Route } from 'next'
import Link from 'next/link'
import ArtifactMedia from '@/components/artifacts/artifact-media'
import type { Artifact } from '@/lib/artifacts'
import { cn } from '@/lib/cn'

type ArtifactTileProps = {
  artifact: Artifact
}

export default function ArtifactTile({ artifact }: ArtifactTileProps) {
  const textColor = artifact.mode === 'light' ? 'text-background/80' : 'text-foreground/70'

  return (
    <article
      className="group relative"
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
        className="pointer-events-none absolute inset-0 rounded-lg outline outline-black/10 -outline-offset-1"
      />
      <h3
        className={cn(
          'pointer-events-none leading-none absolute bottom-3.5 left-4 text-xs font-medium',
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

  const className = 'absolute inset-0 flex items-end justify-end p-2.5 rounded-lg'

  const badge = (
    <span
      className={cn(
        'bevel inline-flex size-7 items-center justify-center rounded-full backdrop-blur-[1px] backdrop-saturate-150 transition-[color,background-color,translate] duration-200 group-hover:-translate-y-0.5',
        artifact.mode === 'light'
          ? 'bg-background/50 text-foreground/80 group-hover:bg-background group-hover:text-foreground'
          : 'bg-foreground/50 text-background/80 group-hover:bg-foreground group-hover:text-background',
      )}
    >
      <RiArrowRightUpLine aria-hidden className="size-4" />
    </span>
  )

  if (artifact.kind === 'demo') {
    return (
      <Link
        href={`/artifacts/${artifact.slug}` as Route}
        aria-label={`Open demo: ${artifact.title}`}
        className={className}
      >
        {badge}
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
        {badge}
      </a>
    )
  }

  return (
    <Link
      href={artifact.href as Route}
      aria-label={`Visit: ${artifact.title}`}
      className={className}
    >
      {badge}
    </Link>
  )
}
