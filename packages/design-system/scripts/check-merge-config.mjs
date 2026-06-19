// Guards the tailwind-merge config in src/lib/cn.ts against drift from the token scales in
// src/styles/theme.css. Run as `npm run check:merge`, chained into build:lib.
//
// WHY THIS EXISTS: the DS renames Tailwind's font-size and border-radius scales, so cn.ts
// hand-registers those names with extendTailwindMerge (stock tailwind-merge doesn't know them).
// Hand-maintained lists drift: cn.ts once registered the size primitives + h1…quote but missed
// the semantic `--text-body-s` / `--text-label-*` family, so tailwind-merge silently dropped
// those font sizes whenever they shared a className with a text color. This script makes that
// class of drift a build failure instead of a rendering bug found months later.
//
// WHAT IT ENFORCES:
//   1. cn.ts `fontSizes` === every top-level `--text-<name>` token in theme.css (each generates
//      a `text-<name>` font-size utility; modifier siblings like `--text-h1--font-weight` excluded).
//   2. cn.ts `radiusScale` === every NUMERIC `--radius-<n>` token in theme.css (the t-shirt name
//      `--radius-full` is provided by stock tailwind-merge, so it's intentionally excluded here).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const themePath = path.join(root, 'src', 'styles', 'theme.css');
const cnPath = path.join(root, 'src', 'lib', 'cn.ts');

function fail(msg) {
  console.error(`\n✗ check:merge — ${msg}\n`);
  process.exit(1);
}

const theme = fs.readFileSync(themePath, 'utf8');
const cn = fs.readFileSync(cnPath, 'utf8');

// --- helpers ----------------------------------------------------------------------------------
// Pull the quoted string members of a `const <name> = [ … ]` (or `<name>: [ … ]`) array in cn.ts.
// The arrays are flat lists of string literals (comments allowed; they carry no quotes), so the
// first `]` after the opener closes the array.
function arrayLiteral(src, opener, label) {
  const start = src.indexOf(opener);
  if (start === -1) fail(`could not find \`${opener}\` in cn.ts — ${label} parser is out of date.`);
  const end = src.indexOf(']', start);
  if (end === -1) fail(`unterminated array after \`${opener}\` in cn.ts — ${label} parser is out of date.`);
  return [...src.slice(start, end).matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

// Top-level `--<prefix>-<name>:` tokens in theme.css, excluding multi-prop modifier siblings
// (`--text-h1--font-weight`), which contain `--` in the captured name.
function themeTokens(prefix) {
  const re = new RegExp(`--${prefix}-([a-z0-9-]+)\\s*:`, 'g');
  return [...theme.matchAll(re)].map((m) => m[1]).filter((n) => !n.includes('--'));
}

function assertSameSet(expected, actual, what) {
  const e = new Set(expected);
  const a = new Set(actual);
  const missing = [...e].filter((x) => !a.has(x)); // in theme.css, not registered in cn.ts
  const extra = [...a].filter((x) => !e.has(x)); // registered in cn.ts, not in theme.css
  if (missing.length || extra.length) {
    fail(
      `${what} in cn.ts is out of sync with theme.css:\n` +
        (missing.length ? `    • missing (in theme.css, not registered): ${missing.join(', ')}\n` : '') +
        (extra.length ? `    • stale (registered, not in theme.css): ${extra.join(', ')}\n` : '') +
        `  Update the list in src/lib/cn.ts to match the tokens in src/styles/theme.css.`,
    );
  }
}

// --- 1. font sizes ----------------------------------------------------------------------------
const themeFontSizes = themeTokens('text');
const cnFontSizes = arrayLiteral(cn, 'const fontSizes = [', 'fontSizes');
if (themeFontSizes.length === 0) fail('parsed 0 `--text-*` tokens from theme.css — parser broke.');
assertSameSet(themeFontSizes, cnFontSizes, 'font-size scale');

// --- 2. border radius (numeric only) ----------------------------------------------------------
const themeRadii = themeTokens('radius').filter((n) => /^[0-9]+$/.test(n));
const cnRadii = arrayLiteral(cn, 'const radiusScale = [', 'radiusScale');
if (themeRadii.length === 0) fail('parsed 0 numeric `--radius-*` tokens from theme.css — parser broke.');
assertSameSet(themeRadii, cnRadii, 'border-radius scale');

console.log(
  `check:merge ✓ font-size (${cnFontSizes.length}) and border-radius (${cnRadii.length}) scales ` +
    `in cn.ts match theme.css.`,
);
