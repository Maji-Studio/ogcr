<div align="center">

# OGCR Design System

**42 ready-made, on-brand React components — install, import one stylesheet, ship.**

The component library, design tokens, and Tailwind v4 theme that every OGCR frontend builds on. The single source of truth other OGCR projects share — build on it instead of reinventing components or re-deriving tokens.

[![npm version](https://img.shields.io/npm/v/@majistudio/ogcr-design-system?color=2e7d32&label=npm)](https://www.npmjs.com/package/@majistudio/ogcr-design-system)
[![license](https://img.shields.io/npm/l/@majistudio/ogcr-design-system?color=2e7d32)](./LICENSE)
[![React 19](https://img.shields.io/badge/React-19-2e7d32)](https://react.dev)
[![components](https://img.shields.io/badge/components-42-2e7d32)](https://ogcr-design-system.vercel.app/storybook/)

[**Demo app**](https://ogcr-design-system.vercel.app/) · [**Storybook**](https://ogcr-design-system.vercel.app/storybook/) · [**Spec**](docs/design-system.md) · [**Quick start**](#quick-start) · [**Contributing**](#contributing--local-development)

</div>

---

## Contents

- [Quick start](#quick-start) — install, import, render a button
- [What's included](#whats-included) — all 42 components, grouped
- [Two ways to import](#two-ways-to-import) — barrel vs. deep imports
- [Theming](#theming) — runtime-themeable color tokens
- [Contributing / local development](#contributing--local-development) — commands & conventions
- [Publishing](#publishing-maintainers) — the release flow
- [How it's built](#how-its-built) — the stack at a glance

---

## Quick start

New here? You'll be rendering a styled button in three steps.

### 1. Install

Add the package plus its peer dependencies (React and Base UI):

```bash
# pnpm
pnpm add @majistudio/ogcr-design-system react react-dom @base-ui/react

# npm
npm install @majistudio/ogcr-design-system react react-dom @base-ui/react

# yarn
yarn add @majistudio/ogcr-design-system react react-dom @base-ui/react
```

> Only need the `Table` component? It also needs `@tanstack/react-table` — `pnpm add @tanstack/react-table`. Everything else works without it.

### 2. Import the stylesheet once

At your app's entry point (e.g. `main.tsx` or the root layout), import the styles a single time. This one file carries the design tokens, Tailwind utilities, and reset:

```tsx
import '@majistudio/ogcr-design-system/styles.css'
```

### 3. Use a component

Import anything from the package and render it:

```tsx
import { Button, Dialog, useToast } from '@majistudio/ogcr-design-system'

export function App() {
  return <Button>Get started</Button>
}
```

That's it — you're styled and on-brand. Browse every component (with live controls) in [Storybook](https://ogcr-design-system.vercel.app/storybook/), and check `docs/design-system.md` for the full written spec.

---

## What's included

42 components built on [Base UI](https://base-ui.com) behavior primitives, styled with Tailwind v4 tokens and [CVA](https://cva.style) variants:

| Group | Components |
| --- | --- |
| **Overlays** | `Dialog`, `AlertDialog`, `Popover`, `Select`, `Combobox`, `Tooltip`, `Menu`, `ContextMenu`, `Sidesheet` |
| **Inputs & forms** | `Input`, `Textarea`, `NumberField`, `Checkbox`, `Radio`, `Switch`, `Slider`, `Toggle` / `ToggleGroup`, `Calendar`, `DatePicker`, `Form` |
| **Layout & structure** | `Accordion`, `Collapsible`, `Tabs`, `Table`, `Toolbar`, `ScrollArea`, `Separator`, `Card`, `Breadcrumb`, `Pagination`, `Navigation`, `SideNavigation` |
| **Feedback & display** | `Toast`, `Message`, `Skeleton`, `ProgressBar`, `Pill`, `Kpi`, `Avatar`, `Logo`, `icons` |

Under the hood: `src/components/` holds the components (`src/index.ts` is the public barrel), `src/styles/` holds the design tokens (reconciled from the OGCR Figma file), and `docs/design-system.md` is the authoritative spec — **when the spec and the code disagree, the spec wins.**

---

## Two ways to import

```tsx
// Barrel — your bundler tree-shakes the components you don't use
import { Button, Dialog } from '@majistudio/ogcr-design-system'

// Deep import — pull in exactly one component (smallest footprint)
import { Button } from '@majistudio/ogcr-design-system/Button'
```

Both work. The barrel is convenient; deep imports give the smallest client boundary in React Server Components apps. Every component has a `./<Name>` subpath.

<details>
<summary><strong>The fine print — SSR boundaries, the <code>Table</code> exception, and <code>cn()</code></strong></summary>

- **`Table` is deep-import only.** It is intentionally **not** on the barrel — import it as `import { Table } from '@majistudio/ogcr-design-system/Table'`. It's the one component that pulls in `@tanstack/react-table`, so keeping it off the barrel means consumers who never render a table don't drag that peer into their dependency graph. `@tanstack/react-table` is an **optional** peer — install it only if you use `Table`, and the install won't warn otherwise.
- **`'use client'` is built in.** Every entry — the barrel and each deep import — ships with a `'use client'` directive as its first line. In an RSC app (Next.js App Router, etc.) the components Just Work from a Server Component. For the smallest client boundary in a perf-sensitive RSC app, deep-import the specific components you render.
- **`cn()` is exported and dependency-free.** The same `clsx` + `tailwind-merge` class-merge helper the components use is available as `import { cn } from '@majistudio/ogcr-design-system'`, or — with **no** `'use client'` directive and no React in its graph — as `import { cn } from '@majistudio/ogcr-design-system/cn'`. Use the `/cn` deep import to compose class names in a Server Component or other pure context.
- **The stylesheet does not split.** `styles.css` is one file (~59 KB) regardless of how many components you use. Import it once.
- **Peer dependencies:** `react` / `react-dom` (^19), `@base-ui/react` (^1), and `@tanstack/react-table` (^8, optional — only for `Table`). Icons (`@phosphor-icons/react`), `react-day-picker` (used by `Calendar` / `DatePicker`), and `cva` / `clsx` / `tailwind-merge` ship as regular dependencies, externalized so a single copy is deduped.
- **Machine-readable indexes ship in the package** for tooling and LLMs: `@majistudio/ogcr-design-system/manifest.json` (every component's import path, exported symbols, and types path) and `@majistudio/ogcr-design-system/llms.txt` (one line per component with its import). Both are regenerated on every `build:lib`.

</details>

---

## Theming

Colors are runtime-themeable. Every brand color resolves through a `--ds-*` custom property, so you can retint the whole system by overriding those properties on any scoping element — no rebuild required:

```css
.my-scope {
  --ds-interaction-primary: #0066ff;
}
```

Everything derived from that token retints instantly. See the **Foundations → Theming** story in Storybook. There's **no dark mode shipped yet**, but the color layer is already on the seam, so adding one is a `.dark { --ds-…: … }` palette override — not a rearchitecture. Always consume the semantic tokens (`bg-surface-*`, `text-text-*`, `shadow-focus-*`), never raw hex.

---

## Contributing / local development

This repo uses **pnpm**. Clone it, install once, and start the dev server or Storybook:

```bash
pnpm install
pnpm dev          # Vite dev server with HMR (the demo app in src/App.tsx)
pnpm storybook    # Storybook 10 — the component workbench
```

> npm works too if you prefer — swap `pnpm` for `npm run` (e.g. `npm run dev`). Node `>=20.19` is required.

Everyday commands:

| Command | What it does |
| --- | --- |
| `pnpm dev` | Vite dev server with HMR (demo app) |
| `pnpm storybook` | Storybook 10 component workbench (`pnpm build-storybook` for a static build) |
| `pnpm test` | jsdom unit suite (Vitest) |
| `pnpm test:a11y` | axe accessibility checks over every story in headless Chromium¹ |
| `pnpm lint` | ESLint over the repo |
| `pnpm build` | type-check + Vite app build (fails on type errors) |
| `pnpm build:lib` | build the publishable `dist/` (ESM `index.js`, bundled `index.d.ts`, `styles.css`) |

¹ First run needs the browser: `pnpm exec playwright install chromium-headless-shell`.

### Adding a component

Each component lives in `src/components/<Name>/` as `index.tsx` + `<Name>.stories.tsx` + `<Name>.test.tsx`, and is re-exported alphabetically from `src/index.ts`. Good references to copy from: `Popover` (Base UI overlay), `Input` (native control + form binding), `Dialog` / `NumberField` (recent and idiomatic). Style only with tokens/utilities — no hardcoded colors or sizes. See `CLAUDE.md` for the conventions in detail.

---

## Publishing (maintainers)

`@majistudio/ogcr-design-system` publishes to the **public npm registry** under the [`@majistudio`](https://www.npmjs.com/org/majistudio) org. Releases run through [Changesets](https://github.com/changesets/changesets). The only artifact shipped is `dist/`, which is rebuilt and contract-checked automatically on publish — you never ship a stale or hand-built `dist/`.

**One-time setup:** `npm login` as a member of the `@majistudio` npm org with publish rights.

**Cut a release:**

```bash
pnpm changeset                    # describe the change, pick the semver bump; commit the generated .changeset/*.md
pnpm version                      # apply pending changesets: bumps package.json + writes the changelog
git commit -am "Version packages" # the changeset config sets commit:false, so commit the bump yourself
pnpm release                      # prepublishOnly builds dist/, then `changeset publish` publishes + tags
git push --follow-tags            # push the version commit + the release tag
```

On publish, `prepublishOnly` runs `build:lib`, which emits `dist/` and runs `check:tokens` + `check:dist`. `check:dist` asserts the publish contract — every entry starts with `'use client'`, `cn.js` stays pure (server-importable), `Table` is deep-import-only, and `npm pack --dry-run` actually ships `dist/index.js`. A failed contract fails the publish.

**Preview the exact tarball without publishing:**

```bash
pnpm build:lib && npm pack --dry-run
```

---

## How it's built

- **React 19 + TypeScript + Vite**, **Tailwind v4** tokens, **Base UI** behavior primitives, **CVA + `cn()`** for variants.
- **React Compiler is on** — components auto-memoize at build time, so skip manual `useMemo` / `useCallback` / `React.memo` unless the compiler can't (e.g. `Table`).
- **Theming is Tailwind v4 `@theme inline` over a runtime `--ds-*` seam** — extend the token layer in `src/styles/theme.css`; `pnpm check:tokens` fails the build if a color utility bakes a literal instead of riding the seam.
- **TypeScript project references:** `tsconfig.json` delegates to `tsconfig.app.json` and `tsconfig.node.json`; `tsc -b` must pass for both.
- **ESLint flat config** in `eslint.config.js`; `dist/` is globally ignored.

For the non-obvious, cross-file details — the two Vitest setups, `@theme inline` themability, Base UI prop gotchas, the a11y gate, and library-build externalization — see **`CLAUDE.md`**.
</content>
</invoke>
