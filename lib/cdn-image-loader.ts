import { assetUrl, imagesHost } from './cdn'

type LoaderArgs = { src: string; width: number; quality?: number }

// Images are pre-encoded to their final width and format before upload (see
// scripts/optimize-photos.ts), so Bunny serves them as plain static files with
// no edge processing. The loader only resolves the CDN host; there is no
// on-the-fly variant to request, so width/quality are intentionally ignored.
export default function bunnyImageLoader({ src }: LoaderArgs): string {
  return assetUrl(src, imagesHost())
}
