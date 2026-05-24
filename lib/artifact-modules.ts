import type { ComponentType } from 'react'

type DemoComponent = ComponentType<Record<string, never>>
type DemoModule = { default: DemoComponent }

export const artifactModules: Record<string, () => Promise<DemoModule>> = {
  // Turbopack requires literal import() calls — do not refactor to a glob.
  'cursor-trail': () => import('@/app/artifacts/_experiments/cursor-trail'),
}
