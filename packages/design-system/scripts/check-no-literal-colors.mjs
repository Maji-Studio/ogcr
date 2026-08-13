// Guards the SOURCE side of the color seam. Run as `pnpm run check:colors`, chained into build:lib.
//
// check-token-seam.mjs guards the OUTPUT: it proves no generated color utility bakes a palette
// hex. That check is blind to a color a component invents that is not in the palette at all —
// `shadow-[0_1px_2px_rgba(68,51,33,0.16)]`, `bg-[rgba(15,54,85,0.36)]`, a hard-coded `#1C3D59`
// inside an inline SVG. Those never appear in palette.css, so nothing failed, and they are exactly
// the values that go stale when the brand moves. This script closes that hole from the other end:
//
//   src/styles/palette.css is the ONLY place a color literal may appear.
//
// Anything else in src/ that contains a hex, rgb()/rgba(), hsl()/hsla(), oklch()/oklab()/lab()/lch()
// or color() literal fails the build.
//
// TWO ESCAPE HATCHES, both deliberate and both narrow:
//
//   1. `/* allow-literal-color: <reason> */` — an inline marker. It exempts the line it sits on and
//      the next line that carries actual code (comment-only lines in between are skipped, so a
//      multi-line rationale comment still works). Deliberately ONE code line, not a window: a
//      wider window would silently bless unrelated literals added next to an approved one — a
//      regression test for exactly that is why this is written the way it is. A declaration that
//      spans several lines must be collapsed onto one, or carry a marker per line.
//   2. EXEMPT_PATHS below — whole files, each with a written reason. Reserved for files that do not
//      ship (the demo/preview surfaces and third-party starter assets). Do NOT use it to park debt
//      in a shipped component: a whole-file exemption blesses every future literal in that file and
//      breaks the guarantee that NEW violations fail while old ones are being worked through. Park
//      debt on hatch 1 instead, line by line.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'src');

// path (posix, relative to src/) → why it is exempt.
const EXEMPT_PATHS = new Map([
  // --- The seam itself ---------------------------------------------------------------------
  ['styles/palette.css', 'The palette. This file is the definition of "where color literals live".'],

  // --- Demo / preview surfaces: not part of the published package ----------------------------
  // vite.lib.config.ts excludes these from the library build (App.tsx, src/demo/**, main.tsx),
  // so nothing here ships to a consumer. They are token GALLERIES: they print hexes as content.
  ['App.tsx', 'Demo page, excluded from the library build; prints token hexes as visible content.'],
  ['App.css', 'Demo-page stylesheet, excluded from the library build.'],
  ['main.tsx', 'Demo entry, excluded from the library build.'],
  ['demo/foundations.tsx', 'Demo token gallery, excluded from the library build; hexes are content.'],
  ['styles/Theming.stories.tsx', 'Theming story: the whole point is overriding --ds-* with a foreign brand palette at runtime.'],
  ['assets/react.svg', 'Third-party logo artwork (Vite starter asset), not a DS component.'],
  ['assets/vite.svg', 'Third-party logo artwork (Vite starter asset), not a DS component.'],
]);

// NOTE ON SHIPPED-COMPONENT DEBT: there is none in this map on purpose. A whole-file exemption
// silently blesses every FUTURE literal added to that file, which would make this gate's promise
// ("NEW violations fail even while old ones are being worked through") false. The four known
// component literals — Switch/Slider thumb shadows, Toggle's pressed shadow, SideNavigation's
// scrim — instead carry inline `allow-literal-color:` markers on the exact offending lines, so a
// fifth literal anywhere in those files still fails the build. Grep for `allow-literal-color: TODO`
// to find them.

const SCAN_EXT = /\.(tsx?|css|svg)$/;
const MARKER = 'allow-literal-color';

