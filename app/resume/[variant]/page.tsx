import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ComponentType } from 'react'

export function generateStaticParams() {
  return []
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function ResumeVariantPage({ params }: PageProps<'/resume/[variant]'>) {
  if (process.env.NODE_ENV === 'production') notFound()

  const { variant } = await params

  let Variant: ComponentType
  try {
    Variant = (await import(`@/lib/resume/variants/${variant}`)).default
  } catch {
    notFound()
  }

  return <Variant />
}
