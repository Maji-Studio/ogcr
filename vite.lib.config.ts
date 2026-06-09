import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// One build entry per component directory (src/components/<Name>/index.tsx) so consumers can
// deep-import a single component — `@ogcr/design-system/Button` — and not just the barrel. The
// output key `components/<Name>/index` lands at dist/components/<Name>/index.js (matched by the
// generated `exports` map subpath `./<Name>`). Coupled code (Popover, Calendar, cn) hoists into
// shared chunks/ automatically, so each component file stays thin. scripts/generate-lib-meta.mjs
// reads these same directories to keep the exports map, manifest.json, and llms.txt in sync.
const componentsDir = path.resolve(dirname, 'src/components');
const componentEntries = Object.fromEntries(
  fs
    .readdirSync(componentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => [
      `components/${entry.name}/index`,
      path.resolve(componentsDir, entry.name, 'index.tsx'),
    ]),
);

// Library build for @ogcr/design-system.
//
// Produces three published artifacts in dist/:
//   - index.js     ESM bundle of every component exported from src/index.ts
//   - index.d.ts   bundled type declarations (mirrors the src tree, root barrel re-exports)
//   - styles.css   Tailwind v4 utilities + reset + design tokens (the ./styles.css export)
//
// React, react-dom, Base UI and TanStack Table are peerDependencies; cva/clsx/tailwind-merge
// and @phosphor-icons/react are runtime dependencies. All are externalized so the consumer's
// bundler dedupes a single copy (and tree-shakes the icon set) rather than inlining ours. The
// app/dev/test build lives in vite.config.ts and is untouched by this config.
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    dts({
      tsconfigPath: path.resolve(dirname, 'tsconfig.app.json'),
      entryRoot: path.resolve(dirname, 'src'),
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: [
        'src/**/*.stories.tsx',
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/App.tsx',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
    }),
  ],
  // Don't copy public/ (favicon, icons.svg, etc.) into the published package.
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: true,
    sourcemap: true,
    target: 'es2023',
    rollupOptions: {
      // Keep every re-export from the barrel alive. Without lib mode Rollup would treat
      // src/index.ts as an app entry and tree-shake the whole (side-effect-free) barrel away,
      // leaving an empty index.js. 'strict' preserves the public export signature.
      preserveEntrySignatures: 'strict',
      // Two entries: the JS barrel and the stylesheet. The CSS entry leaves behind an empty
      // styles.js facade chunk which build:lib removes after the build.
      input: {
        index: path.resolve(dirname, 'src/index.ts'),
        styles: path.resolve(dirname, 'src/styles/global.css'),
        ...componentEntries,
      },
      external: [
        /^react($|\/)/,
        /^react-dom($|\/)/,
        /^@base-ui\/react($|\/)/,
        /^@tanstack\/react-table($|\/)/,
        /^@phosphor-icons\/react($|\/)/,
        /^react-day-picker($|\/)/,
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
      ],
      output: {
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] ?? assetInfo.name ?? '';
          return name.endsWith('.css') ? 'styles.css' : '[name][extname]';
        },
      },
    },
  },
});
