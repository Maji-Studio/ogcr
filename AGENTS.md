# AGENTS.md

Guidance for non-Claude coding agents (Codex, Cursor, others) in this repository. **The authoritative
context is [`CLAUDE.md`](./CLAUDE.md)** — read it for the full picture; this file carries the
load-bearing essentials so an agent that only ingests `AGENTS.md` still has what it needs.

## Repository layout

A pnpm + turbo monorepo:

```
packages/design-system/   @majistudio/ogcr-design-system — React 19 + Tailwind v4 component library
apps/farmer-prototype/     Next.js 16 app that consumes the design system via workspace:*
.agents/skills/            reusable dev-workflow skills, surfaced via .claude/skills/ symlinks
```

The design system is developed in a standalone upstream repo and pulled in here (history-preserving)
via `pnpm ds:sync`; it keeps publishing to npm via its own Changesets flow. See `PLAN.md`.

## Root commands

- `pnpm install` — install + link the workspace
- `pnpm dev` — DS library-watch + farmer dev (farmer on http://localhost:3200)
- `pnpm build` — `turbo run build --filter=./apps/*`; the DS library (`build:lib`) runs first
- `pnpm ds:build` / `pnpm ds:watch` / `pnpm ds:storybook` / `pnpm ds:sync`
- `pnpm lint` / `pnpm test`

**Build gotcha:** the design system has two Vite builds sharing `dist/` — `build` (demo) and
`build:lib` (the publishable library apps consume). Turbo depends on **`build:lib`**, never the demo
`build`. Only `build:lib` produces the `dist/` apps import.

## How apps reuse the design system

`@majistudio/ogcr-design-system` via `"workspace:*"`. **CSS once, components per-import:** import
`@majistudio/ogcr-design-system/styles.css` last in the app's `globals.css` (it *is* the brand —
tokens + reset + utilities); import components from the barrel, or deep-import (`/Table` is
deep-import only). `'use client'` is baked into every DS entry. The DS expects Inter
(`--font-standard`). **Do not re-declare design tokens in an app — extend the design system.**

## `packages/design-system` essentials

- **Vite + React 19 + TS**, **Base UI** primitives, **Tailwind v4** tokens, **CVA + `cn()`** variants.
  `src/index.ts` is the public barrel (every folder except `Table`). `docs/design-system.md` is the
  authoritative spec — when spec and code disagree, the spec wins.
- **React Compiler is on** — avoid hand-written `useMemo` / `useCallback` / `React.memo` (except where
  the compiler opts out, e.g. `Table`).
- **Tailwind v4 `@theme inline` over a runtime `--ds-*` seam.** All 49 color tokens reference
  `var(--ds-*)` in `src/styles/palette.css` (the only place a brand hex appears), so color utilities
  and focus shadows are runtime-themeable. `check:tokens` (in `build:lib`) fails the build if a color
  utility re-bakes a literal. No CSS-in-JS, no co-located component CSS.
- **Component layout:** `src/components/<Name>/` = `index.tsx` + `<Name>.stories.tsx` +
  (often) `<Name>.test.tsx`; shared internals under `src/lib/` (`cn`, `overlay/`, `field/`, `strings`)
  are not exported. **Two test setups:** `pnpm --filter @majistudio/ogcr-design-system test` is jsdom
  unit (`*.test.tsx`); `test:a11y` runs axe over stories in headless Chromium.
- **Conventions:** every component takes `className` merged via `cn()`; spread `...rest` onto the root;
  form controls use `useId()`; style only via tokens/utilities (`bg-surface-*`, `text-text-*`,
  `rounded-12`, `shadow-focus-*`) — never hardcoded hex/px; use native `aria-*`, never camelCase
  `ariaLabel` props.

## `apps/farmer-prototype` essentials

Next.js 16 (App Router) + Better Auth + Drizzle (Postgres) + React Query + react-hook-form, with the
OGCR design system as the design layer.

- **Always `pnpm`, never npm/yarn.** Never skip auth guards. Never exceed 1000 lines/file. Never
  hard-code magic numbers. Never commit `.env`/secrets. Never log PII (log `userId`).
- **Layered architecture:** Component → `hooks/` (React Query) → `fn/` (`"use server"`, Zod-validated)
  → `data-access/` (DB + auth guards) → `db/`. Each layer imports only from the one below.
- **Patterns:** server fns return `ActionResult<T>` (`{success,data} | {success:false,error}`); auth
  guards (`requireAuth()` / `requireProjectMember()`) run first in every data-access fn; React Query
  keys `["resource", projectId, ...]` with mutation invalidation. Forms = RHF + Zod (`zodResolver`),
  schemas in `src/schemas/`. Reference feature: Items CRUD (`src/.../items*`).
- **kebab-case files**, PascalCase component exports, camelCase function exports. React Compiler is on.
- Env validated in `src/config/env.ts` (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `RESEND_API_KEY`, …).
  Document variable NAMES only, never values.
