// Guards the color theming seam (Phase 1a). Run as `npm run check:tokens`, chained into build:lib
// after vite emits dist/styles.css.
//
// THE CONTRACT IT ENFORCES: every brand hex lives in src/styles/palette.css as a `--ds-*` runtime
// custom property; theme.css's `@theme inline` color tokens are `var(--ds-*)` references, so
// Tailwind bakes the *reference* into each color utility (themeable) rather than a literal hex
// (frozen). If anyone re-bakes a color token to a literal in theme.css, the matching utility body
// regains a hex and loses its `var(--ds-…)` — this script catches that and fails the build.
//
// HOW: palette.css is the single source of the 49 hexes. We then scan the built stylesheet's
// CLASS-selector utility rules (not :root/:host, not preflight, not the palette block) and assert
//   (negative) no color-utility body bakes one of the 49 palette hexes, and
//   (positive) a set of widely-used color tokens resolve through `var(--ds-…)`, and
//   (focus shadows) the `.shadow-focus-*` utilities still reference the semantic `var(--color-*)`
//                   tokens (which themselves resolve to `var(--ds-…)` via the emitted :root props)
//                   rather than carrying a baked hex.
//
// EXEMPT, by design: Tailwind base/reset/preflight and the `:root,:host` token blocks (not class
// utilities); alpha utilities (`color-mix(...)`); and arbitrary-value classes (`text-[#0f3655]`),
// detected because the hex also appears in the selector.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const palettePath = path.join(root, 'src', 'styles', 'palette.css');
const cssPath = path.join(root, 'dist', 'styles.css');

function fail(msg) {
  console.error(`\n✗ check:tokens — ${msg}\n`);
  process.exit(1);
}

if (!fs.existsSync(cssPath)) {
  fail(`dist/styles.css not found. Run \`npm run build:lib\` first (check:tokens runs after it).`);
}