// A color literal. Hex must be a whole 3/4/6/8-digit token (so `#root`, `#1` and a 5-char id are
// not matched, and a hash in a URL fragment is not either — those have non-hex chars).
const PATTERNS = [
  { name: 'hex', re: /#[0-9a-fA-F]{3,8}\b/g },
  { name: 'rgb()', re: /\brgba?\(/g },
  { name: 'hsl()', re: /\bhsla?\(/g },
  { name: 'lab/lch/oklab/oklch/color()', re: /\b(?:ok)?(?:lab|lch)\(|\bcolor\(/g },
];

// `#abcdef` is only a color if it is exactly 3, 4, 6 or 8 hex digits long.
function isHexColor(token) {
  const n = token.length - 1;
  return n === 3 || n === 4 || n === 6 || n === 8;
}

// Blank out comments (keeping line/column structure so reported line numbers stay right) before
// scanning. Prose that MENTIONS a hex — "matches Figma #443321", a rationale note — is
// documentation, not a baked value, and flagging it would push authors to write worse comments.
// String literals are deliberately NOT blanked: className strings are where the real violations
// live. Handles /* … */ (css/ts), // … (ts), and <!-- … --> (svg), skipping comment openers that
// appear inside a quoted string.
function stripComments(text, ext) {
  const out = text.split('');
  const isTs = ext === '.ts' || ext === '.tsx';
  const isSvg = ext === '.svg';
  let i = 0;
  let quote = null; // ' " ` when inside a string
  const blank = (from, to) => {
    for (let k = from; k < to && k < out.length; k += 1) if (out[k] !== '\n') out[k] = ' ';
  };
  while (i < text.length) {
    const ch = text[i];
    if (quote) {
      if (ch === '\\') i += 2;
      else {
        if (ch === quote) quote = null;
        i += 1;
      }
      continue;
    }
    if (ch === '"' || ch === "'" || (isTs && ch === '`')) {
      quote = ch;
      i += 1;
      continue;
    }
    if (ch === '/' && text[i + 1] === '*') {
      const end = text.indexOf('*/', i + 2);
      const stop = end === -1 ? text.length : end + 2;
      blank(i, stop);
      i = stop;
      continue;
    }
    if (isTs && ch === '/' && text[i + 1] === '/') {
      const end = text.indexOf('\n', i);
      const stop = end === -1 ? text.length : end;
      blank(i, stop);
      i = stop;
      continue;
    }
    if (isSvg && text.startsWith('<!--', i)) {
      const end = text.indexOf('-->', i + 4);
      const stop = end === -1 ? text.length : end + 3;
      blank(i, stop);
      i = stop;
      continue;
    }
    i += 1;
  }
  return out.join('');
}

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, acc);
    else if (SCAN_EXT.test(entry.name)) acc.push(abs);
  }
  return acc;
}

const violations = [];
const exemptedFiles = new Set();

for (const abs of walk(srcDir)) {
  const rel = path.relative(srcDir, abs).split(path.sep).join('/');
  if (EXEMPT_PATHS.has(rel)) {
    exemptedFiles.add(rel);
    continue;
  }
  const raw = fs.readFileSync(abs, 'utf8');
  const rawLines = raw.split('\n');
  const lines = stripComments(raw, path.extname(abs)).split('\n');

  // Markers live IN comments, so they are read from the raw text; the line they protect is found
  // in the COMMENT-STRIPPED text, so a multi-line rationale comment between marker and code is
  // skipped over. Exactly one code line is protected per marker.
  const allowed = new Set();
  rawLines.forEach((line, i) => {
    if (!line.includes(MARKER)) return;
    allowed.add(i);
    for (let j = i + 1; j < lines.length; j += 1) {
      if (lines[j].trim() === '') continue; // comment-only or blank
      allowed.add(j);
      break;
    }
  });

  lines.forEach((line, i) => {
    if (allowed.has(i)) return;
    for (const { name, re } of PATTERNS) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(line)) !== null) {
        if (name === 'hex' && !isHexColor(m[0])) continue;
        violations.push({
          rel: `src/${rel}`,
          line: i + 1,
          kind: name,
          text: line.trim().slice(0, 100),
        });
        break; // one report per line per pattern is enough
      }
    }
  });
}

if (violations.length) {
  const list = violations
    .map((v) => `    • ${v.rel}:${v.line}  (${v.kind})  ${v.text}`)
    .join('\n');
  console.error(
    `\n✗ check:colors — ${violations.length} color literal(s) outside src/styles/palette.css:\n` +
      `${list}\n` +
      `  Every color value belongs on the --ds-* seam in src/styles/palette.css, referenced from\n` +
      `  theme.css. If a literal is genuinely correct here, annotate the line with\n` +
      `  \`/* ${MARKER}: <reason> */\` or add the file to EXEMPT_PATHS in this script with a reason.\n`,
  );
  process.exit(1);
}

console.log(
  `check:colors ✓ no color literals outside palette.css ` +
    `(${exemptedFiles.size} file(s) on the documented exception list — see EXEMPT_PATHS).`,
);
