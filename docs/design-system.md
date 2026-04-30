# OGCR Design System

Self-contained spec. Rebuild in any stack from this file alone. Reference React code in `src/components/` is one valid implementation; CSS below is the source of truth. When in doubt: CSS in this doc wins over Figma.

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
  --white: #ffffff;

  /* Text */
  --text-primary: #0f3655;
  --text-secondary: #6a8196;
  --text-neutral: #334155;
  --text-positive: #416c51;
  --text-negative: #b91c1c;
  --text-warning: #c2410c;

  /* Icon (mirrors text scale) */
  --icon-primary: #0f3655;
  --icon-secondary: #6a8196;
  --icon-neutral: #334155;
  --icon-positive: #416c51;
  --icon-negative: #b91c1c;
  --icon-warning: #c2410c;

  /* Surface */
  --surface-page: #f8f3ef;
  --surface-light: #ffffff;
  --surface-neutral: #f5f5f4;
  --surface-strong: #0f3655;
  --surface-inverted: #443321;
  --surface-positive: #e2efe6;
  --surface-warning: #ffedd5;
  --surface-negative: #fee2e2;

  /* Border */
  --border-light: #e7e5e4;
  --border-medium: #d6d3d1;
  --border-strong: #a8a29e;
  --border-default: #01012e14;
  --border-high-contrast: #443321;
  --border-positive-light: #c5dfce;
  --border-warning-light: #fed7aa;
  --border-negative-light: #fecaca;
  --border-negative-strong: #dc2626;

  /* Interaction */
  --interaction-primary-default: #4f8263;
  --interaction-primary-hover: #416c51;
  --interaction-primary-active: #416c51;
  --interaction-primary-focus: #e2efe6;
  --interaction-secondary-focus: #e2d0bf;
  --focus-ring-error: #fecaca;

  /* Spacing */
  --space-none: 0;
  --space-2xs: 4px;
  --space-xs: 8px;
  --space-s: 12px;
  --space-m: 16px;
  --space-l: 24px;
  --space-xl: 32px;
  --space-3xl: 64px;

  /* Radius */
  --radius-none: 0;
  --radius-xs: 2px;
  --radius-s: 4px;
  --radius-m: 8px;
  --radius-l: 12px;
  --radius-xl: 16px;
  --radius-full: 999px;

  /* Elevation */
  --elevation-l:
    0 0 2px 0 rgba(68, 51, 33, 0.08),
    0 8px 16px 0 rgba(68, 51, 33, 0.16);

  /* Typography */
  --font-family-default: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-family-display: 'Helvetica Now Display', system-ui, -apple-system, sans-serif;
  --font-family-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;

  --font-size-xs: 14px;
  --font-size-s: 16px;
  --font-size-m: 18px;
  --font-size-l: 20px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;
  --font-size-3xl: 40px;
  --font-size-4xl: 48px;
  --font-size-5xl: 64px;

  /* Motion */
  --motion-fast: 150ms ease-out;
  --motion-base: 200ms cubic-bezier(0.2, 0, 0, 1);
}
```

Token rules:
- `interaction-primary-hover` and `interaction-primary-active` resolve to the same color (`#416c51`). Differentiate active from hover via elevation/border/transform, not fill.
- `radius-l` is **12px** here (Figma sometimes labels 16). Code wins.
- `--text-secondary` on `--surface-light` is borderline WCAG AA (~4.5:1). Audit small text.
- No motion tokens beyond `--motion-fast` / `--motion-base`. Hover/state ≤150ms; layout/size ≤200ms; never >300ms in-place feedback.

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

---

## 2. Typography utilities

Mobile/tablet sizes; `@media (min-width: 1024px)` shifts to desktop sizes. Headings use weight 500 (not 700, despite "Bold" labels in older Figma).

```css
.text-h1 { font-family: var(--font-family-default); font-weight: 500; font-size: var(--font-size-2xl); line-height: 1.2; }
.text-h2 { font-family: var(--font-family-default); font-weight: 500; font-size: var(--font-size-xl); line-height: 1.2; }
.text-h3 { font-family: var(--font-family-default); font-weight: 500; font-size: var(--font-size-l); line-height: 1.2; }
.text-h4 { font-family: var(--font-family-default); font-weight: 500; font-size: var(--font-size-m); line-height: 1.2; }
.text-body { font-family: var(--font-family-default); font-weight: 400; font-size: var(--font-size-m); line-height: 1.5; }
.text-body-s { font-family: var(--font-family-default); font-weight: 400; font-size: var(--font-size-xs); line-height: 1.4; }
.text-label-button { font-family: var(--font-family-default); font-weight: 500; font-size: var(--font-size-xs); line-height: 1; letter-spacing: 0.28px; }
.text-label-input { font-family: var(--font-family-default); font-weight: 500; font-size: var(--font-size-s); line-height: 1.4; }

@media (min-width: 1024px) {
  .text-h1 { font-size: var(--font-size-3xl); }
  .text-h2 { font-size: var(--font-size-2xl); }
  .text-h3 { font-size: var(--font-size-xl); }
  .text-h4 { font-size: var(--font-size-l); }
  .text-body { font-size: var(--font-size-l); }
  .text-body-s { font-size: var(--font-size-s); }
  .text-label-button { font-size: var(--font-size-s); }
}
```

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
- `2xl` not defined; derive from m/xl if needed.

