# OGCR Design System

Self-contained spec. Rebuild in any stack from this file alone. Reference React code in `src/components/` is one valid implementation; CSS below is the source of truth.

Two qualifications on "this doc wins over Figma", both learned the hard way in the 2026-08 audit:

- **Token *values* come from Figma.** The variable collections in the Figma file are ground truth for hexes, sizes and scales; this doc drifted from them and the code did not. Where the code deliberately departs — the focus rings — it is called out as policy, with the reason.
- **Component *anatomy and behavior* come from this doc**, and the doc is kept honest against the code. Everything below has been verified against `src/`; where a section describes something the code no longer does, the code is the bug.

Open follow-ups (Figma-side defects, deferred features, known debt, app-side adoption) live in `docs/audit-follow-ups-2026-08.md`.

---

## 1. Tokens

CSS custom properties, scoped to `:root`. All component CSS below assumes these.

```css
:root {
  /* Brand */
  --brand-blue-300: #3f88c6;
  --brand-blue-800: #1c3d59;
  --brand-green-500: #6db087;

  /* Primitives */
  --red-500: #ef4444;
  --red-600: #dc2626;
  --orange-400: #fb923c;
  --orange-500: #f97316;
  --amber-300: #fcd34d;
  --yellow-300: #fde047;
  --white: #ffffff;

  /* Text */
  --text-primary: #0f3655;
  --text-secondary: #6a8196;
  --text-neutral: #334155;
  --text-positive: #4f8263;
  --text-negative: #b91c1c;
  --text-warning: #c2410c;
  --text-progress: #265277;

  /* Icon (mirrors text scale) */
  --icon-primary: #0f3655;
  --icon-secondary: #6a8196;
  --icon-neutral: #334155;
  --icon-positive: #4f8263;
  --icon-negative: #b91c1c;
  --icon-warning: #c2410c;
  --icon-progress: #265277;
  /* `-light` tier — use these, not the raw primitives they alias. */
  --icon-positive-light: #6db087;
  --icon-negative-light: #ef4444;
  --icon-warning-light: #f97316;
  --icon-progress-light: #326d9e;

  /* Surface */
  --surface-page: #f8f3ef;
  --surface-light: #ffffff;
  --surface-neutral: #f5f5f4;
  --surface-strong: #0f3655;
  --surface-inverted: #443321;
  --surface-positive: #e2efe6;
  --surface-warning: #ffedd5;
  --surface-negative: #fee2e2;
  --surface-progress: #e2edf6;

  /* Border */
  --border-light: #e7e5e4;
  --border-medium: #d6d3d1;
  --border-strong: #a8a29e;
  --border-high-contrast: #443321;
  --border-positive-light: #c5dfce;
  --border-warning-light: #fed7aa;
  --border-negative-light: #fecaca;
  --border-negative-strong: #dc2626;
  --border-neutral-strong: #57534e;
  --border-positive-strong: #5e9975;
  --border-warning-strong: #ea580c;
  --border-default: #01012e14;          /* code-only — see "Code-only tokens" below */

  /* Interaction */
  --interaction-primary-default: #4f8263;
  --interaction-primary-hover: #335641;
  --interaction-primary-active: #335641;
  --interaction-primary-focus: #e2efe6;
  --interaction-secondary-default: #ffffff;
  --interaction-secondary-hover: #1c3d59;
  --interaction-secondary-active: #1c3d59;
  --interaction-secondary-focus: #c3daed;
  --interaction-tertiary-active: #e2efe6; /* code-only — see below */

  /* Focus rings — two-stop by design, see "Focus rings" below */
  --focus-primary:
    0 0 0 2px var(--surface-light),
    0 0 0 4px var(--interaction-primary-default);
  --focus-secondary:
    0 0 0 2px var(--surface-light),
    0 0 0 4px var(--interaction-secondary-active);
  --focus-error:
    0 0 0 2px var(--surface-light),
    0 0 0 4px var(--icon-negative);

  /* Spacing */
  --space-none: 0;
  --space-2xs: 4px;
  --space-xs: 8px;
  --space-s: 12px;
  --space-m: 16px;
  --space-l: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 80px;
  --space-5xl: 120px;
  --space-6xl: 160px;

  /* Radius */
  --radius-none: 0;
  --radius-xs: 2px;
  --radius-s: 4px;
  --radius-m: 8px;
  --radius-l: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Border width */
  --border-width-s: 1px;
  --border-width-m: 1.5px;
  --border-width-l: 2px;

  /* Elevation — exactly one step, by design */
  --elevation-l:
    0 0 2px 0 rgba(68, 51, 33, 0.08),
    0 8px 16px 0 rgba(68, 51, 33, 0.16);

  /* Control shadows — NOT elevation steps (see "Elevation" below) */
  --shadow-control: 0 1px 2px 0 rgba(68, 51, 33, 0.16);
  --shadow-control-pressed: 0 1px 2px 0 rgba(68, 51, 33, 0.12);

  /* Typography */
  --font-family-default: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-family-display: 'Helvetica Now Display', system-ui, -apple-system, sans-serif;
  --font-family-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;

  --font-size-xs: 10px;
  --font-size-s: 14px;
  --font-size-m: 18px;
  --font-size-l: 20px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;
  --font-size-3xl: 40px;
  --font-size-4xl: 48px;
  --font-size-5xl: 64px;
  --font-size-xxs: 12px;   /* code-only, no Figma counterpart */

  /* Motion */
  --motion-fast: 150ms ease-out;
  --motion-base: 200ms cubic-bezier(0.2, 0, 0, 1);
}
```

Token rules:
- `interaction-primary-hover` and `interaction-primary-active` resolve to the same color (`#335641`, brand-green/900). Differentiate active from hover via elevation/border/transform, not fill.
- **Active-control green vs. selection navy is intentional — do not "unify" it.** Controls that toggle a *state* (Switch on, Slider fill) use the brand green `interaction-primary-default` (`#4f8263`); controls that mark a *selection* (Checkbox, Radio checked fill/border) use navy `icon-primary` (`#0f3655`). Error states override both with `icon-negative`. The split signals "active behaviour" vs. "chosen item" and is consistent across the set; a future change should preserve it rather than collapse the two onto one accent.
- `radius-l` is **12px** here (Figma sometimes labels 16). Code wins.
- `--text-secondary` on `--surface-light` is borderline WCAG AA (~4.5:1). Audit small text.
- No motion tokens beyond `--motion-fast` / `--motion-base`. Hover/state ≤150ms; layout/size ≤200ms; never >300ms in-place feedback.
- The **`progress` family** (`text` / `icon` / `surface` / `icon-progress-light`) is the blue "in flight / informational" ramp. It is *not* interchangeable with `positive`: `--icon-positive` is `#4f8263`, the same green as `--interaction-primary-default`, so anything that wants blue must say `progress`.

### Size ladder — the one value that moved

`--font-size-m` is **18px** (Figma `font/size/m`). It used to be 16px, the only wrong step in the whole ladder, and both `--text-h4` and `--text-body` dereference it — so **body copy and h4 grew 2px system-wide.** Expect reflow when adopting. Everything else on the ladder (10 / 14 / 20 / 24 / 32 / 40 / 48 / 64) was already correct.

### Focus rings — an approved deviation from Figma

Figma draws all three focus effects as a **single 3px ring** in the pale `*-focus` tint. Those tints read 1.0–1.2:1 against `--surface-page` and would be effectively invisible, so the design system deliberately ships a **two-stop ring** instead: an inner 2px `--surface-light` halo (breathing room, no `outline-offset` needed) plus a visible 4px ring in the solid tone from the same family, which clears the 3:1 non-text contrast minimum of **WCAG SC 2.4.11 (Focus Appearance)**.

| ring | 4px stop | used by |
| --- | --- | --- |
| `--focus-primary` | `--interaction-primary-default` (green `#4f8263`) | every focusable control in the library today |
| `--focus-secondary` | `--interaction-secondary-active` (brand-blue `#1c3d59`) | reserved for secondary-tier controls; declared and shipped, not yet consumed in-library |
| `--focus-error` | `--icon-negative` (red `#b91c1c`) | inputs, checkbox, radio in their error state |

This is policy, not drift: Figma will keep disagreeing, and the code wins. Two consequences worth knowing:

- `--focus-secondary` used to be a byte-for-byte copy of `--focus-primary`, which collapsed the green/blue split Figma draws between the two button tiers. It is now genuinely distinct. Figma's `interaction/secondary-default` is white and unusable as a ring, so the tier's solid blue carries it.
- There is **no `--focus-ring-error` color token.** It existed, referenced nothing, and was removed; use `--focus-error` (the full shadow) instead. The pale `*-focus` tints remain in the palette as background washes (e.g. the SideNavigation active row), not as rings.

### Elevation — one step, by design

Figma defines exactly **one** elevation effect style (`elevation/l`), and `--elevation-l` matches it stop-for-stop (`#443321` = `rgb(68,51,33)`). There is no `s`/`m`/`xs` elevation and none should be invented without a Figma effect style to match — **`shadow-elevation-s` does not exist and never will**; a class name like that silently produces nothing.

`--shadow-control` / `--shadow-control-pressed` are the 1px lift on a Switch/Slider thumb and a pressed Toggle segment. They are code-side *control* shadows, not elevation steps, and are named apart so they can never be mistaken for one.

### Code-only tokens (no Figma provenance)

Two color tokens exist in code with no counterpart anywhere in the Figma variable collections. Both are kept because something still consumes them; **do not reach for them in new components**:

- `--border-default` (`#01012e14`) — looks imported from another system.
- `--interaction-tertiary-active` (`#e2efe6`) — Figma has no `tertiary` interaction tier at all.

`--font-size-xxs` (12px) is likewise code-only. Two further runtime-only tokens paint the scrollbar (`--ds-scrollbar-track`, `--ds-scrollbar-thumb`, the latter aliasing `--ds-border-medium`) so the reset never hard-codes a color, and two carry the stacking order (`--ds-z-overlay: 50`, `--ds-z-toast: 100`).

One Figma token is deliberately **not** imported: `border/neutral-light` is a byte-for-byte duplicate of `border/light` — a Figma-side defect, tracked in `docs/audit-follow-ups-2026-08.md`, not a gap in the code.

### Base reset

```css
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: var(--font-family-default);
  font-size: var(--font-size-m);
  line-height: 1.5;
  color: var(--text-neutral);
  background: var(--surface-page);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-synthesis: none;
}
button { font-family: inherit; }
```

Body copy is `--font-size-m`, so it is **18px**, not the 16px this reset used to imply.

### Token names in the shipped build

The names above are the spec's own. The published stylesheet expresses the same tokens through Tailwind v4 namespaces, and it is worth knowing the mapping when reading component code:

| spec | shipped | note |
| --- | --- | --- |
| `--surface-page` | `--color-surface-page` → `var(--ds-surface-page)` | every color is a two-hop reference; see below |
| `--space-m` (16px) | `--spacing-16` | the shipped scale is numeric-px, not t-shirt |
| `--radius-l` (12px) | `--radius-12` | same |
| `--font-size-m` | `--text-m` | plus semantic multi-prop tokens `--text-h1`…`--text-label-input` |
| `--elevation-l` | `--shadow-elevation-l` | `--shadow-control`, `--shadow-control-pressed` alongside |
| `--focus-primary` | `--shadow-focus-primary` | `-secondary`, `-error` likewise |
| `--border-width-m` | `--border-width-m` | utility is **`border-w-m`**, not `border-m` — `border-l` already means border-left-width in Tailwind |

Utility names drop the namespace prefix: `bg-surface-page`, `p-16`, `rounded-12`, `text-h1`, `shadow-elevation-l`, `border-w-m`.

### Theming: the `--ds-*` seam

Every **color** token is a `var(--ds-*)` reference into a runtime palette; that palette is the only place a brand hex appears. Because the reference (not the hex) is baked into each utility, overriding a `--ds-*` custom property on any scoping element — `:root`, a wrapper `div`, a `.dark` class — retints every utility and focus shadow that derives from it, with no rebuild. A build gate fails if any color utility re-bakes a literal.

Radius, spacing, border-width, font and elevation tokens stay literal by design (no brand-variance need yet); moving them onto the seam later is the same mechanical step.

Adding a token is **two edits, not one**: declare it in the theme, and pin it in the shipped-utility safelist. A token added to the theme and forgotten in the safelist is a build failure, not a silent hole — see below for why.

A **dark palette is not implemented.** Figma fully specifies a second mode for all 47 product semantic colors; the architecture is ready for it and the values are recorded in `docs/audit-follow-ups-2026-08.md`.

### Consuming the shipped stylesheet

Import order stays what it always was — your own Tailwind first, the design system last:

```css
@import "tailwindcss";
@import "@majistudio/ogcr-design-system/styles.css";
```

Beyond that there are four things a consuming app must know. All of them are recent, and two are behaviour changes.

1. **Every declared token now ships — as a variable *and* as a utility.** The stylesheet is compiled once at publish time by a JIT compiler, so it used to contain only what the library's own components happened to use: `bg-surface-progress` or `var(--spacing-160)` were documented, visible in the token gallery, and produced nothing in a consumer app. The theme block is now emitted in full, and a safelist pins the utility surface (`bg-`/`text-`/`border-` for every color, `fill-`/`stroke-` for the icon tier, the padding/margin/gap/space/size/inset families over every spacing step, every radius variant, every text size, the families/weights, the shadow tokens, `border-w-{s,m,l}`). A build gate asserts the two sets agree.

2. **Design-system utilities now LOSE to yours at equal specificity.** Everything the library ships is inside a *nested* cascade layer, `@layer utilities.ogcr-ds`. Per CSS Cascade 5, rules in a nested sub-layer always lose to their parent layer's own unlayered rules — so your `sm:flex` beats our `.hidden`, in either stylesheet order, and you have to declare nothing. Before this, both sheets landed in a flat `@layer utilities`, layer sorting was a no-op, and the later-loaded library silently beat every responsive variant an app wrote. The library's utilities still outrank `base`/preflight, so only the *consumer* outranks them. Nothing the library ships is unlayered any more — which also means an app's plain `:root { --ds-…: … }` override finally wins (the palette rides `@layer theme`).

3. **`--spacing` is pinned to `1px` globally.** Tailwind keeps a dynamic fallback alive: any `p-<n>` with no matching token resolves to `calc(var(--spacing) * n)`. Stock Tailwind sets `.25rem`, so an app's own `gap-6` meant 24px while this scale means 6px — a silent 4× on every class the app wrote itself. Pinning the multiplier makes the dynamic path agree with the px scale. **This rescales existing app markup that used the stock 4px-step scale: `p-4` is 4px now, not 16px.** Sweep numeric spacing classes during adoption; arbitrary values (`p-[16px]`) and keyword values (`w-full`) are unaffected.

4. **Two sizes moved.** `--font-size-m` went 16 → 18px, taking `--text-h4` and `--text-body` with it (see above), so body copy and h4 grew 2px. And `shadow-elevation-s` never existed — if an app is using it, it has been rendering nothing; use `shadow-elevation-l` or `shadow-control`.

5. **Variants: a curated set ships precompiled; the `./theme` export covers the rest.** The safelist pins the state variants the interaction model implies (`hover:`/`focus-visible:`/`active:`/`disabled:` across the interaction tier, plus the hover/disabled forms of the surface/text/icon/border families). Any variant beyond that — `group-hover:`, responsive prefixes on color utilities, `data-[…]:` — can't exist in a precompiled sheet. For full native generation, import the token source into your own Tailwind build instead:

   ```css
   @import "tailwindcss";
   @import "@majistudio/ogcr-design-system/theme"; /* @theme tokens + --ds-* palette */
   @import "@majistudio/ogcr-design-system/styles.css";
   ```

   With `./theme` imported, your compiler generates any utility × any variant from the real scale, and the precompiled safelist becomes a fallback rather than the ceiling.

