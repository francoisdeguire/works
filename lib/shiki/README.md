# Shiki setup for prose code blocks

`rehype-code.mjs` configures `rehype-pretty-code` with a custom Shiki highlighter so CSS
code blocks render with full Tailwind v4 awareness (`@utility`, `@theme`, `@variant`,
`@custom-variant`, …) instead of the standard CSS grammar's generic at-rule fallback.

## Vendored grammars

Shiki's bundled `css` grammar and the Tailwind directives are different upstream artifacts,
so both are vendored verbatim and combined by a small wrapper grammar in `rehype-code.mjs`:

- `css.tmLanguage.json` — VS Code's built-in `source.css` grammar (MIT, microsoft/vscode).
  Replaces Shiki's `css`; the Tailwind injection's `source.css#…` includes are authored
  against this grammar's repository keys (`rule-list-innards`, `selector-innards`, …).
- `tailwind-at-rules.tmLanguage.json` — the at-rule injection from Tailwind CSS IntelliSense
  (MIT, tailwindlabs/tailwindcss-intellisense, `syntaxes/at-rules.tmLanguage.json`). This is
  the exact grammar the editor uses, so the directives it highlights are recognized here too.

To refresh, recopy from the upstream sources. The wrapper grammar (`source.css.tailwind`)
exists because Shiki has no injection support: it `include`s the directives ahead of
`source.css` and claims the `css` name that ```css fences resolve to.

The theme is Shiki's bundled `catppuccin-latte`, set via the `theme` option in
`next.config.ts` — swap that string to change it.
