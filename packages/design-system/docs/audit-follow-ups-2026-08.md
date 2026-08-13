# Audit follow-ups — 2026-08

Backlog left behind by the 2026-08 design-system audit and remediation pass. Everything here was
found, verified, and deliberately **not** done in that pass — either because it needs a decision,
because it belongs in Figma rather than in code, or because it is app-side adoption work that the
library change does not block.

The spec itself (`docs/design-system.md`) is now reconciled with the code; nothing below is a
documentation gap. Component-level pickups and the Base UI wrapper-alignment workstream are
tracked separately in `docs/component-pickups-plan.md`.

Ground truth for token values is the Figma file `2P6XrQJhT8I39IR5LGK7RT` (OGCR – Design System),
read variable-by-variable on 2026-08-13.

---

## 1. Fix in Figma, not in code

Seven defects in the Figma file, plus one cosmetic mismatch. Each was checked against the variable
collections and each is **deliberately not imported** — importing any of them would put the defect
into the shipped palette. Nobody should "fix" the code to match.

1. **`border/neutral-light` duplicates `border/light`** — byte-for-byte (`#e7e5e4`, both stone/200).
   The 2026-08 pass imported ten of the eleven missing semantic colors and skipped this one; both
   `palette.css` and `theme.css` carry a comment saying so.
2. **`font/family/Mono` is spelled `"JetBRains Mono"`** — a typo in the value. Code has it right.
3. **Stray `italic` variable** duplicating `font/style/italic`, and unscoped (`ALL_SCOPES`).
4. **Orphan `body/body-s/{font-family,font-style,size} 2` triplet.** Its `size 2` bumps to 18 at
   desktop while the canonical `body/body-s/size` stays 14. One of the two is wrong; code follows
   the canonical flat-14 version.
5. **`labels/button/size` and `labels/navigation/size` ladder 14 → 18 → 18 → 14** — labels that
   grow on tablet/desktop and shrink again at `large` read as a mode-authoring error. Code ships
   flat 14 at mobile with a desktop bump to 18 (see §2.2 — the bump is probably wrong too).
6. **`title/heading-{1,2,3,4}/font-family` in the `mobile` mode alone aliases `font/family/headings`**,
   a variable that does not exist in the local `typography` collection. It still resolves to Inter,
   so there is no visual consequence — but it is a dangling reference.
7. **`brand-blue/300` (`#3f88c6`) breaks the ramp's monotonicity.** 200 is `#c3daed` (very pale),
   300 jumps to a fully saturated mid-blue that duplicates `complementary-blue`, then 400–900
   resume a normal ramp from a *lighter* base. Any "use step N" rule misbehaves here.
8. *(Not a defect, just noted.)* **`corner-radius/full` is `999`** where the code ships `9999px`.
   Both mean "pill" and there is no visual difference; aligning them only makes a future
   variable-vs-token diff read clean.

---

## 2. Deferred features

Each is fully specified on the Figma side and structurally ready in code. None was in scope.

### 2.1 Dark mode

Figma defines a complete second mode (`dark`) for **all 47 product semantic colors**;
`palette.css` declares a single `:root` block. The architecture is ready — the `--ds-*` seam
exists, every color utility references it rather than baking a hex, and the palette now rides
`@layer theme` so an app-side override wins. Implementing it is a mechanical
`@media (prefers-color-scheme: dark)` + `[data-theme="dark"]` block over the same 47 names.
`reset.css` also hard-codes `color-scheme: light` — flip that in the same change.

### 2.2 Responsive typography ladder (4 modes)

Figma's `typography-styles` collection carries mobile / tablet / desktop / large values for 9 of
13 styles; `global.css` hard-codes a single 1024px breakpoint bump. Two things to settle together:

- The tablet and large columns are simply not implemented.
- Three existing desktop bumps are suspect and moved as a side effect of the `--text-m` fix:
  `.text-body-s`, `.text-label-button` and `.text-label-navigation` all point at `var(--text-m)`
  and therefore went 16 → 18px. Figma says `body-s` is flat 14 at every breakpoint, and calls the
  `labels/*` ladder an authoring error (§1.5). All three bumps are probably wrong and should
  likely be removed — but that is the ladder work, so they were left rather than half-fixed.

### 2.3 `bg-blur` effect style