---

## 2. Typography utilities

Mobile/tablet sizes; `@media (min-width: 1024px)` shifts to desktop sizes. Headings use weight 500 (not 700, despite "Bold" labels in older Figma).

```css
.text-h1 { font-family: var(--font-family-default); font-weight: 500; font-size: var(--font-size-2xl); line-height: 1.2; }
.text-h2 { font-family: var(--font-family-default); font-weight: 500; font-size: var(--font-size-xl); line-height: 1.2; }
.text-h3 { font-family: var(--font-family-default); font-weight: 500; font-size: var(--font-size-l); line-height: 1.2; }
.text-h4 { font-family: var(--font-family-default); font-weight: 500; font-size: var(--font-size-m); line-height: 1.2; }
.text-lead { font-family: var(--font-family-default); font-weight: 400; font-size: var(--font-size-l); line-height: 1.5; }
.text-body-l { font-family: var(--font-family-default); font-weight: 400; font-size: var(--font-size-l); line-height: 1.5; }
.text-body { font-family: var(--font-family-default); font-weight: 400; font-size: var(--font-size-m); line-height: 1.5; }
.text-body-s { font-family: var(--font-family-default); font-weight: 400; font-size: var(--font-size-s); line-height: 1.4; }
.text-quote { font-family: var(--font-family-default); font-weight: 400; font-style: italic; font-size: var(--font-size-xl); line-height: 1.4; }
.text-label-button { font-family: var(--font-family-default); font-weight: 500; font-size: var(--font-size-s); line-height: 1; letter-spacing: 0.02em; }
.text-label-navigation { font-family: var(--font-family-default); font-weight: 500; font-size: var(--font-size-s); line-height: 1; letter-spacing: 0.02em; }
.text-label-input { font-family: var(--font-family-default); font-weight: 500; font-size: var(--font-size-s); line-height: 1.4; }

@media (min-width: 1024px) {
  .text-h1 { font-size: var(--font-size-3xl); }            /* 40 */
  .text-h2 { font-size: var(--font-size-2xl); }            /* 32 */
  .text-h3 { font-size: var(--font-size-xl); }             /* 24 */
  .text-h4 { font-size: var(--font-size-l); }              /* 20 */
  .text-lead { font-size: var(--font-size-xl); }           /* 24 */
  .text-body-l { font-size: var(--font-size-xl); }         /* 24 */
  .text-body { font-size: var(--font-size-l); }            /* 20 */
  .text-body-s { font-size: var(--font-size-m); }          /* 18 */
  .text-quote { font-size: var(--font-size-2xl); }         /* 32 */
  .text-label-button { font-size: var(--font-size-m); }    /* 18 */
  .text-label-navigation { font-size: var(--font-size-m); }/* 18 */
  /* .text-label-input is flat 14 at every breakpoint — deliberately not bumped. */
}
```

The size primitives are also available on their own (`text-xs` … `text-5xl` in the shipped utility set); `text-xs` is **10px**, not 12 — the smallest primitive on the ladder. `letter-spacing: 0.02em` on the label styles resolves to the 0.28px the components hard-code at 14px.

Three of the desktop bumps above are inherited from an earlier reading of Figma and are **suspect**: Figma keeps `body-s` flat at 14 across all breakpoints, and its `labels/button` / `labels/navigation` ladder (14 → 18 → 18 → 14) shrinks again at the largest breakpoint, which reads as a mode-authoring error. They ship as written today; revisiting them is part of the deferred responsive-ladder work (`docs/audit-follow-ups-2026-08.md`).

Body weights: 400 default, 500 medium, 700 bold. `body/quote` style is italic 400.
`label/*` text is **not** auto-uppercased; encode casing in the source string.

---

## 3. Layout & breakpoints

| Breakpoint | Range (px) | Cols | Margin | Gutter |
| --- | --- | --- | --- | --- |
| Mobile S | 0–319 | 4 | 24 | 16 |
| Mobile L | 320–639 | 6 | 24 | 16 |
| Tablet | 640–1023 | 8 | 32 | 32 |
| Desktop | 1024–1599 | 12 | 32 | 32 |
| Desktop Large | 1600–2560+ | 12 | 64 | 64 |

- Container max-width: 2560. Beyond that, content stays centered.
- Typography scale shifts at the 1024 boundary (mobile+tablet share small; desktop+desktop-large share large).
- Components must work at all four breakpoints.

Spacing conventions:
- Tight stacks: `--space-2xs` (4)
- Icon+label gap: `--space-xs` (8)
- Grouped controls: `--space-s` (12)
- Card sections / outer card padding: `--space-m` (16)
- Section spacing: `--space-xl` (32) and up
- The full Figma gap scale is 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 80 · 120 · 160. The shipped px scale is denser (0 · 1 · 2 · 4 · 6 · 8 · 10 · 12 · 16 · 20 · 24 · 28 · 32 · 36 · 40 · 48 · 56 · 64 · 72 · 80 · 96 · 120 · 128 · 160 · 192 · 256 · 320) because it also serves sizing, not just gaps; the Figma steps are all present in it.

---

## 4. Components

Naming: BEM-ish, prefixed `ogcr-`. Pseudo-HTML shows the DOM the CSS expects. CSS is copy-paste; tokens already declared in §1.

### 4.1 Button

**Variants:** `filled` (default) | `outlined` | `text`
**Size:** `s` 32px | `m` 40px | `l` 48px — optional; defaults per variant (`filled`/`outlined` → `l`, `text` → `m`)
**Modifiers:** `fullWidth`, `iconOnly`, `shape` (`rounded` | `circle`)

```html
<button class="ogcr-button ogcr-button--filled" type="button">
  <span class="ogcr-button__icon" aria-hidden="true"><svg>…</svg></span>
  <span class="ogcr-button__label">Label</span>
  <span class="ogcr-button__icon" aria-hidden="true"><svg>…</svg></span>
</button>

<!-- icon-only: no label span; the name comes from aria-label -->
<button class="ogcr-button ogcr-button--filled ogcr-button--icon-only ogcr-button--circle"
        type="button" aria-label="New record" data-icon-only="true">
  <span class="ogcr-button__icon" aria-hidden="true"><svg>…</svg></span>
</button>
```

```css
.ogcr-button {
  --button-height: 48px;
  --button-padding-x: var(--space-m);
  --button-radius: var(--radius-l);
  --button-bg: var(--interaction-primary-default);
  --button-border: transparent;
  --button-color: var(--surface-page);
  --button-hover-bg: var(--interaction-primary-hover);
  --button-active-bg: var(--interaction-primary-active);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-s);
  height: var(--button-height);
  padding: 0 var(--button-padding-x);
  border-radius: var(--button-radius);
  background: var(--button-bg);
  border: 1px solid var(--button-border);
  color: var(--button-color);
  cursor: pointer;
  transition:
    background-color var(--motion-fast),
    border-color var(--motion-fast),
    box-shadow var(--motion-fast),
    transform var(--motion-fast);
  font-family: var(--font-family-default);
  font-weight: 500;
  font-size: var(--font-size-s);
  line-height: 1;
  letter-spacing: 0.28px;
}
.ogcr-button:hover:not(:disabled) { background: var(--button-hover-bg); }
.ogcr-button:active:not(:disabled) { background: var(--button-active-bg); transform: translateY(1px); }
.ogcr-button:focus-visible {
  outline: none;
  box-shadow: var(--focus-primary);
}
.ogcr-button:disabled { cursor: not-allowed; opacity: 0.5; }

.ogcr-button__icon { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; flex-shrink: 0; }
.ogcr-button__icon > svg { width: 100%; height: 100%; }
.ogcr-button__label { display: inline-flex; align-items: center; white-space: nowrap; }

.ogcr-button--outlined {
  --button-bg: var(--surface-light);
  --button-border: var(--border-medium);
  --button-color: var(--text-primary);
  --button-hover-bg: var(--surface-neutral);
  --button-active-bg: var(--surface-neutral);
}
.ogcr-button--outlined:hover:not(:disabled) { border-color: var(--border-strong); }

.ogcr-button--text {
  --button-height: 40px;
  --button-padding-x: var(--space-s);
  --button-radius: var(--radius-m);
  --button-bg: transparent;
  --button-border: transparent;
  --button-color: var(--text-primary);
  --button-hover-bg: var(--surface-neutral);
  --button-active-bg: var(--surface-neutral);
}

/* Size scale — overrides the variant default when set explicitly. */
.ogcr-button--s { --button-height: 32px; --button-padding-x: var(--space-xs); --button-radius: var(--radius-m); gap: var(--space-xs); }
.ogcr-button--m { --button-height: 40px; --button-padding-x: var(--space-s);  --button-radius: var(--radius-m); gap: var(--space-xs); }
.ogcr-button--l { --button-height: 48px; --button-padding-x: var(--space-m);  --button-radius: var(--radius-l); gap: var(--space-s); }
.ogcr-button--s .ogcr-button__icon,
.ogcr-button--m .ogcr-button__icon { width: 20px; height: 20px; }

/* Modifiers */
.ogcr-button--full-width { width: 100%; }
.ogcr-button--circle { border-radius: var(--radius-full); }
.ogcr-button--icon-only { padding: 0; flex-shrink: 0; }
.ogcr-button--icon-only.ogcr-button--s { width: 32px; }
.ogcr-button--icon-only.ogcr-button--m { width: 40px; }
.ogcr-button--icon-only.ogcr-button--l { width: 48px; }
```

Behavior:
- Both icon slots optional; render only when content provided. Icon box is 24×24 at `l`, 20×20 at `s`/`m`.
- Focus ring is the shared two-stop `--focus-primary` (§1) — 2px `--surface-light` halo + 4px solid green.
- **`size` is optional and per-variant.** `filled` and `outlined` default to `l` (48px); `text` defaults to **`m` (40px)**. The `text` variant used to be 32px, which broke the §8 40×40 minimum hit target on its own; `size="s"` restores the old dense look and is only valid inside a larger padded row.
- `fullWidth` stretches the button to its container — use it instead of a `w-full` class.
- **`iconOnly`** renders a square, label-less button: no label element, `padding: 0`, one icon slot, width locked to the size (32/40/48). The glyph may be supplied as `iconLeft`, `iconRight`, or `children`. The root carries `data-icon-only="true"`.
- **`shape="circle"`** fully rounds the corners. `iconOnly` + `shape="circle"` + `--elevation-l` is the FAB recipe.
- **Type-enforced accessible name.** In the React implementation `ButtonProps` is a union: `iconOnly: true` requires `aria-label` *or* `aria-labelledby`. Omitting both is a compile error, not a lint warning — the first type-level a11y contract in the system. Any reimplementation should enforce the same rule.
- Single-character labels: rely on padding to keep min hit area; do not collapse below 40×40 effective.

### 4.2 Input

**Variants:** none. `error` is a class toggle.

```html
<div class="ogcr-input">
  <label class="ogcr-input__label" for="id-x">Email</label>
  <div class="ogcr-input__field">
    <span class="ogcr-input__icon"><svg>…</svg></span>
    <input id="id-x" class="ogcr-input__control" type="email" placeholder="you@…" aria-describedby="id-x-help" />
    <span class="ogcr-input__icon"><svg>…</svg></span>
  </div>
  <p id="id-x-help" class="ogcr-input__helper">Helper text</p>
</div>
<!-- error: add `ogcr-input--error` to root -->
```

```css
.ogcr-input { display: flex; flex-direction: column; gap: var(--space-2xs); width: 100%; }
.ogcr-input__label {
  font-family: var(--font-family-default); font-weight: 400;
  font-size: var(--font-size-s); line-height: 1.4; color: var(--text-secondary);
}
.ogcr-input__field {
  display: flex; align-items: center; gap: var(--space-s);
  height: 48px; padding: 0 var(--space-m);
  background: var(--surface-light);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-l);
  transition: border-color var(--motion-fast), box-shadow var(--motion-fast);
}
.ogcr-input__field:hover { border-color: var(--border-strong); }
.ogcr-input__field:focus-within {
  border-color: var(--interaction-primary-default);
  box-shadow: var(--focus-primary);
}
.ogcr-input__icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 20px; height: 20px; flex-shrink: 0; color: var(--icon-secondary);
}
.ogcr-input__icon > svg { width: 100%; height: 100%; }
.ogcr-input__control {
  flex: 1 1 0; min-width: 0; height: 100%;
  border: none; outline: none; background: transparent;
  font-family: var(--font-family-default); font-weight: 500;
  font-size: var(--font-size-m); line-height: 1.4; color: var(--text-primary);
}
.ogcr-input__control::placeholder { color: var(--text-secondary); font-weight: 500; }
.ogcr-input__control:disabled { cursor: not-allowed; color: var(--text-secondary); }
.ogcr-input__helper {
  margin: 0;
  font-family: var(--font-family-default); font-weight: 400;
  font-size: var(--font-size-s); line-height: 1.4; color: var(--text-secondary);
}
.ogcr-input--error .ogcr-input__field { border-color: var(--border-negative-strong); }
.ogcr-input--error .ogcr-input__field:focus-within { box-shadow: var(--focus-error); }
.ogcr-input--error .ogcr-input__helper { color: var(--text-negative); }
```

Behavior:
- Label, helper, and either icon are optional.
- Use `aria-describedby` on the input pointing at the helper id.
- Error focus ring is the red-family `--focus-error`, not primary.
- Control has `flex: 1 1 0; min-width: 0` so it shrinks below content width.

### 4.3 Card

**Variants:** `floating` (boolean class) — adds elevation.
**Padding:** `none` | `s` | `m` (default) | `l` — 0 / 12 / 16 / 24px.

```html
<section class="ogcr-card ogcr-card--floating">
  <header class="ogcr-card__header">
    <div class="ogcr-card__titles">
      <h3 class="ogcr-card__title">Title</h3>
      <p class="ogcr-card__subtitle">Subtitle</p>
    </div>
    <div class="ogcr-card__trailing">…</div>
  </header>
  <div class="ogcr-card__body">…</div>
</section>
```

```css
.ogcr-card {
  display: flex; flex-direction: column; gap: var(--space-m);
  padding: var(--space-m);
  background: var(--surface-light);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-xl);
}
.ogcr-card--floating { box-shadow: var(--elevation-l); }
.ogcr-card--padding-none { padding: var(--space-none); }
.ogcr-card--padding-s    { padding: var(--space-s); }
.ogcr-card--padding-l    { padding: var(--space-l); }
.ogcr-card__header { display: flex; align-items: center; justify-content: space-between; gap: var(--space-s); }
.ogcr-card__titles { display: flex; flex-direction: column; gap: var(--space-2xs); min-width: 0; }
.ogcr-card__title {
  margin: 0; font-family: var(--font-family-default); font-weight: 500;
  font-size: var(--font-size-m); line-height: 1.2; color: var(--text-primary);
}
.ogcr-card__subtitle {
  margin: 0; font-family: var(--font-family-default); font-weight: 400;
  font-size: var(--font-size-s); line-height: 1.4; color: var(--text-secondary);
}
.ogcr-card__trailing { display: inline-flex; align-items: center; gap: var(--space-xs); flex-shrink: 0; }
.ogcr-card__body { display: flex; flex-direction: column; gap: var(--space-m); }
```

