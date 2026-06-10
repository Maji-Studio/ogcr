---
"@ogcr/design-system": minor
---

Extract shared overlay chrome and add a runtime stacking seam (Phase 3). Zero visual change.

- **One source of truth for overlay chrome.** The card surface, positioned-popup motion, modal/sheet backdrop, arrow positioning, and `sideOffset` default — previously copy-pasted across `Dialog`, `AlertDialog`, `Sidesheet`, `Popover`, `Tooltip`, `Menu`, `ContextMenu`, `Select`, `Combobox`, and `Toast` — now live in an internal `src/lib/overlay/` module as composable class strings. Each component keeps its own Base UI root and every part keeps its `data-slot` + `className` passthrough. There is deliberately **no** generic `Overlay` wrapper — see `docs/adr/0001-no-generic-overlay-module.md`.
- **One arrow.** The pointer arrow had two divergent copies (a complete one in `Popover`, an incomplete inline one in `Tooltip`). Both are replaced by a single `OverlayArrowSvg` with a `border` toggle. `Popover` still exports `PopoverArrowSvg` (now a thin back-compat delegate) — non-breaking.
- **Runtime stacking tokens.** New `--ds-z-overlay` (50) and `--ds-z-toast` (100) custom properties on the palette layer; overlay/toast components consume them via `z-[var(--ds-z-overlay)]` / `z-[var(--ds-z-toast)]` instead of literal `z-50` / `z-[100]`. Stacking is now overridable at runtime alongside the color seam. (`Sidesheet`'s backdrop stays a layer below at `z-40` by design.)
