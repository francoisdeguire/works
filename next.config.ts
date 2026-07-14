import { fileURLToPath } from 'node:url'
import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

// Absolute path so @next/mdx's string-plugin resolver imports it on the Node side of the
// Turbopack boundary; the custom Shiki highlighter (a function) can't be serialized inline.
const rehypeCode = fileURLToPath(new URL('./lib/shiki/rehype-code.mjs', import.meta.url))

const nextConfig: NextConfig = {
  reactCompiler: true,

  allowedDevOrigins: ['192.168.2.14'],

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
      [rehypeCode, { theme: 'catppuccin-latte', keepBackground: false }],
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
