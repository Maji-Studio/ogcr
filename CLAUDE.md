# CLAUDE.md

Guidance for Claude Code when working in this repository. This is the **single, monorepo-wide**
context file: it covers the root workspace, the `packages/design-system` library, and the
`apps/farmer-prototype` app. (Non-Claude agents: see the mirrored [`AGENTS.md`](./AGENTS.md).)

## Repository layout

```
ogcr/                      pnpm workspace (turbo)
  packages/
    design-system/         @majistudio/ogcr-design-system — React 19 + Tailwind v4 component library
  apps/
    farmer-prototype/      Next.js 16 app (consumes the design system via workspace:*)
  .agents/skills/          reusable dev-workflow skills (caveman, diagnose, tdd, teach, prototype, …)
  .claude/skills/          symlinks → ../.agents/skills/* so Claude Code discovers them repo-wide
```

The design system is developed in a **standalone upstream repo** and pulled in here
(history-preserving). `pnpm ds:sync` merges upstream changes; the standalone repo keeps publishing to
npm via its own Changesets flow. See [`PLAN.md`](./PLAN.md) for the migration plan and status.

## Root commands

| Command | What it does |
| --- | --- |
| `pnpm install` | Install + link the workspace |
| `pnpm dev` | DS library-watch + farmer dev together ([`scripts/dev.sh`](./scripts/dev.sh)); farmer serves on http://localhost:3200 |
| `pnpm build` | `turbo run build --filter=./apps/*` — builds each app; the DS library (`build:lib`) runs first as a dependency |
| `pnpm ds:build` | Build the DS's publishable `dist/` (`build:lib`, **not** the demo `build`) |
| `pnpm ds:watch` | `turbo watch build:lib` — rebuild the DS `dist/` on every DS source change |
| `pnpm ds:storybook` | Run the design system's Storybook |
| `pnpm ds:sync` | Pull design-system updates from the standalone upstream repo |
| `pnpm lint` / `pnpm test` | Lint / test across the workspace |

`apps/farmer-prototype` needs an `.env.local` to boot (env is validated at import). Copy
`apps/farmer-prototype/.env.example` → `.env.local`; placeholder values are enough to run the UI. A
real Postgres (`pnpm --filter farmer-prototype dev:docker`) is only needed for DB-backed routes —
without it, auth-gated pages redirect to `/login`, which is expected.

### Build orchestration (the `build:lib` vs `build` gotcha)

The design system ships **two** Vite builds that share `dist/` and clobber each other: `build` (the
Storybook/demo app) and `build:lib` (the publishable library — `index.js`, `index.d.ts`,
`styles.css`). Apps consume `build:lib`, so turbo depends on **`build:lib`**, never the demo `build`:
`turbo.json`'s app `build` task `dependsOn: ["^build:lib"]`, and `pnpm build` filters to `./apps/*`
so the DS demo `build` is never invoked in the monorepo. Only `build:lib` produces the `dist/` apps import.

## Agent skills