---

## 4. Components

Naming: BEM-ish, prefixed `ogcr-`. Pseudo-HTML shows the DOM the CSS expects. CSS is copy-paste; tokens already declared in §1.

### 4.1 Button

**Variants:** `filled` (default) | `outlined` | `text`

```html
<button class="ogcr-button ogcr-button--filled" type="button">
  <span class="ogcr-button__icon" aria-hidden="true"><svg>…</svg></span>
  <span class="ogcr-button__label">Label</span>
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
  --button-focus-ring: var(--interaction-primary-focus);

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
  font-size: var(--font-size-xs);
  line-height: 1;
  letter-spacing: 0.28px;
}
.ogcr-button:hover:not(:disabled) { background: var(--button-hover-bg); }
.ogcr-button:active:not(:disabled) { background: var(--button-active-bg); transform: translateY(1px); }
.ogcr-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--surface-page), 0 0 0 4px var(--button-focus-ring);
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
  --button-height: 32px;
  --button-padding-x: var(--space-xs);
  --button-radius: var(--radius-m);
  --button-bg: transparent;
  --button-border: transparent;
  --button-color: var(--text-primary);
  --button-hover-bg: var(--surface-neutral);
  --button-active-bg: var(--surface-neutral);
}
```

Behavior:
- Both icon slots optional; render only when content provided. Each icon is 24×24.
- Focus ring is double: 2px page-color inner + 2px focus-color outer (offset look without `outline-offset`).
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
  font-size: var(--font-size-xs); line-height: 1.4; color: var(--text-secondary);
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
  box-shadow: 0 0 0 3px var(--interaction-primary-focus);
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
  font-size: var(--font-size-s); line-height: 1.4; color: var(--text-primary);
}
.ogcr-input__control::placeholder { color: var(--text-secondary); font-weight: 500; }
.ogcr-input__control:disabled { cursor: not-allowed; color: var(--text-secondary); }
.ogcr-input__helper {
  margin: 0;
  font-family: var(--font-family-default); font-weight: 400;
  font-size: var(--font-size-xs); line-height: 1.4; color: var(--text-secondary);
}
.ogcr-input--error .ogcr-input__field { border-color: var(--border-negative-strong); }
.ogcr-input--error .ogcr-input__field:focus-within { box-shadow: 0 0 0 3px var(--surface-negative); }
.ogcr-input--error .ogcr-input__helper { color: var(--text-negative); }
```

Behavior:
- Label, helper, and either icon are optional.
- Use `aria-describedby` on the input pointing at the helper id.
- Error focus ring is negative-tinted (`--surface-negative`), not primary.
- Control has `flex: 1 1 0; min-width: 0` so it shrinks below content width.

### 4.3 Card

**Variants:** `floating` (boolean class) — adds elevation.

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
.ogcr-card__header { display: flex; align-items: center; justify-content: space-between; gap: var(--space-s); }
.ogcr-card__titles { display: flex; flex-direction: column; gap: var(--space-2xs); min-width: 0; }
.ogcr-card__title {
  margin: 0; font-family: var(--font-family-default); font-weight: 500;
  font-size: var(--font-size-m); line-height: 1.2; color: var(--text-primary);
}
.ogcr-card__subtitle {
  margin: 0; font-family: var(--font-family-default); font-weight: 400;
  font-size: var(--font-size-xs); line-height: 1.4; color: var(--text-secondary);
}
.ogcr-card__trailing { display: inline-flex; align-items: center; gap: var(--space-xs); flex-shrink: 0; }
.ogcr-card__body { display: flex; flex-direction: column; gap: var(--space-m); }
```

