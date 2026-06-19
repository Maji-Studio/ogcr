import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge configured for the OGCR design system's renamed token scales.
 *
 * The DS renames Tailwind's font-size and border-radius scales, and stock
 * tailwind-merge can't reason about names it doesn't ship. `scripts/check-merge-config.mjs`
 * (chained into build:lib) fails the build if either list below drifts from the
 * `--text-*` / `--radius-*` tokens in src/styles/theme.css — which is exactly how the
 * font-size list silently lost the `--text-body-s` / `--text-label-*` family once.
 *
 * FONT SIZE — the DS uses `text-xs` / `text-s` / `text-m` / … and the semantic
 * `text-h1` … `text-label-input` instead of Tailwind's `text-sm` / `text-base`. Because
 * tailwind-merge doesn't know these names, it can't tell a custom `text-<size>` from a
 * `text-<color>` (`text-surface-light`, `text-text-primary`, …): it lumps them into one
 * conflicting `text-*` group and drops whichever appears first — silently losing either
 * the font-size or the text colour (e.g. the dark Tooltip rendered with no light text).
 * The list MUST mirror every top-level `--text-<name>` token in theme.css.
 *
 * BORDER RADIUS — the DS uses a numeric scale (`rounded-12`, `rounded-t-8`, …).
 * tailwind-merge's stock `rounded` validators only know t-shirt names (none/sm/full/…),
 * so two numeric radii (a component default + a consumer `className` override) both
 * survive instead of the last one winning. We extend every radius classGroup (base +
 * per-side + per-corner) with the numeric scale so overrides resolve last-wins; `full`
 * and the t-shirt names stay available via stock. The numerics MUST mirror the numeric
 * `--radius-<n>` tokens in theme.css.
 */
const fontSizes = [
  // Size primitives (--text-xxs … --text-5xl)
  "xxs", "xs", "s", "m", "l", "xl",
  "2xl", "3xl", "4xl", "5xl",
  // Semantic multi-prop sizes (--text-h1 … --text-label-input)
  "h1", "h2", "h3", "h4",
  "body", "body-s", "body-l", "lead", "quote",
  "label-button", "label-navigation", "label-input",
];

const radiusScale = ["2", "4", "8", "12", "16", "20", "24", "32", "48"];
// Every border-radius classGroup id tailwind-merge ships: base, per-side, per-corner.
const radiusGroupIds = [
  "rounded", "rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l",
  "rounded-ss", "rounded-se", "rounded-ee", "rounded-es",
  "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl",
];
const radiusClassGroups = Object.fromEntries(
  // Extend each stock group (same id ⇒ `rounded-12 rounded-full` still resolves last-wins).
  radiusGroupIds.map((id) => [id, [{ [id]: radiusScale }]]),
);

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: fontSizes }],
      ...radiusClassGroups,
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
