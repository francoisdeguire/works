import type { Metadata } from 'next'
import DefaultResume from '@/lib/resume/default'

export const metadata: Metadata = {
  title: 'Resume',
  robots: { index: false, follow: false },
}

export default function ResumePage() {
  return <DefaultResume />
}
