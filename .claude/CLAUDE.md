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
  react-day-picker v9 for `Calendar`/`DatePicker`), Tailwind v4 tokens, CVA + `cn()`. Developed in a
  **standalone upstream repo** and pulled in here history-preserving (`pnpm ds:sync`); it keeps
  publishing to npm via its own Changesets flow. Migration plan/status: `PLAN.md`.
- **farmer-prototype** — Next.js 16 App Router app from `Maji-Studio/nextjs-template`: Better Auth,
  PostgreSQL + Drizzle, React Query + react-hook-form, with the OGCR design system as its design
  layer (green brand, Inter via `next/font`). Needs `.env.local` to boot (env validated at import):
  copy `.env.example`; placeholders are enough for the UI. Real Postgres
  (`pnpm --filter farmer-prototype dev:docker`) only for DB-backed routes — without it, auth-gated
  pages redirect to `/login`, which is expected.
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
| `pnpm ds:sync` | Pull design-system updates from the standalone upstream repo |
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
- **Env:** validated via Zod in `src/config/env.ts`. Required: `DATABASE_URL`,
  `NEXT_PUBLIC_APP_URL`, `BETTER_AUTH_SECRET` (32+ chars), `RESEND_API_KEY`, `RESEND_FROM_EMAIL`,
  `ADMIN_EMAIL`, `ALLOW_SELF_SIGNUP`. Document variable NAMES only, never values.

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

## Picking the Right Models for Workflows and Subagents

Rankings below are **higher = better**. Cost reflects what I actually pay (gpt-5.6-sol is flat-rate
via the Codex desktop subscription, not list price). Intelligence = how hard a problem you can hand
the model unsupervised. Taste = UI/UX, code quality, API design, copy.

| model       | cost | intelligence | taste |
| ----------- | ---- | ------------ | ----- |
| gpt-5.6-sol | 9    | 8            | 7     |
| sonnet-5    | 5    | 5            | 7     |
| opus-5    | 4    | 7            | 8     |
| fable-5     | 2    | 9            | 9     |

**How to apply** — these are defaults, not limits: you have standing permission to escalate if a
cheaper model's output doesn't meet the bar. Judge the output, not the price tag; use cheap options
to gather information before moving work to expensive ones.

- **Prefer gpt-5.6-sol over opus-5 most of the time** — it's quite powerful and effectively free;
  reach for opus-5 mainly when the work must run as a native Claude subagent/Workflow agent or
  when taste matters.
- Bulk/mechanical (clear-spec implementation, data analysis, migrations) → **gpt-5.6-sol**.
- User-facing (Copy, API design) needs **taste ≥ 7**. Use ux-writing.md for writing
- For UI & styling, use Opus 5 to design and utilize frontend-design skill for everything.
- Reviews of plans/implementations → **fable-5 or gpt-5.6-sol**, optionally opus-5 as an extra
  independent perspective.
- **Never use Haiku.** Subagents/Workflow agents run on **sonnet or opus — never inherit Fable**.
  Batch items to keep agent counts low.
- Don't use Fable for workflows, except it's been asked. Use instead opus-5 or gpt-5.6-sol.

**Mechanics** — the Codex model (**gpt-5.6-sol high**; the flat-rate slot formerly called
"gpt-5.5") is only reachable through the Codex CLI (`codex exec` / `codex review`;
`~/.codex/config.toml` sets the default model + effort; binary at `~/Library/pnpm/bin/codex`, needs
codex-cli ≥ 0.144 for gpt-5.6-sol; fallback `/Applications/ChatGPT.app/Contents/Resources/codex`).
Use the **codex-implementation**, **codex-review**, **codex-computer-use** skills; for uncovered
work (investigation, data analysis) run `codex exec -s read-only` directly with a self-contained
prompt. Claude models run via the Agent/Workflow `model` parameter.

**gpt-5.6-sol inside workflows/subagents** — the `model` param only takes Claude models, so wrap:
spawn a thin Claude wrapper agent (`model: 'sonnet'`, effort `low`) whose prompt writes a
self-contained codex prompt, runs `codex exec` via Bash, and returns the report (use `schema` on
the wrapper for structured output). **Always label the wrapper with a `gpt-5.6:` prefix** (e.g.
`{label: 'gpt-5.6:review-auth'}`) — the UI shows the wrapper's Claude model, the label is the only
signal of the real worker. Codex runs can exceed Bash's 10-min timeout: pass an explicit timeout or
background+poll. Parallel gpt-5.6-sol implementation agents must use `isolation: 'worktree'`.
Workflow token budgets only count Claude tokens — codex work is invisible to `budget.spent()`.

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
