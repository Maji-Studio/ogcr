---
"@majistudio/ogcr-design-system": minor
---

Add a runtime theming seam for color (Phase 1a). Brand color values now live in `src/styles/palette.css` as `--ds-*` custom properties, and the `@theme inline` color tokens reference them, so every color utility and focus shadow bakes a `var(--ds-…)` reference instead of a frozen hex. Colors are now overridable at runtime by setting `--ds-*` on any scoping element — with zero visual change to the default palette. A new `npm run check:tokens` gate (chained into `build:lib`) fails the build if any color utility re-bakes a literal. Radius, spacing, font, and elevation tokens are unchanged.
