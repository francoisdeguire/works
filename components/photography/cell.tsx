'use client'

import { useState } from 'react'
import { type Photo, photoSrcset, photoUrl } from '@/lib/photography'

// Photo's long edge as a fraction of the cell. Constraint with
// JITTER_RATIO in lib/photography-math.ts: PHOTO_RATIO + 2 * JITTER_RATIO <= 1
// so adjacent cells never overlap at worst-case jitter. Lower values make
// photos smaller relative to the cell, which surfaces as more breathing
// room between adjacent photos.
const PHOTO_RATIO = 0.72

type CellProps = {
  photo: Photo
  x: number
  y: number
  cellSize: number
  loading?: 'lazy' | 'eager'
}

export function Cell({ photo, x, y, cellSize, loading = 'lazy' }: CellProps) {
  const [errored, setErrored] = useState(false)
  const longEdge = cellSize * PHOTO_RATIO
  const aspect = photo.width / photo.height
  const displayWidth = aspect >= 1 ? longEdge : longEdge * aspect
  const displayHeight = aspect >= 1 ? longEdge / aspect : longEdge
  const srcset = photoSrcset(photo.src)
  const eager = loading === 'eager'

  return (
    <figure
      className="absolute flex items-center justify-center"
      style={{
        left: x,
        top: y,
        width: cellSize,
        height: cellSize,
      }}
    >
      <div className="flex flex-col items-start" style={{ width: displayWidth }}>
        {errored ? (
          <div className="bg-gray-900" style={{ width: displayWidth, height: displayHeight }} />
        ) : (
          // Blur-up: the tiny base64 placeholder paints instantly behind the
          // image (no layout shift, dims are known) and the decoded WebP, being
          // opaque and exactly cell-sized, covers it once it lands. WebP has no
          // progressive decode, so this is the equivalent low-to-sharp reveal.
          <div
            className="bg-cover bg-center"
            style={{
              width: displayWidth,
              height: displayHeight,
              backgroundImage: photo.blur ? `url("${photo.blur}")` : undefined,
            }}
          >
            {/* biome-ignore lint/performance/noImgElement: virtualized canvas requires plain <img>; next/image's <picture> markup + priority heuristics fight remount-based cache reuse (R8/R10) */}
            <img
              src={photoUrl(photo.src)}
              srcSet={srcset}
              sizes={`${Math.round(displayWidth)}px`}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading={eager ? 'eager' : 'lazy'}
              fetchPriority={eager ? 'high' : 'auto'}
              decoding="async"
              draggable={false}
              onError={() => setErrored(true)}
              className="block h-full w-full object-cover select-none hover:after:content-[''] hover:after:absolute hover:after:-inset-2 hover:after:bg-white"
              style={{ width: displayWidth, height: displayHeight }}
            />
          </div>
        )}
        <figcaption className="mt-4 font-display text-xs lg:text-sm text-foreground/70 select-none">
          {photo.location}
        </figcaption>
      </div>
    </figure>
  )
}
