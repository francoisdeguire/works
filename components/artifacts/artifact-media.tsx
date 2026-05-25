'use client'

import { useEffect, useRef } from 'react'
import { assetUrl, imagesHost, videoUrl } from '@/lib/cdn'

type ArtifactMediaProps = {
  video?: string
  poster: string
  alt: string
}

let sharedObserver: IntersectionObserver | null = null

function getObserver(): IntersectionObserver {
  if (sharedObserver) return sharedObserver
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement
        if (entry.isIntersecting) {
          void video.play().catch(() => {})
        } else {
          video.pause()
        }
      }
    },
    { rootMargin: '200px 0px', threshold: 0.25 },
  )
  return sharedObserver
}

const mediaClass = 'block size-[calc(100%+2px)] -m-px object-cover'

export default function ArtifactMedia({ video, poster, alt }: ArtifactMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = getObserver()
    observer.observe(el)
    return () => {
      observer.unobserve(el)
    }
  }, [])

  const posterUrl = assetUrl(poster, imagesHost())

  if (!video) {
    return <img src={posterUrl} alt={alt} loading="lazy" className={mediaClass} />
  }

  return (
    <video
      ref={videoRef}
      src={videoUrl(video)}
      poster={posterUrl}
      preload="none"
      muted
      loop
      playsInline
      className={mediaClass}
    />
  )
}
