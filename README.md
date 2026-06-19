# OGCR Monorepo

The OGCR design system and the apps that build on it, in one pnpm workspace.

```
ogcr/
  packages/
    design-system/      @majistudio/ogcr-design-system — React 19 + Tailwind v4 component library
  apps/
    farmer-prototype/   Next.js 16 app (consumes the design system via workspace:*)
```

## Getting started

```bash
pnpm install
pnpm ds:build          # build the design system's publishable dist/ (apps consume this)
pnpm dev               # design-system watch + farmer dev server on http://localhost:3200
```

> `apps/farmer-prototype` needs an `.env.local` to boot (env is validated at import). Copy
> `apps/farmer-prototype/.env.example` → `.env.local`; the placeholder values are enough to run the
> UI. A real Postgres (`pnpm --filter farmer-prototype dev:docker`) is only needed for DB-backed
> routes — without it, auth-gated pages redirect to `/login`, which is expected.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | DS library-watch + farmer dev together (see [scripts/dev.sh](./scripts/dev.sh)) |
| `pnpm build` | `turbo run build --filter=./apps/*` — builds each app; the DS library (`build:lib`) runs first as a dependency |
| `pnpm ds:build` | Build the DS's publishable `dist/` (`build:lib`, **not** the demo `build`) |
| `pnpm ds:watch` | `turbo watch build:lib` — rebuild the DS `dist/` on every DS source change |
| `pnpm ds:storybook` | Run the design system's Storybook |
| `pnpm ds:sync` | Pull design-system updates from the standalone upstream repo |
| `pnpm lint` / `pnpm test` | Lint / test across the workspace |

### Build orchestration (the `build:lib` vs `build` gotcha)

The design system ships **two** Vite builds that share `dist/` and clobber each other: `build`
(the Storybook/demo app) and `build:lib` (the publishable library — `index.js`, `index.d.ts`,
`styles.css`). Apps consume `build:lib`. So turbo is wired to depend on **`build:lib`**, never the
demo `build`:

- `turbo.json`: the app `build` task `dependsOn: ["^build:lib"]`; `pnpm build` filters to `./apps/*`
  so the DS demo `build` is never invoked in the monorepo.
- `build:lib` is the only thing that produces the `dist/` apps import.

## How apps reuse the design system

Apps depend on `@majistudio/ogcr-design-system` with `"workspace:*"`. The split is **CSS once,
components per-import**:

```css
/* app globals.css — the DS stylesheet IS the brand: tokens + reset + utilities */
@import "tailwindcss";                                /* the app's own utility generation */
@import "@majistudio/ogcr-design-system/styles.css";  /* loaded last so the DS layer wins */
```

```tsx
// components — barrel import, or deep-import for the smallest RSC client boundary
import { Button } from "@majistudio/ogcr-design-system";
import { Table } from "@majistudio/ogcr-design-system/Table"; // Table is deep-import only
```

`'use client'` is baked into every DS component entry, so they import cleanly from Server
Components. The DS expects **Inter** (`--font-standard`); farmer loads it via `next/font` and maps
the token in `globals.css`. Don't re-declare design tokens in an app — extend the design system.

### Near-live DS iteration

Components are consumed **prebuilt** (`dist/`), so a DS source edit reaches an app only after
`dist/` rebuilds. `pnpm dev` runs `ds:watch` to rebuild on change (~a few seconds, including the
`'use client'` injection and token checks); refresh the app afterward. True TSX HMR
(`transpilePackages`) is intentionally deferred — see [`PLAN.md`](./PLAN.md).

## Design system as upstream

The design system is developed in its **standalone repo** and pulled in here (history-preserving).
Run `pnpm ds:sync` to merge upstream changes; the standalone repo keeps publishing to npm via its
own Changesets flow. See [`PLAN.md`](./PLAN.md) for the full migration plan and current status.
