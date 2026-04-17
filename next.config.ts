import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,

  experimental: {
    viewTransition: true,
  },

  pageExtensions: ['ts', 'tsx', 'mdx'],

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.francois.works' },
      { protocol: 'https', hostname: 'videos.francois.works' },
    ],
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
