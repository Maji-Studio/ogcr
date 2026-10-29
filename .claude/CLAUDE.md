# CLAUDE.md — ogcr

Guidance for Claude Code in this **pnpm + turbo monorepo**. **These instructions OVERRIDE default
behavior — follow them exactly.** (Non-Claude agents get the same rules via the root `AGENTS.md`
pointer file.)

## DO NOT — Critical Rules

- ❌ **NEVER use npm or yarn** — always `pnpm`.
- ❌ **NEVER skip auth guards** — every `data-access/` function in the farmer app calls
  `requireAuth()` / `requireProjectMember()` first; permissions are checked in the data-access
  layer, not the UI.
- ❌ **NEVER let a file exceed 1000 lines** — split into modular files.
- ❌ **NEVER hard-code magic numbers** — constants at top of file or in `@/config`; style only via
  design-system tokens/utilities, never hardcoded hex/px.
- ❌ **NEVER re-declare design tokens in an app** — extend the design system instead (the `--ds-*`
  seam in `palette.css`); don't introduce a styling framework without discussion.
- ❌ **NEVER commit `.env` files, secrets, API keys, or credentials** — not even in docs or tests.
  If one slips in: rotate immediately, then scrub history with `git-filter-repo`.
- ❌ **NEVER log PII (emails, names)** — log `userId` instead.
- ❌ **NEVER run the DS demo `build` when you need the library** — `build` (Storybook/demo) and
  `build:lib` (publishable `dist/`) share `dist/` and clobber each other. Apps consume
  **`build:lib`** only; turbo depends on `build:lib`, and `pnpm build` filters to `./apps/*` so the
  demo build is never invoked in the monorepo.

## Project Overview

```
ogcr/                      pnpm workspace (turbo)
  packages/
    design-system/         @majistudio/ogcr-design-system — React 19 + Tailwind v4 component library
  apps/
    farmer-prototype/      Next.js 16 app (consumes the design system via workspace:*)
  .agents/skills/          reusable dev-workflow skills (surfaced via .claude/skills/ symlinks)
```

- **Design system** — 42 component modules on Vite + React 19 + TS, **Base UI** primitives (plus
  react-day-picker v9 for `Calendar`/`DatePicker`), Tailwind v4 tokens, CVA + `cn()`. This monorepo
  is its **sole source of truth**: it publishes to npm from here via Changesets (`.changeset/` at
  the workspace root; the former standalone repo is archived). Migration record: `PLAN.md`.
- **farmer-prototype** — Next.js 16 App Router app from `Maji-Studio/nextjs-template`: Better Auth,
  PostgreSQL + Drizzle, React Query + react-hook-form, with the OGCR design system as its design
  layer (green brand, Inter via `next/font`). It is self-contained by default: `MOCK_DATA=true`
  provides an in-process demo user, projects, and items with no `.env.local` or external services.
  Set `MOCK_DATA=false` and configure `.env.local` to opt into PostgreSQL + Better Auth; use
  `DISABLE_AUTH=true` only when intentionally bypassing sessions against that real database.
- Template chrome not yet ported off the old design layer (sidebar/nav, projects + dashboard pages,
  remaining auth forms, `components/ui/*` + `components/forms/*`) renders with undefined tokens —
  port those screens to DS components when they become real.

## Essential Commands

| Command | Purpose |
| --- | --- |
| `pnpm install` | Install + link the workspace |
| `pnpm dev` | DS library-watch + farmer dev together (`scripts/dev.sh`); farmer on http://localhost:3200 |
| `pnpm build` | `turbo run build --filter=./apps/*` — DS `build:lib` runs first as a dependency |
| `pnpm ds:build` | Build the DS's publishable `dist/` (`build:lib`, **not** the demo `build`) |
| `pnpm ds:watch` | Rebuild the DS `dist/` on every DS source change |
| `pnpm ds:storybook` | Design system Storybook |
| `pnpm lint` / `pnpm test` | Lint / test across the workspace |

Per-package scripts run with `pnpm --filter <pkg> <script>`:

- **farmer-prototype:** `dev` (port 3200; `dev:docker` boots Postgres), `build`/`start`, `lint`,
  `db:generate` (SAFE), `db:push` (review first), `db:studio` (SAFE).
- **@majistudio/ogcr-design-system:** `dev` (demo w/ HMR), `build:lib` (the artifact; runs
  `check:tokens` + `check:dist` gates), `lint`, `test` (jsdom unit suite), `test:a11y` (axe over
  every story, Playwright chromium), `storybook`, Changesets `changeset`/`version`/`release`.

## Architecture — each layer imports only from the layer below

