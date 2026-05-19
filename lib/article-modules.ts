import type { MDXProps } from 'mdx/types'
import type { ComponentType } from 'react'

type MDXModule = { default: ComponentType<MDXProps> }

// Static module map. Each entry is a literal `import(...)` call so Turbopack can
// statically analyze and pre-resolve every article at build time. Add one line per
// new article alongside the matching content/writing/<slug>.mdx file.
export const articleModules: Record<string, () => Promise<MDXModule>> = {
  'hello-typography': () => import('@/content/writing/hello-typography.mdx'),
}
