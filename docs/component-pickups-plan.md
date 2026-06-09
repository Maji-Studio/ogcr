# Component pickups — production status & remaining work

Components picked up from the Base UI / Radix / shadcn diff (see chat that
produced this). All five are now **production-complete** for their core
surface (compiles, lints clean, unit-tested, story-tested in real Chromium,
exported from `src/index.ts`, lib build green). A handful of larger items are
**explicitly deferred** (each needs a design/product decision, not just code) —
listed per component below.

**Status legend:** ✅ done · 🔨 scaffolded (functional, has TODOs) · ⏸ deferred (needs a decision) · 📋 planned

| Component | Built on | Status | Barrel |
|---|---|---|---|
| `Menu` | Base UI `menu` | ✅ | ✅ |
| `Toolbar` (+ `Button`/`Group`/`Separator`/`Link`/`Input`) | Base UI `toolbar` | ✅ | ✅ |
| `ScrollArea` | Base UI `scroll-area` | ✅ | ✅ |
| `Calendar` | `react-day-picker` v9 | ✅ | ✅ |
| `DatePicker` | Popover + Calendar | ✅ | ✅ |

## What landed in the production pass (2026-06-09)

- **Menu** — scrollable `maxHeight` popup (keyboard-aware native overflow, thin
  tokenised scrollbar), `showArrow` (reuses `PopoverArrowSvg`), filled-dot radio
  indicator (vs. the check glyph for checkboxes), RTL caret flip + disabled-submenu
  affordance. New stories: `WithArrow`, `LongScrollable`, disabled submenu.
- **ScrollArea** — `scrollbars="always"` variant; `Horizontal` / `Both` /
  `AlwaysVisible` stories. (Menu deliberately uses native overflow, not this — see
  its note; `ScrollArea` remains for non-menu long surfaces.)
- **Calendar** — selection rebuilt as cell-vs-button layering: range band on the
  cell, round fill on the endpoint buttons, `range_middle` reset (important, since
  it co-carries `selected`); `today` is now a ring so it never fights selected-text;
  `captionLayout="dropdown"` styling; `MultiMonth` + `DropdownCaption` stories.
- **DatePicker** — Form/Field binding (`id` / `aria-describedby` / `aria-invalid` /
  `required` forwarded to the trigger; `error` standalone), `minDate`/`maxDate` +
  `disabledDates` passthrough (also limits nav), clearable affordance. New stories:
  `Clearable`, `Bounded`, `WithinForm`, `Invalid`.
- **Toolbar** — `ToolbarInput` (roving-focus search field), `density`
  ('comfortable' | 'compact') via context, `WithInput` + `Compact` stories.

Each lives in `src/components/<Name>/` with `index.tsx` + `<Name>.stories.tsx`
+ `<Name>.test.tsx`, per the repo convention.

---

## Pick up later (consolidated)

Everything here is **optional / decision-gated** — the five components are
production-complete without it. Per-component detail is in the sections below.

