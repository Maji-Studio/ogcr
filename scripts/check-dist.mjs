// Guards the Phase 2 consumption contract on the built package, run as the last build:lib step.
// Sibling of check-token-seam.mjs. It asserts what the publish boundary promises:
//
//   1. `'use client'` is the FIRST line of dist/index.js and every dist/components/*/index.js
//      (every entry a consumer can import is a client boundary).
//   2. dist/lib/cn.js EXISTS and does NOT start with `'use client'` (the cn() helper is pure and
//      must stay importable from a Server Component).
//   3. Table is NOT re-exported from dist/index.d.ts (it is deep-import-only so barrel consumers
//      don't drag in the optional @tanstack/react-table peer).
//   4. `npm pack --dry-run` succeeds and the tarball includes dist/index.js (the package is
//      actually publishable and ships its entry).
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
  // or a Table-typed re-export; deep import `@ogcr/design-system/Table` stays available separately.
  check(
    !/from\s+['"][^'"]*components\/Table['"]/.test(dts),
    'dist/index.d.ts re-exports ./components/Table — Table must be deep-import-only.',
  );
}

// --- 4. Package is publishable and ships its entry --------------------------------------------
let packedOk = false;
try {
  const out = execFileSync('npm', ['pack', '--dry-run', '--json'], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const meta = JSON.parse(out);
  const files = (meta?.[0]?.files ?? []).map((f) => f.path);
  packedOk = true;
  check(
    files.includes('dist/index.js'),
    'npm pack --dry-run did not include dist/index.js in the tarball.',
  );
} catch (err) {
  failures.push(`npm pack --dry-run failed: ${err.message?.split('\n')[0] ?? err}`);
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
    `npm pack ${packedOk ? 'ships dist/index.js' : 'ok'}.`,
);
