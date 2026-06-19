# OGCR Monorepo — Plan & Tracking

> Living document. Goal: a pnpm monorepo where **`farmer-prototype`** and the
> **`ogcr-design-system`** coexist, so farmer reuses *all* of the design system with the least
> possible friction.

## Status at a glance

| Phase | What | Status |
| --- | --- | --- |
| 0 | Monorepo skeleton (`git init`, root config) | ✅ done |
| 1 | Move `design-system` in (history-preserving), verify it builds | 🟡 in progress |
| 2 | Scaffold `apps/farmer-prototype` from `nextjs-template`, strip its design layer | ⬜ todo |
| 3 | Proof: port login + one CRUD screen to DS components | ⬜ todo |
| 4 | Turbo `dev`/`build` orchestration + reconcile DS build script | ⬜ todo |

---

## The core insight (why this isn't just `pnpm add`)

`nextjs-template` (the basis for `operator-prototype`) ships its **own competing design layer** — a
purple/rose **Maji** brand (`--clr-dark-purple`, GT-Flexa fonts, `--color-*` tokens, hand-authored
`.gap-m`/`.body-large` utilities, its own `ui/button|card|input`). The **OGCR design system** is a
**different brand**: green, on a `--ds-*` seam, with `bg-surface-*` / `shadow-focus-*` utilities
baked into a single precompiled `dist/styles.css`.

That divergence is exactly why `operator-prototype` **reimplemented** tokens instead of reusing the
DS. So "reuse all of the OGCR design system" means:

> Take the template's **app architecture** (Next.js 16, Better Auth, Drizzle, the
> `fn/` → `data-access/` → `hooks/` layers, React Query + react-hook-form wiring) but **strip its
> design layer** and let the OGCR design system *be* farmer's design layer.

## Decisions locked in

- **Layout:** pnpm workspace, `packages/*` + `apps/*`.
- **Repo strategy:** fresh monorepo at `/Users/kenji/Dropbox/Maji/20 OGCR/ogcr`; design-system moved
  in via `git subtree` (history preserved). It **keeps publishing to npm** from
  `packages/design-system` via its existing Changesets flow.
- **Scope now:** just `farmer-prototype` + `design-system`. `operator-prototype` stays a separate
  sibling repo (same recipe can fold it in later).
- **Farmer stack:** from `Maji-Studio/nextjs-template` (Next.js 16, Better Auth, Drizzle), **minus**
  its design layer.
- **Consumption mode (split by layer):**
  - **CSS → prebuilt `dist/styles.css`** imported once. Required, zero-config, *is* the brand.
  - **Components → `workspace:*` (prebuilt) + a watch task** for near-live iteration. Optional
    upgrade to `transpilePackages` + a `development` export condition pointing at `src/` for true
    TSX HMR — deferred until co-editing friction is real (it risks CSS drift, since a DS edit using
    a new utility isn't styled until `styles.css` rebuilds).

## Open decisions (need a call before/within Phase 2)

- [ ] **Fonts:** OGCR DS type everywhere, or keep GT-Flexa for farmer? (Drop `src/styles/fonts.css`
      if DS type wins.)
- [ ] **DS repo future:** keep the standalone GitHub repo synced via `git subtree pull`, or make the
      monorepo its sole home and archive the old repo?

---

## The reuse recipe (target end-state for farmer)

`apps/farmer-prototype/package.json`:
```jsonc
"dependencies": {
  "@majistudio/ogcr-design-system": "workspace:*",
  "@base-ui/react": "^1", "react": "^19", "react-dom": "^19"
  // + @tanstack/react-table only if farmer renders <Table>
}
```

`apps/farmer-prototype/src/app/globals.css` (replaces the template's ~1200-line token block):
```css
@import "@majistudio/ogcr-design-system/styles.css"; /* OGCR tokens + utilities + reset = the brand */
/* farmer-only app utilities AFTER the DS. Do NOT @import "tailwindcss" again — the DS already
   bundles Tailwind's preflight; a second reset would duplicate. The DS owns the reset. */
```
> If farmer needs to author markup with DS tokens (`bg-surface-page`, `rounded-12`), add a
> `./theme.css` (raw `@theme`) export to the DS so farmer's own Tailwind can generate those
> utilities. Without it, only classes the DS itself uses exist in the bundle.

Components: `import { Button, Dialog } from "@majistudio/ogcr-design-system"` (barrel), or deep
imports (`/Button`) for the smallest RSC client boundary. `'use client'` is already baked into every
DS entry, so they work from Server Components. `Table` is **deep-import only**.

---

## Phase detail & checklist

### Phase 0 — skeleton ✅
- [x] `git init -b main` at `ogcr/`
- [x] root `package.json` (private, pnpm@11.3.0, turbo devDep, `ds:build`/`dev`/`build` scripts)
- [x] `pnpm-workspace.yaml` (`packages/*`, `apps/*`, `allowBuilds`)
- [x] `turbo.json`, `.gitignore`, `README.md`, `PLAN.md`
- [x] initial commit

### Phase 1 — design-system in 🟡
- [ ] `git subtree add --prefix=packages/design-system "<local ogcr-design-system>" main`
- [ ] remove nested `pnpm-lock.yaml` + `pnpm-workspace.yaml` (root workspace governs)
- [ ] `pnpm install` at root (links workspace)
- [ ] `pnpm ds:build` green (emits `dist/index.js`, `dist/styles.css`, `dist/index.d.ts`)
- [ ] commit

### Phase 2 — farmer scaffold ⬜
- [ ] copy `nextjs-template` → `apps/farmer-prototype`; drop its `node_modules`, lockfile,
      per-repo `.git`, per-app `pnpm-workspace.yaml`
- [ ] add `@majistudio/ogcr-design-system: workspace:*` + DS peers
- [ ] rewrite `globals.css` to import DS `styles.css`; remove the purple token block
- [ ] delete `src/components/ui/{button,card,input}`; point usages at DS components
- [ ] rebind `src/components/forms/*` to DS `Input`/`Form` field primitives
- [ ] fonts decision (see open decisions)
- [ ] `pnpm --filter farmer-prototype dev` boots, styled with OGCR brand

### Phase 3 — proof ⬜
- [ ] port login screen to DS `Input`/`Button`/`Form`
- [ ] port one CRUD page (items) to DS `Table`/`Dialog`/`Card`
- [ ] visual check: green brand, DS focus rings, no leftover purple

### Phase 4 — orchestration ⬜
- [ ] reconcile DS build script with turbo (DS consumable build is `build:lib`, not `build`)
- [ ] `pnpm dev` runs DS watch + farmer dev together
- [ ] document the workflow in `README.md`