**Needs a product/UX decision:**
- [ ] `Menu` vs `ContextMenu` naming (cross-cutting #4) — keep both / fold / repurpose.
- [ ] DatePicker free-text date entry — which formats to accept, ambiguity handling.
- [ ] Toolbar overflow / "more" menu — which items collapse first (+ ResizeObserver).

**Needs a shared-primitive / API decision:**
- [ ] `Kbd` primitive for Menu `shortcut` (reusable across Menu / Command / Tooltip).
- [ ] Make `Toggle` forward `ref`/props so it can be projected into `Toolbar` via `render`.
- [ ] `DateRangePicker` variant (range mode + two-field trigger).

**Cross-cutting (tracked elsewhere too):**
- [ ] `docs/design-system.md` spec sections for all five (the authoritative spec).
- [ ] color-contrast palette decision (system-wide; covers Calendar today/selected).
- [ ] `pnpm changeset` when these land for real.

**Before committing — stage selectively:**
- [ ] The working tree carries a large *pre-existing* uncommitted set (~20 unrelated
      components — Accordion, Combobox, Toggle, Tooltip, … — a `ComponentProps`
      passthrough sweep) that is **not** part of this work. `git add src/components`
      would sweep it all in. Stage only the five new dirs + `src/index.ts`,
      `src/components/icons/index.tsx`, `vite.lib.config.ts`, `package.json`,
      `pnpm-lock.yaml`, `pnpm-workspace.yaml`, and this doc.

---

## Environment changes already made (don't redo)

- **pnpm 10 → 11 store migration.** The repo's `node_modules` was linked by pnpm
  10 (store `v10`); the active CLI is pnpm 11 (store `v11`). `npm install` is
  unusable here (corrupts the pnpm symlink tree — arborist `Link.matches` crash).
  Resolved by `rm -rf node_modules && pnpm install`. **Always use pnpm.**
- **esbuild build-script approval.** pnpm 11 gates build scripts; the approval
  lives in `pnpm-workspace.yaml` (`allowBuilds: { esbuild: true }`), *not* the
  `package.json` `pnpm` field (ignored in pnpm 11). Without it every `pnpm run`
  fails its pre-run dep check.
- **`react-day-picker@^9` added** to `dependencies` and externalized in
  `vite.lib.config.ts` (matches the "externalize everything" rule; kept
  `dist/index.js` from ballooning — ~67 kB saved).
- **Icons added** to `src/components/icons/index.tsx`: `CaretLeftIcon`,
  `CaretRightIcon`, `CheckIcon`, `CircleIcon`, `CalendarIcon`.

---

## Cross-cutting follow-ups (apply to all new components)

1. **a11y gate.** Run `pnpm test:a11y` (needs
   `npx playwright install chromium-headless-shell`). New stories are
   structurally clean; expect the known `color-contrast` failures on brand
   tokens (pre-existing, blocked on a palette decision — see CLAUDE.md). Don't
   introduce *new* structural violations.
2. **`docs/design-system.md`** is the authoritative spec — add sections for
   Menu, Toolbar, ScrollArea, Calendar, DatePicker once their APIs settle.
   Spec wins over code when they disagree.
3. **CHANGELOG / changeset** — add a changeset (`pnpm changeset`) when these
   land for real.
4. **Naming decision pending: `Menu` vs `ContextMenu`.** Today `ContextMenu` is
   actually a *click*-triggered flat dropdown (misnamed — Base UI's real
   right-click `context-menu` part is unused). `Menu` is the richer composable
   superset. Decide whether to (a) keep both, (b) fold `ContextMenu` into a
   `Menu` preset, or (c) repurpose `ContextMenu` onto the real `context-menu`
   part for right-click menus. Not done — needs product sign-off.

---

## Menu — `src/components/Menu/index.tsx`

Composable dropdown on Base UI `menu`, props-driven via a recursive `items`
discriminated union (house style — no dot-notation compound API).

**Done:** action items (icon, shortcut hint, destructive), `separator`,
`checkbox` items, `radio-group`, `link` items, `group` + group label, nested
`submenu`. Open/controlled props, side/align/offset. Unit tests cover action /
checkbox / radio / submenu.

**Done (production pass):**
- [x] Scrollable long menus via `maxHeight` — native overflow on the popup, not
      `Menu.Viewport` (that's a *transition* container, not a scroll host) and not
      the custom `ScrollArea` (would fight Base UI's keyboard scroll-into-view).
      Thin tokenised scrollbar; verified by unit test + `LongScrollable` story.
- [x] `showArrow` reusing `PopoverArrowSvg`.
- [x] Disabled-submenu affordance (`data-[disabled]` opacity + not-allowed; can't
      open) + RTL caret flip (`rtl:-scale-x-100`).
- [x] Filled-dot radio indicator (`CircleIcon weight="fill"`); checkbox keeps the
      check glyph.

**Deferred (needs a decision):**
- [ ] Real `Kbd` styling for `shortcut` — left as a muted span. ⏸ Introducing a
      shared `Kbd` public primitive is API surface that should be designed once and
      reused (Menu, Command palette, Tooltip), so it's deliberately not invented here.
- [ ] Decide `Menu` vs `ContextMenu` (see cross-cutting #4) — product sign-off.
- [ ] `docs/design-system.md` section (authoritative spec) once the API is signed off.

---

## Toolbar — `src/components/Toolbar/index.tsx`

Roving-focus container on Base UI `toolbar`. Flat sub-component exports
(`Toolbar`, `ToolbarButton`, `ToolbarGroup`, `ToolbarSeparator`, `ToolbarLink`)
matching the `Toggle`/`ToggleGroup` convention.

**Done:** horizontal + vertical orientation, button/group/separator/link parts,
focus-visible rings, roving-focus arrow-key nav (unit-tested).

**Done (production pass):**
- [x] `ToolbarInput` wrapper (Base UI `toolbar/input`) — roving-focus search field,
      unit-tested (stays in focus order + accepts typing).
- [x] `density` ('comfortable' | 'compact') via context → control heights/padding;
      `Compact` story + unit test.

**Deferred (needs a decision):**
- [ ] Overflow / "more" affordance (collapse into a `Menu`) for narrow widths. ⏸
      Needs a ResizeObserver measure-and-collapse pass *and* a product call on which
      items collapse first — too much surface to stub safely.
- [ ] Project the OGCR `Toggle`/`ToggleGroup` into the toolbar via `render`. ⏸
      Blocked on `Toggle` not forwarding `ref`/arbitrary props (it has a fixed prop
      set), so Base UI's roving-focus props can't be merged onto it. Fixing that
      touches the already-shipped `Toggle` public API — separate change. Stateful
      controls already compose fine as `ToolbarButton`s.
- [ ] `docs/design-system.md` section.

---

## ScrollArea — `src/components/ScrollArea/index.tsx`

Styled custom scrollbar on Base UI `scroll-area`. Single props-driven component
(`maxHeight`, `orientation`, `viewportClassName`).

**Done:** vertical/horizontal/both scrollbars, auto-hide thumb (hover/scroll),
`maxHeight` constraint, corner. Unit-tested (renders + maxHeight applied).

**Done (production pass):**
- [x] `Horizontal` + `Both` + `AlwaysVisible` stories.
- [x] Always-visible variant via `scrollbars="always"`.

**Notes / deferred:**
- Menu long-list scrolling uses **native overflow**, not this component (keyboard
  scroll-into-view correctness — see Menu's note). `ScrollArea` stays the host for
  non-menu long surfaces. Wiring it into `Select`/`Combobox` popups is optional and
  left for when those surfaces need it.
- [ ] `docs/design-system.md` section.

---

## Calendar — `src/components/Calendar/index.tsx`

Tokenised wrapper over `react-day-picker` v9 `DayPicker`. Passes through the full
DayPicker API (so `mode="single"|"multiple"|"range"` and matching
`selected`/`onSelect` types are preserved). No `react-day-picker/style.css`
import — styling is class-driven; nav chevrons swapped for Phosphor carets.

**Done:** single + range stories, month grid, day select, custom chevrons,
token classNames. Unit-tested (grid renders, onSelect fires) with a fixed month
for determinism.

**Done (production pass):**
- [x] Cell-vs-button layering: range band on the **cell**, round fill on the
      endpoint **buttons**, `range_middle` reset (important — it co-carries
      `selected`; verified at `DayPicker.js:303-311`). `today` is a ring, not a text
      colour, so it never fights selected-text. Unit test asserts the middle is a
      band, not a solid fill.
- [x] `numberOfMonths` (`MultiMonth` story) + `captionLayout="dropdown"`
      (`DropdownCaption` story, styled dropdowns).
- [x] RTL — DayPicker handles nav direction when `dir="rtl"` is passed through.

**Deferred / notes:**
- [ ] Week numbers; `locale` is already passthrough (full DayPicker API).
- [ ] Brand-token color-contrast on `today`/`selected` — part of the system-wide
      palette decision (see cross-cutting #1), not Calendar-specific.
- [ ] `docs/design-system.md` section.

---

## DatePicker — `src/components/DatePicker/index.tsx`

Single-date field: `Popover` + `Calendar` (single mode) + a field-style trigger.
Controlled (`value`+`onChange`) or uncontrolled (`defaultValue`); trigger label
via `Intl.DateTimeFormat`; selecting a day closes the popover.

**Done:** placeholder/empty + selected + disabled states, controlled +
uncontrolled, formatted label. Unit-tested (placeholder, open→select→onChange,
formatted value).

**Done (production pass):**
- [x] **Form/Field binding** — forwards `id` / `aria-describedby` / `aria-invalid`
      / `required` to the trigger so `FormField` lights it up like `Input`; `error`
      is the standalone equivalent. Unit-tested (label association + error state).
      Also fixed controlled-detection to the standard `value !== undefined`.
- [x] `minDate` / `maxDate` (disable out-of-range days + limit nav) +
      `disabledDates` matcher passthrough.
- [x] Clear button (`clearable`) — rendered as a sibling overlay (a `<button>`
      can't legally nest in the trigger button); unit-tested.

**Deferred (needs a decision):**
- [ ] Free-text keyboard entry + parse. ⏸ Needs a locale-aware parse strategy
      (which formats to accept, how to handle ambiguity) — a product/UX decision,
      not just code.
- [ ] `DateRangePicker` variant (range mode + two-field trigger).
- [ ] `docs/design-system.md` section.

---

## Verification snapshot (production pass — 2026-06-09)

- `npx tsc -b --force` — clean, 0 errors (a transient incremental-build artifact
  flagged a non-existent `SideNavigation.stories.tsx` error mid-edit; a forced full
  build is clean — not a real error, and unrelated to these five).
- `eslint` (new dirs + index) — clean, 0 errors / 0 warnings.
- `pnpm test` (jsdom unit suite) — **34 files / 144 tests pass** (was 136; +8 new).
- `pnpm run build:lib` — green; `dist/index.js` 223.40 kB (gzip 75.07), up ~10 kB
  from the new features (Form binding, density, arrow, range layering).
- `pnpm test:a11y` scoped to the five components (real Chromium) — **25 stories
  pass**, no structural a11y regressions. (Whole-suite color-contrast on brand
  tokens is still the known, pre-existing `test: 'todo'` item — palette decision.)

---

# Base UI / shadcn wrapper-alignment — follow-ups (2026-06-09)

Separate workstream from the five pickups above. **Items 1–3 of the alignment
plan are DONE** (rest/ref passthrough + Base-UI-derived prop types across 21
wrappers; shared `TooltipProvider`) — `tsc -b` / `eslint` / `pnpm test`
(142 tests) all green; diff stayed surgical. The items below are what we still
need to **look at / decide later**.

## ⏸ Needs a decision (owner sign-off)

1. **Compound / composable parts.** The big remaining divergence from
   shadcn/Base UI: we expose closed config-prop APIs (`Dialog` takes
   `title`/`primaryAction`; `Accordion`/`Tabs` take `items[]`) rather than
   composable parts (`DialogContent`, `DialogFooter`, `AccordionItem`,
   `TabsList`, …). This is **additive** API surface and a deliberate house-style
   call — not built. Decide whether to also ship compound parts (alongside the
   config APIs) for power users, or stay closed. Same shape as the
   `Menu`-no-dot-notation decision above; resolve them together for consistency.

## 🔎 Deviations from the alignment plan to revisit

2. **Tooltip delay moved to `Trigger`, not `Root`.** The plan assumed
   `Tooltip.Root` accepts `delay`/`closeDelay`; in the installed Base UI it does
   **not** — delay lives on `Tooltip.Trigger` (per-trigger) and
   `Tooltip.Provider` (shared). We put `delay`/`closeDelay` on the `Trigger`,
   which preserves the standalone 200 ms default *and* lets a shared
   `TooltipProvider` group adjacent tooltips (verified: group logic forces a 0 ms
   reopen even when a per-trigger delay is set). Open: confirm 200 ms standalone
   vs. provider-driven delay is the UX we want, and whether to surface the
   provider `timeout` (instant-reopen window) as a first-class prop.

3. **Toast rest/ref forwards onto *every* item root.** Toasts are
   manager-generated, so `ToastProvider`'s extra props/`ref` spread onto each
   `BaseToast.Root` (existing children/timeout/limit-only callers render
   identically). Forwarding a single `ref` to many elements is a bit odd —
   revisit if we want a cleaner per-toast escape hatch instead.

4. **SideNavigation `onSelect` Omit + mobile branch.** Had to
   `Omit<'onSelect'>` from `ComponentProps<'aside'>` (DOM `onSelect` collided
   with the bespoke `onSelect: (id) => void`). The mobile (Dialog-drawer) branch
   does **not** forward the `aside`-typed `...rest` — fine today, but revisit if
   the mobile path needs passthrough.

5. **Select → Trigger, Combobox → Input.** Their Base UI `*.Root` render no DOM,
   so `...rest`/`ref` land on the styleable trigger/input surface (mirrors
   `Popover` → `Popup`). Confirm that's the escape-hatch target consumers expect
   (vs. a wrapper element).

## 📋 Standard follow-ups (same as the pickups)

6. **`docs/design-system.md`** — spec not yet updated for the new rest/ref
   escape hatches or the `TooltipProvider` export. Update once the compound-parts
   decision (#1) settles, since it may change the documented surface.
7. **a11y gate** (`pnpm test:a11y`) and **changeset** (`pnpm changeset`) — run
   when this lands for real; same known brand-token color-contrast caveat.