Figma effect style `bg-blur` (`BACKGROUND_BLUR`, radius 16). No `backdrop-blur` token exists in
code. (`SideNavigation`'s mobile drawer uses an ad-hoc 2px blur — see §3.2.)

### 2.4 Smaller token gaps, same origin

- **Weight-variant text styles.** Figma ships `-medium` / `-bold` siblings for six body sizes;
  code ships one weight per semantic token and expects `font-medium` / `font-bold` utilities
  (both safelisted). Fine as a policy, but it should be a *stated* policy or the variants should
  be built.
- **`--text-body-xs`** (Figma `body/body-xs`, 10px/100%) and a **`mono-s`** text token — the
  `--text-xs` and `--font-mono` primitives exist, the semantic tokens do not.
- **Two known value drifts** not fixed because they were outside the brief: `label-nav`
  letter-spacing is 2% where Figma says 10%, and `body/quote` line-height is 1.4 where Figma says
  1.5. Decide which side is right — 10% tracking on nav labels looks like a lot.
- **Gradients and layout grids.** Four `Gradient-*` paint styles and four breakpoint grid styles
  exist in Figma with no code counterpart.

---

## 3. Known debt in the library

### 3.1 Three components still carry raw rgba shadows

`Switch` and `Slider` (thumb, `rgba(68,51,33,0.16)`) and `Toggle` (pressed segment,
`rgba(68,51,33,0.12)`) hard-code their shadows as arbitrary values. The tokens they should use
now exist — **`--shadow-control`** and **`--shadow-control-pressed`**, same ink, same stops — and
are shipped and safelisted. The swap is a one-line change per component; it was not made because
those components were frozen during that pass (a different agent owned them). Until then the
three files sit on the `check:colors` exemption list as explicit DEBT entries.

Note the naming was chosen deliberately: these are **not** `--shadow-elevation-s/-xs`. Figma has
exactly one elevation step, and inventing an `s` would also silently validate the farmer app's
existing `shadow-elevation-s` usage with a control-sized shadow where a card-sized one was meant
— turning a loud missing-class bug into a quiet wrong-shadow bug.

### 3.2 Two scrims that disagree

`SideNavigation`'s mobile drawer paints `rgba(15,54,85,0.36)` + a 2px backdrop blur; every other
overlay uses the shared `bg-black/40` from `lib/overlay/chrome.ts`. Different color, different
alpha, different blur. Picking one is a design decision, not token plumbing —
`bg-surface-strong/36` would tokenize the SideNavigation one if that is the wanted look, or the
drawer adopts the shared scrim. Also on the `check:colors` DEBT list.

### 3.3 ProgressBar's `aria-label` is inert when a visible label is present

`ProgressBar` passes `aria-label={rest['aria-label'] ?? label}`, but when `label` is set the
visible label element is also wired as `aria-labelledby` — which wins. So the `aria-label`
fallback does nothing in exactly the case it was written for. Harmless today (both resolve to the
same string), but the redundant fallback should be dropped so the naming path is obvious.
Documented as-is in spec §4.7.

### 3.4 `--shadow-focus-secondary` is shipped but unused

The secondary focus ring is now genuinely distinct from the primary one (brand-blue vs green,
matching the split Figma draws between the two button tiers), and it ships in `dist/styles.css`
— but no component consumes it. Either a secondary-tier control should adopt it, or it should be
documented purely as a consumer-facing token. Spec §1 currently says the latter.

### 3.5 The a11y color-contrast gate is still `test: 'todo'`

`.storybook/preview.tsx` keeps the axe `color-contrast` rule non-blocking. Structural a11y is
clean and should stay that way; roughly 79 stories still fail contrast on Figma-sourced brand
tokens. This is blocked on a palette decision, not on code — the same decision that gates
`Calendar`'s `today`/`selected` treatment. Nothing else in the audit can close it.

### 3.6 Base UI peer range

`peerDependencies` accepted `^1` while the wrappers are built against 1.5 behavior. The floor has
been raised to `^1.5.0`; keep it in step with the version the wrappers actually rely on. Tracked
alongside the wrapper-alignment items in `docs/component-pickups-plan.md`.

### 3.7 Residual code-vs-spec disagreements from the docs reconciliation

Found while rewriting the spec against source; each needs a small design call or a targeted fix:

- **Focus indicators**: SideNavigation rows use an outline while its chrome buttons use the shared
  ring; ContextMenu/Menu items have *no* focus ring at all — their `surface-neutral` highlight is
  ~1.05:1, which the spec's own focus policy would reject.
- **`--shadow-focus-secondary`** now ships with a distinct color but no component consumes it yet
  (see 3.4) — decide which controls take the secondary ring.
- **Message**: action/close buttons use `border-current` instead of the documented
  `--message-action-border` `-light` tokens, and the action Button renders 48px next to a 40px
  close button.
- **`--text-m` at 18px** also grew table cells, input text, and card/message/popover titles; the
  token value is right per Figma, but audit whether some of those belong on `text-s`.
- **Toolbar**: no story exercises the ToggleGroup prop/ref projection the spec now documents.

---

## 4. App-side adoption sweep (farmer-prototype)

Deliberately deferred: none of this is required for the library change to land, and doing it
inside the same pass would have mixed a library diff with an app diff. Paths are relative to
`apps/farmer-prototype/`.

### 4.1 Must-fix (behavior changes, not cleanups)

- **`--spacing` is now pinned to `1px`.** Any numeric spacing utility the app's *own* Tailwind
  generates lands on the px scale: `p-4` is 4px, not 16px; `gap-6` is 6px, not 24px. Sweep numeric
  spacing classes app-wide. Arbitrary values (`p-[16px]`) and keyword values (`w-full`) are
  unaffected.
- **`--text-m` is 18px**, so `text-body` / `h4` / anything on `text-m` grew 2px. Expect reflow;
  check dense rows and fixed-height chrome.
- **`shadow-elevation-s` does not exist** and never did — it has been rendering nothing wherever
  the app uses it. Replace with `shadow-elevation-l` or `shadow-control`.
- **Design-system utilities now lose to app utilities at equal specificity.** This is the fix for
  responsive layout in consumer apps, but if any screen was (accidentally) relying on a library
  class beating its own `sm:`/`lg:` variant, that stops.

### 4.2 Retire hand-rolled clones (the library now covers them)

- **`Button fullWidth`** replaces `className="w-full"` at ~10 sites: `auth/login-form.tsx`,
  `personas/farmer/enrollment-approval.tsx` (×2), `personas/farmer/rail-overview.tsx` (×3),
  `personas/farmer/earning-route-button.tsx`, `personas/supplier/supplier-rail.tsx`,
  `programs/program-dossier.tsx`, `scope-3-prototype/flow-shell.tsx`.
- **`Button iconOnly` + `shape="circle"`** replaces the hand-built FAB in
  `scope-3-prototype/flow-shell.tsx` — drop `h-48 w-48 rounded-full p-0`, keep the positioning and
  `shadow-elevation-l`.
- **`Button size`** — anything that relied on `variant="text"` being 32px tall is now 40px. Pass
  `size="s"` where the dense height is wanted; likeliest spots are `map/map-controls.tsx`,
  `navigation/*`, `scope-3-prototype/flow-shell.tsx`.
- **`Kpi icon` + `accentBar={false}`** replaces `personas/farmer/dashboard-stat.tsx` entirely —
  that component *is* a Kpi with an icon and no accent bar, and its "deliberately not the design
  system Kpi" comment is now obsolete. Migrate its call sites in `farmer-kpi-row.tsx` and
  `supplier-kpi-row.tsx`; `shared-ui/index.tsx` `StatRow` can pass `icon` through.
- **`Pill tone="progress"` + `dot`** replaces the `EXTRA_CLASS` override and inline-style dot in
  `personas/farmer/state-pill.tsx`. Keep `leading` for states whose colour intentionally diverges
  from the tone.
- **`Card padding="l"`** replaces the `Panel` wrapper in `shared-ui/index.tsx`, which exists only
  to force 24px over Card's 16px; same check for `scope-3-prototype/shared-ui.tsx`.
- **`Popover width="l"`** replaces the width overrides in `navigation/account-switcher.tsx` and
  `scope-3-prototype/flow-shell.tsx`.
- **`Navigation` / `SideNavigation` with `href` / `render`** — `navigation/persona-top-nav.tsx`,
  `farmer-top-nav.tsx`, `persona-sidebar.tsx` and `sidebar.tsx` were hand-rolled *because* library
  nav items were button-only. They can now use the real components with
  `render={<Link href="…" />}` per item. Biggest single reduction available in the app.
- **`LogoMark`** wherever the app hand-builds a mark.

### 4.3 Import hygiene

- **21 files import from `@phosphor-icons/react/dist/ssr` directly** and can use the library
  re-exports instead (`items/item-list.tsx`, `map/*`, `navigation/*`, `personas/*`,
  `programs/program-dossier.tsx`, `projects/project-list.tsx`, `scope-3-prototype/*`).
  `import type { Icon }` becomes `PhosphorIcon` from the library.
  **Caveat:** the app imports the SSR entry; the library re-exports the CSR entry and every
  library component is `'use client'`. Migrating an icon used inside a Server Component needs a
  client boundary — spot-check per file rather than sweeping blind.
- **Local `cn()` copies** in the app should import the library's dependency-free `/cn` deep entry.
