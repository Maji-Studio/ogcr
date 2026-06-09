# AGENTS.md

Guidance for non-Claude coding agents (Codex, Cursor, others) working in this repository. This file mirrors CLAUDE.md so any agent picks up the same context.

## Commands

- `npm run dev` — Vite dev server with HMR
- `npm run build` — `tsc -b` then Vite production build; fails on TS errors
- `npm run lint` — ESLint over the repo
- `npm run preview` — serve the production build locally
- `npm run test` / `npm run test:watch` — Vitest (jsdom, React Testing Library)
- `npm run storybook` / `npm run build-storybook` — Storybook 10 (with addon-a11y, addon-vitest)
- `npm run changeset` / `npm run version` / `npm run release` — Changesets-driven publish to npm as `@ogcr/design-system`

## Stack & architecture

This is the OGCR design system, packaged as `@ogcr/design-system` (pre-1.0).

- **Vite + React 19 + TypeScript**. `tsconfig.json` is composite — `tsconfig.app.json` covers `src/`, `tsconfig.node.json` covers Vite/Vitest config. `tsc -b` runs both projects.
- **React Compiler is on.** `vite.config.ts` wires `@rolldown/plugin-babel` with `reactCompilerPreset()` alongside `@vitejs/plugin-react`. Avoid hand-written `useMemo` / `useCallback` / `React.memo` unless the compiler explicitly opts out (TanStack Table's `useReactTable` is one such case).
- **Tailwind v4 with `@theme inline` tokens.** `src/styles/theme.css` declares the entire token system. Tailwind v4 emits utility classes directly from those tokens. Components compose utilities via `cn()` (clsx + tailwind-merge) at `src/lib/cn.ts`. No CSS-in-JS, no co-located component CSS files.
- **Base UI primitives** (`@base-ui/react`) provide accessibility for `Dialog`, `Menu`, `Checkbox`, `Radio`, `RadioGroup`, `Progress`. Components wrap Base UI primitives with OGCR token theming.
- **TanStack Table** (`@tanstack/react-table`) powers `DataTable`.
- **CVA** (`class-variance-authority`) drives variant systems.
- **Storybook 10** is the canonical playground; every component ships an `index.tsx`, `<Name>.stories.tsx`, and (most) `<Name>.test.tsx`.
- **Vitest 4 + Testing Library** for unit tests.
- **ESLint flat config** at `eslint.config.js`.
- **Changesets** orchestrate releases.

## Component layout

`src/components/<Name>/` houses each component: `index.tsx` + `<Name>.stories.tsx` + (often) `<Name>.test.tsx`. The barrel at `src/index.ts` re-exports every folder. Package entry: `dist/index.js`.

## Conventions

- Every component takes a `className` and merges with `cn()`.
- Most wrappers extend `ComponentPropsWithoutRef<'tag'>` and spread `...rest` onto the root, so consumers can set `id`, `data-*`, and `aria-*`.
- Form controls generate ids via `useId()`. `FormField` clones its single child to inject id/aria-describedby/aria-invalid.
- Custom `ariaLabel` camelCase props are forbidden — use the native `aria-label` / `aria-labelledby` attributes.
- Heading components (`Card`, `FormSection`) accept `headingLevel` (default 3).
- Focus rings use the unified `shadow-focus-primary` / `shadow-focus-secondary` / `shadow-focus-error` utilities; do not inline arbitrary `[box-shadow:...]` for focus state.
- Dark-mode tokens have not been defined; do not assume they exist.