Behavior:
- Header omits if no title/subtitle/trailing supplied.
- Body omits if no children.
- Trailing typically holds a Pill, segmented control, or icon button.
- `padding` changes only the outer padding; the internal 16px gaps stay put. `l` (24px) is the page-level-panel step — reach for it instead of wrapping a Card in a padding div. The title's heading level is configurable (`headingLevel`, default `h3`) so a Card slots into any document outline.

### 4.4 Checkbox

**Variants (layout):** `inline` (default, no border) | `border-left` | `border-right`
**State props:** `checked: false | true | indeterminate`, `error`, `disabled`.

```html
<label class="ogcr-check ogcr-check--inline ogcr-check--checked">
  <input class="ogcr-check__input" type="checkbox" checked />
  <span class="ogcr-check__box">
    <!-- when checked: -->
    <svg class="ogcr-check__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3.5 8.5 6.5 11.5 12.5 5" />
    </svg>
    <!-- when indeterminate, replace polyline with: <line x1="3" y1="8" x2="13" y2="8" /> -->
  </span>
  <span class="ogcr-check__text">
    <span class="ogcr-check__line1">Label</span>
    <span class="ogcr-check__line2">Secondary</span>
  </span>
</label>
<!-- border-right reverses visual order: place .ogcr-check__text BEFORE .ogcr-check__box -->
```

```css
.ogcr-check {
  display: inline-flex; align-items: center; gap: var(--space-s);
  cursor: pointer; position: relative;
  font-family: var(--font-family-default); font-weight: 500;
  font-size: var(--font-size-s); line-height: 1.4; color: var(--text-primary);
}
.ogcr-check--border-left,
.ogcr-check--border-right {
  align-items: flex-start; width: 240px; padding: var(--space-s);
  background: var(--surface-light); border: 1px solid var(--border-medium);
  border-radius: var(--radius-l);
  transition: border-color var(--motion-fast), box-shadow var(--motion-fast);
}
.ogcr-check--border-left:hover,
.ogcr-check--border-right:hover { border-color: var(--border-strong); }

.ogcr-check__input {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; border: 0;
  clip: rect(0 0 0 0); overflow: hidden; white-space: nowrap;
}
.ogcr-check__box {
  display: inline-flex; align-items: center; justify-content: center;
  width: 16px; height: 16px; flex-shrink: 0;
  background: var(--surface-light);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-s);
  color: var(--surface-light);
  transition:
    background-color var(--motion-fast),
    border-color var(--motion-fast),
    box-shadow var(--motion-fast);
}
.ogcr-check__icon { width: 100%; height: 100%; }
.ogcr-check__text { display: inline-flex; flex-direction: column; gap: var(--space-2xs); flex: 1 1 auto; min-width: 0; }
.ogcr-check__line1 { color: var(--text-primary); }
.ogcr-check__line2 { color: var(--text-secondary); font-weight: 500; }

.ogcr-check--checked .ogcr-check__box,
.ogcr-check--indeterminate .ogcr-check__box {
  background: var(--icon-primary); border-color: var(--icon-primary);
}
.ogcr-check__input:focus-visible ~ .ogcr-check__box {
  box-shadow: var(--focus-primary);
}
.ogcr-check--error .ogcr-check__box { border-color: var(--icon-negative); }
.ogcr-check--error.ogcr-check--checked .ogcr-check__box,
.ogcr-check--error.ogcr-check--indeterminate .ogcr-check__box {
  background: var(--icon-negative); border-color: var(--icon-negative);
}
.ogcr-check--error .ogcr-check__input:focus-visible ~ .ogcr-check__box {
  box-shadow: var(--focus-error);
}
.ogcr-check--disabled { cursor: not-allowed; }
.ogcr-check--disabled .ogcr-check__box { opacity: 0.5; }
.ogcr-check--disabled .ogcr-check__line1,
.ogcr-check--disabled .ogcr-check__line2 { opacity: 0.6; }
```

