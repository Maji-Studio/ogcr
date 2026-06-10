# OGCR Design System

`@ogcr/design-system` — the React component library, design tokens, and Tailwind v4 theme bridge for OGCR frontends. This repo is the single source other OGCR projects build on; import from the package rather than reinventing components or re-deriving tokens.

> Status: `0.1.0`, public — published to npm under public access (`publishConfig.access: public`). The publishable artifact is produced by `npm run build:lib`. `docs/design-system.md` is the authoritative written spec; when spec and code disagree, the spec wins.

## What's in here

- **`src/components/`** — 42 components on [Base UI](https://base-ui.com) primitives (plus [react-day-picker](https://daypicker.dev) for the calendar), styled with Tailwind v4 tokens and [CVA](https://cva.style) variants. Overlays (`Dialog`, `AlertDialog`, `Popover`, `Select`, `Combobox`, `Tooltip`, `Menu`, `ContextMenu`, `Sidesheet`), inputs (`Input`, `Textarea`, `NumberField`, `Checkbox`, `Radio`, `Switch`, `Slider`, `Toggle`/`ToggleGroup`, `Calendar`, `DatePicker`, `Form`), structure (`Accordion`, `Collapsible`, `Tabs`, `Table`, `Toolbar`, `ScrollArea`, `Separator`, `Card`, `Breadcrumb`, `Pagination`, `Navigation`, `SideNavigation`), and feedback/display (`Toast`, `Message`, `Skeleton`, `ProgressBar`, `Pill`, `Kpi`, `Avatar`, `Logo`, `icons`). `src/index.ts` is the public barrel.
- **`src/styles/`** — design tokens as Tailwind v4 `@theme` custom properties (`theme.css`), a small reset, and the `global.css` entry. Tokens are reconciled from the OGCR Figma file.
- **`docs/design-system.md`** — the authoritative spec: tokens, component anatomy, and conventions.

## Install & use (in an OGCR app)

```bash
# Once published; today, consume via the local build:lib output / workspace link.
npm install @ogcr/design-system
```

```tsx
import { Button, Dialog, useToast } from '@ogcr/design-system' // barrel (tree-shaken by your bundler)
import { Button } from '@ogcr/design-system/Button'            // or deep-import a single component
import '@ogcr/design-system/styles.css'                        // tokens + Tailwind utilities + reset (import once)
```

The barrel is ESM with `"sideEffects": ["*.css"]`, so a bundler (Vite/webpack/Rollup/esbuild) tree-shakes the components you don't import. Every component also has a `./<Name>` subpath (`@ogcr/design-system/Button`) for explicit deep imports and non-bundler setups — the `exports` map and subpaths are generated from `src/components/*` by `scripts/generate-lib-meta.mjs` during `build:lib`. **The stylesheet does not split** — `styles.css` is one file (~53 KB) regardless of how many components you use; import it once.

Machine-readable indexes ship in the package for tooling and LLM exploration: **`@ogcr/design-system/manifest.json`** (structured: every component's import path, exported symbols, and types path) and **`@ogcr/design-system/llms.txt`** (llms.txt format — one line per component with its import). Both are regenerated on every `build:lib`.

### Imports, SSR boundaries & peers — the consumption contract

- **`Table` is deep-import only.** It is intentionally **not** re-exported from the barrel; import it as `import { Table } from '@ogcr/design-system/Table'`. It is the one component that pulls in `@tanstack/react-table`, so keeping it off the barrel means consumers who never render a table don't drag that peer into their dependency graph. `@tanstack/react-table` is declared an **optional** peer (`peerDependenciesMeta`) — install it only if you use `Table`; the install won't warn otherwise.
- **`'use client'` boundary.** Every component entry — the barrel (`@ogcr/design-system`) and each deep import (`@ogcr/design-system/Button`) — ships with a `'use client'` directive as its first line. In a React Server Components app (Next.js App Router, etc.) importing from either draws the server/client boundary at the package edge, so the components Just Work from a Server Component. For the **smallest** client boundary in an RSC/perf-sensitive app, deep-import the specific components you render rather than pulling the whole barrel across the boundary.
- **`cn()` is exported, and dependency-free.** The same `clsx` + `tailwind-merge` class-merge helper the components use is available as `import { cn } from '@ogcr/design-system'` (barrel) or, with **no** `'use client'` directive and no React in its graph, as `import { cn } from '@ogcr/design-system/cn'` — use the `/cn` deep import when you need to compose class names in a Server Component or other pure context.

Peer dependencies the consumer provides: `react`/`react-dom` (^19), `@base-ui/react` (^1), and `@tanstack/react-table` (^8, **optional** — only if you use `Table`). Icons (`@phosphor-icons/react`), `react-day-picker` (used by `Calendar`/`DatePicker`), and `cva`/`clsx`/`tailwind-merge` ship as regular dependencies and are externalized from the bundle so a single copy is deduped.

## Local development

- `npm run dev` — Vite dev server with HMR (the demo app in `src/App.tsx`)
- `npm run storybook` — Storybook 9 (component workbench; `npm run build-storybook` for a static build)
- `npm run test` — jsdom unit suite (Vitest)
- `npm run test:a11y` — axe accessibility checks over every story in a headless Chromium (needs `npx playwright install chromium-headless-shell`)
- `npm run lint` — ESLint over the repo
- `npm run build` — type-check + Vite app build (fails on type errors)
- `npm run build:lib` — produce the publishable `dist/` (`index.js` ESM, bundled `index.d.ts`, `styles.css`)
- `npm run changeset` / `release` — Changesets versioning/publish flow

## Stack notes

- **React 19 + TypeScript + Vite**, **Tailwind v4** tokens, **Base UI** behavior primitives, **CVA + `cn()`** for variants.
- **React Compiler is on** (`@rolldown/plugin-babel` + `reactCompilerPreset()`). Components auto-memoize at build time — skip manual `useMemo` / `useCallback` / `React.memo` unless the compiler can't (e.g. `Table`).
- **Theming is Tailwind v4 `@theme inline`.** Extend the token layer in `src/styles/theme.css`; consume the semantic tokens (`bg-surface-*`, `text-text-*`, `shadow-focus-*`), not raw hex. There is no dark mode yet — see `CLAUDE.md` for the `@theme inline` mechanics that any dark-mode work must account for.
- **TypeScript project references**: `tsconfig.json` delegates to `tsconfig.app.json` and `tsconfig.node.json`; `tsc -b` must pass for both.
- **ESLint flat config** in `eslint.config.js`; `dist/` is globally ignored.

See `CLAUDE.md` for the non-obvious, cross-file details (the two Vitest setups, `@theme inline` themability, Base UI prop gotchas, the a11y gate, and library-build externalization).
