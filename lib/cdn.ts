const DEFAULT_IMAGES_HOST = 'https://images.francois.works'
const DEFAULT_VIDEOS_HOST = 'https://videos.francois.works'

export function imagesHost(): string {
  return process.env.NEXT_PUBLIC_CDN_IMAGES_HOST ?? DEFAULT_IMAGES_HOST
}

export function videosHost(): string {
  return process.env.NEXT_PUBLIC_CDN_VIDEOS_HOST ?? DEFAULT_VIDEOS_HOST
}

export function assetUrl(src: string, host: string): string {
  return new URL(src, host).toString()
}

export function videoUrl(src: string): string {
  return assetUrl(src, videosHost())
}
