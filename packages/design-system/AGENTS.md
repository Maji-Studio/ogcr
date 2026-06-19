# AGENTS.md

Guidance for non-Claude coding agents (Codex, Cursor, others) working in this repository. This file mirrors CLAUDE.md so any agent picks up the same context.

## Commands

- `npm run dev` — Vite dev server with HMR
- `npm run build` — `tsc -b` then Vite production build; fails on TS errors
- `npm run lint` — ESLint over the repo
- `npm run preview` — serve the production build locally
- `npm run test` / `npm run test:watch` — Vitest (jsdom, React Testing Library)
- `npm run storybook` / `npm run build-storybook` — Storybook 10 (addons: a11y, vitest, docs, mcp, chromatic). The `Overview` MDX welcome page is pinned first in the sidebar.
- `npm run test:a11y` — axe accessibility checks over every story in headless Chromium (needs `npx playwright install chromium-headless-shell`)
- `npm run build:lib` — build the publishable `dist/` (ESM `index.js`, bundled `index.d.ts`, `styles.css`, `manifest.json`, `llms.txt`); runs the `check:tokens` + `check:dist` contract gates
- `npm run changeset` / `npm run version` / `npm run release` — Changesets-driven publish to npm as `@majistudio/ogcr-design-system`

## Stack & architecture

This is the OGCR design system, packaged as `@majistudio/ogcr-design-system` (currently `1.0.0`). 42 component modules; `docs/design-system.md` is the authoritative written spec — when spec and code disagree, the spec wins.

- **Vite + React 19 + TypeScript**. `tsconfig.json` is composite — `tsconfig.app.json` covers `src/`, `tsconfig.node.json` covers Vite/Vitest config. `tsc -b` runs both projects.
- **React Compiler is on.** `vite.config.ts` wires `@rolldown/plugin-babel` with `reactCompilerPreset()` alongside `@vitejs/plugin-react`. Avoid hand-written `useMemo` / `useCallback` / `React.memo` unless the compiler explicitly opts out (TanStack Table's `useReactTable` is one such case).
- **Tailwind v4 with `@theme inline` tokens over a runtime `--ds-*` seam.** `src/styles/theme.css` declares the token system; Tailwind v4 emits utility classes directly from those tokens. All 49 color tokens reference `var(--ds-*)` custom properties in `src/styles/palette.css` (the only place a brand hex appears), so color utilities and focus shadows are runtime-themeable — override a `--ds-*` on any scoping element and everything derived from it retints. `npm run check:tokens` fails the build if a color utility re-bakes a literal. Components compose utilities via `cn()` (clsx + tailwind-merge) at `src/lib/cn.ts`. No CSS-in-JS, no co-located component CSS files.
- **Base UI primitives** (`@base-ui/react`) provide the accessibility/behavior layer for the overlays (`Dialog`, `AlertDialog`, `Popover`, `Select`, `Combobox`, `Tooltip`, `Menu`, `ContextMenu`, `Sidesheet`), the form controls (`Checkbox`, `Radio`, `Switch`, `Slider`, `Toggle`, `NumberField`), and structural primitives (`Accordion`, `Collapsible`, `Tabs`, `ScrollArea`, `Separator`, `Toolbar`, `Progress`). Components wrap Base UI parts with OGCR token theming. `react-day-picker` v9 backs `Calendar`/`DatePicker`.
- **TanStack Table** (`@tanstack/react-table`) powers `Table`. It is **deep-import only** (`import { Table } from '@majistudio/ogcr-design-system/Table'`) — intentionally not on the barrel, so consumers who never render a table don't pull in the optional `@tanstack/react-table` peer.
- **CVA** (`class-variance-authority`) drives variant systems.
- **Storybook 10** is the canonical playground; every component ships an `index.tsx`, `<Name>.stories.tsx`, and (most) `<Name>.test.tsx`.
- **Vitest 4 + Testing Library** for unit tests.
- **ESLint flat config** at `eslint.config.js`.
- **Changesets** orchestrate releases.

## Component layout

`src/components/<Name>/` houses each component: `index.tsx` + `<Name>.stories.tsx` + (often) `<Name>.test.tsx`. The barrel at `src/index.ts` re-exports every folder **except `Table`** (deep-import only). Each component also has a `./<Name>` subpath export and a `'use client'` directive, so it works from a React Server Component. Shared internals live under `src/lib/` (`cn`, `overlay/`, `field/`, `strings`) and are not exported. Package entry: `dist/index.js`.

## Conventions

- Every component takes a `className` and merges with `cn()`.
- Most wrappers extend `ComponentPropsWithoutRef<'tag'>` and spread `...rest` onto the root, so consumers can set `id`, `data-*`, and `aria-*`.
- Form controls generate ids via `useId()`. `FormField` clones its single child to inject id/aria-describedby/aria-invalid.
- Custom `ariaLabel` camelCase props are forbidden — use the native `aria-label` / `aria-labelledby` attributes.
- Heading components (`Card`, `FormSection`) accept `headingLevel` (default 3).
- Focus rings use the unified `shadow-focus-primary` / `shadow-focus-secondary` / `shadow-focus-error` utilities; do not inline arbitrary `[box-shadow:...]` for focus state.
- Style only via tokens/utilities (`bg-surface-*`, `text-text-*`, `rounded-12`, `shadow-focus-*`) — never hardcoded hex/px. Brand colors ride the `--ds-*` seam in `palette.css`.
- No dark mode is shipped yet. Colors are runtime-themeable via `--ds-*`, but do not assume a `.dark` palette or dark-mode tokens exist.
