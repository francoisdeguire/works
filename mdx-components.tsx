import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'
import Caption from '@/components/mdx/caption'
import Figure from '@/components/mdx/figure'
import Note from '@/components/mdx/note'
import Preview from '@/components/mdx/preview'
import Video from '@/components/mdx/video'
import { assetUrl, imagesHost, isAnimatedImage } from './lib/cdn'
import { cn } from './lib/cn'

const FALLBACK_IMG_WIDTH = 800
const FALLBACK_IMG_HEIGHT = 500

function resolveDimension(
  value: string | number | undefined,
  label: 'width' | 'height',
  fallback: number,
  src: string,
): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const parsed = Number(value)
  if (Number.isFinite(parsed) && parsed > 0) return parsed
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`MDX <img> missing ${label} (src: ${src}); using ${fallback}px fallback.`)
  }
  return fallback
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a: ({ href, children, className }: ComponentPropsWithoutRef<'a'>) => {
      const url = href ?? ''
      if (className?.includes('section-link')) {
        return (
          <a href={url} className={cn('section-link', className)}>
            {children}
          </a>
        )
      }
      if (url.startsWith('http')) {
        return (
          <a href={url} target="_blank" rel="noreferrer noopener" className={cn('link', className)}>
            {children}
          </a>
        )
      }
      if (url.startsWith('#')) {
        return (
          <a href={url} className={cn('link', className)}>
            {children}
          </a>
        )
      }
      return (
        <Link href={url} className={cn('link', className)}>
          {children}
        </Link>
      )
    },
    img: ({ src, alt, width, height, ...rest }: ComponentPropsWithoutRef<'img'>) => {
      const srcString = typeof src === 'string' ? src : ''
      const animated = isAnimatedImage(srcString)
      return (
        <Image
          src={animated ? assetUrl(srcString, imagesHost()) : srcString}
          alt={alt ?? ''}
          width={resolveDimension(width, 'width', FALLBACK_IMG_WIDTH, srcString)}
          height={resolveDimension(height, 'height', FALLBACK_IMG_HEIGHT, srcString)}
          unoptimized={animated}
          {...rest}
        />
      )
    },
    Figure,
    Note,
    Preview,
    Caption,
    Video,
  }
}
