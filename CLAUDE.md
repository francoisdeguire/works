# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `pnpm dev` (Next.js on localhost:3000)
- **Build:** `pnpm build`
- **Lint:** `pnpm lint` (runs `biome check`)
- **Format:** `pnpm format` (runs `biome format --write`)

## Stack

- **Next.js 16** with App Router and React Compiler enabled (`reactCompiler: true` in next.config.ts)
- **React 19** with Server Components by default
- **Tailwind CSS v4** via PostCSS (using `@import "tailwindcss"` — no tailwind.config file)
- **tw-animate-css** for animation utilities
- **Biome 2** for linting and formatting (not ESLint/Prettier) — 2-space indent, auto-organized imports
- **TypeScript** with strict mode, path alias `@/*` mapping to `./src/*`
- **pnpm** as package manager (with workspace config)

## Architecture

- `src/app/` — Next.js App Router pages and layouts
- `src/lib/utils.ts` — `cn()` helper combining `clsx` + `tailwind-merge` for conditional class merging
- `docs/plans/` — planning docs (gitignored, not part of the app)

## Conventions

- Use `tailwind-variants` for component variant patterns instead of manual conditional classes
- Use `cn()` from `@/lib/utils` when merging Tailwind classes conditionally
- Dark mode uses class strategy: `&:is(.dark *)` custom variant
- Fonts: Geist Sans (`--font-geist-sans`) and Geist Mono (`--font-geist-mono`) loaded via `next/font/google`
- Biome handles import organization automatically — do not manually sort imports
