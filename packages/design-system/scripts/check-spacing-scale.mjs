// Guards against off-scale spacing / sizing / border-radius utilities in src/.
// Run as `npm run check:spacing`, chained into build:lib.
//
// THE FOOTGUN: theme.css defines a discrete spacing scale (--spacing-0 … --spacing-320) and
// radius scale (--radius-2 … --radius-48), but Tailwind v4 keeps a dynamic `--spacing` multiplier
// active. So a utility whose number is NOT a defined token doesn't error — it silently falls back
// to `calc(0.25rem * n)`. `w-44` rendered 176px (44 × 4px) instead of any intended size, which
// collapsed the NumberField input until the UI review caught it visually. Radius behaves similarly
// (an off-scale `rounded-10` produces no rule at all). This guard turns that silent footgun into a
// build failure.
//
// HOW: derive the valid {spacing, radius} number sets from theme.css (so the guard tracks the
// scale automatically), then scan every class-bearing source token in src/ for a spacing/sizing or
// radius utility whose number is outside its scale. Keyword values (`w-full`, `h-px`, `rounded-full`),
// fractions (`w-1/2`), and arbitrary values (`w-[240px]`) carry no bare integer, so they're never
// matched. Variant prefixes (`hover:`, `data-[…]:`, `[&>svg]:`) are stripped before matching.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const themePath = path.join(root, 'src', 'styles', 'theme.css');
const srcDir = path.join(root, 'src');

function fail(msg) {
  console.error(`\n✗ check:spacing — ${msg}\n`);
  process.exit(1);
}

// --- 1. Valid number sets, straight from theme.css -------------------------------------------
const theme = fs.readFileSync(themePath, 'utf8');
function scaleNumbers(prefix) {
  return new Set([...theme.matchAll(new RegExp(`--${prefix}-(\\d+)\\s*:`, 'g'))].map((m) => m[1]));
}
const spacingScale = scaleNumbers('spacing');
const radiusScale = scaleNumbers('radius');
if (spacingScale.size === 0 || radiusScale.size === 0) {
  fail('parsed 0 --spacing-* or --radius-* tokens from theme.css — parser broke.');
}

// --- 2. Utility roots that read each scale ----------------------------------------------------
// Spacing-scale consumers (padding/margin/gap/space/sizing/inset/translate/basis/indent). Sorted
// longest-first so the alternation prefers `min-w` over `w`, etc.
const spacingRoots = [
  'min-w', 'max-w', 'min-h', 'max-h', 'gap-x', 'gap-y', 'space-x', 'space-y',
  'inset-x', 'inset-y', 'translate-x', 'translate-y', 'scroll-mx', 'scroll-my', 'scroll-px', 'scroll-py',
  'inset', 'basis', 'indent', 'start', 'end', 'size', 'top', 'right', 'bottom', 'left', 'gap',
  'px', 'py', 'pt', 'pr', 'pb', 'pl', 'ps', 'pe', 'mx', 'my', 'mt', 'mr', 'mb', 'ml', 'ms', 'me',
  'w', 'h', 'p', 'm',
];
const radiusRoots = [
  'rounded-ss', 'rounded-se', 'rounded-ee', 'rounded-es',
  'rounded-tl', 'rounded-tr', 'rounded-br', 'rounded-bl',
  'rounded-s', 'rounded-e', 'rounded-t', 'rounded-r', 'rounded-b', 'rounded-l', 'rounded',
];
// Spacing utilities can be negated (`-mt-4`); radius utilities cannot. Anchored to a full token.
const spacingRe = new RegExp(`^-?(${spacingRoots.join('|')})-(\\d+)$`);
const radiusRe = new RegExp(`^(${radiusRoots.join('|')})-(\\d+)$`);

// --- 3. Scan src/ -----------------------------------------------------------------------------
const files = fs
  .readdirSync(srcDir, { recursive: true })
  .filter((f) => /\.(tsx?|css)$/.test(f))
  .map((f) => path.join(srcDir, f));

const violations = [];
for (const abs of files) {
  const text = fs.readFileSync(abs, 'utf8');
  const rel = path.relative(root, abs);
  text.split('\n').forEach((line, i) => {
    // Split into candidate class tokens; class-syntax punctuation are the separators.
    for (const tok of line.split(/[\s"'`{}()[\];,<>=]+/)) {
      if (!tok) continue;
      // Strip variant prefixes (`hover:`, `data-[…]:`, `[&>svg]:`) — the utility is after the last ':'.
      const cls = tok.includes(':') ? tok.slice(tok.lastIndexOf(':') + 1) : tok;
      const sp = cls.match(spacingRe);
      if (sp) {
        if (!spacingScale.has(sp[2])) {
          violations.push({ rel, line: i + 1, cls, kind: 'spacing', n: sp[2] });
        }
        continue;
      }
      const rad = cls.match(radiusRe);
      if (rad && !radiusScale.has(rad[2])) {
        violations.push({ rel, line: i + 1, cls, kind: 'radius', n: rad[2] });
      }
    }
  });
}

if (violations.length) {
  const list = violations
    .map((v) => `    • ${v.rel}:${v.line}  \`${v.cls}\`  (${v.n} not in the ${v.kind} scale)`)
    .join('\n');
  fail(
    `${violations.length} off-scale ${violations.length === 1 ? 'utility' : 'utilities'} found — ` +
      `each silently falls back to a wrong value instead of a defined token:\n${list}\n` +
      `  Use a value from the scale in src/styles/theme.css, or an arbitrary value (e.g. w-[44px]) ` +
      `if you genuinely need an off-scale size.`,
  );
}

console.log(
  `check:spacing ✓ ${files.length} source files scanned; all spacing/sizing/radius utilities ` +
    `are on the ${spacingScale.size}-step spacing + ${radiusScale.size}-step radius scales.`,
);