Reusable dev-workflow skills live at the **repo root** (`.agents/skills/`, surfaced to Claude Code
via `.claude/skills/` symlinks) so they apply across the whole monorepo, not just one package. They
are the [mattpocock/skills](https://github.com/mattpocock/skills) set, version-pinned in
[`skills-lock.json`](./skills-lock.json) and managed by the `setup-matt-pocock-skills` skill: caveman,
diagnose, grill-me, grill-with-docs, handoff, improve-codebase-architecture, prototype, tdd, teach,
to-issues, to-prd, triage, zoom-out. None of them are design-system-specific.

## How apps reuse the design system

Apps depend on `@majistudio/ogcr-design-system` with `"workspace:*"`. The split is **CSS once,
components per-import**:

```css
/* app globals.css — the DS stylesheet IS the brand: tokens + reset + utilities */
@import "tailwindcss";                                /* the app's own utility generation */
@import "@majistudio/ogcr-design-system/styles.css";  /* loaded last so the DS layer wins */
```

```tsx
import { Button } from "@majistudio/ogcr-design-system";        // barrel
import { Table } from "@majistudio/ogcr-design-system/Table";   // Table is deep-import only
```

`'use client'` is baked into every DS component entry, so they import cleanly from Server Components.
The DS expects **Inter** (`--font-standard`); farmer loads it via `next/font` and maps the token in
`globals.css`. **Don't re-declare design tokens in an app — extend the design system.** Components are
consumed **prebuilt** (`dist/`), so a DS source edit reaches an app only after `dist/` rebuilds;
`pnpm dev` runs `ds:watch` to rebuild on change (refresh the app afterward). True TSX HMR
(`transpilePackages`) is intentionally deferred — see [`PLAN.md`](./PLAN.md).

---

# Package: `packages/design-system` (`@majistudio/ogcr-design-system`)

The OGCR design system: 42 component modules on **Vite + React 19 + TypeScript**, **Base UI**
(`@base-ui/react`) primitives (plus **react-day-picker** v9 for `Calendar`/`DatePicker`), **Tailwind
v4** design tokens, and **CVA + `cn()`** for variants. `src/index.ts` is the public barrel.
`docs/design-system.md` is the authoritative written spec — when spec and code disagree, the spec wins.

### Commands (run with `pnpm --filter @majistudio/ogcr-design-system <script>`)

- `dev` — Vite dev server with HMR (the demo app in `src/App.tsx`)
- `build` — `tsc -b` then a Vite build; fails on TS errors. **This is the demo, not the artifact.**
- `build:lib` — build the publishable library to `dist/` via `vite.lib.config.ts` (ESM `index.js`,
  bundled `index.d.ts`, `styles.css`, `manifest.json`, `llms.txt`); runs the `check:tokens` +
  `check:dist` contract gates. This is what consumers get. `build` and `build:lib` share `dist/` and
  clobber each other.
- `lint` — ESLint over the repo
- `test` / `test:watch` — the **jsdom** unit suite (`vitest run`, config `vitest.config.ts`, `*.test.tsx`)
- `test:a11y` — axe over every story in the **Playwright chromium** storybook project
  (`vitest run --config vite.config.ts`; needs `npx playwright install chromium-headless-shell`)
- `storybook` / `build-storybook` — Storybook 10 (sidebar order `Overview → Foundations → Components → Modules`)
- `changeset` / `version` / `release` — Changesets flow; publishes to npm as
  `@majistudio/ogcr-design-system` (public, scoped; currently `1.0.0`). `prepublishOnly` runs `build:lib`.

### Non-obvious facts that span multiple files

- **Two separate test setups.** `vitest.config.ts` is the **jsdom** unit runner `pnpm test` resolves
  (it takes precedence over `vite.config.ts`); it runs `*.test.tsx`. `vite.config.ts` *also* defines a
  `storybook` vitest project that runs every `*.stories.tsx` in a **Playwright chromium** browser with
  the a11y addon — **not** run by `pnpm test`; invoke it via `test:a11y`.
- **Tailwind v4 `@theme inline` over a runtime `--ds-*` seam (load-bearing for theming).** Tokens live
  in `src/styles/theme.css` inside an `@theme inline` block (entry `src/styles/global.css` `@import`s
  `palette.css` → `tailwindcss` → `reset.css` → `theme.css`; consumers import
  `@majistudio/ogcr-design-system/styles.css`). With `inline`, a token whose value is a **literal**
  (`--radius-12: 12px`) is **baked into every utility** and is **not** runtime-themeable; a token whose
  value is a **`var()` reference** keeps the reference (themeable). All 49 color tokens are
  `var(--ds-*)` references into `src/styles/palette.css` (the only place a brand hex appears), so every
  color utility and focus shadow is runtime-themeable — override a `--ds-*` on any scoping element and
  everything derived from it retints with no rebuild. `npm run check:tokens` (chained into `build:lib`)
  fails the build if any color utility re-bakes a literal. Radius/spacing/font/elevation tokens stay
  literal by design. No dark mode is shipped yet, but the color layer is on the seam, so adding one is
  a `.dark { --ds-…: … }` palette override. Utility names drop the `--color-` namespace:
  `bg-surface-page`, not `bg-color-surface-page`. Extend the token approach; don't introduce a styling
  framework without discussion.
- **Shared internal modules under `src/lib/` (not exported).** `cn.ts` is the class-merge helper (also
  shipped as the dependency-free `/cn` deep import). `overlay/` centralizes overlay chrome (card
  surface, popup motion, backdrop, single `OverlayArrowSvg`) consumed by every overlay; there is
  deliberately **no** generic `Overlay` wrapper (see `docs/adr/0001-no-generic-overlay-module.md`).
  `field/` is the `useField` hook (id generation, `aria-describedby` merging, error/helper precedence).
  `strings.ts` is the default user-facing copy table — every default string is an overridable prop.
- **Icons are Phosphor.** `src/components/icons/index.tsx` re-exports `@phosphor-icons/react` glyphs
  under stable `*Icon` names (`SearchIcon → MagnifyingGlass`, etc.), each `aria-hidden` by default.
- **React Compiler is enabled.** `vite.config.ts` / `vite.lib.config.ts` wire `@rolldown/plugin-babel`
  with `reactCompilerPreset()`. Avoid hand-written `useMemo` / `useCallback` / `React.memo` unless the
  compiler can't (e.g. `Table` skips it — TanStack Table returns unmemoizable functions).
- **TypeScript project references.** `tsconfig.json` delegates to `tsconfig.app.json` (`src/`) and
  `tsconfig.node.json` (Vite configs). `tsc -b` must pass for both.
- **Library build externalizes everything.** `vite.lib.config.ts` marks react/react-dom,
  `@base-ui/react`, `@tanstack/react-table`, `@phosphor-icons/react`, `react-day-picker`, and
  cva/clsx/tailwind-merge as `external`. **TanStack Table** powers `Table` and is **deep-import only**
  (`/Table`) — intentionally not on the barrel, so consumers who never render a table don't pull the peer.

### Conventions when adding or changing components

- Each component is a directory under `src/components/<Name>/` with `index.tsx` + `<Name>.stories.tsx`
  + `<Name>.test.tsx`, re-exported (alphabetically) from `src/index.ts` (every folder **except
  `Table`**). Each has a `./<Name>` subpath export and a `'use client'` directive. Good references:
  `Popover`, `Input`, `Dialog`/`NumberField`.
- Before wrapping a Base UI primitive, confirm exact part/prop names from
  `node_modules/@base-ui/react/<part>/*.d.ts` — the API is precise (`Accordion`/`Toggle` use
  `multiple`; `Dialog.Root` has no `dismissible`; Base UI callbacks fire `(value, eventDetails)`).
- Style only via tokens/utilities (`bg-surface-*`, `text-text-*`, `rounded-12`, `shadow-focus-*`,
  `--motion-*`) — never hardcoded hex/px. Brand colors ride the `--ds-*` seam in `palette.css`.
- Every component takes a `className` merged with `cn()`; most wrappers extend
  `ComponentPropsWithoutRef<'tag'>` and spread `...rest` onto the root. Form controls generate ids via
  `useId()`. Custom `ariaLabel` camelCase props are forbidden — use native `aria-label` /
  `aria-labelledby`. Focus rings use `shadow-focus-primary|secondary|error`; don't inline
  `[box-shadow:...]`.
- Run the a11y gate with `test:a11y`. It's `test: 'todo'` in `.storybook/preview.tsx` — **structural**
  a11y is clean, but ~79 stories still fail `color-contrast` on Figma-sourced brand tokens, which
  needs a palette decision before flipping to `'error'`. Keep new work structurally clean (label
  icon-only controls; `role="combobox"`/`role="menu"` need a name from a label, not contents).

---

# App: `apps/farmer-prototype`

A **Next.js 16** app (App Router) built from `Maji-Studio/nextjs-template` — Better Auth, PostgreSQL +
Drizzle ORM, React Query + react-hook-form — with its original design layer **stripped** and the OGCR
design system wired in as the design layer (green brand, Inter via `next/font`).

> Template chrome that is *not yet ported* off the old design layer (sidebar/navigation, projects +
> dashboard pages, the remaining auth forms, `components/ui/*` + `components/forms/*`) renders with
> undefined tokens, not purple. Port those screens to DS components when they become real.

## DO NOT — critical rules

- ❌ **NEVER use npm or yarn** — always `pnpm`
- ❌ **NEVER skip auth guards** — check user permissions in the data-access layer
- ❌ **NEVER let a file exceed 1000 lines** — split into smaller modules
- ❌ **NEVER hard-code magic numbers** — use constants at top of file or in `@/config`
- ❌ **NEVER commit `.env` files, secrets, API keys, or credentials** — not even in docs or test files
- ❌ **NEVER log PII (emails, names)** — log `userId` instead
- ❌ **NEVER re-declare design tokens** — use the OGCR design system (see the consumption model above)

If a secret is accidentally committed: rotate it immediately, then scrub history with `git-filter-repo`.

## Commands (run with `pnpm --filter farmer-prototype <script>`)

- `dev` — Next dev server on port 3200 (`dev:docker` boots Postgres too; `dev:manual` also on 3200)
- `build` / `start` — production build / serve
- `lint` — ESLint
- `db:generate` — generate migrations from schema changes (SAFE)
- `db:push` — push schema directly (review first)
- `db:studio` — Drizzle Studio (SAFE)

## Architecture — layered

```
Component (UI) → hooks/ (React Query) → fn/ (server actions: validate + orchestrate)
  → data-access/ (DB queries + auth guards) → db/ (connection & schema)
```

1. Each layer only imports from the layer below it.
2. Server functions (`fn/`) ALWAYS use the `"use server"` directive and validate input with Zod.
3. All data-access functions check authentication (`requireAuth()` / `requireProjectMember()`).
4. Never skip layers.

Project structure: `src/app/` (App Router — `(auth)/`, `(app)/[projectId]/`, `admin/`, `api/`),
`components/`, `config/`, `data-access/`, `db/`, `fn/`, `hooks/`, `lib/`, `schemas/`, `types/`.

## Code quality & React patterns

- **File naming:** kebab-case files (`item-form.tsx`, `use-items.ts`); PascalCase component exports;
  camelCase hook/function exports. See `docs/organization.md`.
- **File size:** never exceed 1000 lines. Simple features (< 500 lines, < 3 components) use a flat
  folder; complex features use `components/` / `dialogs/` / `hooks/` subfolders.
- **TypeScript strict mode** — avoid `any`. Magic numbers → constants. Use DS tokens, never hardcoded values.
- **React Compiler is on** — don't add manual `useMemo`/`useCallback`/`React.memo` unless profiling
  demands it. **Avoid `useEffect`** for data fetching (use React Query) or derived state (compute
  directly); reserve it for syncing with external systems, subscriptions, or imperative DOM.
- **Forms** use React Hook Form + Zod (`zodResolver`). Schemas live in `src/schemas/`. Use DS `Input`
  / `Textarea` / `Button` and the project's `FormField` / `ServerError`. Server-error pattern:
  `setError('root.serverError', {...})`.

## Key patterns

- **ActionResult:** server functions return
  `{ success: true; data: T } | { success: false; error: string }`.
- **Auth guards:** every data-access fn calls `requireAuth()` (or `requireProjectMember()`) first.
- **React Query:** query keys `["resource", projectId, ...specifics]`; mutations invalidate related
  queries; stale time 30s current / 5m historical.

**Reference feature (Items CRUD)** — a full vertical slice ported to DS components:
`src/db/schema/items.ts`, `src/data-access/items.ts`, `src/fn/items.ts`, `src/hooks/use-items.ts`,
`src/components/items/`, `src/app/(app)/[projectId]/items/page.tsx`. Items list uses the DS `Table`
(deep import); create/edit via DS `Dialog`; archive via DS `AlertDialog` (`tone="danger"`); errors via
DS `Message`. Use it as the template when adding features.

## Adding a feature — checklist

1. **Zod schemas** (`src/schemas/`) — form + server-action schemas; export inferred types.
2. **DB schema** (`src/db/schema/`) — Drizzle table + types; add to `schema/index.ts`; `pnpm db:generate`.
3. **Data access** (`src/data-access/`) — CRUD with auth guards (always).
4. **Server actions** (`src/fn/`) — `"use server"`, Zod-validate, return `ActionResult<T>`.
5. **React Query hooks** (`src/hooks/`) — queries + mutations with invalidation.
6. **Components** (`src/components/<feature>/`) — use DS components + RHF; barrel export.
7. **Routes** (`src/app/(app)/.../page.tsx`) — async params for Next.js 16.

## Authentication & environment

- **Admin-invite only** by default (`ALLOW_SELF_SIGNUP=false`); admin via `ADMIN_EMAIL`. Email invites
  + password resets via Resend. Session cookies via Better Auth (`nextCookies` plugin). Route
  protection runs through `src/proxy.ts` (Next.js 16 proxy) → `updateSession()` →
  `auth.api.getSession()`.
- Env vars validated via Zod in `src/config/env.ts`. **Required:** `DATABASE_URL`,
  `NEXT_PUBLIC_APP_URL`, `BETTER_AUTH_SECRET` (32+ chars), `RESEND_API_KEY`, `RESEND_FROM_EMAIL`,
  `ADMIN_EMAIL`, `ALLOW_SELF_SIGNUP`. **Document only variable NAMES, never values.**

See `apps/farmer-prototype/docs/` for the app's deeper guides (architecture, organization, database,
auth, forms, modern-patterns, troubleshooting) and `TEMPLATE_USAGE.md`.
