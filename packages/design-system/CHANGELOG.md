# @majistudio/ogcr-design-system

## 1.0.0

### Major Changes

- 2833bf3: Configure the library as an npm-publishable package under the scoped name @majistudio/ogcr-design-system, add a prepublishOnly build step to ensure the package is built before publishing, include complete package metadata in package.json, and document installation and release procedures in the README.

### Minor Changes

- cc84baa: Add a runtime theming seam for color (Phase 1a). Brand color values now live in `src/styles/palette.css` as `--ds-*` custom properties, and the `@theme inline` color tokens reference them, so every color utility and focus shadow bakes a `var(--ds-…)` reference instead of a frozen hex. Colors are now overridable at runtime by setting `--ds-*` on any scoping element — with zero visual change to the default palette. A new `npm run check:tokens` gate (chained into `build:lib`) fails the build if any color utility re-bakes a literal. Radius, spacing, font, and elevation tokens are unchanged.
- cc84baa: Harden the consumption interface (Phase 2).

  - **Publishable to npm under public access.** `private` is now `false` and `publishConfig.access` is `public`; the Changesets `access` is `public`.
  - **`'use client'` boundaries.** Every component entry — the root barrel and each `./<Name>` deep import — now ships with a `'use client'` directive as its first line, so the components work from a React Server Component (Next.js App Router, etc.) without the consumer adding the boundary. Injected post-build by `scripts/inject-use-client.mjs` and verified by `scripts/check-dist.mjs`, both chained into `build:lib`.
  - **`cn()` is exported.** Available as `import { cn } from '@majistudio/ogcr-design-system'` and as the dependency-free, directive-free deep import `import { cn } from '@majistudio/ogcr-design-system/cn'` (safe in a Server Component).
  - **BREAKING: `Table` is deep-import-only.** It is no longer re-exported from the barrel — import it as `import { Table } from '@majistudio/ogcr-design-system/Table'`. This keeps `@tanstack/react-table` (now declared an **optional** peer via `peerDependenciesMeta`) out of the dependency graph of consumers who never render a table.
  - New `npm run check:dist` gate asserts the directive placement, the purity of the `cn` entry, the Table-barrel removal, and `npm pack` publishability.
  - README documents the imports / SSR boundary / peers contract.

- cc84baa: Extract shared overlay chrome and add a runtime stacking seam (Phase 3). Zero visual change.

  - **One source of truth for overlay chrome.** The card surface, positioned-popup motion, modal/sheet backdrop, arrow positioning, and `sideOffset` default — previously copy-pasted across `Dialog`, `AlertDialog`, `Sidesheet`, `Popover`, `Tooltip`, `Menu`, `ContextMenu`, `Select`, `Combobox`, and `Toast` — now live in an internal `src/lib/overlay/` module as composable class strings. Each component keeps its own Base UI root and every part keeps its `data-slot` + `className` passthrough. There is deliberately **no** generic `Overlay` wrapper — see `docs/adr/0001-no-generic-overlay-module.md`.
  - **One arrow.** The pointer arrow had two divergent copies (a complete one in `Popover`, an incomplete inline one in `Tooltip`). Both are replaced by a single `OverlayArrowSvg` with a `border` toggle. `Popover` still exports `PopoverArrowSvg` (now a thin back-compat delegate) — non-breaking.
  - **Runtime stacking tokens.** New `--ds-z-overlay` (50) and `--ds-z-toast` (100) custom properties on the palette layer; overlay/toast components consume them via `z-[var(--ds-z-overlay)]` / `z-[var(--ds-z-toast)]` instead of literal `z-50` / `z-[100]`. Stacking is now overridable at runtime alongside the color seam. (`Sidesheet`'s backdrop stays a layer below at `z-40` by design.)

- cc84baa: Centralize form-field a11y wiring behind a shared Field module (Phase 4).

  - **One source of truth for field wiring.** A new internal `useField` hook owns id generation, `aria-describedby` merging, `aria-invalid` resolution (caller value wins), and error/helper precedence (`errorText` over `helperText`). `Input`, `Textarea`, `NumberField`, `Select`, and `Combobox` all consume it instead of each hand-rolling the logic.
  - **Consistent `aria-describedby` merging.** Previously `Input`/`Textarea` **overwrote** a caller-supplied `aria-describedby` (dropping it), while `NumberField` merged it. Now every control merges — a caller-passed description id is always preserved alongside the control's own helper id.
  - **`Select` and `Combobox` gain `label` / `helperText` / `errorText`.** They can now render their own associated label + helper/error chrome standalone, matching the other inputs. When these props are omitted the rendered output is unchanged.
  - **`FormField` publishes a Field context.** Our controls nested in a `FormField` adopt its control id, `aria-describedby`, and error state from context and suppress their own label/helper — so there is never a duplicate `<label>`. `FormField` still clones the child as a fallback for opaque (non-context) children, and now shares the same dedup-safe `mergeIds` helper.

- cc84baa: Add a copy seam — every default user-facing string is now an overridable prop (Phase 5).

  - **One table for default copy.** A new internal `src/lib/strings.ts` holds every default string the components ship (close/dismiss/clear labels, placeholders, empty states, pagination labels, stepper labels). Each component sources its default from this table.
  - **New overridable props** for strings that were previously hardcoded inline:
    - `Dialog` / `Sidesheet` — `closeLabel`
    - `Toast` / `Message` — `dismissLabel`
    - `DatePicker` — `clearLabel`
    - `NumberField` — `decrementLabel`, `incrementLabel`
    - `Pagination` — `navLabel`, `previousLabel`, `nextLabel`, and `pageLabel(page)` (a function, for localized numbered-page labels)
  - **Existing defaults re-sourced from the table** (no API change): `AlertDialog` `confirmLabel`/`cancelLabel`, `Select`/`Combobox`/`DatePicker` placeholders, `Combobox` `emptyMessage`, `Table` empty-state fallback.
  - **No provider/context** — overriding is per-prop, keeping the seam explicit and tree-shakeable. Localizing globally is done by wrapping components (or a future provider over this same table). Third-party copy (react-day-picker month/weekday/nav labels, Base UI internals) is out of scope and localized through those libraries.
