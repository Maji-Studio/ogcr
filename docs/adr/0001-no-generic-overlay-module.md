# 1. No generic Overlay module over different Base UI roots

- Status: accepted
- Date: 2026-06-10
- Deciders: OGCR design-system maintainers

## Context

Ten components in the library are "overlays": `Dialog`, `AlertDialog`, `Sidesheet`,
`Popover`, `Tooltip`, `Menu`, `ContextMenu`, `Select`, `Combobox`, and `Toast`. They
visibly share chrome — the same white card surface (`bg-surface-light border
border-border-light rounded-12 shadow-elevation-l`), the same enter/exit motion
(`origin-[var(--transform-origin)] transition-[transform,opacity] … scale-95`), the same
backdrop, the same pointer arrow, and the same `sideOffset`. Before this change that
chrome was copy-pasted verbatim across the ten files, and the arrow existed in two
divergent copies (a complete dual-path SVG in `Popover`, an incomplete single-path inline
copy in `Tooltip`).

The obvious-looking fix is a single generic `<Overlay>` wrapper that every overlay renders
through. We considered and rejected it.

The ten components do **not** share a runtime root. Each wraps a *different* Base UI
primitive — `Dialog.Root`, `AlertDialog.Root`, `Popover.Root`, `Tooltip.Root`,
`Menu.Root`, `Select.Root`, `Autocomplete.Root` (Combobox), `Toast.Provider` — each with
its own parts (`Positioner`, `Backdrop`, `Popup`, `Arrow`, `Viewport`), its own prop
shapes, its own callback signatures (`(value, eventDetails)`), and its own
focus/dismiss/portal semantics. A wrapper that tried to span them would either (a) leak
every underlying part and prop straight through — a wrapper in name only — or (b) invent a
lowest-common-denominator API that re-implements, and then drifts from, Base UI's behavior.
Both erase the precise per-primitive contract this library is built on, and both make the
per-part `data-slot` + `className` override hooks (the documented styling surface) harder
to reach, not easier.

## Decision

**Extract the shared chrome as composable, presentational primitives — not as a wrapper
component.** `src/lib/overlay/` exports:

- `overlaySurfaceClassName`, `overlayMotionClassName`, `overlayPopupClassName` — the card
  surface and positioned-popup motion class strings.
- `overlayBackdropClassName` — the modal/sheet scrim (z-index intentionally left to each
  caller, since `Sidesheet` sits its backdrop below the overlay layer).
- `overlayArrowClassName` and `OverlayArrowSvg` — the **one** arrow implementation, with a
  `border` toggle so the dark `Tooltip` arrow renders the single foreground path and the
  light surfaces render the bordered two-path version.
- `OVERLAY_SIDE_OFFSET` — the shared positioner offset default.

Each component keeps its own Base UI root and composes these strings with `cn()` alongside
its component-specific layout/size classes. Every part keeps its `data-slot` and its
`className` passthrough untouched. Stacking moves onto the `--ds-z-overlay` / `--ds-z-toast`
runtime tokens (palette layer) so z-index is themeable and no longer a scattered literal.

## Consequences

- The chrome has one source of truth; a surface/motion/arrow change lands once.
- No abstraction sits between consumers and Base UI — every primitive's parts, props, and
  behaviors stay directly reachable, and the `data-slot`/`className` override contract is
  unchanged. This is a deliberately *non-breaking* refactor (`Popover` still re-exports
  `PopoverArrowSvg` for back-compat, now delegating to `OverlayArrowSvg`).
- The shared module is internal: it is not a published `exports` subpath and is reached
  only through component entries that already carry the `'use client'` boundary.
- Cost: the shared strings are presentational only. Anything genuinely behavioral (focus
  trapping, dismissal, portalling) stays per-component, by design — if a future need looks
  like "shared overlay behavior," that is a signal to revisit this ADR, not to quietly grow
  these class strings into a runtime wrapper.
