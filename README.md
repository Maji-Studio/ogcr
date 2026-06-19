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
pnpm ds:build          # build the design system's publishable dist/ (required before apps consume it)
pnpm dev               # run apps (+ design-system watch) via turbo
```

## How apps reuse the design system

Apps depend on `@majistudio/ogcr-design-system` with `"workspace:*"`, import its prebuilt
stylesheet once, and import components from the barrel:

```tsx
// app entry / root layout
import "@majistudio/ogcr-design-system/styles.css";
import { Button } from "@majistudio/ogcr-design-system";
```

The stylesheet **is** the brand (OGCR green, tokens, reset). Apps should not re-declare their own
design tokens — extend the design system instead.

See [`PLAN.md`](./PLAN.md) for the migration plan and current status.
