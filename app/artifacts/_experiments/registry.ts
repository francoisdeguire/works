import type { ComponentType } from 'react'

// Explicit lazy map of artifact demos. Static import specifiers (not a
// template-literal `import(`…/${slug}`)` context) so Turbopack chunks each
// experiment as a normal dynamic import. A recursive context over this
// directory breaks resolution once an experiment ships more than a lone
// index file (colocated CSS or subcomponents poison the generated context).
export const artifactDemos: Record<string, () => Promise<{ default: ComponentType }>> = {
  player: () => import('./player'),
  'scribble-strikethrough': () => import('./scribble-strikethrough'),
}
