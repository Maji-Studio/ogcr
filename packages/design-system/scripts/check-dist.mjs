// Guards the Phase 2 consumption contract on the built package, run as the last build:lib step.
// Sibling of check-token-seam.mjs. It asserts what the publish boundary promises:
//
//   1. `'use client'` is the FIRST line of dist/index.js and every dist/components/*/index.js
//      (every entry a consumer can import is a client boundary).
//   2. dist/lib/cn.js EXISTS and does NOT start with `'use client'` (the cn() helper is pure and
//      must stay importable from a Server Component).
//   3. Table is NOT re-exported from dist/index.d.ts (it is deep-import-only so barrel consumers
//      don't drag in the optional @tanstack/react-table peer).
//   4. `pnpm pack --dry-run` succeeds and the tarball includes dist/index.js (the package is
//      actually publishable and ships its entry).
//   5. THE SHIPPED-STYLESHEET CONTRACT (added after the 2026-08 audit). dist/styles.css is
//      precompiled at publish time, so a token that produces no CSS here produces no CSS anywhere
//      — the consumer cannot "just rebuild". Three assertions close that hole:
//        a. every `--color-*` token declared in theme.css has at least one utility rule
//           (bg-/text-/border-/fill-/stroke-) in dist/styles.css;
//        b. every declared `--spacing-*` / `--radius-*` / `--text-*` / `--border-width-*` /
//           `--shadow-*` / `--font-*` variable is emitted into the shipped `:root` block, so a
//           consumer can `var()` anything the DS documents (this is what `@theme static` buys);
//        c. the utilities are wrapped in the `utilities.ogcr-ds` sub-layer and `--spacing` is
//           pinned to 1px — the two cascade/scale guarantees consumer apps depend on.
//      Fix a failure by adding the class to src/styles/safelist.css (a) or checking that the
//      `@theme static inline` modifier is still on the block in theme.css (b/c).
//
// Any failure exits non-zero and fails the build.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const failures = [];
function check(cond, msg) {
  if (!cond) failures.push(msg);
}

function startsWithUseClient(file) {
  const first = fs.readFileSync(file, 'utf8').replace(/^\s+/, '').split('\n', 1)[0].trim();
  return first === "'use client';" || first === '"use client";';
}

// --- 1. Every entry carries the client directive ----------------------------------------------
const barrel = path.join(dist, 'index.js');
check(fs.existsSync(barrel), 'dist/index.js missing — run build:lib.');
if (fs.existsSync(barrel)) {
  check(startsWithUseClient(barrel), "dist/index.js does not start with 'use client'.");
}

