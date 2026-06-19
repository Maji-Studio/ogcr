# Storybook UI Review — OGCR Design System

Visual + polish pass across all 42 component stories, driven through Storybook in the browser.
Reviewed against: design-system token rules (`bg-surface-*`, `text-text-*`, `rounded-12`, `shadow-focus-*`,
`--motion-*` — no hardcoded values), `docs/design-system.md` spec, and a frontend-design quality bar
(typography, spacing rhythm, state coverage hover/focus/disabled/loading, alignment, motion).

**Fix policy:** auto-fix mechanical issues (wrong token, misalignment, broken focus ring, inconsistent
spacing/state); flag judgment calls (brand color choices, color-contrast a11y, layout redesigns) for the user.

**Setup:** Storybook on `http://localhost:6008` (6006 is occupied by Docker). Review live via
`/iframe.html?id=<story-id>&viewMode=story` for isolated component shots.

Status legend: ⬜ not started · 🔄 in progress · ✅ reviewed (no/auto-fixed issues) · 🚩 flagged for user

---

## Results summary — review COMPLETE (42/42)

**5 fixes landed** (all mechanical, auto-fixed; verified in-browser + `tsc -b` / lint / 157 unit tests / token check all green):

1. **`cn.ts` — systemic (HIGH).** Registered the custom font-size scale in tailwind-merge; it was silently dropping `text-<size>` or `text-<color>` whenever both appeared in one className. Repaired Tooltip + latent size/color drops across ~41 components.
2. **NumberField** — stepper `w-44` → `w-48` (44 is an undefined spacing token → rendered 176px, collapsing the input so the value was invisible).
3. **Calendar** — added `relative` to the root so the absolutely-positioned nav chevrons anchor to the calendar instead of flying to the viewport edges (standalone use was broken).
4. **Tooltip** — root cause was the `cn.ts` bug (dark tooltip rendered dark-slate text, ~1.3:1). Fixed by #1.
5. **Toolbar** — `ToolbarSeparator` orientation branches were swapped, so horizontal toolbars rendered full-width horizontal rules; items overflowed off-screen. Swapped branches.

**37 components reviewed clean** (no issues). The system is well-built; the bugs found were a token-fallback footgun (spacing + the tailwind-merge size/color confusion) plus two positioning/orientation slips, not pervasive sloppiness.

**Flagged for your decision** (not auto-changed): see Cross-cutting flags below — brand-token `color-contrast`, the spacing-token lint guard, and the green-vs-navy active/selection split.

---

## Batch 1 — Inputs & basic controls ✅ DONE
| Component | Status | Findings / fixes |
|---|---|---|
| Button | ✅ | Clean. filled/outlined/text heights + tokens correct, disabled 50%, focus ring (`shadow-focus-primary`) good. |
| Input | ✅ | Clean. error/leading-icon/search states correct, `rounded-12`, icon centering good. |
| Textarea | ✅ | Clean. error + no-resize consistent with Input. |
| NumberField | ✅ | **FIXED** — stepper `w-44` rendered 176px (undefined token → Tailwind default 11rem), collapsing the input to 24px so the value was invisible & increment overflowed. Changed to `w-48` (48px square steppers matching `h-48`). Verified: now `[−] US$18.50 [+]` / `[−] 9,999 [+]`. `src/components/NumberField/index.tsx:45`. |
| Checkbox | ✅ | Clean. indeterminate/error/border-left correct. Checked fill is navy (not button-green) — deliberate CTA-vs-selection split, consistent. |
| Radio | ✅ | Clean. group (unselected/navy-selected/disabled) + red error border, consistent with Checkbox. |

## Batch 2 — Selection & date ✅ DONE
| Component | Status | Findings / fixes |
|---|---|---|
| Switch | ✅ | Clean. off/on(green)/error(pink)/disabled all correct. |
| Toggle | ✅ | Clean. Segmented group, selected segment white fill + navy text. |
| Slider | ✅ | Clean. Green fill track, value label aligned, knob ring. |
| Select | ✅ | Clean. Trigger + dropdown excellent — selected row gray highlight + navy checkmark, disabled grayed, chevron flips. |
| Combobox | ✅ | Clean. with-value + error (red border) correct. |
| Calendar | ✅ | **FIXED** — standalone nav chevrons flew to viewport edges: `nav` is `absolute inset-x-0` but the DayPicker root had no `relative`, so it anchored to the wrong ancestor (worked in DatePicker popover only by accident). Added `relative` to root. Verified standalone + range band. `src/components/Calendar/index.tsx:52`. |
| DatePicker | ✅ | Clean. invalid state (red border, asterisk, "A date is required."), popover calendar correct. |

> Consistency note (judgment call): Switch-on / Slider-fill use **green**; Checkbox / Radio use **navy**. Deliberate "active vs. selection" split — flag for your confirmation, not auto-changed.

## Batch 3 — Overlays ✅ DONE
| Component | Status | Findings / fixes |
|---|---|---|
| Dialog | ✅ | Clean. Gray backdrop, white card + shadow, title/description, close X, footer (green primary + outlined Cancel). |
| AlertDialog | ✅ | Clean. Danger variant red primary, no close-X (forces choice). |
| Popover | ✅ | Clean. Title + body card, rounded, shadow. |
| Tooltip | ✅ | **FIXED (root cause systemic — see cn.ts below).** Dark navy tooltip rendered dark-slate text (~1.3:1, unreadable). `text-surface-light` was being stripped by `cn()`. Now crisp white. `src/components/Tooltip/index.tsx`. |
| Menu | ✅ | Clean. Uppercase muted group labels, icon+label items, separators. |
| ContextMenu | ✅ | Clean. Header + "3 selected" badge, icon items, red destructive "Archive". |
| Sidesheet | ✅ | Clean. Right-slide panel, back+close header, status pill, sticky footer. |

