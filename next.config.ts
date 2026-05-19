import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,

  experimental: {
    viewTransition: true,
  },

  pageExtensions: ['ts', 'tsx', 'mdx'],

  images: {
    loader: 'custom',
    loaderFile: './lib/cdn-image-loader.ts',
    remotePatterns: [
      { protocol: 'https', hostname: 'images.francois.works' },
      { protocol: 'https', hostname: 'videos.francois.works' },
    ],
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      ['remark-frontmatter', ['yaml']],
      ['remark-gfm', {}],
    ],
    rehypePlugins: [
      ['rehype-slug', {}],
      ['rehype-pretty-code', { theme: 'min-light', keepBackground: false }],
      [
        'rehype-autolink-headings',
        {
          behavior: 'append',
          content: { type: 'text', value: '#' },
          properties: { className: ['section-link'], ariaLabel: 'Link to section' },
        },
      ],
    ],
  },
})

export default withMDX(nextConfig)