Behavior:
- Header omits if no title/subtitle/trailing supplied.
- Body omits if no children.
- Trailing typically holds a Pill, segmented control, or icon button.

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
  font-size: var(--font-size-xs); line-height: 1.4; color: var(--text-primary);
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
  box-shadow: 0 0 0 3px var(--interaction-secondary-focus);
}
.ogcr-check--error .ogcr-check__box { border-color: var(--icon-negative); }
.ogcr-check--error.ogcr-check--checked .ogcr-check__box,
.ogcr-check--error.ogcr-check--indeterminate .ogcr-check__box {
  background: var(--icon-negative); border-color: var(--icon-negative);
}
.ogcr-check--error .ogcr-check__input:focus-visible ~ .ogcr-check__box {
  box-shadow: 0 0 0 3px var(--focus-ring-error);
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
  font-size: var(--font-size-xs); line-height: 1.4; color: var(--text-primary);
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
  box-shadow: 0 0 0 3px var(--interaction-secondary-focus);
}
.ogcr-radio--error .ogcr-radio__box { border-color: var(--icon-negative); }
.ogcr-radio--error.ogcr-radio--checked .ogcr-radio__box {
  background: var(--icon-negative); border-color: var(--icon-negative);
}
.ogcr-radio--error .ogcr-radio__input:focus-visible ~ .ogcr-radio__box {
  box-shadow: 0 0 0 3px var(--focus-ring-error);
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

**Variants (tone):** `neutral` (default) | `positive` | `warning` | `negative`. Presentational only, no interactive states.

```html
<span class="ogcr-pill ogcr-pill--positive">+12%</span>
```

```css
.ogcr-pill {
  display: inline-flex; align-items: center; gap: var(--space-xs);
  padding: var(--space-2xs) var(--space-xs);
  border-radius: var(--radius-m);
  font-family: var(--font-family-default); font-weight: 400;
  font-size: var(--font-size-xs); line-height: 1.4;
  white-space: nowrap;
}
.ogcr-pill--neutral  { background: var(--surface-neutral);  color: var(--text-primary); }
.ogcr-pill--positive { background: var(--surface-positive); color: var(--text-positive); }
.ogcr-pill--warning  { background: var(--surface-warning);  color: var(--text-warning); }
.ogcr-pill--negative { background: var(--surface-negative); color: var(--text-negative); }
```

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
.ogcr-progress--blue    { --progress-fill: var(--icon-positive); }
.ogcr-progress--orange  { --progress-fill: var(--icon-warning); }
.ogcr-progress--neutral { --progress-fill: var(--text-neutral); }

.ogcr-progress__text { display: flex; align-items: flex-start; gap: var(--space-s); }
.ogcr-progress__label {
  display: inline-flex; align-items: center; gap: var(--space-xs);
  font-family: var(--font-family-default); font-weight: 400;
  font-size: var(--font-size-xs); line-height: 1.4; color: var(--text-secondary);
}
.ogcr-progress__label-icon { display: inline-flex; width: 20px; height: 20px; color: var(--icon-secondary); }
.ogcr-progress__label-icon > svg { width: 100%; height: 100%; }
.ogcr-progress__value {
  margin-left: auto;
  font-family: var(--font-family-default); font-weight: 500;
  font-size: var(--font-size-xs); line-height: 1.4; color: var(--text-primary);
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

### 4.8 ContextMenu

```html
<div class="ogcr-menu" role="menu">
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
  font-size: var(--font-size-xs); line-height: 1.4; color: var(--text-primary);
  transition: background-color var(--motion-fast), color var(--motion-fast);
}
.ogcr-menu__item:hover:not(:disabled) { background: var(--surface-neutral); }
.ogcr-menu__item:focus-visible {
  outline: none;
  background: var(--surface-neutral);
  box-shadow: 0 0 0 2px var(--interaction-secondary-focus);
}
.ogcr-menu__item:disabled { cursor: not-allowed; opacity: 0.5; }
.ogcr-menu__item--destructive { color: var(--text-negative); }
.ogcr-menu__item--destructive:hover:not(:disabled) { background: var(--surface-negative); }
.ogcr-menu__item-icon { display: inline-flex; width: 20px; height: 20px; color: var(--icon-secondary); }
.ogcr-menu__item--destructive .ogcr-menu__item-icon { color: var(--icon-negative); }
.ogcr-menu__item-icon > svg { width: 100%; height: 100%; }
```

Behavior:
- Width fixed 320px. Items full-width buttons.
- Header optional (omit if no title/status).
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
  font-size: var(--font-size-xs); line-height: 1.4; color: inherit;
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
- Border is **1.5px**, not 1.
- Per-state colors all flow through `--message-fg`, `--message-icon`, `--message-action-border` so the action button inherits theme.
- Close button only on `floating`.
- ARIA role: `alert` for `error`; `status` otherwise.

### 4.10 Sidesheet

```html
<aside class="ogcr-sidesheet" role="dialog" aria-modal="false" aria-labelledby="ss-title">
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
    <button class="ogcr-button ogcr-button--outlined">Secondary</button>
    <button class="ogcr-button ogcr-button--filled">Primary</button>
  </footer>
</aside>
```

```css
.ogcr-sidesheet {
  display: flex; flex-direction: column;
  width: 480px; max-height: 720px;
  background: var(--surface-light);
  border-radius: var(--radius-xl);
  box-shadow: var(--elevation-l);
  overflow: hidden;
}
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
- Fixed 480 wide, capped at 720 tall. Body scrolls; nav and footer stay pinned via flex.
- Body has top + bottom 1px hairlines that visually separate scroll area.
- Component is a panel, not an overlay — overlay/scrim and focus trap are app responsibility if used as a modal.
- Back button uses outlined Button + arrow-left icon. Either back button or status pill may be omitted.

### 4.11 KPI

**Variants (tone):** `positive` (default, no class) | `warning` | `negative` | `neutral`. Tone drives the 6px top accent bar color.

```html
<article class="ogcr-kpi ogcr-kpi--warning">
  <span class="ogcr-kpi__bar" aria-hidden="true"></span>
  <header class="ogcr-kpi__header">
    <span class="ogcr-kpi__label">Removals YTD</span>
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

.ogcr-kpi__bar { position: absolute; inset: 0 0 auto 0; height: 6px; background: var(--kpi-accent); }
.ogcr-kpi__header { display: flex; align-items: center; justify-content: space-between; gap: var(--space-s); padding-top: var(--space-2xs); }
.ogcr-kpi__label {
  font-family: var(--font-family-default); font-weight: 400;
  font-size: var(--font-size-xs); line-height: 1.4; color: var(--text-secondary);
}
.ogcr-kpi__value {
  font-family: var(--font-family-default); font-weight: 500;
  font-size: var(--font-size-xl); line-height: 1.2; color: var(--text-primary);
}
.ogcr-kpi__secondary {
  margin: 0; font-family: var(--font-family-default); font-weight: 400;
  font-size: var(--font-size-xs); line-height: 1.4; color: var(--text-secondary);
}
```

Behavior:
- Accent bar is decorative (`aria-hidden`) but is the primary signal of status.
- Status Pill in the header is optional, mirrors tone.

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
      <li>
        <button class="ogcr-nav__button ogcr-nav__button--active" aria-current="page">
          <span class="ogcr-nav__icon"><svg>…</svg></span>
          <span class="ogcr-nav__label">Overview</span>
        </button>
      </li>
      <li><button class="ogcr-nav__button">…</button></li>
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
  font-size: var(--font-size-xs); color: var(--text-primary);
}
.ogcr-nav__list { display: flex; align-items: center; gap: var(--space-xs); list-style: none; margin: 0; padding: 0; }
.ogcr-nav__button {
  display: inline-flex; align-items: center; gap: var(--space-s);
  height: 32px; padding: 0 var(--space-xs);
  background: transparent; border: none;
  border-radius: var(--radius-m); cursor: pointer;
  color: var(--text-secondary);
  font-family: var(--font-family-default); font-weight: 500;
  font-size: var(--font-size-xs); letter-spacing: 0.28px;
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
  font-size: var(--font-size-xs); letter-spacing: 0.28px;
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
- `aria-current="page"` on the active button.
- Mobile icon plate is 48×48 to satisfy 40×40 minimum hit target with margin.

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
    <p class="ogcr-form__footer-note">Required fields are marked *</p>
    <div class="ogcr-form__footer-actions">
      <!-- text · outlined · filled buttons -->
    </div>
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
  font-size: var(--font-size-xs); line-height: 1.45;
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
  font-size: var(--font-size-xs); line-height: 1.4;
  color: var(--text-secondary);
}
.ogcr-form__required { color: var(--text-negative); margin-left: 4px; font-weight: 500; }
.ogcr-form__helper {
  margin: 0;
  font-family: var(--font-family-default); font-weight: 400;
  font-size: var(--font-size-xs); line-height: 1.4;
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
  font-size: var(--font-size-xs); line-height: 1.4;
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
  flex-wrap: wrap; justify-content: flex-end;
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
- Field-level error: pass `errorText`; the wrapper sets `ogcr-form__field--error` and the helper turns `--text-negative`. Primitives like Input expose their own `error` boolean — the Form wrappers don't override it, they coexist.
- Required indicator: the `*` is `aria-hidden`; pair with `required` on the underlying input for assistive tech.
- Footer: left-side mono note (e.g. "Required fields are marked *"), right-side action stack. Stacks on narrow widths.

### 4.14 DataTable

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
  font-size: var(--font-size-s); font-weight: 400;
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
  font-size: var(--font-size-xs);
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
- Hover row: `--surface-neutral` background tint. Last row drops the dashed border so it doesn't double up with the table's own border.
- Empty state: single full-span cell with mono-caps copy ("No records" by default).
- Responsive: header row never wraps (`white-space: nowrap`); the wrapper `.ogcr-table__scroll` provides horizontal overflow on narrow viewports.

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

---

## 6. Logo

Two React exports from `src/components/Logo.tsx`:

- **`Logo`** — full mark + "OGCR" wordmark. Native SVG 129×46. Use at sizes where the wordmark stays legible (≥ ~88px wide). The hero is currently the only place this is used.
- **`LogoMark`** — icon only (no wordmark). Native SVG 50×45. Use anywhere the wordmark would render too small to read — top nav, side nav rail (collapsed and expanded), favicon-style placements.

Both accept `width` (number, px) and preserve their native aspect ratio (height is computed). Both accept any `SVGProps<SVGSVGElement>` plus an optional `title` (default `"OGCR"`) for the `aria-label`. Keep contrast ≥ WCAG AA against the chosen surface. Variants in Figma: full-color, mono white/blue/black, horizontal/vertical.

```tsx
import { Logo, LogoMark } from './components/Logo'

<Logo width={129} />          {/* hero */}
<LogoMark width={36} />       {/* top nav, side nav (expanded) */}
<LogoMark width={28} />       {/* side nav (collapsed) */}
```

---

## 7. Components — spec only, not yet built

These have Figma specs but no code yet. Implement when needed, following §1 tokens.

### 7.1 Icon Button
- Square hit area: 32×32 (small) or 40×40 (medium).
- Icon size 20px inside a 40px target.
- Same color/variant logic as Button minus the label.

### 7.2 Tooltip
- Bg: `--surface-inverted` (#443321). Text: `--surface-page` (#f8f3ef), `text-body-s` (Inter 14, line-height 1.4).
- Padding: 6px (y) × `--space-xs` (x). Gap: `--space-xs`. Radius: `--radius-m`.
- Arrow: 11.5×5px, on one of four sides.
- Variants: `side ∈ {top, right, bottom, left}`. Apply `--elevation-l` if floating above complex content.
- Tooltip is supplemental — never the only label for an action. Pair with `aria-describedby`.

### 7.3 Charts
Five primitives in Figma: `Area Chart Interactive`, `Area Chart`, `Bar Chart`, `Line Chart`, `Pie Chart`.
- Primary series: `--interaction-primary-default`.
- Additional series: rotate through brand + primitive palette.
- Axis labels: `text-body-s`, `--text-secondary`.

### 7.4 Map
Reference implementation only. Recommendation in Figma: prefer open-source / MapBox. Wrap behind an app-side `Map` component to avoid vendor lock-in.

---

## 8. Accessibility

- Min hit target: 40×40 for any interactive control, even when visual is smaller (Checkbox box is 16 — wrap the label).
- Focus ring (default): `box-shadow: 0 0 0 2px var(--surface-page), 0 0 0 4px var(--interaction-primary-focus)`. 3px single ring is acceptable for inline controls (Input, Checkbox box).
- Error focus ring: `box-shadow: 0 0 0 3px var(--surface-negative)` (Input) or `--focus-ring-error` (Checkbox/Radio).
- Contrast: every text/icon token must clear WCAG AA against the chosen surface. `--text-secondary` (#6a8196) on `--surface-light` is ~4.5:1 — fine for body, audit for small text.
- ARIA: dialogs (Sidesheet) get `role="dialog"`; menus get `role="menu"` / `role="menuitem"`; alerts get `role="alert"` (errors) or `role="status"` (other states); progress bars get `role="progressbar"` + `aria-valuenow`/`min`/`max`.
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

Icons not yet pulled into the file as components (rendered inline today via `src/components/icons.tsx` — see §5). Phosphor categories in Figma: Weather & Nature `6152:3505`, System & Devices `6152:105822`, Education `6152:138748`, Security & Warnings `6152:138746`, Development `6152:138744`, People `6152:138742`, Arrows `6152:138740`, Commerce `6152:138738`, Office & Editing `6152:138736`, Math & Finance `6152:138734`, Health & Wellness `6152:102768`, Brands `6152:96660`, Design `6152:93606`, Games `6152:90552`, Time `6152:87498`, Media `6152:84444`, Maps & Travel `6152:81390`, Communication `6152:78336`. Logo symbol frame: `2005:1524`.