Behavior:
- Native input visually hidden but reachable by keyboard/AT.
- Indeterminate is a third state: native HTML uses `el.indeterminate = true` (not an attribute). Shown via icon swap + same checked styling.
- Box is 16×16, but the wrapping `<label>` provides hit area via padding/text — ensure ≥40×40 effective hit on touch.
- `border-right` layout: in the DOM, place text before the box (CSS doesn't auto-reverse).

### 4.5 Radio

**Variants (layout):** `inline` | `border-left` | `border-right`. Same shell as Checkbox.

```html
<label class="ogcr-radio ogcr-radio--inline ogcr-radio--checked">
  <input class="ogcr-radio__input" type="radio" name="group" value="a" checked />
  <span class="ogcr-radio__box"><span class="ogcr-radio__dot"></span></span>
  <span class="ogcr-radio__text">
    <span class="ogcr-radio__line1">Label</span>
    <span class="ogcr-radio__line2">Secondary</span>
  </span>
</label>
```

```css
.ogcr-radio {
  display: inline-flex; align-items: center; gap: var(--space-s);
  cursor: pointer; position: relative;
  font-family: var(--font-family-default); font-weight: 500;
  font-size: var(--font-size-s); line-height: 1.4; color: var(--text-primary);
}
.ogcr-radio--border-left,
.ogcr-radio--border-right {
  align-items: flex-start; width: 240px; padding: var(--space-s);
  background: var(--surface-light); border: 1px solid var(--border-medium);
  border-radius: var(--radius-l);
  transition: border-color var(--motion-fast), box-shadow var(--motion-fast);
}
.ogcr-radio--border-left:hover,
.ogcr-radio--border-right:hover { border-color: var(--border-strong); }

.ogcr-radio__input {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; border: 0;
  clip: rect(0 0 0 0); overflow: hidden; white-space: nowrap;
}
.ogcr-radio__box {
  display: inline-flex; align-items: center; justify-content: center;
  width: 16px; height: 16px; flex-shrink: 0;
  background: var(--surface-light);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-full);
  transition:
    background-color var(--motion-fast),
    border-color var(--motion-fast),
    box-shadow var(--motion-fast);
}
.ogcr-radio__dot {
  width: 8px; height: 8px;
  border-radius: var(--radius-full);
  background: var(--surface-light);
  transform: scale(0);
  transition: transform var(--motion-fast);
}
.ogcr-radio--checked .ogcr-radio__box {
  background: var(--icon-primary); border-color: var(--icon-primary);
}
.ogcr-radio--checked .ogcr-radio__dot { transform: scale(1); }

.ogcr-radio__text { display: inline-flex; flex-direction: column; gap: var(--space-2xs); flex: 1 1 auto; min-width: 0; }
.ogcr-radio__line1 { color: var(--text-primary); }
.ogcr-radio__line2 { color: var(--text-secondary); font-weight: 500; }

.ogcr-radio__input:focus-visible ~ .ogcr-radio__box {
  box-shadow: var(--focus-primary);
}
.ogcr-radio--error .ogcr-radio__box { border-color: var(--icon-negative); }
.ogcr-radio--error.ogcr-radio--checked .ogcr-radio__box {
  background: var(--icon-negative); border-color: var(--icon-negative);
}
.ogcr-radio--error .ogcr-radio__input:focus-visible ~ .ogcr-radio__box {
  box-shadow: var(--focus-error);
}
.ogcr-radio--disabled { cursor: not-allowed; }
.ogcr-radio--disabled .ogcr-radio__box { opacity: 0.5; }
.ogcr-radio--disabled .ogcr-radio__line1,
.ogcr-radio--disabled .ogcr-radio__line2 { opacity: 0.6; }
```

Behavior:
- No indeterminate state.
- Inner dot animates via `transform: scale()` 0→1 on check.
- Group radios via shared `name` attribute.

### 4.6 Pill

**Variants (tone):** `neutral` (default) | `positive` | `warning` | `negative` | `progress`. Presentational only, no interactive states.
**Leading content:** `dot` (boolean) or `leading` (arbitrary node).

```html
<span class="ogcr-pill ogcr-pill--positive" data-tone="positive">+12%</span>

<!-- with a status dot -->
<span class="ogcr-pill ogcr-pill--progress" data-tone="progress">
  <span class="ogcr-pill__dot" aria-hidden="true"></span>
  In review
</span>

<!-- with an arbitrary leading glyph (wins over dot) -->
<span class="ogcr-pill ogcr-pill--neutral" data-tone="neutral">
  <span class="ogcr-pill__leading" aria-hidden="true"><svg>…</svg></span>
  Draft
</span>
```

```css
.ogcr-pill {
  display: inline-flex; align-items: center; gap: var(--space-xs);
  padding: var(--space-2xs) var(--space-xs);
  border-radius: var(--radius-m);
  font-family: var(--font-family-default); font-weight: 400;
  font-size: var(--font-size-s); line-height: 1.4;
  white-space: nowrap;
}
.ogcr-pill--neutral  { background: var(--surface-neutral);  color: var(--text-primary); }
.ogcr-pill--positive { background: var(--surface-positive); color: var(--text-positive); }
.ogcr-pill--warning  { background: var(--surface-warning);  color: var(--text-warning); }
.ogcr-pill--negative { background: var(--surface-negative); color: var(--text-negative); }
.ogcr-pill--progress { background: var(--surface-progress); color: var(--text-progress); }

.ogcr-pill__dot {
  display: inline-block; width: 8px; height: 8px; flex-shrink: 0;
  border-radius: var(--radius-full);
  background: currentColor;
}
.ogcr-pill__leading { display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ogcr-pill__leading > svg { width: 16px; height: 16px; }
```

Behavior:
- `progress` is the blue in-flight / informational ramp — distinct from `neutral`, which is the "no state" grey. Pill tone is the canonical tone list: KPI's tone set is a superset of it, and KPI sources its status chip straight from Pill so the two cannot drift.
- `dot` tints itself with `currentColor`, i.e. the tone's own text color. When the dot needs some *other* color (a domain state palette that deliberately diverges from the tone), pass `leading` instead — it takes precedence over `dot` and accepts any node.
- Both leading elements are `aria-hidden`; the pill's meaning must be in its text.
- The root carries `data-tone` for styling hooks and testing.

### 4.7 ProgressBar

**Variants (tone):** `default` (green, no class) | `blue` | `orange` | `neutral`.

```html
<div class="ogcr-progress ogcr-progress--blue" role="progressbar" aria-valuenow="64" aria-valuemin="0" aria-valuemax="100" aria-label="Task progress">
  <div class="ogcr-progress__text">
    <span class="ogcr-progress__label">
      <span class="ogcr-progress__label-icon"><svg>…</svg></span>
      Task name
    </span>
    <span class="ogcr-progress__value">64%</span>
  </div>
  <div class="ogcr-progress__track">
    <div class="ogcr-progress__fill" style="width: 64%"></div>
  </div>
</div>
```

```css
.ogcr-progress {
  display: flex; flex-direction: column; gap: var(--space-2xs);
  width: 100%;
  --progress-fill: var(--interaction-primary-default);
}
.ogcr-progress--blue    { --progress-fill: var(--icon-progress); }
.ogcr-progress--orange  { --progress-fill: var(--icon-warning); }
.ogcr-progress--neutral { --progress-fill: var(--text-neutral); }

.ogcr-progress__text { display: flex; align-items: flex-start; gap: var(--space-s); }
.ogcr-progress__label {
  display: inline-flex; align-items: center; gap: var(--space-xs);
  font-family: var(--font-family-default); font-weight: 400;
  font-size: var(--font-size-s); line-height: 1.4; color: var(--text-secondary);
}
.ogcr-progress__label-icon { display: inline-flex; width: 20px; height: 20px; color: var(--icon-secondary); }
.ogcr-progress__label-icon > svg { width: 100%; height: 100%; }
.ogcr-progress__value {
  margin-left: auto;
  font-family: var(--font-family-default); font-weight: 500;
  font-size: var(--font-size-s); line-height: 1.4; color: var(--text-primary);
}
.ogcr-progress__track {
  position: relative; height: 8px; width: 100%;
  background: var(--border-medium);
  border-radius: var(--radius-l);
  overflow: hidden;
}
.ogcr-progress__fill {
  height: 100%;
  background: var(--progress-fill);
  border-radius: var(--radius-m);
  transition: width var(--motion-base);
}
```

Behavior:
- Clamp `value` 0–100 in app code; set fill width inline.
- Text row optional. Omit if no label and no displayed value.
- **`blue` is `--icon-progress` (`#265277`), not `--icon-positive`.** This spec used to say `--icon-positive`, which is `#4f8263` — the same green as `--interaction-primary-default`, so the `blue` variant would have rendered identically to `default`. `progress` is the deliberate blue token; the variant name is kept as `blue` for back-compat.
- `value: null` renders the indeterminate ARIA state; the fill still clamps to 0.
- **Naming precedence:** when a visible `label` is rendered, it is wired as the bar's `aria-labelledby`, which takes precedence over any `aria-label`. So `aria-label` only names the bar when there is no visible label — don't rely on it to override one.

### 4.8 ContextMenu

**Width:** `s` 256 | `m` 280 | `l` 320 (default) | `auto` — the shared overlay width scale, see below.

```html
<div class="ogcr-menu" role="menu" data-width="l">
  <header class="ogcr-menu__header">
    <span class="ogcr-menu__title">Header</span>
    <span class="ogcr-pill ogcr-pill--neutral">3 selected</span>
  </header>
  <ul class="ogcr-menu__list">
    <li>
      <button class="ogcr-menu__item" role="menuitem">
        <span class="ogcr-menu__item-icon"><svg>…</svg></span>
        Item label
      </button>
    </li>
    <li>
      <button class="ogcr-menu__item ogcr-menu__item--destructive" role="menuitem">
        <span class="ogcr-menu__item-icon"><svg>…</svg></span>
        Delete
      </button>
    </li>
  </ul>
</div>
```

```css
.ogcr-menu {
  width: 320px;
  background: var(--surface-light);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-l);
  padding: var(--space-m);
  box-shadow: var(--elevation-l);
  display: flex; flex-direction: column; gap: var(--space-m);
}
.ogcr-menu__header { display: flex; align-items: center; justify-content: space-between; gap: var(--space-s); }
.ogcr-menu__title {
  font-family: var(--font-family-default); font-weight: 500;
  font-size: var(--font-size-m); line-height: 1.2; color: var(--text-primary);
}
.ogcr-menu__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--space-2xs); }
.ogcr-menu__item {
  display: flex; align-items: center; gap: var(--space-s);
  width: 100%; padding: var(--space-xs) var(--space-s);
  background: transparent; border: none; border-radius: var(--radius-m);
  cursor: pointer; text-align: left;
  font-family: var(--font-family-default); font-weight: 500;
  font-size: var(--font-size-s); line-height: 1.4; color: var(--text-primary);
  transition: background-color var(--motion-fast), color var(--motion-fast);
}
.ogcr-menu__item:hover:not(:disabled) { background: var(--surface-neutral); }
/* Keyboard highlight IS the focus indicator here — the roving-highlight model
   moves a `data-highlighted` state between items rather than focusing each one. */
.ogcr-menu__item[data-highlighted] { outline: none; background: var(--surface-neutral); }
.ogcr-menu__item:disabled { cursor: not-allowed; opacity: 0.5; }
.ogcr-menu__item--destructive { color: var(--text-negative); }
.ogcr-menu__item--destructive:hover:not(:disabled) { background: var(--surface-negative); }
.ogcr-menu__item-icon { display: inline-flex; width: 20px; height: 20px; color: var(--icon-secondary); }
.ogcr-menu__item--destructive .ogcr-menu__item-icon { color: var(--icon-negative); }
.ogcr-menu__item-icon > svg { width: 100%; height: 100%; }
```

Behavior:
- **Width comes from the shared overlay scale** (`s` 256 / `m` 280 / `l` 320 / `auto`), defaulting to `l` — the 320px this menu has always shipped. `auto` drops the fixed width so the popup shrinks to its content. The same scale drives Popover (§4.29); it lives in one place (`src/lib/overlay/chrome.ts` `overlayWidths`) so the two cannot drift. `m` (280px) is deliberately an arbitrary value: 280 sits between the 256 and 320 steps of the spacing scale. The root carries `data-width`.
- Items are full-width buttons.
- Header optional (omit if no title/status). It carries `role="presentation"` so it stays out of the `role="menu"` required-children set.
- Destructive items shift background and icon color on hover (not just text).

### 4.9 Message

**Variants:**
- `state`: `neutral` (no class) | `success` | `warning` | `error`
- `type`: `inline` (no class) | `floating` (adds elevation + close button)

```html
<div class="ogcr-message ogcr-message--success ogcr-message--floating" role="status">
  <div class="ogcr-message__content">
    <span class="ogcr-message__icon" aria-hidden="true"><svg>…</svg></span>
    <div class="ogcr-message__text">
      <p class="ogcr-message__title">Title</p>
      <p class="ogcr-message__description">Description</p>
    </div>
  </div>
  <button class="ogcr-button ogcr-button--outlined ogcr-message__action">Action</button>
  <button class="ogcr-message__close" aria-label="Dismiss"><svg>…</svg></button>
</div>
<!-- Use role="alert" instead of "status" when state="error". -->
```

```css
.ogcr-message {
  display: flex; align-items: center; gap: var(--space-m);
  padding: var(--space-m);
  border-radius: var(--radius-xl);
  border: 1.5px solid var(--border-light);
  background: var(--surface-page);
  color: var(--text-neutral);
  --message-fg: var(--text-neutral);
  --message-icon: var(--icon-neutral);
  --message-action-border: var(--border-medium);
}
.ogcr-message--floating { box-shadow: var(--elevation-l); }
.ogcr-message--success {
  background: var(--surface-positive);
  border-color: var(--border-positive-light);
  color: var(--text-positive);
  --message-fg: var(--text-positive);
  --message-icon: var(--icon-positive);
  --message-action-border: var(--border-positive-light);
}
.ogcr-message--warning {
  background: var(--surface-warning);
  border-color: var(--border-warning-light);
  color: var(--text-warning);
  --message-fg: var(--text-warning);
  --message-icon: var(--icon-warning);
  --message-action-border: var(--border-warning-light);
}
.ogcr-message--error {
  background: var(--surface-negative);
  border-color: var(--border-negative-light);
  color: var(--text-negative);
  --message-fg: var(--text-negative);
  --message-icon: var(--icon-negative);
  --message-action-border: var(--border-negative-light);
}
.ogcr-message__content { display: flex; align-items: flex-start; gap: var(--space-s); flex: 1 1 auto; min-width: 0; }
.ogcr-message__icon { display: inline-flex; width: 24px; height: 24px; color: var(--message-icon); flex-shrink: 0; padding-top: 2px; }
.ogcr-message__icon > svg { width: 100%; height: 100%; }
.ogcr-message__text { display: flex; flex-direction: column; gap: var(--space-2xs); min-width: 0; color: var(--message-fg); }
.ogcr-message__title {
  margin: 0; font-family: var(--font-family-default); font-weight: 500;
  font-size: var(--font-size-m); line-height: 1.5; color: inherit;
}
.ogcr-message__description {
  margin: 0; font-family: var(--font-family-default); font-weight: 400;
  font-size: var(--font-size-s); line-height: 1.4; color: inherit;
}
.ogcr-message__action {
  flex-shrink: 0;
  background: transparent;
  border-color: var(--message-action-border);
  color: var(--message-fg);
}
.ogcr-message__action:hover:not(:disabled) { background: rgba(255, 255, 255, 0.4); }
.ogcr-message__close {
  display: inline-flex; align-items: center; justify-content: center;
  width: 40px; height: 40px;
  background: transparent;
  border: 1px solid var(--message-action-border);
  border-radius: var(--radius-l);
  color: var(--message-fg); cursor: pointer; flex-shrink: 0;
  transition: background-color var(--motion-fast);
}
.ogcr-message__close:hover { background: rgba(255, 255, 255, 0.4); }
.ogcr-message__close > svg { width: 24px; height: 24px; }
```

Behavior:
- Border is **1.5px**, not 1 — this is `--border-width-m`, the Figma `border-width/m` step (see §1); it is the one place in the system that uses it.
- Per-state colors all flow through `--message-fg`, `--message-icon`, `--message-action-border` so the action button inherits theme.
- Close button only on `floating`.
- **ARIA role matrix — `alert` is reserved for `error`.** `role="alert"` interrupts the screen reader mid-utterance, which is right for a failure and wrong for anything else. Every other state, `warning` included, announces politely.

  | state | role | icon |
  | --- | --- | --- |
  | `neutral` | `status` | Info |
  | `success` | `status` | CheckCircle |
  | `warning` | `status` | Warning (triangle) |
  | `error` | `alert` | WarningOctagon |

  The state also lands on the root as `data-state`, and the icon is chosen by state — it is not a caller-supplied slot.

### 4.10 Sidesheet

A right-anchored **modal** sheet for a focused sub-task: portal + backdrop + focus trap, dismissible with Escape or a click outside. It is not a bare panel — dropping the chrome in-page is a different component.

```html
<!-- portalled to the end of <body> -->
<div class="ogcr-sidesheet__backdrop" data-slot="sidesheet-backdrop"></div>
<aside class="ogcr-sidesheet" role="dialog" aria-modal="true" aria-labelledby="ss-title">
  <div class="ogcr-sidesheet__nav">
    <button class="ogcr-button ogcr-button--outlined" aria-label="Back">
      <span class="ogcr-button__icon"><svg>arrow-left</svg></span>
      <span class="ogcr-button__label">Back</span>
    </button>
    <button class="ogcr-sidesheet__close" aria-label="Close"><svg>x</svg></button>
  </div>
  <header class="ogcr-sidesheet__header">
    <h2 id="ss-title" class="ogcr-sidesheet__title">Title</h2>
    <span class="ogcr-pill ogcr-pill--neutral">Status</span>
  </header>
  <div class="ogcr-sidesheet__body">…</div>
  <footer class="ogcr-sidesheet__footer">
    <button class="ogcr-button ogcr-button--filled">Primary</button>
    <button class="ogcr-button ogcr-button--outlined">Secondary</button>
  </footer>
</aside>
```

```css
.ogcr-sidesheet__backdrop {
  position: fixed; inset: 0; z-index: 40;   /* one layer BELOW the overlay stack */
  background: rgba(0, 0, 0, 0.4);
  transition: opacity var(--motion-base);
}
.ogcr-sidesheet {
  position: fixed; top: 0; right: 0; z-index: 50;
  display: flex; flex-direction: column;
  width: 480px; max-width: 100vw; height: 100vh;
  background: var(--surface-light);
  box-shadow: var(--elevation-l);
  overflow: hidden;
  outline: none;
  transition: transform var(--motion-base);
}
/* Enter/exit: slides in from the right edge. */
.ogcr-sidesheet[data-starting-style],
.ogcr-sidesheet[data-ending-style] { transform: translateX(100%); }
.ogcr-sidesheet__nav { display: flex; align-items: center; justify-content: space-between; padding: var(--space-m); gap: var(--space-s); }
.ogcr-sidesheet__close {
  display: inline-flex; align-items: center; justify-content: center;
  width: 40px; height: 40px;
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-l);
  background: var(--surface-light);
  color: var(--icon-primary); cursor: pointer;
  transition: background-color var(--motion-fast), border-color var(--motion-fast);
}
.ogcr-sidesheet__close:hover { background: var(--surface-neutral); }
.ogcr-sidesheet__close > svg { width: 24px; height: 24px; }
.ogcr-sidesheet__header { display: flex; align-items: center; justify-content: space-between; gap: var(--space-s); padding: 0 var(--space-m) var(--space-m); }
.ogcr-sidesheet__title {
  margin: 0; font-family: var(--font-family-default); font-weight: 500;
  font-size: var(--font-size-xl); line-height: 1.2; color: var(--text-primary);
}
.ogcr-sidesheet__body {
  flex: 1 1 auto; overflow-y: auto;
  padding: var(--space-m);
  display: flex; flex-direction: column; gap: var(--space-m);
  border-top: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
}
.ogcr-sidesheet__footer { display: flex; gap: var(--space-xs); padding: var(--space-m); }
```

Behavior:
- **Modal by design.** The sheet portals out of the page, paints a scrim, traps focus, locks page scroll, and closes on Escape / outside click. The app supplies no chrome of its own. (This spec previously described a bare 480×720 panel and pushed the scrim and focus trap onto the app; the shipped component owns them, and the modal reading is now canonical. `modal={false}` is available for the rare non-trapping case, but it is not the design.)
- Fixed **480 wide, full viewport height**, pinned to the right edge, with `max-width: 100vw` so it degrades to full-bleed on narrow screens. Square corners — it meets three viewport edges, so radius would look like a mistake. Body scrolls; nav, header and footer stay pinned via flex.
- Body has top + bottom 1px hairlines that visually separate the scroll area.
- **Stacking:** the scrim sits at `z-index: 40`, one layer *below* the shared overlay stack (`--ds-z-overlay`, 50) that the sheet itself rides. That is deliberate — a Dialog or Popover opened from inside the sheet still lands above it.
- **Footer order is primary-first / leftmost**, then secondary — the same left-anchored CTA rule as Dialog (§4.30), AlertDialog (§4.31) and Form (§4.13). The footer renders only when at least one action is supplied.
- Back button uses outlined Button + arrow-left icon. Either back button or status pill may be omitted.

### 4.11 KPI

**Variants (tone):** `positive` (default, no class) | `warning` | `negative` | `neutral` | `progress`. Tone drives the 6px top accent bar color.
**Slots:** `icon` (optional, before the label) · `accentBar` (boolean, default on).

```html
<article class="ogcr-kpi ogcr-kpi--warning" data-tone="warning">
  <span class="ogcr-kpi__bar" aria-hidden="true"></span>
  <header class="ogcr-kpi__header">
    <span class="ogcr-kpi__label-group">
      <span class="ogcr-kpi__icon" aria-hidden="true"><svg>…</svg></span>
      <span class="ogcr-kpi__label">Removals YTD</span>
    </span>
    <span class="ogcr-pill ogcr-pill--warning">At risk</span>
  </header>
  <span class="ogcr-kpi__value">1,234 t</span>
  <p class="ogcr-kpi__secondary">vs 1,500 t target</p>
</article>
```

```css
.ogcr-kpi {
  position: relative;
  display: flex; flex-direction: column; gap: var(--space-2xs);
  padding: var(--space-m) var(--space-l);
  background: var(--surface-light);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-l);
  overflow: hidden;
  --kpi-accent: var(--icon-positive);
}
.ogcr-kpi--warning  { --kpi-accent: var(--icon-warning); }
.ogcr-kpi--negative { --kpi-accent: var(--icon-negative); }
.ogcr-kpi--neutral  { --kpi-accent: var(--text-neutral); }
.ogcr-kpi--progress { --kpi-accent: var(--icon-progress); }

.ogcr-kpi__bar { position: absolute; inset: 0 0 auto 0; height: 6px; background: var(--kpi-accent); }
/* The header's top padding exists only to clear the accent bar — drop it with the bar. */
.ogcr-kpi__header { display: flex; align-items: center; justify-content: space-between; gap: var(--space-s); padding-top: var(--space-2xs); }
.ogcr-kpi--no-bar .ogcr-kpi__header { padding-top: 0; }
.ogcr-kpi__label-group { display: inline-flex; align-items: center; gap: var(--space-xs); min-width: 0; }
.ogcr-kpi__icon { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; flex-shrink: 0; color: var(--icon-secondary); }
.ogcr-kpi__icon > svg { width: 100%; height: 100%; }
.ogcr-kpi__label {
  font-family: var(--font-family-default); font-weight: 400;
  font-size: var(--font-size-s); line-height: 1.4; color: var(--text-secondary);
}
.ogcr-kpi__value {
  font-family: var(--font-family-default); font-weight: 500;
  font-size: var(--font-size-xl); line-height: 1.2; color: var(--text-primary);
}
.ogcr-kpi__secondary {
  margin: 0; font-family: var(--font-family-default); font-weight: 400;
  font-size: var(--font-size-s); line-height: 1.4; color: var(--text-secondary);
}
```

Behavior:
- Accent bar is decorative (`aria-hidden`) and is the primary signal of status — **unless `accentBar={false}`, in which case the icon + label carry the identity.** Turn it off for quiet, icon-led stat tiles in a dense dashboard row; the header's `4px` top padding (which exists only to clear the bar) is dropped with it.
- `icon` is a 20×20 `--icon-secondary` glyph rendered before the label, `aria-hidden` — decoration, never the only carrier of meaning.
- Status Pill in the header is optional and mirrors tone. **KPI's tone set is Pill's tone set** (including `progress`) and the chip is rendered by Pill itself, so the two can't drift.
- `label` and `value` both accept arbitrary nodes, not just strings.
- The root carries `data-tone`.

### 4.12 Navigation

**Variants (layout):** `desktop` (top bar) | `mobile` (bottom bar).

```html
<!-- Desktop -->
<nav class="ogcr-nav ogcr-nav--desktop">
  <div class="ogcr-nav__left">
    <div class="ogcr-nav__brand">
      <span class="ogcr-nav__logo"><svg>…OGCR…</svg></span>
      <span class="ogcr-nav__divider" aria-hidden="true"></span>
      <span class="ogcr-nav__product">Product Name</span>
    </div>
    <ul class="ogcr-nav__list">
      <!-- link form: an item with an href renders as <a>, no type attribute -->
      <li>
        <a href="/overview" class="ogcr-nav__button ogcr-nav__button--active" aria-current="page">
          <span class="ogcr-nav__icon"><svg>…</svg></span>
          <span class="ogcr-nav__label">Overview</span>
        </a>
      </li>
      <!-- button form: an item that only changes in-page state -->
      <li><button class="ogcr-nav__button" type="button">…</button></li>
    </ul>
  </div>
  <div class="ogcr-nav__trailing">…</div>
</nav>

<!-- Mobile -->
<nav class="ogcr-nav ogcr-nav--mobile">
  <ul class="ogcr-nav__mobile-list">
    <li class="ogcr-nav__mobile-item">
      <button class="ogcr-nav__mobile-button ogcr-nav__mobile-button--active" aria-current="page">
        <span class="ogcr-nav__mobile-icon"><svg>…</svg></span>
        <span>Overview</span>
      </button>
    </li>
  </ul>
</nav>
```

```css
.ogcr-nav { background: var(--surface-light); width: 100%; }

/* Desktop */
.ogcr-nav--desktop {
  display: flex; align-items: center; gap: var(--space-xl);
  min-height: 80px;
  padding: var(--space-m) var(--space-l);
  border-bottom: 1px solid var(--border-light);
  border-radius: var(--radius-l) var(--radius-l) 0 0;
}
.ogcr-nav__left { display: flex; align-items: center; gap: var(--space-xl); flex: 1 1 auto; min-width: 0; }
.ogcr-nav__brand { display: inline-flex; align-items: center; gap: var(--space-m); flex-shrink: 0; }
.ogcr-nav__logo { display: inline-flex; flex-shrink: 0; height: auto; }
.ogcr-nav__divider { display: inline-block; width: 1px; height: 24px; background: var(--border-medium); }
.ogcr-nav__product {
  font-family: var(--font-family-default); font-weight: 500;
  font-size: var(--font-size-s); color: var(--text-primary);
}
.ogcr-nav__list { display: flex; align-items: center; gap: var(--space-xs); list-style: none; margin: 0; padding: 0; }
.ogcr-nav__button {
  display: inline-flex; align-items: center; gap: var(--space-s);
  height: 32px; padding: 0 var(--space-xs);
  background: transparent; border: none;
  border-radius: var(--radius-m); cursor: pointer;
  text-decoration: none;              /* the link form must not pick up the UA underline */
  color: var(--text-secondary);
  font-family: var(--font-family-default); font-weight: 500;
  font-size: var(--font-size-s); letter-spacing: 0.28px;
  transition: background-color var(--motion-fast), color var(--motion-fast);
}
.ogcr-nav__button:hover { background: var(--surface-neutral); color: var(--text-primary); }
.ogcr-nav__button--active { background: var(--interaction-primary-focus); color: var(--text-primary); }
.ogcr-nav__icon { display: inline-flex; width: 24px; height: 24px; }
.ogcr-nav__icon > svg { width: 100%; height: 100%; }
.ogcr-nav__label { white-space: nowrap; }
.ogcr-nav__trailing { display: inline-flex; align-items: center; gap: var(--space-xs); flex-shrink: 0; }

/* Mobile */
.ogcr-nav--mobile { padding: var(--space-s) var(--space-m); border-radius: var(--radius-xl); box-shadow: var(--elevation-l); }
.ogcr-nav__mobile-list {
  display: flex; align-items: stretch; justify-content: space-between;
  list-style: none; margin: 0; padding: 0;
  gap: var(--space-xs);
}
.ogcr-nav__mobile-item { flex: 1 1 0; }
.ogcr-nav__mobile-button {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: var(--space-xs);
  width: 100%; padding: var(--space-2xs);
  background: transparent; border: none;
  border-radius: var(--radius-m); cursor: pointer;
  color: var(--text-secondary);
  font-family: var(--font-family-default); font-weight: 500;
  font-size: var(--font-size-s); letter-spacing: 0.28px;
  transition: background-color var(--motion-fast), color var(--motion-fast);
}
.ogcr-nav__mobile-button:hover { color: var(--text-primary); }
.ogcr-nav__mobile-icon {
  display: inline-flex; width: 48px; height: 48px;
  align-items: center; justify-content: center;
  border-radius: var(--radius-m);
  transition: background-color var(--motion-fast);
}
.ogcr-nav__mobile-icon > svg { width: 24px; height: 24px; }
.ogcr-nav__mobile-button--active { color: var(--text-primary); }
.ogcr-nav__mobile-button--active .ogcr-nav__mobile-icon { background: var(--interaction-primary-focus); }
```

Behavior:
- Desktop active item: solid `--interaction-primary-focus` background pill.
- Mobile active item: only the 48×48 icon plate fills with `--interaction-primary-focus`; label color shifts.
- `aria-current="page"` on the active item.
- Mobile icon plate is 48×48 to satisfy 40×40 minimum hit target with margin.
- **Element choice per item — `button`, `<a href>`, or your router's link.** A nav item is a button when it only changes in-page state, a link when it goes somewhere, and neither when the app owns routing:
  - `NavItem.href` → renders `<a href>` with real link affordances (middle-click, ⌘-click, "copy link address") and **no** `type` attribute. `onSelect` still fires.
  - `NavItem.render` → the Base UI `render` contract (`NavRender`): a `ReactElement` to clone, or `(props, state) => ReactElement`. The item's `className`, `aria-current`, icon+label children and click handler are merged into whatever you hand back, so `render={<Link href="/overview" />}` keeps every nav affordance. `render` wins over `href` for the element type.
  - Neither → `<button type="button">`, the historical behavior.

  Both apply to the `desktop` and `mobile` layouts, and the same contract is shared with SideNavigation (§4.40) — one internal element renderer serves both.

### 4.13 Form

Composition layer over Input, Checkbox, Radio, and Button. Layout-only — no surface chrome — so a Form sits cleanly inside a Card, Sidesheet, or page section. Library-agnostic: `errorText` / `helperText` are passed as props, so it works with native React state or react-hook-form's `Controller` / `register`.

Pieces: `Form` (`<form>` wrapper), `FormSection` (step + title + description + body), `FormRow` (2-column field pair), `FormField` (label + helper/error wrapper for arbitrary controls), `FormFieldset` (legend-grouped controls, e.g. radio groups), `FormFooter` (action row with optional note).

```html
<form class="ogcr-form" novalidate>
  <section class="ogcr-form__section">
    <header class="ogcr-form__section-head">
      <span class="ogcr-form__section-step">I</span>
      <h3 class="ogcr-form__section-title">Project</h3>
      <p class="ogcr-form__section-description">Identify the project being submitted.</p>
    </header>
    <div class="ogcr-form__section-body">
      <div class="ogcr-form__row">
        <!-- ogcr-input -->
        <!-- ogcr-input -->
      </div>
      <!-- ogcr-input full width -->
    </div>
  </section>

  <section class="ogcr-form__section">
    <header class="ogcr-form__section-head">
      <span class="ogcr-form__section-step">II</span>
      <h3 class="ogcr-form__section-title">Verification</h3>
    </header>
    <div class="ogcr-form__section-body">
      <fieldset class="ogcr-form__fieldset">
        <legend class="ogcr-form__legend">
          Verification level<span class="ogcr-form__required" aria-hidden="true">*</span>
        </legend>
        <div class="ogcr-form__fieldset-body">
          <!-- ogcr-radio (border-left) -->
          <!-- ogcr-radio (border-left) -->
        </div>
      </fieldset>
    </div>
  </section>

  <footer class="ogcr-form__footer">
    <div class="ogcr-form__footer-actions">
      <!-- filled · outlined · text buttons (primary CTA first / leftmost) -->
    </div>
    <p class="ogcr-form__footer-note">Required fields are marked *</p>
  </footer>
</form>
```

```css
.ogcr-form { display: flex; flex-direction: column; width: 100%; margin: 0; padding: 0; }

.ogcr-form__section {
  display: flex; flex-direction: column; gap: var(--space-m);
  padding-block: var(--space-xl);
  border-top: 1px solid var(--border-light);
}
.ogcr-form__section:first-of-type { border-top: none; padding-top: 0; }

.ogcr-form__section-head {
  display: flex; flex-direction: column; gap: var(--space-2xs);
  margin-bottom: var(--space-xs);
}
.ogcr-form__section-step {
  font-family: var(--font-family-mono);
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--interaction-primary-default);
}
.ogcr-form__section-title {
  margin: 0;
  font-family: var(--font-family-default); font-weight: 500;
  font-size: var(--font-size-m); line-height: 1.2; letter-spacing: -0.01em;
  color: var(--text-primary);
}
.ogcr-form__section-description {
  margin: 0; max-width: 60ch;
  font-family: var(--font-family-default); font-weight: 400;
  font-size: var(--font-size-s); line-height: 1.45;
  color: var(--text-secondary);
}
.ogcr-form__section-body { display: flex; flex-direction: column; gap: var(--space-m); min-width: 0; }

.ogcr-form__row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-m);
}
@media (max-width: 520px) { .ogcr-form__row { grid-template-columns: 1fr; } }

.ogcr-form__field { display: flex; flex-direction: column; gap: var(--space-2xs); min-width: 0; }
.ogcr-form__label {
  font-family: var(--font-family-default); font-weight: 400;
  font-size: var(--font-size-s); line-height: 1.4;
  color: var(--text-secondary);
}
.ogcr-form__required { color: var(--text-negative); margin-left: 4px; font-weight: 500; }
.ogcr-form__helper {
  margin: 0;
  font-family: var(--font-family-default); font-weight: 400;
  font-size: var(--font-size-s); line-height: 1.4;
  color: var(--text-secondary);
}
.ogcr-form__field--error .ogcr-form__helper { color: var(--text-negative); }

.ogcr-form__fieldset {
  border: none; margin: 0; padding: 0;
  display: flex; flex-direction: column; gap: var(--space-xs); min-width: 0;
}
.ogcr-form__legend {
  padding: 0;
  font-family: var(--font-family-default); font-weight: 400;
  font-size: var(--font-size-s); line-height: 1.4;
  color: var(--text-secondary);
}
.ogcr-form__fieldset-body { display: flex; flex-direction: column; gap: var(--space-xs); }
.ogcr-form__fieldset--inline .ogcr-form__fieldset-body {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  gap: var(--space-s);
}
.ogcr-form__fieldset--inline .ogcr-form__fieldset-body > * { width: 100%; max-width: none; }
@media (max-width: 520px) {
  .ogcr-form__fieldset--inline .ogcr-form__fieldset-body {
    grid-auto-flow: row;
    grid-auto-columns: minmax(0, 1fr);
  }
}
.ogcr-form__fieldset--error .ogcr-form__helper { color: var(--text-negative); }

.ogcr-form__footer {
  display: flex; align-items: center; justify-content: space-between;
  gap: var(--space-m);
  padding-top: var(--space-l); margin-top: var(--space-xs);
  border-top: 1px solid var(--border-light);
}
.ogcr-form__footer-note {
  margin: 0;
  font-family: var(--font-family-mono);
  font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--text-secondary);
}
.ogcr-form__footer-actions {
  display: flex; align-items: center; gap: var(--space-xs);
  flex-wrap: wrap; justify-content: flex-start; /* CTAs anchored bottom-left */
}
@media (max-width: 520px) {
  .ogcr-form__footer { flex-direction: column; align-items: stretch; }
  .ogcr-form__footer-actions { justify-content: stretch; }
}
```

Behavior:
- Sections stack vertically with a `--border-light` divider above each one (skipped on the first).
- Section head is title-led: small mono step kicker, then title, then description. All left-aligned at the top of the section body.
- `FormRow` opt-in: pairs two fields side-by-side on a 2-col grid; collapses to 1-col under 520px.
- `FormFieldset` defaults to a vertical body; add `ogcr-form__fieldset--inline` (or pass `inline` to the React component) to lay options out horizontally — useful for short radio/checkbox card pairs. Stacks under 520px.
- Field-level error: pass `errorText`; the wrapper sets `ogcr-form__field--error` and the helper turns `--text-negative`. Primitives like Input expose their own `error` boolean, and the two **OR together** rather than one overriding the other. Exact resolution order for the control's `aria-invalid` (and the error styling it drives — one resolved value feeds both, so they can never diverge):

  1. the control's own `aria-invalid` prop, if passed — **the child always wins**;
  2. otherwise the field-level state published by `FormField` (set whenever `errorText` is present);
  3. otherwise the control's own `error` boolean.

  Consequence worth stating plainly: **`error={false}` cannot cancel a field-level error.** Every primitive defaults `error` to `false`, so `false` is indistinguishable from "not passed" — honouring it would silently un-flag every control inside a `FormField` that has `errorText`, and would split the ARIA state from the visible red helper text. The explicit opt-out is `aria-invalid={false}` on the child, which is rule 1 and works today.
- Required indicator: the `*` is `aria-hidden`; pair with `required` on the underlying input for assistive tech.
- Footer: left-side action stack (primary CTA first / leftmost), right-side mono note (e.g. "Required fields are marked *"). CTAs are anchored bottom-**left**, not bottom-right. Stacks on narrow widths.

### 4.14 Table

Sortable, accessible table built on [`@tanstack/react-table`](https://tanstack.com/table) v8. Visual treatment matches the kv-row pattern: dashed row rules, mono-caps headers, tabular-nums on numeric cells, Pill-rendered status cells.

The component is the only one in this library that takes a runtime dependency. The headless engine handles sorting, row models, and column meta; the DOM and CSS below are this design system.

```html
<div class="ogcr-table">
  <div class="ogcr-table__scroll" role="region" aria-label="Issuance ledger">
    <table class="ogcr-table__table">
      <caption class="ogcr-table__caption">Issuance ledger · last 30 days</caption>
      <thead class="ogcr-table__thead">
        <tr>
          <th scope="col" class="ogcr-table__th" data-align="left" aria-sort="none">
            <button type="button" class="ogcr-table__sort ogcr-table__sort--none">
              <span>Project</span>
              <span class="ogcr-table__sort-icon" aria-hidden="true">↕</span>
            </button>
          </th>
          <th scope="col" class="ogcr-table__th" data-align="right" aria-sort="descending">
            <button type="button" class="ogcr-table__sort ogcr-table__sort--desc">
              <span>Credits (t CO₂e)</span>
              <span class="ogcr-table__sort-icon" aria-hidden="true">↓</span>
            </button>
          </th>
          <th scope="col" class="ogcr-table__th" data-align="left">Status</th>
        </tr>
      </thead>
      <tbody class="ogcr-table__tbody">
        <tr class="ogcr-table__tr">
          <td class="ogcr-table__td" data-align="left">Iberian rewilding</td>
          <td class="ogcr-table__td" data-align="right" data-numeric>42,180</td>
          <td class="ogcr-table__td" data-align="left">
            <span class="ogcr-pill ogcr-pill--warning">In review</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

```css
.ogcr-table {
  width: 100%;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-l);
  background: var(--surface-light);
  overflow: hidden;
}
.ogcr-table__scroll { width: 100%; overflow-x: auto; }
.ogcr-table__table { width: 100%; border-collapse: collapse; font-family: var(--font-family-default); }
.ogcr-table__caption {
  caption-side: top;
  padding: var(--space-s) var(--space-m); text-align: left;
  font-family: var(--font-family-mono);
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-secondary);
  background: var(--surface-neutral);
  border-bottom: 1px solid var(--border-light);
}
.ogcr-table__thead {
  background: linear-gradient(to bottom, var(--surface-neutral), var(--surface-light));
}
.ogcr-table__th {
  padding: var(--space-s) var(--space-m);
  text-align: left;
  border-bottom: 1px solid var(--border-medium);
  font-family: var(--font-family-mono);
  font-size: 11px; font-weight: 500; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--text-secondary);
  white-space: nowrap; vertical-align: middle;
}
.ogcr-table__th[data-align="right"] { text-align: right; }
.ogcr-table__th[data-align="center"] { text-align: center; }

