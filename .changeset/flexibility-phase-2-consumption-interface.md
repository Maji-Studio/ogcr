---
"@ogcr/design-system": minor
---

Harden the consumption interface (Phase 2).

- **Publishable to npm under public access.** `private` is now `false` and `publishConfig.access` is `public`; the Changesets `access` is `public`.
- **`'use client'` boundaries.** Every component entry — the root barrel and each `./<Name>` deep import — now ships with a `'use client'` directive as its first line, so the components work from a React Server Component (Next.js App Router, etc.) without the consumer adding the boundary. Injected post-build by `scripts/inject-use-client.mjs` and verified by `scripts/check-dist.mjs`, both chained into `build:lib`.
- **`cn()` is exported.** Available as `import { cn } from '@ogcr/design-system'` and as the dependency-free, directive-free deep import `import { cn } from '@ogcr/design-system/cn'` (safe in a Server Component).
- **BREAKING: `Table` is deep-import-only.** It is no longer re-exported from the barrel — import it as `import { Table } from '@ogcr/design-system/Table'`. This keeps `@tanstack/react-table` (now declared an **optional** peer via `peerDependenciesMeta`) out of the dependency graph of consumers who never render a table.
- New `npm run check:dist` gate asserts the directive placement, the purity of the `cn` entry, the Table-barrel removal, and `npm pack` publishability.
- README documents the imports / SSR boundary / peers contract.
