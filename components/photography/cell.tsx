'use client'

import { useState } from 'react'
import { type Photo, photoSrcset, photoUrl } from '@/lib/photography'

// Photo's long edge as a fraction of the cell. Constraint with
// JITTER_RATIO in lib/photography-math.ts: PHOTO_RATIO + 2 * JITTER_RATIO <= 1
// so adjacent cells never overlap at worst-case jitter. Lower values make
// photos smaller relative to the cell, which surfaces as more breathing
// room between adjacent photos.
const PHOTO_RATIO = 0.6

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
          // biome-ignore lint/performance/noImgElement: virtualized canvas requires plain <img>; next/image's <picture> markup + priority heuristics fight remount-based cache reuse (R8/R10)
          <img
            src={photoUrl(photo.src, 720)}
            srcSet={srcset}
            sizes="(max-width: 40rem) 50vw, 24rem"
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={eager ? 'high' : 'auto'}
            decoding="async"
            draggable={false}
            onError={() => setErrored(true)}
            className="block h-full w-full object-cover select-none"
            style={{ width: displayWidth, height: displayHeight }}
          />
        )}
        <figcaption className="mt-2 font-display text-xs text-gray-400 select-none">
          {photo.location}
        </figcaption>
      </div>
    </figure>
  )
}