.ogcr-table__sort {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 0; margin: 0; border: 0; background: transparent;
  font: inherit; letter-spacing: inherit; text-transform: inherit; color: inherit;
  cursor: pointer; transition: color var(--motion-fast);
}
.ogcr-table__sort:hover { color: var(--text-primary); }
.ogcr-table__sort:focus-visible {
  outline: 2px solid var(--interaction-primary-default);
  outline-offset: 3px; border-radius: 2px;
}
.ogcr-table__sort-icon {
  display: inline-block; min-width: 10px;
  font-family: var(--font-family-mono); font-size: 12px; line-height: 1;
  opacity: 0.4; transition: opacity var(--motion-fast), color var(--motion-fast);
}
.ogcr-table__sort--asc .ogcr-table__sort-icon,
.ogcr-table__sort--desc .ogcr-table__sort-icon {
  opacity: 1; color: var(--interaction-primary-default);
}
.ogcr-table__th[data-align="right"] .ogcr-table__sort { flex-direction: row-reverse; }

.ogcr-table__tr { transition: background-color var(--motion-fast); }
.ogcr-table__tr:hover { background: var(--surface-neutral); }

.ogcr-table__td {
  padding: var(--space-s) var(--space-m);
  border-bottom: 1px dashed var(--border-light);
  font-size: var(--font-size-m); font-weight: 400;
  color: var(--text-primary); vertical-align: middle; white-space: nowrap;
}
.ogcr-table__tbody tr:last-child .ogcr-table__td { border-bottom: none; }
.ogcr-table__td[data-align="right"] { text-align: right; }
.ogcr-table__td[data-align="center"] { text-align: center; }
.ogcr-table__td[data-numeric] {
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum' 1;
  letter-spacing: -0.005em; font-weight: 500;
}
.ogcr-table__empty {
  padding: var(--space-xl) var(--space-m); text-align: center;
  color: var(--text-secondary);
  font-size: var(--font-size-s);
  font-family: var(--font-family-mono);
  letter-spacing: 0.12em; text-transform: uppercase;
}
```

Column-meta extension (TypeScript module augmentation on `@tanstack/react-table`):

```ts
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: 'left' | 'right' | 'center'
    numeric?: boolean
  }
}
```

`align` controls header + cell text alignment (`data-align` attribute); `numeric` shorthand right-aligns + applies tabular-nums styling on cells.

Behavior:
- Sort: `aria-sort` reflects `none` / `ascending` / `descending`. Click toggles asc → desc → cleared. Sort button is the only focusable thing in the header cell.
- Hover row: `--surface-neutral` background tint. **Last row drops the dashed border** so it doesn't double up with the table's own border — the rule lives on the *cells* (`.ogcr-table__tbody tr:last-child .ogcr-table__td`), because a `<tr>` can't paint the bottom edge of a collapsed-border table. In the Tailwind implementation each `<tr>` is marked `group` and the cells carry `group-last:border-b-0`; without the `group` marker the variant has nothing to match and *every* row keeps its rule.
- Empty state: single full-span cell with mono-caps copy ("No records" by default).
- Responsive: header row never wraps (`white-space: nowrap`); the wrapper `.ogcr-table__scroll` provides horizontal overflow on narrow viewports.

---

> **§4.15 onward — implementation note.** The components below are built on [Base UI](https://base-ui.com) behavior primitives styled with Tailwind v4 token utilities (`bg-surface-*`, `rounded-12`, `shadow-elevation-l`, `shadow-focus-*`), not the hand-authored `ogcr-*` CSS used above. So they are specified by **part anatomy, props, key dimensions, and behavior** rather than copy-paste CSS. The token values in §1 remain the source of truth; the React API (exported symbols + props) is documented as the contract consumers bind to. Each `data-slot` attribute marks a stylable part. Naming of props is exact — `onValueChange` / `onPressedChange` / `onCheckedChange` differ by component.

### 4.15 Textarea

Multi-line text control mirroring the Input field. **No primitive — native `<textarea>`.**

- **Exports:** `Textarea`; types `TextareaResize`, `TextareaProps` (extends `TextareaHTMLAttributes`).
- **Props:** `label?`, `helperText?`, `errorText?` (forces error tone, overrides `helperText`), `error?=false`, `resize?='vertical'` (`none | vertical | horizontal | both`), `rows?=4`.
- **Anatomy:** `[data-slot=textarea]` › `[data-slot=textarea-label]` + `[data-slot=textarea-control]` + `[data-slot=textarea-helper]`.
- **Dimensions/tokens:** control `min-height: 96px`, `padding: 12px 16px`, `--radius-l`, `text-m`; border `--border-medium` → hover `--border-strong` → focus `--interaction-primary-default` + `--shadow-focus-primary`. Error: `--border-negative-strong` + `--shadow-focus-error`.
- **Behavior:** auto-wires `aria-invalid` / `aria-describedby`; helper switches to `--text-negative` in error.

### 4.16 Avatar

Person/entity marker with image-or-initials fallback. **Wraps:** Base UI `Avatar` (`Root`/`Image`/`Fallback`).

- **Exports:** `Avatar`, `deriveInitials` (helper); types `AvatarSize`, `AvatarShape`, `AvatarProps`.
- **Props:** `src?`, `alt?`, `name?`, `initials?` (overrides derived), `size?='m'` (`xs | s | m | l | xl`), `shape?='circle'` (`circle | square`), `delay?` (fallback delay, ms).
- **Dimensions/tokens:** sizes 24 / 28 / 32 / 40 / 48 px square; `circle` → `--radius-full`, `square` → `--radius-l`; fallback `--surface-strong` bg + white text.
- **Behavior:** renders image when it loads; otherwise explicit `initials`, else initials derived from `name` (`"Jane Cooper" → "JC"`).

### 4.17 Select

Single-choice dropdown; trigger mirrors the Input field. **Wraps:** Base UI `Select`.

- **Exports:** `Select`; types `SelectSide`, `SelectAlign`, `SelectOption`, `SelectProps`. `SelectOption = { value: string; label: ReactNode; disabled? }`.
- **Props:** `options`, `value?: string | null`, `defaultValue?`, `onValueChange?(value: string | null)`, `placeholder?='Select…'`, `error?=false`, `disabled?`, `required?`, `name?`, `side?='bottom'`, `align?='start'`, `sideOffset?=8`, plus `aria-label`/`-labelledby`.
- **Anatomy:** `Trigger` (`role=combobox`) › `Value` + caret `Icon`; `Portal` › `Positioner` › `Popup` › `Item`/`ItemText`/`ItemIndicator`.
- **Dimensions/tokens:** trigger `height: 48px`, `padding: 0 16px`, `--radius-l` — identical to Input; popup `min-width: var(--anchor-width)`, `max-height: min(var(--available-height), 320px)`, `--elevation-l`; caret rotates 180° on open.
- **Behavior:** controlled or uncontrolled; the `combobox` trigger needs an accessible name from an external label, not its value.

### 4.18 Combobox

Type-ahead autocomplete over a list of strings. **Wraps:** Base UI `Autocomplete`.

- **Exports:** `Combobox`; types `ComboboxSide`, `ComboboxAlign`, `ComboboxProps`.
- **Props:** `items: string[]`, `value?`, `defaultValue?`, `onValueChange?(value: string)`, `placeholder?='Search…'`, `emptyMessage?='No matches found.'`, `error?=false`, `disabled?`, `side?='bottom'`, `align?='start'`, `sideOffset?=8`.
- **Anatomy:** `Input` › `Portal` › `Positioner` › `Popup` › `Empty` + `List` › `Item`.
- **Dimensions/tokens:** input matches Select/Input (`height: 48px`, `--radius-l`); popup `min-width: var(--anchor-width)`, `max-height: min(…, 320px)`, `--elevation-l`.
- **Behavior:** filters `items` as you type; renders `emptyMessage` when nothing matches.

### 4.19 NumberField

Numeric input with steppers, clamping, and `Intl` formatting. **Wraps:** Base UI `NumberField`.

- **Exports:** `NumberField`; type `NumberFieldProps`.
- **Props:** `value?: number | null`, `defaultValue?`, `onValueChange?(value: number | null)`, `min?`, `max?`, `step?`, `smallStep?`, `largeStep?`, `label?`, `helperText?`, `errorText?` (forces error), `error?=false`, `disabled?`, `readOnly?`, `placeholder?`, `format?: Intl.NumberFormatOptions`.
- **Anatomy:** `Group` › `Decrement` + `Input` + `Increment`.
- **Dimensions/tokens:** group `height: 48px`, `--radius-l`; steppers `width: 44px` with divider borders; input centered + `tabular-nums`.
- **Behavior:** steppers honor small/large step modifiers; value clamps to `min`/`max`; `errorText` overrides `helperText`.
- **Note on the 44px steppers:** 44 is deliberately *not* on the spacing scale, so the implementation writes it as an arbitrary value. A bare `w-44` would resolve through the `--spacing` multiplier to 44px only by coincidence of the 1px scale — the spacing gate rejects off-scale bare numbers in library source for exactly that reason.

### 4.20 Slider

Single-value range control. **Wraps:** Base UI `Slider`.

- **Exports:** `Slider`; type `SliderProps`.
- **Props:** `value?: number`, `defaultValue?`, `onValueChange?(value)`, `onValueCommitted?(value)`, `min?=0`, `max?=100`, `step?=1`, `label?`, `showValue?=false`, `format?`, `error?=false`, `disabled?`, `aria-label?`.
- **Anatomy:** `Label` + `Value` (header) over `Control` › `Track` › `Indicator` + `Thumb`.
- **Dimensions/tokens:** track `height: 6px`, `--radius-full`, `--border-medium`; indicator `--interaction-primary-default`; thumb 20×20, `--radius-full`, 2px ring. Error → negative indicator/thumb + `--shadow-focus-error`.
- **Behavior:** `onValueChange` fires continuously while dragging; `onValueCommitted` fires once on release / keyboard commit.

### 4.21 Toggle

Two-state pressable button, standalone or grouped. **Wraps:** Base UI `Toggle` / `ToggleGroup`.

- **Exports:** `Toggle`, `ToggleGroup`; types `ToggleSize`, `ToggleProps`, `ToggleGroupItem`, `ToggleGroupProps`.
- **Toggle props:** `pressed?`, `defaultPressed?`, `onPressedChange?(pressed: boolean)`, `value?`, `size?='m'` (`s | m`), `disabled?`, `aria-label?`.
- **Group props:** `items: ToggleGroupItem[]`, `value?: string[]`, `defaultValue?`, `onValueChange?(value: string[])`, `multiple?=false`, `size?`, `disabled?`, `aria-label?`, **plus any Base UI `ToggleGroup` prop** (rest and `ref` are forwarded to the group element, after our defaults, so injected props win). `ToggleGroupItem = { value; label?; icon?; disabled?; 'aria-label'? }`.
- **Dimensions/tokens:** Toggle `s`=32 / `m`=40 px tall, `--radius-m` items; group is `role=toolbar`, `--radius-l`, `--surface-neutral`; pressed Toggle → `--interaction-primary-focus`, pressed segment → `--surface-light` + `--shadow-control-pressed`.
- **Behavior:** standalone is on/off; group is single-select unless `multiple`; value carried as a string array. The group deliberately overrides Base UI's default `role="group"` with `role="toolbar"`: Base UI also emits `aria-orientation`, which ARIA permits on `toolbar` but not on `group`, and the roving-focus keyboard model already matches a toolbar.
- **Toolbar projection:** the open prop/ref forwarding above is what makes `<ToolbarButton render={<ToggleGroup … />} />` (§4.39) work — Base UI hands the projected element its roving-focus wiring (`tabIndex`, key handlers, `data-*`, `ref`) as ordinary props, and a wrapper with a closed prop set would swallow them.

### 4.22 Switch

Binary on/off control with optional inline label. **Wraps:** Base UI `Switch`.

- **Exports:** `Switch`; type `SwitchProps`.
- **Props:** `checked?`, `defaultChecked?`, `onCheckedChange?(next: boolean)`, `onChange?` (**@deprecated**), `label?`, `secondaryText?`, `error?=false`, `disabled?`, `readOnly?`, `required?`, `name?`, `value?`.
- **Anatomy:** `Root` › `Thumb`; with `label`, wrapped in `<label>` with optional `secondaryText`.
- **Dimensions/tokens:** track 40×24, `--radius-full`; thumb 20×20, slides `translateX(16px)` when checked; checked track `--interaction-primary-default`. Error → negative track + `--shadow-focus-error`.
- **Behavior:** renders the bare control when no `label`; both `onCheckedChange` and legacy `onChange` fire.

### 4.23 Tabs

Sibling panels with a sliding active indicator. **Wraps:** Base UI `Tabs`.

- **Exports:** `Tabs`; types `TabsOrientation`, `TabItem`, `TabsProps`. `TabItem = { value; label; icon?; content; disabled? }`.
- **Props:** `items`, `value?`, `defaultValue?`, `onValueChange?(value: string)`, `orientation?='horizontal'` (`horizontal | vertical`).
- **Anatomy:** `List` › `Tab` + animated `Indicator`; `Panel` per item.
- **Dimensions/tokens:** tab `padding: 12px`, `--radius-m`; 2px indicator `--interaction-primary-default` driven by `--active-tab-width/left` (horizontal) or `--active-tab-height/top` (vertical).
- **Behavior:** uncontrolled default falls back to the first item; panels are read from the same `items` array.

### 4.24 Accordion

Stack of headers expanding to reveal content. **Wraps:** Base UI `Accordion`.

- **Exports:** `Accordion`; types `AccordionItemData`, `AccordionProps`. `AccordionItemData = { value; title; content; disabled? }`.
- **Props:** `items`, `value?: string[]`, `defaultValue?`, `onValueChange?(value: string[])`, `multiple?=false`, `disabled?`.
- **Anatomy:** `Item` › `Header` › `Trigger` (+ chevron) + `Panel`.
- **Dimensions/tokens:** items divided by `border-b --border-light`; panel animates `height: var(--accordion-panel-height)`; chevron rotates 180° on open.
- **Behavior:** single-open by default; `multiple` allows several panels open; value is a string array.

### 4.25 Collapsible

Single trigger that shows/hides one region. **Wraps:** Base UI `Collapsible`.

- **Exports:** `Collapsible`; type `CollapsibleProps`.
- **Props:** `trigger: ReactNode`, `open?`, `defaultOpen?`, `onOpenChange?(open: boolean)`, `disabled?`, `hideChevron?=false`.
- **Anatomy:** `Trigger` (+ optional chevron) › `Panel`.
- **Dimensions/tokens:** trigger `padding-y: 8px`, `--radius-m`, `text-s`; panel animates `height: var(--collapsible-panel-height)`; chevron 16×16.
- **Behavior:** one open/close region with an optional built-in chevron affordance.

### 4.26 Breadcrumb

Hierarchical trail to the current page. **No primitive — `nav > ol > li`.**

- **Exports:** `Breadcrumb`; types `BreadcrumbItem`, `BreadcrumbProps`. `BreadcrumbItem = { label; href?; onClick? }`.
- **Props:** `items`, `separator?` (default chevron), `label?='Breadcrumb'` (nav landmark name).
- **Dimensions/tokens:** `gap: 8px`, crumbs `text-s` + `--radius-s`; separator 16×16, `--icon-secondary`.
- **Behavior:** renders a link when `href`, a button when only `onClick`, plain text otherwise; the last crumb is non-interactive with `aria-current="page"`.

### 4.27 Pagination

Page navigation with a truncated window. **No primitive — `nav > ul > li > button`.**

- **Exports:** `Pagination`, `getPaginationRange` (helper); type `PaginationProps`.
- **Props:** `page: number` (1-based), `pageCount: number`, `onPageChange?(page: number)`, `siblingCount?=1`.
- **Helper:** `getPaginationRange(page, pageCount, siblingCount=1): Array<number | 'ellipsis'>`.
- **Dimensions/tokens:** cells `min-width: 40px`, `height: 40px`, `--radius-m`; active `--interaction-primary-default` on `--surface-page` text; prev/next icon cells 40px.
- **Behavior:** keeps first/last + current ±siblings in view, inserting `ellipsis` markers; ignores out-of-range / same-page clicks.

### 4.28 Separator

One-pixel divider, optionally labeled. **Wraps:** Base UI `Separator` (plain `div role=separator` for the labeled case).

- **Exports:** `Separator`; types `SeparatorOrientation`, `SeparatorProps`.
- **Props:** `orientation?='horizontal'` (`horizontal | vertical`), `label?` (horizontal only).
- **Dimensions/tokens:** line `--border-light`; horizontal `height: 1px; width: 100%`, vertical `width: 1px; align-self: stretch`; label `text-s --text-secondary`.
- **Behavior:** a horizontal separator with `label` renders the label centered between two rules; a string label becomes the accessible name.

### 4.29 Popover

Floating surface anchored to a trigger. **Wraps:** Base UI `Popover`.

- **Exports:** `Popover`, `PopoverArrowSvg` (**@deprecated** — a back-compat re-export of the shared internal arrow; prefer `showArrow`); types `PopoverSide`, `PopoverAlign`, `PopoverWidth`, `PopoverProps`.
- **Props:** `trigger: ReactElement` (cloned via `render`), `title?` (wires `aria-labelledby`), `description?` (wires `aria-describedby`), `open?`, `defaultOpen?`, `onOpenChange?(open: boolean)`, `side?='bottom'`, `align?='center'`, `sideOffset?=8`, `showArrow?=false`, `modal?=false`, `width?='m'` (`s | m | l | auto`). Rest props and `ref` land on the popup, the styleable surface.
- **Anatomy:** `Trigger` › `Portal` › `Positioner` › `Popup` (+ `Arrow`, `Title`, `Description`).
- **Dimensions/tokens:** popup `max-width: calc(100vw - 32px)`, `padding: 16px`, `--radius-l`, `--elevation-l`; width from the shared overlay scale — `s` 256 / **`m` 280 (default)** / `l` 320 / `auto` (no fixed width, shrink to content). The root carries `data-width`. The scale is shared with ContextMenu (§4.8) from one place, `overlayWidths` in `src/lib/overlay/chrome.ts`; `m` stays an arbitrary 280px because 280 sits between the 256 and 320 spacing steps.
- **Behavior:** non-modal by default; `modal` traps focus and locks scroll; title/description auto-wire ARIA.

### 4.30 Dialog

Centered modal for focused tasks. **Wraps:** Base UI `Dialog`.

- **Exports:** `Dialog`, `dialogBackdropClassName`, `dialogPopupClassName` (shared class strings); types `DialogSize`, `DialogAction`, `DialogProps`.
- **Props:** `title`, `trigger?: ReactElement`, `description?`, `primaryAction?`, `secondaryAction?`, `showClose?=true`, `size?='m'` (`s | m | l`), `open?`, `defaultOpen?`, `onOpenChange?(open: boolean)`. `DialogAction = { label; variant?; onClick?; closeOnClick?=true }`.
- **Anatomy:** `Trigger` › `Portal` › `Backdrop` + `Popup` › `Title` + `Description` + body + footer + `Close`.
- **Dimensions/tokens:** sizes `s`=400 / `m`=512 / `l`=640 px wide; popup `--radius-xl`, `padding: 24px`, `--elevation-l`; backdrop `rgba(0,0,0,.4)`. Primary action defaults to `filled`, secondary to `outlined`.
- **Behavior:** footer actions are anchored bottom-**left** (`justify-start`) with the primary CTA first/leftmost, then the secondary; actions close after `onClick` unless `closeOnClick: false`; corner close button optional.

### 4.31 AlertDialog

Compact confirmation modal for consequential actions. **Wraps:** Base UI `AlertDialog` (reuses Dialog's backdrop/popup classes).

- **Exports:** `AlertDialog`; types `AlertDialogTone`, `AlertDialogProps`.
- **Props:** `title`, `description?`, `trigger?: ReactElement`, `confirmLabel?='Confirm'`, `cancelLabel?='Cancel'`, `onConfirm?`, `onCancel?`, `tone?='default'` (`default | danger`), `open?`, `defaultOpen?`, `onOpenChange?`.
- **Dimensions/tokens:** fixed `width: 400px`; `danger` confirm → `--border-negative-strong` bg + white text.
- **Behavior:** footer actions are anchored bottom-**left** (`justify-start`) with the confirm CTA first/leftmost, then cancel; both confirm and cancel are wrapped in `Close` (always dismiss via a choice); no corner close button.

### 4.32 Skeleton

Pulsing placeholder for loading content. **No primitive — decorative `div`/`span` (`aria-hidden`).**

- **Exports:** `Skeleton`; types `SkeletonVariant`, `SkeletonProps`.
- **Props:** `variant?='rectangular'` (`text | rectangular | circular`), `width?: number | string`, `height?: number | string`, `lines?: number` (text only). Numeric `width`/`height` coerce to `px`.
- **Dimensions/tokens:** `--surface-neutral` bg + `animate-pulse`; text `height: 1em` + `--radius-s`, rectangular `--radius-l`, circular `--radius-full`.
- **Behavior:** `variant="text"` with `lines > 1` renders N stacked lines, the last shortened to 60%.

### 4.33 Toast

Transient, imperatively-triggered notifications. **Wraps:** Base UI `Toast`.

- **Exports:** `ToastProvider`, `useToast` (= `Toast.useToastManager`); types `ToastTone`, `ToastProviderProps`.
- **Provider props:** `children`, `timeout?` (auto-dismiss ms; `0` disables), `limit?` (max concurrent).
- **Tones:** `neutral | success | error | warning | info`, set per toast via `type` — each maps to a `border-l-4` accent + icon (Bell / CheckCircle / WarningOctagon / Warning / Info). Unknown `type` → `neutral`.
- **Anatomy:** `Provider` › `Portal` › `Viewport` › `Root` › icon + `Title` + `Description` + optional `Action` + `Close`.
- **Dimensions/tokens:** toast `padding: 16px 40px 16px 16px`, `--radius-l`, `--elevation-l`; viewport fixed bottom-right, `width: 400px`, `z-index: 100`.
- **Behavior:** wrap the app once in `ToastProvider`; call `useToast().add({ title, description, type, actionProps? })` from any descendant to push, close, or update toasts.

### 4.34 Tooltip

Small label revealed on hover/focus. **Wraps:** Base UI `Tooltip`. *(Promoted from §7 spec-only — now built.)*

- **Exports:** `Tooltip`, `TooltipProvider`; types `TooltipSide`, `TooltipAlign`, `TooltipProps`, `TooltipProviderProps`.
- **Props:** `trigger: ReactElement` (cloned via `render`), `children` (content), `side?='top'`, `align?='center'`, `sideOffset?=8`, `showArrow?=true`, `delay?=200`, `closeDelay?=0`, `open?`, `defaultOpen?`, `onOpenChange?` (plus any Base UI `Popup` prop via `...rest`).
- **Anatomy:** `Provider` › `Root` › `Trigger` + `Portal` › `Positioner` › `Popup` (+ `Arrow`). Each `Tooltip` self-provides; mount the optional standalone `TooltipProvider` (`delay?=200`, `closeDelay?=0`) once near the app root so moving between adjacent tooltips skips the reopen delay (Base UI delay grouping).
- **Dimensions/tokens:** popup `padding: 8px 12px`, `max-width: 260px`, `--surface-strong` bg + `--surface-light` text, `--radius-m`, `--elevation-l`, `text-s`; 20×10 arrow on one of four sides.
- **Behavior:** supplemental only — never the sole label for a control; pair with `aria-describedby`/`aria-label` on the trigger. (Note: implemented on `--surface-strong`, not the `--surface-inverted` the original §7 spec proposed.)

### 4.35 Calendar

Month grid for date selection. **Wraps:** `react-day-picker` v9 `DayPicker`.

- **Exports:** `Calendar`; type `CalendarProps` (= `ComponentProps<typeof DayPicker>` — the full DayPicker API).
- **Props:** everything DayPicker takes — `mode` (`single | multiple | range`) with the matching `selected`/`onSelect`, `showOutsideDays?=true`, `startMonth`/`endMonth` (nav bounds), `disabled` matchers, `captionLayout`, `dir` (RTL), `defaultMonth`, plus `className` and a `classNames` map that merges over the OGCR defaults.
- **Anatomy/tokens:** root `padding: 16px`, `--surface-light`; nav + day buttons 36×36, `--radius-m`; weekday header `text-xs --text-secondary`; nav chevrons swapped for Phosphor `CaretLeft/Right`.
- **Selection layering:** the range band is the **cell** background (`--interaction-primary-focus`); the round endpoint fill is on the **day button** (`--interaction-primary-default` + white text); `range_middle` resets its own button so only the band shows; `today` is a ring (`--interaction-primary-default`), not a text color, so it never fights selected-text.
- **Behavior:** consumers do **not** import `react-day-picker/style.css` — styling is fully class-driven here. RTL nav is handled by DayPicker when `dir="rtl"` is passed through.

### 4.36 DatePicker

Single-date field that opens a Calendar in a Popover. **Composition:** Popover + Calendar.

- **Exports:** `DatePicker`; type `DatePickerProps`.
- **Props:** `value?: Date`, `defaultValue?`, `onChange?(date: Date | undefined)`, `placeholder?='Select date'`, `disabled?`, `minDate?` / `maxDate?` (disable out-of-range days **and** limit Calendar nav), `disabledDates?: Matcher | Matcher[]`, `clearable?=false`, `formatOptions?: Intl.DateTimeFormatOptions` (default `{ year:'numeric', month:'short', day:'numeric' }`), `error?=false`, `required?`, `id?`, `aria-label`/`-describedby`/`-invalid`.
- **Anatomy:** `[data-slot=date-picker]` › Popover `[data-slot=date-picker-trigger]` (`[data-slot=date-picker-value]` + calendar icon, or `[data-slot=date-picker-clear]` ✕) › `Calendar mode="single"`.
- **Dimensions/tokens:** trigger `height: 48px`, `width: 240px`, `padding: 0 16px`, `--radius-l` — mirrors Input; invalid → `--border-negative-strong` + `--shadow-focus-error`.
- **Behavior:** controlled or uncontrolled; selecting a day closes the popover; forwards `id` / `aria-describedby` / `aria-invalid` / `required` to the trigger so `FormField` lights it up exactly like `Input` (`error` is the standalone equivalent of `aria-invalid`); `clearable` overlays an ✕ when a date is set. Free-text entry, `DateRangePicker`, and a `locale` prop are deferred — see `docs/component-pickups-plan.md`.

### 4.37 Menu

Click-triggered dropdown menu — the richer sibling of ContextMenu. **Wraps:** Base UI `Menu`.

- **Exports:** `Menu`; types `MenuItem` (union) + `MenuActionItem`, `MenuCheckboxItem`, `MenuRadioGroupItem`, `MenuLinkItem`, `MenuSeparatorItem`, `MenuGroupItem`, `MenuSubItem`, `MenuProps`.
- **Props:** `trigger: ReactElement` (cloned via `render`), `items: MenuItem[]`, `open?`, `defaultOpen?`, `onOpenChange?(open)`, `side?='bottom'`, `align?='start'`, `sideOffset?=8`, `showArrow?=false`, `maxHeight?` (scrolls overflowing items).
- **Item model:** `action` (`icon?`, muted `shortcut?` hint, `onSelect`, `disabled?`, `destructive?`), `checkbox` (check glyph), `radio-group` (filled-dot indicator, single-select), `link` (`href`), `separator`, `group` (optional uppercase label), and `submenu` (recursive `items`, opens to the right). Use `ContextMenu` for a plain action list; reach for `Menu` when you need state-bearing items or nesting.
- **Anatomy/tokens:** popup `min-w: 220px`, `max-w: 320px`, `padding: 8px`, `--surface-light`, `--border-light`, `--radius-l`, `--elevation-l`; items `py-8 px-12`, `--radius-m`, `text-s`; highlighted `--surface-neutral`; destructive `--text-negative` / hover `--surface-negative`.
- **Behavior:** `maxHeight` scrolls via native overflow (keyboard-aware — deliberately **not** the `ScrollArea` component, which would fight scroll-into-view); Base UI's `menu` part has no `Separator`, so separators render as a styled `role="separator"`; checkbox/radio items stay open on click (`closeOnClick=false`).

### 4.38 ScrollArea

Styled, cross-browser custom scrollbar. **Wraps:** Base UI `ScrollArea`.

- **Exports:** `ScrollArea`; type `ScrollAreaProps`.
- **Props:** `children`, `maxHeight?: number | string` (constrains the viewport so content clips), `orientation?='vertical'` (`vertical | horizontal | both`), `scrollbars?='hover'` (`hover | always`), `className`, `viewportClassName` (e.g. inner padding).
- **Anatomy:** `Root [data-slot=scroll-area]` › `Viewport` (children) + `Scrollbar [data-slot=scroll-area-scrollbar]` › `Thumb` + `Corner`.
- **Dimensions/tokens:** scrollbar 10px thick, `padding: 2px`; thumb `--radius-l`, `--border-medium` → hover `--border-strong`.
- **Behavior:** pass `maxHeight` (or a height-constrained `className`) so the viewport actually clips and scrolls; the thumb auto-hides when idle and appears on hover/scroll, or stays visible whenever content overflows when `scrollbars="always"`.

### 4.39 Toolbar

Roving-focus container for grouped controls. **Wraps:** Base UI `Toolbar`.

- **Exports:** `Toolbar`, `ToolbarButton`, `ToolbarGroup`, `ToolbarSeparator`, `ToolbarLink`, `ToolbarInput`; types `ToolbarOrientation`, `ToolbarDensity`, `ToolbarProps`, and each part's `*Props`.
- **Props:** `Toolbar` — `children`, `orientation?='horizontal'` (`horizontal | vertical`), `density?='comfortable'` (`comfortable | compact`), `aria-label` (names the `role="toolbar"` landmark), `className`. Parts extend their Base UI component props; `ToolbarButton` accepts `render` to project an existing control (e.g. a `Toggle` / `ToggleGroup`) into the roving-focus model — which works because those two forward rest props and `ref` (§4.21). A wrapper with a closed prop set cannot be projected: Base UI passes the roving-focus wiring as ordinary props and they would be swallowed.
- **Dimensions/tokens:** container `--surface-light`, `--border-light`, `--radius-l`; interactive parts 36px (comfortable) / 32px (compact) tall via density context, `--radius-m`, hover `--surface-neutral`, `--shadow-focus-primary`; separator 1px `--border-light`.
- **Behavior:** arrow keys move between items and only one item is in the tab order; `density` is set once on `Toolbar` and flows to the parts through context; `ToolbarInput` is a search/filter field that stays in the roving-focus order. Overflow / "more"-menu collapsing is deferred — see `docs/component-pickups-plan.md`.

### 4.40 SideNavigation

The app-shell sidebar: a collapsible desktop rail with nested sections, badges and a user chip, and a drawer on mobile. Sibling of the top-bar `Navigation` (§4.12) — same item contract, different chrome. **Wraps:** Base UI `Dialog` (mobile drawer only); the desktop rail is a plain `<aside>`.

- **Exports:** `SideNavigation`; types `SideNavigationItem`, `SideNavigationChild`, `SideNavigationUser`, `SideNavigationProps`. The `render` prop's type, `NavRender`, is exported once from the Navigation module and shared.
- **Props:**
  - `items: SideNavigationItem[]`, `activeId: string`, `onSelect?(id: string)` — `activeId` may name a parent *or* a child.
  - `product?` (name beside the logo), `trailing?` (nodes above the user chip), `user?: SideNavigationUser` (`{ name, role?, initials }`), `onUserAction?`.
  - `collapsed?` / `onToggleCollapsed?(next)` / `defaultCollapsed?=false` — controlled or uncontrolled rail width.
  - `defaultExpandedIds?: string[]` — which sections start open. Omit it and the parent of `activeId` opens automatically. Expansion is uncontrolled by design; there is no `expandedIds` prop.
  - `layout?='desktop'` (`desktop | mobile`), `mobileTrigger?` (extra chrome in the mobile top bar, left of the hamburger).
  - Plus any `<aside>` prop (`onSelect` is `Omit`ted — it collides with the DOM event). **The mobile branch does not forward `...rest`**; only `className` reaches the drawer.
- **Item model:** `SideNavigationItem = { id, label, icon, badge?, children?, href?, render? }`; `SideNavigationChild = { id, label, badge?, href?, render? }`.
- **Anatomy (desktop):** `[data-slot=sidebar]` › brand block (LogoMark + divider + `product` + collapse toggle) › `[data-slot=sidebar-nav]` (`<nav aria-label="Sections">` › `ul` › rows › nested `ul`) › footer (`trailing` + user chip).
- **Anatomy (mobile):** `[data-slot=sidebar-mobile]` top bar (LogoMark + `product` + `mobileTrigger` + hamburger) › Dialog `Portal` › `Backdrop` + `[data-slot=sidebar-mobile-drawer]`.
- **Dimensions/tokens:**
  - Rail **264px expanded / 72px collapsed**, `padding: 16px` (8px horizontal when collapsed), `--surface-light`, right hairline `--border-light`, `--radius-l` on the left corners, width/padding transition 200ms.
  - Rows 40px tall, `padding: 0 12px`, `gap: 12px`, `--radius-m`; label `text-s` medium, `letter-spacing: 0.28px`; icon slot 20×20 (`--icon-secondary`, `--icon-primary` when active or hovered). Active row: `--interaction-primary-focus` background + `--text-primary`, plus a 3px `--interaction-primary-default` marker on the left edge (expanded only). Collapsed rows become 40×40 centered squares and take a native `title` tooltip.
  - Child rows sit in a list indented behind a 1px `--border-light` rule, min-height 32px, `padding: 4px 12px`, `--radius-s`; the active child gets a 2px `--interaction-primary-default` pip on the rule.
  - Badges: pill-shaped 20px-tall chips, 11px semibold, `--surface-neutral` (or `--surface-light` on an active row).
  - Brand block reserves 128px min-height; LogoMark 36px expanded / 28px collapsed; collapse toggle 32×32 with `aria-expanded` and an "Expand/Collapse navigation" label.
  - Mobile: 56px top bar; drawer `88vw` capped at 360px, full `100svh`, slides from the left, `--elevation-l`; scrim is a translucent navy wash with a 2px backdrop blur, one layer below the drawer.
- **Behavior:**
  - **Element choice per row is the Navigation contract** (§4.12): `href` → `<a href>`, `render` → your framework's link, neither → `<button type="button">`. `onSelect` fires either way, and it applies to children too.
  - **One deliberate exception:** while a parent owns an *expanded* sub-list, that row is a disclosure control — it carries `aria-expanded`/`aria-controls`, clicking it opens the list, and its `href`/`render` are ignored. Put the `href` on the children. When the rail is **collapsed** there is no sub-list to disclose, so the parent's `href` is honoured and the row selects.
  - `aria-current="page"` marks the row whose `id` is `activeId`. A collapsed rail (or a closed section) shows the parent as active when one of its children is.
  - Selecting an item on mobile closes the drawer. `collapsed` is forced off in the mobile layout.
  - The user chip is a button named `Account · {name}`; it renders the Avatar alone when collapsed.
  - Rows and the user chip take a 2px `--interaction-primary-default` focus outline at 2px offset (an outline reads better against a tinted row than the halo ring); the chrome buttons — collapse toggle, hamburger, drawer close — use the shared `--focus-primary` ring.

---

## 5. Iconography

Style: stroke icons. All icons share:
- `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.6"`, `stroke-linecap="round"`, `stroke-linejoin="round"`.
- Size in containers: 20px (controls/inline), 24px (buttons, message, nav, table headers), 16px (dense lists). Logical default: 20.
- Color: inherit `currentColor` from parent. Defaults: `--icon-primary` (default), `--icon-secondary` (de-emphasized), state-tinted from `--icon-{positive,warning,negative}`.