## Batch 4 — Navigation & disclosure ✅ DONE
| Component | Status | Findings / fixes |
|---|---|---|
| Navigation | ✅ | Clean. Top bar, "Overview" selected (green pill), icon items, bell action. |
| SideNavigation | ✅ | Clean. Group expand, "Parcels" selected (green left-accent), count badges, user footer. |
| Breadcrumb | ✅ | Clean. Chevron separators, current page navy. |
| Tabs | ✅ | Clean. Green underline indicator, icon+label tabs. |
| Pagination | ✅ | Clean. Page 6 green-filled, ellipsis gaps, prev/next arrows. |
| Toolbar | ✅ | **FIXED** — `ToolbarSeparator` orientation branches were swapped. Base UI sets `data-orientation` to the line's own direction (horizontal toolbar → `vertical` divider), but the CSS mapped `vertical`→`w-full h-px` (a full-width horizontal rule), stretching the toolbar across the viewport and pushing items off-screen. Swapped the two branches. Verified both horizontal (vertical dividers) and vertical (horizontal divider). `src/components/Toolbar/index.tsx:113`. |
| Accordion | ✅ | Clean. Expand/collapse chevron, separators, content. |
| Collapsible | ✅ | Clean. Trigger + chevron + content. |

## Batch 5 — Data display ✅ DONE (all clean)
| Component | Status | Findings / fixes |
|---|---|---|
| Table | ✅ | Clean. Sortable headers w/ indicators, right-aligned numerics, colored status pills, dashed row separators. |
| Card | ✅ | Clean. Title/subtitle + trailing pill alignment correct. |
| Kpi | ✅ | Clean. 2×2 grid, colored top-accent per tone, status pills, big number + sub-label. |
| Avatar | ✅ | Clean. 5 sizes scale correctly, navy circle + white initials. |
| Pill | ✅ | Clean. 4 tones (neutral/verified/in-review/flagged). Brand-tone contrast → cross-cutting flag. |
| ProgressBar | ✅ | Clean. 4 tones, label + % + colored fill. |
| Message | ✅ | Clean. neutral/success/warning/error banners, icon + tint + action. Brand-tone contrast → cross-cutting flag. |

## Batch 6 — Foundations & feedback ✅ DONE (all clean)
| Component | Status | Findings / fixes |
|---|---|---|
| Form | ✅ | Clean. Multi-section (I/II/III markers), radio cards, checkbox, footer actions + required-fields caption. |
| Skeleton | ✅ | Clean. Avatar + text-line + image placeholders, shimmer. |
| Toast | ✅ | Clean. Bottom-right stack, colored left-accent per tone, icon/title/desc/action/close. |
| Separator | ✅ | Clean. Centered "or" label with flanking rules. |
| ScrollArea | ✅ | Clean. Scrollable item list, rounded container. |
| Logo | ✅ | Clean. 3 sizes scale, mark + navy/green wordmark. |
| Icons | ✅ | Clean. Full labeled grid (25 glyphs), consistent stroke. |
| Theming | ✅ | Clean. `--ds-*` seam override works (default green → purple on wrapper). |

---

## 🔴 Systemic fix landed — `cn()` was dropping font-size/color classes (HIGH impact)

`src/lib/cn.ts` called bare `twMerge` with no config. The DS renames the font-size scale
(`text-xs`/`text-s`/`text-m`/…), which tailwind-merge doesn't recognise — so it couldn't tell a
font-size (`text-s`) from a text-color (`text-surface-light`/`text-text-primary`) and treated them as
one conflicting `text-*` group, **silently dropping whichever class came first.** Proven with the
project's own tailwind-merge:
- `"text-s text-surface-light"` → `"text-surface-light"` (font-size lost)
- `"text-surface-light text-s"` → `"text-s"` (**color lost** — this broke the Tooltip)

41 components combine a text-size + text-color in one `cn()` string, so this affected font sizes and/or
colors **system-wide** (e.g. Button rendered 16px instead of `text-s`=14px; Tooltip lost its light text).
**Fix:** `extendTailwindMerge` to register the custom font-size scale. Verified: both classes now survive,
Tooltip text is white, Button is 14px + correct color, `tsc -b` passes. This is a pure correctness fix
(size & color are different CSS properties — keeping both is always right; two same-property classes still
resolve last-wins). Recommend a visual regression sweep on consumers, since many components' text now
renders at their intended size where it previously fell back.

## Cross-cutting flags (need user decision)

- **Spacing-token fallback footgun (systemic, low residual risk).** The spacing scale defines only
  `{0,1,2,4,6,8,10,12,16,20,24,28,32,36,40,48,56,64,72,80,96,128,160,192,256,320}` (px). Any utility
  using a value *outside* this set (e.g. `w-44`, `p-44`) silently falls back to Tailwind's default
  `n×0.25rem` = `n×4px` — 4× too large — with no build error. This caused the NumberField bug.
  Repo-wide scan after the fix is **clean** (no other offenders). _Optional hardening:_ a lint/CI guard
  that rejects spacing utilities outside the scale would prevent regressions. Awaiting user call.
- **`color-contrast` on brand tokens (known, pre-existing).** `text-secondary` labels/helper text on the
  cream `surface-page`, and green `interaction-primary` on light tints, are borderline on WCAG AA. This is
  the documented backlog item blocking the a11y gate flip to `'error'`. Needs a palette decision — not
  fixing per-component. (CLAUDE.md already tracks this.)
