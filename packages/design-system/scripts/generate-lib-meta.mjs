// Generates the per-component publishing surface for @majistudio/ogcr-design-system, run as the last step
// of `npm run build:lib` (after vite has emitted dist/). It is the single source that keeps three
// artifacts in lockstep with the contents of src/components/*:
//
//   1. package.json  `exports`  — adds a `./<Name>` subpath per component (deep imports), plus the
//                                 root `.`, `./styles.css`, `./manifest.json`, `./llms.txt`.
//   2. dist/manifest.json       — structured index (name, import path, exported symbols, types path)
//                                 for tooling/codegen.
//   3. dist/llms.txt            — llms.txt-format index (title + summary + one line per component)
//                                 so an agent can enumerate the library from a single file.
//
// Exported symbols are parsed from each component's emitted dist/components/<Name>/index.d.ts —
// the public type surface — so the manifest never claims an export the build didn't ship.
//
// Run: node scripts/generate-lib-meta.mjs   (wired into the build:lib script)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const componentsSrc = path.join(root, 'src', 'components');
const componentsDist = path.join(root, 'dist', 'components');
const pkgPath = path.join(root, 'package.json');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const componentNames = fs
  .readdirSync(componentsSrc, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b));

// Pull the public export identifiers out of a bundled .d.ts. Covers the shapes the dts plugin
// emits: `export declare const/function/class X`, `export type/interface T`, and `export { A, B as C }`.
function parseExports(dtsPath) {
  if (!fs.existsSync(dtsPath)) return [];
  const source = fs.readFileSync(dtsPath, 'utf8');
  const names = new Set();

  const declRe = /export\s+(?:declare\s+)?(?:const|function|class|type|interface|enum)\s+([A-Za-z0-9_$]+)/g;
  for (const m of source.matchAll(declRe)) names.add(m[1]);

  const braceRe = /export\s*(?:type\s*)?\{([^}]*)\}/g;
  for (const m of source.matchAll(braceRe)) {
    for (const part of m[1].split(',')) {
      const token = part.trim();
      if (!token) continue;
      // `Foo as Bar` -> exported name is Bar; `Foo` -> Foo
      const asMatch = token.match(/\bas\s+([A-Za-z0-9_$]+)/);
      const name = asMatch ? asMatch[1] : token.split(/\s+/)[0];
      if (name && name !== 'default') names.add(name);
    }
  }

  return [...names].sort((a, b) => a.localeCompare(b));
}

const components = componentNames.map((name) => ({
  name,
  import: `${pkg.name}/${name}`,
  subpath: `./${name}`,
  js: `./dist/components/${name}/index.js`,
  types: `./dist/components/${name}/index.d.ts`,
  exports: parseExports(path.join(componentsDist, name, 'index.d.ts')),
}));

// 1. package.json exports map ------------------------------------------------------------------
const exportsMap = {
  '.': {
    types: './dist/index.d.ts',
    import: './dist/index.js',
  },
  './styles.css': './dist/styles.css',
  './manifest.json': './dist/manifest.json',
  './llms.txt': './dist/llms.txt',
  // Dependency-free deep import of the cn() class-merge helper. Built as its own entry
  // (lib/cn in vite.lib.config.ts); kept in this base map because pkg.exports is rebuilt
  // from scratch on every run and would otherwise drop it.
  './cn': {
    types: './dist/lib/cn.d.ts',
    import: './dist/lib/cn.js',
  },
};
for (const component of components) {
  exportsMap[component.subpath] = {
    types: component.types,
    import: component.js,
  };
}
pkg.exports = exportsMap;
fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

// 2. dist/manifest.json ------------------------------------------------------------------------
const manifest = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  styles: `${pkg.name}/styles.css`,
  barrel: pkg.name,
  componentCount: components.length,
  components: components.map(({ name, import: importPath, types, exports }) => ({
    name,
    import: importPath,
    types,
    exports,
  })),
};
fs.writeFileSync(path.join(root, 'dist', 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

// 3. dist/llms.txt -----------------------------------------------------------------------------
const lines = [
  `# ${pkg.name}`,
  '',
  `> ${pkg.description} ${components.length} components on Base UI primitives, Tailwind v4 tokens, and CVA variants. Import the stylesheet once with \`import '${pkg.name}/styles.css'\`, then import components from the barrel (\`import { Button } from '${pkg.name}'\`) or deep-import a single one (\`import { Button } from '${pkg.name}/Button'\`). Peer deps: react/react-dom ^19, @base-ui/react ^1, @tanstack/react-table ^8 (only for Table).`,
  '',
  '## Components',
  '',
];
for (const component of components) {
  const symbols = component.exports.length ? ` — exports ${component.exports.join(', ')}` : '';
  lines.push(`- [${component.name}](${component.types}): \`import { ${component.exports[0] ?? component.name} } from '${component.import}'\`${symbols}`);
}
lines.push('');
fs.writeFileSync(path.join(root, 'dist', 'llms.txt'), lines.join('\n'));

console.log(
  `generate-lib-meta: ${components.length} components → exports map, dist/manifest.json, dist/llms.txt`,
);
