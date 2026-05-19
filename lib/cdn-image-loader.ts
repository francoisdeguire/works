'use client'

import { assetUrl, imagesHost } from './cdn'

type LoaderArgs = { src: string; width: number; quality?: number }

const PASSTHROUGH_EXTENSIONS = ['.gif', '.svg']

function extension(src: string): string {
  const path = src.split('?')[0] ?? ''
  const dot = path.lastIndexOf('.')
  return dot === -1 ? '' : path.slice(dot).toLowerCase()
}

export default function bunnyImageLoader({ src, width, quality }: LoaderArgs): string {
  const absolute = assetUrl(src, imagesHost())
  if (PASSTHROUGH_EXTENSIONS.includes(extension(src))) {
    return absolute
  }
  const url = new URL(absolute)
  url.searchParams.set('width', String(width))
  url.searchParams.set('format', 'webp')
  url.searchParams.set('quality', String(quality ?? 75))
  return url.toString()
}
