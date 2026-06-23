import { readFileSync } from 'node:fs'
import rehypePrettyCode from 'rehype-pretty-code'
import { createHighlighter } from 'shiki'

// A custom Shiki highlighter can't live in next.config: Turbopack serializes the MDX
// loader options across a worker boundary, so a `getHighlighter` function there is dropped.
// Referencing this module by path keeps the function on the Node side of that boundary.

const load = (file) => JSON.parse(readFileSync(new URL(file, import.meta.url), 'utf8'))

// VS Code's own `source.css` grammar plus the Tailwind CSS IntelliSense at-rule injection,
// vendored verbatim (see ./README.md). Pairing the two is what makes `@utility`, `@theme`,
// `@variant`, `@custom-variant`, etc. and the rule bodies tokenize exactly like the editor.
const cssGrammar = load('./css.tmLanguage.json')
const tailwindAtRules = load('./tailwind-at-rules.tmLanguage.json')

// Shiki has no injection support, so a wrapper grammar pulls the directives in ahead of
// `source.css` and claims the `css` name that ```css fences resolve to.
const cssWithTailwind = {
  name: 'css',
  scopeName: 'source.css.tailwind',
  patterns: [{ include: 'tailwindcss.at-rules.injection' }, { include: 'source.css' }],
}

function getHighlighter(options) {
  return createHighlighter({
    ...options,
    langs: [...(options.langs ?? []), cssGrammar, tailwindAtRules, cssWithTailwind],
  })
}

export default function rehypeCode(options = {}) {
  return rehypePrettyCode({ ...options, getHighlighter })
}