const componentsDist = path.join(dist, 'components');
if (fs.existsSync(componentsDist)) {
  for (const entry of fs.readdirSync(componentsDist, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const entryJs = path.join(componentsDist, entry.name, 'index.js');
    if (!fs.existsSync(entryJs)) continue;
    check(
      startsWithUseClient(entryJs),
      `dist/components/${entry.name}/index.js does not start with 'use client'.`,
    );
  }
}

// --- 2. cn() stays a pure, server-importable entry --------------------------------------------
const cnJs = path.join(dist, 'lib', 'cn.js');
check(fs.existsSync(cnJs), 'dist/lib/cn.js missing — the ./cn deep-import entry did not build.');
if (fs.existsSync(cnJs)) {
  check(!startsWithUseClient(cnJs), "dist/lib/cn.js must NOT start with 'use client' (it is pure).");
}

// --- 3. Table is deep-import-only -------------------------------------------------------------
const barrelDts = path.join(dist, 'index.d.ts');
check(fs.existsSync(barrelDts), 'dist/index.d.ts missing — run build:lib.');
if (fs.existsSync(barrelDts)) {
  const dts = fs.readFileSync(barrelDts, 'utf8');
  // The barrel must not re-export the Table module. Catch a `from './components/Table'` re-export
  // or a Table-typed re-export; deep import `@majistudio/ogcr-design-system/Table` stays available separately.
  check(
    !/from\s+['"][^'"]*components\/Table['"]/.test(dts),
    'dist/index.d.ts re-exports ./components/Table — Table must be deep-import-only.',
  );
}

// --- 4. Package is publishable and ships its entry --------------------------------------------
// pnpm-only repo: `pnpm pack --dry-run --json` returns `{ name, version, filename, files:[{path}] }`
// (npm returns an ARRAY of that shape — hence the `meta.files` vs `meta[0].files` difference).
let packedOk = false;
try {
  const out = execFileSync('pnpm', ['pack', '--dry-run', '--json'], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const meta = JSON.parse(out);
  const files = ((Array.isArray(meta) ? meta[0]?.files : meta?.files) ?? []).map((f) =>
    typeof f === 'string' ? f : f.path,
  );
  packedOk = true;
  check(
    files.includes('dist/index.js'),
    'pnpm pack --dry-run did not include dist/index.js in the tarball.',
  );
  check(
    files.includes('dist/styles.css'),
    'pnpm pack --dry-run did not include dist/styles.css in the tarball.',
  );
} catch (err) {
  failures.push(`pnpm pack --dry-run failed: ${err.message?.split('\n')[0] ?? err}`);
}

// --- 5. The shipped-stylesheet contract -------------------------------------------------------
const cssPath = path.join(dist, 'styles.css');
const themePath = path.join(root, 'src', 'styles', 'theme.css');
let colorCount = 0;
let varCount = 0;

if (!fs.existsSync(cssPath)) {
  failures.push('dist/styles.css missing — the ./styles.css export did not build.');
} else if (!fs.existsSync(themePath)) {
  failures.push('src/styles/theme.css missing — token parser has nothing to check against.');
} else {
  const css = fs.readFileSync(cssPath, 'utf8');
  const theme = fs.readFileSync(themePath, 'utf8');

  // Declared token names, straight from theme.css. Multi-prop modifier siblings
  // (`--text-h1--font-weight`) are excluded: they are not standalone utilities/variables.
  const declared = (prefix) =>
    [...new Set(
      [...theme.matchAll(new RegExp(`^\\s*--${prefix}-([a-z0-9-]+)\\s*:`, 'gm'))]
        .map((m) => m[1])
        .filter((n) => !n.includes('--')),
    )];

  // 5a. Every color token reaches a utility. A consumer writing `bg-<token>` must get a rule.
  const colorTokens = declared('color');
  colorCount = colorTokens.length;
  const utilityPrefixes = ['bg', 'text', 'border', 'fill', 'stroke', 'ring', 'outline'];
  const missingUtilities = colorTokens.filter(
    (t) => !utilityPrefixes.some((p) => css.includes(`.${p}-${t}{`)),
  );
  check(
    missingUtilities.length === 0,
    `${missingUtilities.length} --color-* token(s) declared in theme.css produce NO utility in ` +
      `dist/styles.css (a consumer writing the class gets nothing): ` +
      `${missingUtilities.join(', ')}. Add them to src/styles/safelist.css.`,
  );

  // 5b. Every scale variable is emitted, so `var(--spacing-160)` etc. resolve in a consumer app.
  //     This is what the `static` modifier on theme.css's `@theme` block guarantees.
  const varPrefixes = ['spacing', 'radius', 'text', 'border-width', 'shadow', 'font'];
  const missingVars = [];
  for (const prefix of varPrefixes) {
    for (const name of declared(prefix)) {
      varCount += 1;
      // Tailwind emits `--<prefix>-<name>:<value>` inside `@layer theme{:root,:host{…}}`.
      if (!new RegExp(`--${prefix}-${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:`).test(css)) {
        missingVars.push(`--${prefix}-${name}`);
      }
    }
  }
  check(
    missingVars.length === 0,
    `${missingVars.length} token variable(s) declared in theme.css are NOT emitted into ` +
      `dist/styles.css, so \`var(…)\` on them is invalid in a consumer app: ` +
      `${missingVars.slice(0, 12).join(', ')}${missingVars.length > 12 ? ', …' : ''}. ` +
      `Check that theme.css's block is still \`@theme static inline\`.`,
  );

  // 5c. Cascade + scale guarantees the consumption contract depends on (see global.css).
  check(
    css.includes('@layer utilities.ogcr-ds'),
    'dist/styles.css does not wrap its utilities in the `utilities.ogcr-ds` sub-layer — DS ' +
      'utilities would beat the consuming app\'s own responsive variants at equal specificity. ' +
      'See the CASCADE note in src/styles/global.css.',
  );
  // 5d. The `/theme` export: the escape hatch from the precompiled surface. It must exist, be
  //     self-contained (no build-relative @import a consumer cannot resolve), and actually carry
  //     the token block — otherwise a consumer importing it into their Tailwind gets silence.
  const themeExport = path.join(dist, 'theme.css');
  check(fs.existsSync(themeExport), 'dist/theme.css missing — the ./theme export did not build.');
  if (fs.existsSync(themeExport)) {
    const exported = fs.readFileSync(themeExport, 'utf8');
    check(
      !/^\s*@import\b/m.test(exported),
      'dist/theme.css contains an @import — a published stylesheet cannot resolve build-relative ' +
        'paths. Inline the dependency in scripts/build-theme-export.mjs.',
    );
    check(
      /@theme\s+static\s+inline/.test(exported) && exported.includes('--ds-surface-page'),
      'dist/theme.css is missing the `@theme static inline` block or the --ds-* palette — the ' +
        './theme export would teach a consumer\'s Tailwind nothing.',
    );
  }

  check(
    /--spacing:\s*1px/.test(css),
    'dist/styles.css does not pin `--spacing: 1px` — a consumer\'s own Tailwind would resolve ' +
      'DS-style spacing classes on the stock 0.25rem scale (4× the DS value).',
  );
}

// --- Report -----------------------------------------------------------------------------------
if (failures.length) {
  console.error(`\n✗ check:dist — ${failures.length} contract violation(s):`);
  for (const f of failures) console.error(`    • ${f}`);
  console.error('');
  process.exit(1);
}

console.log(
  `check:dist ✓ all entries carry 'use client', cn.js is pure, Table is deep-import-only, ` +
    `pnpm pack ${packedOk ? 'ships dist/index.js + styles.css' : 'ok'}; ` +
    `${colorCount} color tokens have utilities and ${varCount} token variables ship in styles.css ` +
    `(layered as utilities.ogcr-ds, --spacing pinned to 1px).`,
);