Reference set (used by current code; production should swap for Phosphor equivalents). All paths are 24×24:

```html
<!-- arrow-right -->
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <line x1="5" y1="12" x2="19" y2="12" />
  <polyline points="12 5 19 12 12 19" />
</svg>

<!-- arrow-left -->
<svg …>
  <line x1="19" y1="12" x2="5" y2="12" />
  <polyline points="12 19 5 12 12 5" />
</svg>

<!-- search -->
<svg …>
  <circle cx="11" cy="11" r="7" />
  <line x1="21" y1="21" x2="16.65" y2="16.65" />
</svg>

<!-- mail -->
<svg …>
  <rect x="3" y="5" width="18" height="14" rx="2" />
  <polyline points="3 7 12 13 21 7" />
</svg>

<!-- x (close) -->
<svg …>
  <line x1="6" y1="6" x2="18" y2="18" />
  <line x1="18" y1="6" x2="6" y2="18" />
</svg>

<!-- check-circle -->
<svg …>
  <circle cx="12" cy="12" r="9" />
  <polyline points="8 12.5 11 15 16 9" />
</svg>

<!-- info -->
<svg …>
  <circle cx="12" cy="12" r="9" />
  <line x1="12" y1="11" x2="12" y2="17" />
  <circle cx="12" cy="8" r="0.6" fill="currentColor" stroke="none" />
</svg>

<!-- warning (triangle) -->
<svg …>
  <polygon points="12 3 22 20 2 20 12 3" />
  <line x1="12" y1="10" x2="12" y2="14" />
  <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
</svg>

<!-- warning-octagon -->
<svg …>
  <polygon points="8 3 16 3 21 8 21 16 16 21 8 21 3 16 3 8 8 3" />
  <line x1="12" y1="8" x2="12" y2="13" />
  <circle cx="12" cy="16" r="0.6" fill="currentColor" stroke="none" />
</svg>

<!-- squares-four -->
<svg …>
  <rect x="4" y="4" width="7" height="7" />
  <rect x="13" y="4" width="7" height="7" />
  <rect x="4" y="13" width="7" height="7" />
  <rect x="13" y="13" width="7" height="7" />
</svg>

<!-- flask -->
<svg …>
  <path d="M9 3h6" />
  <path d="M10 3v6L4 19a2 2 0 0 0 1.7 3h12.6A2 2 0 0 0 20 19l-6-10V3" />
  <path d="M7 15h10" />
</svg>

<!-- chart-bar -->
<svg …>
  <line x1="3" y1="20" x2="21" y2="20" />
  <rect x="6" y="11" width="3" height="9" />
  <rect x="11" y="6" width="3" height="14" />
  <rect x="16" y="14" width="3" height="6" />
</svg>

<!-- folder -->
<svg …>
  <path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
</svg>

<!-- user -->
<svg …>
  <circle cx="12" cy="9" r="4" />
  <path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
</svg>

<!-- bell -->
<svg …>
  <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 6 1.5 6h-15S6 13 6 9z" />
  <path d="M10 19a2 2 0 0 0 4 0" />
</svg>

<!-- dots-three -->
<svg …>
  <circle cx="6" cy="12" r="1" fill="currentColor" />
  <circle cx="12" cy="12" r="1" fill="currentColor" />
  <circle cx="18" cy="12" r="1" fill="currentColor" />
</svg>
```

