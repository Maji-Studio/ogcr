# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server with HMR (the demo app in `src/App.tsx`)
- `npm run build` — type-check (`tsc -b`) then produce a Vite build. Fails on TypeScript errors.
- `npm run build:lib` — build the publishable library to `dist/` via `vite.lib.config.ts` (ESM `index.js`, bundled `index.d.ts`, `styles.css`). This is the artifact consumers get, **not** `npm run build`. The two builds share `dist/` and clobber each other.
- `npm run lint` — run ESLint over the repo
- `npm run test` — run the **jsdom** unit suite (`vitest run`, config `vitest.config.ts`, picks up `src/**/*.test.tsx`)
- `npm run test:watch` — same suite in watch mode
- `npm run storybook` / `npm run build-storybook` — Storybook 9 dev server / static build
- `npm run preview` — serve a built `dist/` locally
- `npm run changeset` / `version` / `release` — Changesets release flow (package is `private`/alpha; not published yet)

## Stack & architecture

This is the OGCR design system: 42 component modules (`src/components/*`) on **Vite + React 19 + TypeScript**, **Base UI** (`@base-ui/react`) primitives (plus **react-day-picker** v9 for `Calendar`/`DatePicker`), **Tailwind v4** design tokens, and **CVA + `cn()`** for variants. `src/index.ts` is the public barrel; `npm run build:lib` ships it as `@ogcr/design-system`. `docs/design-system.md` is the authoritative written spec — when spec and code disagree, the spec wins.

Non-obvious facts that span multiple files:

- **Two separate test setups.** `vitest.config.ts` is the **jsdom** unit runner that `npm run test` resolves (it takes precedence over `vite.config.ts`); it runs `*.test.tsx`. `vite.config.ts` *also* defines a `storybook` vitest project that runs every `*.stories.tsx` in a **Playwright chromium** browser with the a11y addon — that project is **not** run by `npm run test`; invoke it with `vitest run --config vite.config.ts` (or `npm run test:a11y`), and it needs `npx playwright install chromium-headless-shell`. (Earlier notes claimed the unit suite runs in browser mode — it does not; it's jsdom.)
- **Tailwind v4 `@theme inline` (load-bearing for theming).** Tokens live in `src/styles/theme.css` inside an `@theme inline` block (entry point is `src/styles/global.css`; consumers import `@ogcr/design-system/styles.css`). With `inline`, a token whose value is a **literal** (`--color-surface-page: #f8f3ef`) is **baked into every utility** (`bg-surface-page { background:#f8f3ef }`) and is **not** emitted as a `:root` custom property — so it is **not** runtime-themeable. A token whose value is a **`var()` reference** keeps the reference in the utility (themeable). There is currently **no dark mode**; adding one requires a two-layer rearchitecture (runtime `:root`/`.dark` palette + repoint the semantic color tokens to `var(--ds-…)`), not a simple `.dark { --color-… }` override. Utility names drop the `--color-` namespace: `bg-surface-page`, not `bg-color-surface-page`. Extend the token approach rather than introducing a styling framework without discussion.
- **Icons are Phosphor.** `src/components/icons/index.tsx` re-exports `@phosphor-icons/react` glyphs under stable `*Icon` names (`SearchIcon → MagnifyingGlass`, `MailIcon → Envelope`, `PanelLeftIcon → SidebarSimple`, `CalendarIcon → CalendarBlank`), each wrapped to be `aria-hidden` by default (decorative; the parent control supplies the accessible name).
- **React Compiler is enabled.** `vite.config.ts` / `vite.lib.config.ts` wire `@rolldown/plugin-babel` with `reactCompilerPreset()`. Components auto-memoize at build time; avoid hand-written `useMemo` / `useCallback` / `React.memo` unless the compiler can't (e.g. `Table` skips it — TanStack Table returns unmemoizable functions; that lint warning is expected).
- **TypeScript project references.** `tsconfig.json` delegates to `tsconfig.app.json` (browser `src/`) and `tsconfig.node.json` (Vite configs). `tsc -b` must pass for both.
- **ESLint flat config** in `eslint.config.js` extends `js`, `tseslint`, `reactHooks` flat-recommended, the Storybook plugin, and `reactRefresh.configs.vite`; `dist/` is globally ignored. Non-component exports from a component file (helpers like `getPaginationRange`, `deriveInitials`, `useToast`) need an inline `// eslint-disable-next-line react-refresh/only-export-components`.
- **Library build externalizes everything.** `vite.lib.config.ts` marks react/react-dom, `@base-ui/react`, `@tanstack/react-table`, `@phosphor-icons/react`, `react-day-picker`, and cva/clsx/tailwind-merge as `external` so the consumer's bundler dedupes/tree-shakes one copy.

## Conventions when adding or changing components

- Each component is a directory under `src/components/<Name>/` with `index.tsx` + `<Name>.stories.tsx` + `<Name>.test.tsx`, re-exported (alphabetically) from `src/index.ts`. Good references: `Popover` (Base UI overlay wrap), `Input` (native control + Form binding), `Dialog`/`NumberField` (recent, idiomatic).
- Before wrapping a Base UI primitive, confirm exact part/prop names from `node_modules/@base-ui/react/<part>/*.d.ts` — the API is precise (`Accordion`/`Toggle` use `multiple`, not `openMultiple`; `Dialog.Root` has no `dismissible`; Base UI callbacks fire `(value, eventDetails)`).
- Style only via tokens/utilities (`bg-surface-*`, `text-text-*`, `rounded-12`, `shadow-focus-*`, `--motion-*`) — no hardcoded colors/sizes.
- Run the a11y gate with `npm run test:a11y` (axe over every story via the storybook browser project). It's currently `test: 'todo'` in `.storybook/preview.tsx` — **structural** a11y (names, roles, ARIA) is clean, but ~79 stories still fail `color-contrast` on Figma-sourced brand tokens (`text-secondary` on light surfaces, green `interaction-primary` on light tints), which needs a palette decision before flipping to `'error'`. Keep new work structurally clean: label icon-only controls (`aria-label`); `role="combobox"`/`role="menu"` need a name from a label, not from contents.