// --- 1. Parse palette.css for the authoritative {name → hex} set ------------------------------
const paletteSrc = fs.readFileSync(palettePath, 'utf8');
const palette = new Map(); // ds-name (e.g. "ds-surface-page") → lowercased hex
for (const m of paletteSrc.matchAll(/(--ds-[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
  palette.set(m[1].slice(2), m[2].toLowerCase());
}
if (palette.size === 0) fail('parsed 0 --ds-* definitions from palette.css — parser or file broke.');

// Every hex form a minifier might emit for a given source hex, so a baked value matches regardless
// of #rrggbb vs shorthand #rgb. Returns lowercased candidate strings.
function hexForms(hex) {
  const forms = new Set([hex]);
  if (hex.length === 7) {
    const [, r1, r2, g1, g2, b1, b2] = hex;
    if (r1 === r2 && g1 === g2 && b1 === b2) forms.add(`#${r1}${g1}${b1}`); // #rrggbb → #rgb
  } else if (hex.length === 4) {
    forms.add(`#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`); // #rgb → #rrggbb
  }
  return [...forms];
}
// Match a hex only as a whole color token: the form must NOT be followed by another hex digit, so
// `#443321` does not match inside `#44332114` (the elevation shadow's minified rgba+alpha) and
// `#fff` does not match inside `#ffffff`.
function hexRe(form) {
  return new RegExp(form + '(?![0-9a-f])', 'i'); // `#` is not a regex metachar; no escaping needed
}
const hexes = [...palette.values()].flatMap((hex) =>
  hexForms(hex).map((form) => ({ hex, form, re: hexRe(form) })),
);

// --- 2. Split the built CSS into (selector, body) style rules, skipping at-rule wrappers -------
// Minified Tailwind output nests style rules inside @layer/@media/@supports. Walk brace depth and
// collect only leaf `prelude{body}` pairs whose body has declarations (no nested `{`).
// NOTE: this hand-rolled brace walker is coupled to Tailwind v4's current minified output shape
// (no CSS nesting in declaration bodies, at-rules only as wrappers). A future Tailwind that emits
// native nesting inside utility bodies would break the "leaf rule" assumption — if the positive
// checks in section 4 start failing after a Tailwind bump, revisit this parser first.
const css = fs.readFileSync(cssPath, 'utf8');
const rules = [];
{
  let i = 0;
  let prelude = '';
  const stack = []; // preludes of open blocks
  while (i < css.length) {
    const ch = css[i];
    if (ch === '{') {
      const sel = prelude.trim();
      // Find matching close brace.
      let depth = 1;
      let j = i + 1;
      let hasNested = false;
      while (j < css.length && depth > 0) {
        if (css[j] === '{') {
          depth++;
          hasNested = true;
        } else if (css[j] === '}') depth--;
        j++;
      }
      const inner = css.slice(i + 1, j - 1);
      if (sel.startsWith('@') || hasNested) {
        // Wrapper at-rule (or a rule containing nested rules): descend so leaf rules are seen.
        stack.push(sel);
        prelude = '';
        i += 1;
        continue;
      }
      rules.push({ selector: sel, body: inner });
      prelude = '';
      i = j;
      continue;
    }
    if (ch === '}') {
      stack.pop();
      prelude = '';
      i += 1;
      continue;
    }
    prelude += ch;
    i += 1;
  }
}

// A class-selector utility rule is one whose selector contains a `.class` token. Excludes
// `:root,:host`, preflight universal selectors, etc.
const classRules = rules.filter((r) => /\.[a-zA-Z]/.test(r.selector));

// --- 3. Negative check: no color utility bakes a palette hex ----------------------------------
const violations = [];
for (const rule of classRules) {
  if (rule.body.includes('color-mix(')) continue; // alpha utility — exempt
  const selLower = rule.selector.toLowerCase();
  for (const { hex, form, re } of hexes) {
    if (!re.test(rule.body)) continue;
    if (selLower.includes(form) || selLower.includes(form.slice(1))) continue; // arbitrary value — exempt
    violations.push(`${rule.selector.slice(0, 80)} bakes ${hex} (\`${form}\`) — should be var(--ds-…)`);
  }
}
if (violations.length) {
  fail(
    `${violations.length} color utility(ies) bake a palette literal instead of referencing the seam:\n` +
      violations.map((v) => `    • ${v}`).join('\n') +
      `\n  A color token in theme.css was set to a hex literal. Repoint it to var(--ds-…) (palette.css).`,
  );
}

// --- 4. Positive check: widely-used color tokens resolve through var(--ds-…) -------------------
// These are consumed by many components, so JIT always emits their utilities. If any is missing or
// baked, the seam is broken for that family.
const mustResolve = [
  ['bg-surface-page', 'ds-surface-page'],
  ['bg-surface-light', 'ds-surface-light'],
  ['text-text-primary', 'ds-text-primary'],
  ['text-text-secondary', 'ds-text-secondary'],
  ['border-border-light', 'ds-border-light'],
  ['bg-interaction-primary-default', 'ds-interaction-primary-default'],
];
const missingSeam = [];
for (const [util, ds] of mustResolve) {
  const re = new RegExp(`\\.${util}\\b\\{[^}]*var\\(--${ds}\\)`);
  if (!re.test(css)) missingSeam.push(`.${util} → var(--${ds})`);
}
if (missingSeam.length) {
  fail(
    `expected color utilities not wired through the seam:\n` +
      missingSeam.map((m) => `    • ${m}`).join('\n'),
  );
}

// --- 5. Focus shadows: still reference semantic --color-* tokens, never a baked hex -----------
const shadowRules = classRules.filter((r) => /\.shadow-focus-/.test(r.selector));
if (shadowRules.length === 0) fail('no .shadow-focus-* utilities found in dist/styles.css.');
for (const rule of shadowRules) {
  if (!rule.body.includes('var(--color-')) {
    fail(`${rule.selector} no longer references var(--color-*) — focus-shadow seam broken.`);
  }
  for (const { hex, re } of hexes) {
    if (re.test(rule.body)) {
      fail(`${rule.selector} bakes ${hex} — focus shadow must stay on the seam.`);
    }
  }
}

console.log(
  `check:tokens ✓ ${palette.size} palette hexes on the seam; ${classRules.length} utility rules scanned, ` +
    `${shadowRules.length} focus-shadow utilities verified.`,
);
