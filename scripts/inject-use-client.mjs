// Prepends the `'use client'` directive to every published component entry, run as a build:lib
// step after vite emits dist/ and generate-lib-meta.mjs rewrites the exports map.
//
// WHY A POST-BUILD BANNER: Rolldown strips in-source `'use client'` directives during bundling, so
// the directive cannot live in the .tsx sources. Every component in this library is client-only
// (Base UI primitives, hooks, refs), so the boundary belongs at each entry the consumer can import:
// the root barrel (dist/index.js) and each deep-import entry (dist/components/<Name>/index.js). A
// React Server Components bundler reads the directive as the first module statement and draws the
// server/client boundary there.
//
// SCOPE — deliberately narrow:
//   • dist/index.js                      (root barrel)
//   • dist/components/*/index.js          (per-component deep imports)
// NOT touched: dist/lib/cn.js (pure, dependency-free — must stay server-importable) and shared
// chunks/ (internal, reached only through an entry that already carries the directive).
//
// Idempotent: a file that already starts with the directive is left as-is, so re-running build:lib
// never stacks duplicate banners.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const DIRECTIVE = "'use client';";

function alreadyDirected(source) {
  // First non-empty line is the directive, in either quote style.
  const firstLine = source.replace(/^\s+/, '').split('\n', 1)[0].trim();
  return firstLine === "'use client';" || firstLine === '"use client";';
}

function inject(file) {
  const source = fs.readFileSync(file, 'utf8');
  if (alreadyDirected(source)) return false;
  fs.writeFileSync(file, `${DIRECTIVE}\n${source}`);
  return true;
}

const targets = [];

const barrel = path.join(dist, 'index.js');
if (!fs.existsSync(barrel)) {
  console.error('\n✗ inject-use-client — dist/index.js not found. Run the vite build first.\n');
  process.exit(1);
}
targets.push(barrel);

const componentsDist = path.join(dist, 'components');
if (fs.existsSync(componentsDist)) {
  for (const entry of fs.readdirSync(componentsDist, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const entryJs = path.join(componentsDist, entry.name, 'index.js');
    if (fs.existsSync(entryJs)) targets.push(entryJs);
  }
}

let injected = 0;
for (const file of targets) {
  if (inject(file)) injected += 1;
}

console.log(
  `inject-use-client: ${injected} injected, ${targets.length - injected} already directed ` +
    `(${targets.length} entries; lib/cn.js and chunks/ untouched).`,
);
