// Shared overlay chrome — presentational class strings composed by the overlay components
// (Dialog, AlertDialog, Sidesheet, Popover, Tooltip, Menu, ContextMenu, Select, Combobox,
// Toast). NOT a wrapper component: each overlay keeps its own Base UI root and parts, and
// merges these strings with `cn()` alongside its own layout/size classes. See
// docs/adr/0001-no-generic-overlay-module.md for why this is strings-not-a-wrapper.
//
// Internal only: not a published `exports` subpath. Reached through component entries that
// already carry the `'use client'` boundary, so it needs no directive of its own. The arrow
// component lives in ./arrow (kept separate so this file is component-free).

import { cn } from '../cn'

/** The white card surface every light popup shares (bg + border + radius + elevation). */
export const overlaySurfaceClassName =
  'bg-surface-light border border-border-light rounded-12 shadow-elevation-l'

/** Enter/exit motion for a positioned popup (anchored to the positioner's transform origin). */
export const overlayMotionClassName = cn(
  'outline-none origin-[var(--transform-origin)] transition-[transform,opacity] duration-150',
  'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
  'data-[starting-style]:scale-95 data-[ending-style]:scale-95',
)

/** Convenience: the light-popup surface + positioned-popup motion (Popover/Menu/Select/…). */
export const overlayPopupClassName = cn(overlaySurfaceClassName, overlayMotionClassName)

/**
 * Modal/sheet backdrop scrim. z-index is intentionally NOT included — callers add their own
 * (`Dialog`/`AlertDialog` ride `--ds-z-overlay`; `Sidesheet` sits its scrim a layer below).
 */
export const overlayBackdropClassName = cn(
  'fixed inset-0 bg-black/40',
  'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
  'transition-opacity duration-200',
)

/** Per-side rotation/offset for an anchored arrow (shared by Popover, Tooltip, Menu). */
export const overlayArrowClassName = cn(
  'data-[side=bottom]:top-[-8px] data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180',
  'data-[side=left]:right-[-13px] data-[side=left]:rotate-90',
  'data-[side=right]:left-[-13px] data-[side=right]:-rotate-90',
)

/** Default gap between an anchored popup and its trigger, in px. */
export const OVERLAY_SIDE_OFFSET = 8
