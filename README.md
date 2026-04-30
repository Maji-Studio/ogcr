# OGCR Design System

Reference implementation of the OGCR design system. This repo is the source other OGCR frontend projects look to when they need tokens, component behavior, or visual conventions — copy from here, don't reinvent.

## What's in here

- **[`docs/design-system.md`](docs/design-system.md)** — the authoritative spec. Tokens, component anatomy, and the CSS that defines them. When the spec and code disagree, the spec wins.
- **[`src/components/`](src/components/)** — example library. One working React + CSS implementation of the spec (Button, Card, Checkbox, ContextMenu, Form, Input, Kpi, Message, Navigation, Pill, ProgressBar, Radio, Sidesheet, Table, icons, Logo). Treat it as a reference, not a published package — there is no build output for consumers yet.

## Using this as a reference

- Pulling a component into another project: read the matching section in `docs/design-system.md` first, then crib the JSX/CSS from `src/components/`.
- Tokens live in `src/index.css` as plain CSS custom properties. Copy the `:root` block (and the `prefers-color-scheme: dark` overrides) rather than re-deriving values.
- Stick to the CSS-variable approach. No Tailwind, CSS-in-JS, or token pipeline — keep downstream projects aligned.

## Local development

- `npm run dev` — Vite dev server with HMR
- `npm run build` — `tsc -b` then a Vite production build (fails on type errors)
- `npm run lint` — ESLint over the repo
- `npm run preview` — serve `dist/` to sanity-check the production output

No test runner is configured.

## Stack notes

- **React 19 + TypeScript + Vite.**
- **React Compiler is on** via `@rolldown/plugin-babel` in `vite.config.ts`. Components auto-memoize at build time — skip manual `useMemo` / `useCallback` / `React.memo` unless the compiler can't handle the case.
- **TypeScript project references**: `tsconfig.json` delegates to `tsconfig.app.json` (browser) and `tsconfig.node.json` (Vite config). Both must type-check.
- **ESLint flat config** in `eslint.config.js`; `dist/` is globally ignored.
