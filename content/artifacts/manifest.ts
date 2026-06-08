import type { ArtifactInput } from '@/lib/artifacts'

export const artifactsManifest: ArtifactInput[] = [
  {
    slug: 'player',
    title: 'Interactive Tape Player',
    date: '2026-06-08',
    mode: 'dark',
    video: 'https://videos.francois.works/artifacts/tape-player/preview.mp4',
    poster: 'https://videos.francois.works/artifacts/tape-player/poster.jpg',
    width: 720,
    height: 720,
    kind: 'demo',
  },
  {
    slug: 'francois-works-source',
    title: 'This Site, Open Source',
    date: '2026-04-12',
    mode: 'dark',
    poster: 'https://picsum.photos/seed/works-source/1920/1080',
    width: 1920,
    height: 1080,
    kind: 'visit',
    href: 'https://github.com/francoisdeguire/works',
  },
  {
    slug: 'hello-typography-piece',
    title: 'Writing: Hello Typography',
    date: '2026-03-01',
    mode: 'light',
    video: 'https://www.w3schools.com/html/movie.mp4',
    poster: 'https://picsum.photos/seed/hello-typography/1280/720',
    width: 1280,
    height: 720,
    kind: 'visit',
    href: '/writing/hello-typography',
  },
]