Farmer app (see `apps/farmer-prototype/docs/architecture.md`):

```text
Component (UI)
  ↓ hooks/        React Query — client state
  ↓ fn/           Server actions — "use server", Zod validation, orchestration
  ↓ data-access/  DB queries + auth guards
  ↓ db/           Connection & schema
```

Never skip layers · `fn/` always has `"use server"` and validates with Zod · every `data-access/`
function calls an auth guard · server functions return
`ActionResult<T> = { success: true; data } | { success: false; error }` · React Query keys
`["resource", projectId, ...specifics]`, mutations invalidate related queries.

**Reference feature (Items CRUD)** — full vertical slice ported to DS components:
`src/db/schema/items.ts` → `src/data-access/items.ts` → `src/fn/items.ts` →
`src/hooks/use-items.ts` → `src/components/items/` → `src/app/(app)/[projectId]/items/page.tsx`.
Use it as the template when adding features (checklist in `TEMPLATE_USAGE.md`).

**How apps consume the design system** — CSS once, components per-import:

```css
@import "tailwindcss";                                /* the app's own utility generation */
@import "@majistudio/ogcr-design-system/styles.css";  /* loaded last so the DS layer wins */
```

```tsx
import { Button } from "@majistudio/ogcr-design-system";        // barrel
import { Table } from "@majistudio/ogcr-design-system/Table";   // Table is deep-import only
```

`'use client'` is baked into every DS component entry (imports cleanly from Server Components).
Components are consumed **prebuilt** (`dist/`) — a DS source edit reaches an app only after `dist/`
rebuilds (`pnpm dev` runs `ds:watch`; refresh the app afterward). True TSX HMR is intentionally
deferred — see `PLAN.md`.

## Design System — non-obvious facts

- **Two test setups.** `vitest.config.ts` is the jsdom unit runner `pnpm test` resolves
  (`*.test.tsx`). `vite.config.ts` also defines a `storybook` vitest project running every
  `*.stories.tsx` in Playwright chromium with the a11y addon — **not** run by `pnpm test`; invoke
  via `test:a11y` (needs `npx playwright install chromium-headless-shell`).
- **Tailwind v4 `@theme inline` over a runtime `--ds-*` seam (load-bearing for theming).** Tokens
  live in `src/styles/theme.css`. Literal-valued tokens (`--radius-12: 12px`) are baked into
  utilities and not runtime-themeable; `var()`-valued tokens keep the reference. All 49 color
  tokens are `var(--ds-*)` references into `src/styles/palette.css` (the only place a brand hex
  appears), so every color utility retints by overriding a `--ds-*` on any scoping element —
  no rebuild. `check:tokens` (chained into `build:lib`) fails if a color utility re-bakes a
  literal. Radius/spacing/font/elevation stay literal by design. Utility names drop the `--color-`
  namespace: `bg-surface-page`, not `bg-color-surface-page`.
- **Shared internals under `src/lib/` (not exported):** `cn.ts` (also shipped as the
  dependency-free `/cn` deep import), `overlay/` (centralized overlay chrome; deliberately **no**
  generic `Overlay` wrapper — `docs/adr/0001-no-generic-overlay-module.md`), `field/` (`useField`
  hook), `strings.ts` (default copy table; every default string is an overridable prop).
- **Icons are Phosphor**, re-exported under stable `*Icon` names in `src/components/icons/`,
  `aria-hidden` by default.
- **React Compiler is enabled** (both Vite configs). No hand-written
  `useMemo`/`useCallback`/`React.memo` unless the compiler can't (e.g. `Table` — TanStack returns
  unmemoizable functions).
- **Library build externalizes everything** (react, Base UI, TanStack Table, Phosphor,
  react-day-picker, cva/clsx/tailwind-merge). **TanStack Table** is deep-import only (`/Table`) —
  intentionally off the barrel so non-table consumers don't pull the peer.
- **Component conventions:** each is `src/components/<Name>/` with `index.tsx` + stories + tests,
  re-exported alphabetically from `src/index.ts` (except `Table`), own subpath export,
  `'use client'`. Confirm Base UI part/prop names from `node_modules/@base-ui/react/<part>/*.d.ts`
  before wrapping. Every component takes `className` merged with `cn()`; spread `...rest`; ids via
  `useId()`; native `aria-label`/`aria-labelledby` (custom `ariaLabel` props forbidden); focus
  rings via `shadow-focus-*`, never inline `[box-shadow:...]`. Good references: `Popover`,
  `Input`, `Dialog`/`NumberField`.
- **a11y gate** is `test: 'todo'` in `.storybook/preview.tsx` — structural a11y is clean; ~79
  stories still fail `color-contrast` on Figma-sourced brand tokens (needs a palette decision).
  Keep new work structurally clean.

