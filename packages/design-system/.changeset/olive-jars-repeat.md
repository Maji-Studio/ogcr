---
"@majistudio/ogcr-design-system": major
---

Reconcile the design system with its Figma source and ship the full token surface.

**This is a breaking release.** The shipped stylesheet now pins `--spacing: 1px` and grows
`--text-m` to 18px, which rescales consumer markup written against Tailwind's stock 4px spacing
steps and grows body copy: a consumer must not take this update through a compatible-range bump
without migrating. Before upgrading, sweep app markup for stock-scale spacing/sizing utilities
(`p-4` meaning 16px, `w-64` meaning 256px, `gap-3` meaning 12px, …) and rewrite them on the
design-system px scale (`p-16`, `w-256`, `gap-12`), then re-check text that sat on `text-m`.
The full sweep checklist lives in `docs/audit-follow-ups-2026-08.md` §4.

**New component APIs**

- `Button` gains a `size` scale (`s` 32 / `m` 40 / `l` 48 px), `fullWidth`, `iconOnly` and
  `shape="circle"` — the latter two retire the hand-built icon-button and FAB. `iconOnly` requires
  an accessible name at the *type* level: `iconOnly: true` without `aria-label`/`aria-labelledby`
  no longer compiles.
- `Navigation` and `SideNavigation` items accept `href` and `render`, so a nav row can be a real
  `<a>` or your router's `Link` instead of always being a `<button>`. `SideNavigation` also picks
  up its first spec section (§4.40).
- `Popover` and `ContextMenu` share a `width` scale (`s` 256 / `m` 280 / `l` 320 / `auto`),
  defaulting to their existing widths.
- `Card` gains `padding` (`none`/`s`/`m`/`l`), `Kpi` gains an `icon` slot and `accentBar={false}`,
  and `Pill` gains `dot` / `leading`. `Kpi` and `Pill` both gain the blue `progress` tone.
- `Toggle` / `ToggleGroup` forward rest props and `ref`, so a group can be projected into
  `Toolbar` via `render` as the spec always promised.
- The icon set grows from 25 to 48 glyphs and exports `createDecorativeIcon()` plus the
  `PhosphorIcon` / `PhosphorIconProps` types, so apps can add a glyph without importing Phosphor
  directly.

**Tokens**

- Ten semantic colors imported from Figma: the `icon-*-light` tier, the `border-*-strong` tier and
  the `interaction-secondary-{default,hover,active}` steps.
- New scale steps: `--spacing-120`, `--radius-0`, `--border-width-{s,m,l}` (utilities are
  `border-w-*`), `--shadow-control` and `--shadow-control-pressed`.
- **`--text-m` is now 18px** (Figma `font/size/m`, previously 16). `--text-h4` and `--text-body`
  dereference it, so body copy and h4 grow 2px system-wide.
- `--shadow-focus-secondary` is no longer a copy of `--shadow-focus-primary`; it now rides the
  brand-blue of the secondary tier, restoring the green/blue split. The dead
  `--ds-focus-ring-error` token is removed.

**Shipped stylesheet** — three consumer-visible changes

- Every declared token now ships both a `var()`-able variable and a utility class; a build gate
  fails if the two sets disagree.
- Library utilities move into a nested `@layer utilities.ogcr-ds`, so they **lose** to a consuming
  app's utilities at equal specificity. This fixes responsive variants (`sm:`/`lg:`) silently
  losing to library classes, and makes app-side `--ds-*` overrides work.
- `--spacing` is pinned to `1px` so numeric spacing utilities an app generates itself land on the
  px scale. **This rescales markup written against Tailwind's stock 4px steps** — `p-4` is 4px,
  not 16px.
- A curated state-variant set (`hover:`/`focus-visible:`/`active:`/`disabled:` across the
  interaction tier and friends) ships precompiled, and a new **`./theme` export** exposes the
  `@theme` token source: `@import "@majistudio/ogcr-design-system/theme"` in an app's own Tailwind
  build generates any utility × any variant natively.

**Build gates** — `build:lib` now runs five checks (`check:merge` → `check:spacing` →
`check:colors` → `check:tokens` → `check:dist`). The new `check:colors` forbids color literals
anywhere in `src/` outside the palette; `check:dist` additionally asserts the shipped variable and
utility surfaces. All scripts run under pnpm.

`docs/design-system.md` is reconciled with the code throughout; remaining backlog is in
`docs/audit-follow-ups-2026-08.md`.
