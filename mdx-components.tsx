import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import Caption from '@/components/mdx/caption'
import Figure from '@/components/mdx/figure'
import Note from '@/components/mdx/note'
import Preview from '@/components/mdx/preview'
import Video from '@/components/mdx/video'
import { assetUrl, imagesHost } from './lib/cdn'
import { cn } from './lib/cn'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a: ({ href, children, className, ...rest }: ComponentPropsWithoutRef<'a'>) => {
      const url = href ?? ''
      if (className?.includes('section-link')) {
        return (
          <a href={url} className={cn('section-link', className)} {...rest}>
            {children as ReactNode}
          </a>
        )
      }
      if (url.startsWith('http')) {
        return (
          <a
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            className={cn('link', className)}
            {...rest}
          >
            {children as ReactNode}
          </a>
        )
      }
      if (url.startsWith('#')) {
        return (
          <a href={url} className={cn('link', className)} {...rest}>
            {children as ReactNode}
          </a>
        )
      }
      return (
        <Link href={url} className={cn('link', className)} {...rest}>
          {children as ReactNode}
        </Link>
      )
    },
    img: ({ src, alt, width, height, ...rest }: ComponentPropsWithoutRef<'img'>) => {
      const srcString = typeof src === 'string' ? src : ''
      // GIFs must bypass the loader; optimization params strip animation frames
      const isAnimated = /\.gif(\?|$)/i.test(srcString)
      return (
        <Image
          src={isAnimated ? assetUrl(srcString, imagesHost()) : srcString}
          alt={alt ?? ''}
          width={typeof width === 'number' ? width : Number(width) || 800}
          height={typeof height === 'number' ? height : Number(height) || 500}
          unoptimized={isAnimated}
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