## Farmer App — patterns

- **File naming:** kebab-case files (`item-form.tsx`, `use-items.ts`); PascalCase component
  exports; camelCase hooks/functions. TS strict, no `any`. See `docs/organization.md`.
- **React Compiler is on** here too — no manual memoization; avoid `useEffect` for data fetching
  (React Query) or derived state (compute directly).
- **Forms:** React Hook Form + Zod (`zodResolver`); schemas in `src/schemas/`; DS
  `Input`/`Textarea`/`Button` + the project's `FormField`/`ServerError`; server errors via
  `setError('root.serverError', {...})`.
- **Auth:** admin-invite only by default (`ALLOW_SELF_SIGNUP=false`); admin via `ADMIN_EMAIL`;
  invites + resets via Resend; Better Auth session cookies; route protection through
  `src/proxy.ts` → `updateSession()` → `auth.api.getSession()`.
- **Env:** validated via Zod in `src/config/env.ts`. Mock mode needs no environment file. With
  `MOCK_DATA=false`, `DATABASE_URL` and `BETTER_AUTH_SECRET` (32+ chars) are required;
  `NEXT_PUBLIC_APP_URL`, email settings, admin settings, and pool tuning remain configurable.
  Document variable NAMES only, never real values.

## Git & Branch Guardrails

- Branch `<area>/<kebab-desc>` (e.g. `farmer/maplibre-map`); commit/PR title
  `<type>(<scope>)?: <imperative, lowercase>` — types `feat` · `fix` · `refactor` · `chore` ·
  `docs` · `test`; scopes seen: `farmer`, `ds`.
- Feature work goes on a branch + PR; default base is `main`. **Confirm the target branch before
  every commit** (`git branch --show-current`).
- Run git/gh operations as discrete steps, not chained `&&` one-liners.

## Review Remediation (CodeRabbit / Claude review / audits)

For every finding: **verify it against the actual code first**, fix only valid ones with minimal
changes, skip invalid ones with a one-line written reason (false positives are common, including
bogus P0s). Validate with `pnpm lint` + tests before committing. Never blanket-apply a findings
list.

## Model Selection

Shared across all projects in `~/.claude/model-selection.md` (imported by the global `~/.claude/CLAUDE.md`; source: `shared-agent-skills/policies/model-selection.md`). Change it with the `update-model-policy` skill, not here.

Project note: copy follows `ux-writing.md`.

## Agent Skills

Reusable dev-workflow skills live at the repo root (`.agents/skills/`, surfaced to Claude Code via
`.claude/skills/` symlinks) so they apply monorepo-wide. The imported
[mattpocock/skills](https://github.com/mattpocock/skills) are version-pinned in `skills-lock.json`;
the custom codex/workflow skills (`codex-*`, `issue-cleanup`, `resolve-open-prs`) are maintained in
the shared collection at `Maji/08 Agents & Skills/shared-agent-skills` and adapted per-repo.

## Docs Index — read the target BEFORE doing the work (docs are NOT auto-indexed)

Farmer app (`apps/farmer-prototype/docs/` unless noted):

- Before **writing a server action or data-access query** → `docs/architecture.md` — layers,
  `ActionResult`, React Query patterns.
- Before **form/schema** work → `docs/forms.md`.
- **Auth guards, route protection** → `docs/auth.md`; **auth email not arriving** → `docs/mail-setup.md`.
- **Database** (Drizzle schema, migrations) → `docs/database.md`.
- **Where a new file goes** (naming, flat-vs-subfolder features) → `docs/organization.md`.
- **Env / secrets** → `docs/security.md`.
- **Library version drift vs training data** (Next 16, async `params`, Zod, Drizzle) →
  `docs/modern-patterns.md`; **stuck on a known gotcha** → `docs/troubleshooting.md`.
- **Adding a feature (checklist + reference entity)** → `apps/farmer-prototype/TEMPLATE_USAGE.md`.
- **Scope 3 intermediary flow** (current prototype spec) → `docs/scope-3-intermediary-flow-spec.md`;
  improvement backlog → `docs/improvement-plan-2026.md`.

Design system (`packages/design-system/docs/`):

- Before **any DS component or UI** work → `docs/design-system.md` — the authoritative written
  spec; **when spec and code disagree, the spec wins**. The farmer app also keeps its own
  `docs/design-system.md` for app-side consumption notes.
- **Architecture decisions** → `docs/adr/`; **component port backlog** → `docs/component-pickups-plan.md`.

Monorepo:

- **DS migration plan & status** (upstream sync, deferred HMR) → `PLAN.md`.