Production icon set: Phosphor (~18,000 glyphs). Each ships 6 weights × 2 formats. Defaults: weight `Regular`, format `Stroke`. Use `Fill` only for selected/active states.

### The shipped set — 48 glyphs, re-exported under stable names

The library re-exports a curated slice of Phosphor under `*Icon` names, grouped as *navigation & chrome* (11), *actions* (9), *status & feedback* (9) and *objects & domain* (19). Two things every re-export guarantees:

1. **Decorative by default** — each carries `aria-hidden`, because icons in this system sit inside a labelled control or beside visible text. Pass Phosphor's `alt` prop (renders a `<title>`) or `aria-hidden={false}` for a meaningful standalone icon.
2. **Stable public names** — the `*Icon` suffix and the OGCR aliases are the contract; the underlying glyph can change without breaking a consumer. Current aliases: `SearchIcon` ← `MagnifyingGlass`, `MailIcon` ← `Envelope`, `PanelLeftIcon` ← `SidebarSimple`, `GlobeIcon` ← `GlobeHemisphereWest`, `MapIcon` ← `MapTrifold`, `CalendarIcon` ← `CalendarBlank`.

Color follows `currentColor` (Phosphor renders with `fill`), size defaults to `1em` and is set by the `size`/`width`/`height` props or a CSS rule on the svg.

