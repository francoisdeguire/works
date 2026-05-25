import type { Metadata } from 'next'
import { PhotographyCanvas } from '@/components/photography/canvas'
import { getAllPhotos } from '@/lib/photography'

export const metadata: Metadata = {
  title: 'Photography',
  description: 'An infinite canvas of personal photographs.',
  openGraph: {
    title: 'Photography — François Deguire',
    description: 'An infinite canvas of personal photographs.',
    url: '/photography',
  },
}

export default async function PhotographyPage() {
  const photos = await getAllPhotos()
  return <PhotographyCanvas photos={photos} />
}