**Apps must not import from `@phosphor-icons/react` directly.** A raw import loses the `aria-hidden` default and re-opens the naming contract. Two supported ways to get a glyph that isn't in the set:

- add it to the set (preferred, if it will be used more than once), or
- wrap it with the exported **`createDecorativeIcon(Glyph, displayName)`** — the same wrapper the set itself is built from:

```tsx
import { createDecorativeIcon } from '@majistudio/ogcr-design-system'
import { Tractor } from '@phosphor-icons/react'

const TractorIcon = createDecorativeIcon(Tractor, 'TractorIcon')
```

The types **`PhosphorIcon`** (the glyph component type) and **`PhosphorIconProps`** are re-exported too, so an app can type an icon slot (`icon: PhosphorIcon`) without taking a direct dependency on Phosphor. They are renamed on the way out to keep a bare `Icon` off the barrel.

---

## 6. Logo

Two React exports from `src/components/Logo/`:

- **`Logo`** — full mark + "OGCR" wordmark. Native SVG 129×46. Use at sizes where the wordmark stays legible (≥ ~88px wide). The hero is currently the only place this is used.
- **`LogoMark`** — icon only (no wordmark). Native SVG 50×45. Use anywhere the wordmark would render too small to read — top nav, side nav rail (collapsed and expanded), favicon-style placements.

Both accept `width` (number, px) and preserve their native aspect ratio (height is computed). Both accept any `SVGProps<SVGSVGElement>` plus an optional `title` (default `"OGCR"`) for the `aria-label`. Keep contrast ≥ WCAG AA against the chosen surface.

The two brand colors are painted with the `fill-brand-blue-800` / `fill-brand-green-500` utilities rather than hard-coded path fills, so the mark retints with the palette like everything else. Variants in Figma: full-color, mono white/blue/black, horizontal/vertical.

```tsx
import { Logo, LogoMark } from '@majistudio/ogcr-design-system'

<Logo width={129} />          {/* hero */}
<LogoMark width={36} />       {/* top nav, side nav (expanded) */}
<LogoMark width={28} />       {/* side nav (collapsed) */}
```

---

## 7. Components — spec only, not yet built

These have Figma specs but no code yet. Implement when needed, following §1 tokens.

> Icon Button is now built — it is Button's `iconOnly` mode, see §4.1. The old spec's
> 32×32 / 40×40 squares are `size="s"` / `size="m"`, and 48px `l` is a new third step.
> Tooltip is now built — see §4.34.

### 7.2 Charts
Five primitives in Figma: `Area Chart Interactive`, `Area Chart`, `Bar Chart`, `Line Chart`, `Pie Chart`.
- Primary series: `--interaction-primary-default`.
- Additional series: rotate through brand + primitive palette.
- Axis labels: `text-body-s`, `--text-secondary`.

### 7.3 Map
Reference implementation only. Recommendation in Figma: prefer open-source / MapBox. Wrap behind an app-side `Map` component to avoid vendor lock-in.

---

## 8. Accessibility

- Min hit target: 40×40 for any interactive control, even when visual is smaller (Checkbox box is 16 — wrap the label). **Button now enforces this by default**: the `text` variant is 40px tall, and the 32px `size="s"` is documented as valid only inside a larger padded row.
- **Icon-only controls must carry an accessible name**, and for `Button` this is enforced at the *type* level — `iconOnly: true` without `aria-label`/`aria-labelledby` does not compile (§4.1).
- Focus ring: the shared two-stop `--focus-primary` / `--focus-secondary` / `--focus-error` (§1) — a 2px `--surface-light` halo plus a 4px ring in the solid tone of the family. Every focusable control in the library uses one of the three; a few nav rows use a 2px outline at 2px offset instead, where an outline reads better against a tinted row. Do **not** hand-roll a pale 3px ring: the pale `*-focus` tints fail WCAG SC 2.4.11 against `--surface-page`.
- Error focus ring: `--focus-error` everywhere (Input, Checkbox, Radio, NumberField, Slider, Switch). There is no `--focus-ring-error` color token any more.
- Contrast: every text/icon token must clear WCAG AA against the chosen surface. `--text-secondary` (#6a8196) on `--surface-light` is ~4.5:1 — fine for body, audit for small text.
- ARIA: dialogs (Sidesheet, Dialog, AlertDialog) get `role="dialog"` + `aria-modal`; menus get `role="menu"` / `role="menuitem"`; messages get `role="alert"` **only** for the error state and `role="status"` otherwise (§4.9 — `alert` interrupts the screen reader); progress bars get `role="progressbar"` + `aria-valuenow`/`min`/`max`.
- Hidden native inputs (Checkbox/Radio) must remain keyboard-reachable; use the visually-hidden `clip` pattern, not `display:none`.
- Tooltip is supplemental, never the only label. `aria-describedby`.

---

## 9. Appendix: Figma source

Keep for designers/Code-Connect. Engineers without Figma access can ignore this section.

```
file:        https://www.figma.com/design/2P6XrQJhT8I39IR5LGK7RT (OGCR – Design System)
library key: lk-fe936dd…6a5b062
pages:       1:2  Tokens
             1:4  Modules
             0:1  Assets (icons + logos)
tokens root: 8:420
```

Component sets (Figma componentKeys):

| Component | componentKey |
| --- | --- |
| button | `c8c4409236e58565c5a200f3172b0c9e5ee64ebb` |
| icon-button | `53b70920220c0b6f002e883068fd036c4cfa6417` |
| RadioButton | `ae823c3e03f1e1336cc5cab93327491217e59745` |
| tooltip | `3abda8406c3f323b3d267b1a473918cae6446736` |
| instance-slot | `8a8ef3aae5700c50b46ef5616f7054077de68ebf` |

Module nodes:

| Module | Node |
| --- | --- |
| Navigation | `2097:3591` |
| KPI | `6001:1958` |
| Maps | `6001:1952` |
| Charts | `6103:3689` |
| Context menu | `6001:1963` |
| Cards | `6001:1968` |
| Sidesheet | `6001:24638` |
| Message | `6052:1184` |
| Table | `6103:2882` |

Component-set source nodes (referenced when this file was extracted):

| Component | Node |
| --- | --- |
| Input field | `4011:1499` |
| Card | `6064:722` |
| Checkbox | `6029:687` |
| Radio | `6059:1143` |
| Pill | `2111:4296` |
| Progress Bar | `6025:562` |
| Context Menu | `6063:1658` |
| Message | `6052:1186` |
| Sidesheet | `6103:2880` |
| KPI | `6063:1279` |
| Navigation desktop | `6140:3865` |
| Navigation mobile | `6072:2172` |

Useful MCP calls:
- `mcp__plugin_figma_figma__get_libraries` — library key lookup.
- `mcp__plugin_figma_figma__get_variable_defs` on `8:420` — full token dump.
- `mcp__plugin_figma_figma__get_metadata` on `1:4` — modules tree.
- `mcp__plugin_figma_figma__get_design_context` on a component node id — spec + reference React/Tailwind code.
- `mcp__plugin_figma_figma__search_design_system` with `includeLibraryKeys: ['lk-fe936dd…6a5b062']` — scope to OGCR.

Icons not yet pulled into the Figma file as components (code re-exports Phosphor from `src/components/icons/` — see §5). Phosphor categories in Figma: Weather & Nature `6152:3505`, System & Devices `6152:105822`, Education `6152:138748`, Security & Warnings `6152:138746`, Development `6152:138744`, People `6152:138742`, Arrows `6152:138740`, Commerce `6152:138738`, Office & Editing `6152:138736`, Math & Finance `6152:138734`, Health & Wellness `6152:102768`, Brands `6152:96660`, Design `6152:93606`, Games `6152:90552`, Time `6152:87498`, Media `6152:84444`, Maps & Travel `6152:81390`, Communication `6152:78336`. Logo symbol frame: `2005:1524`.
