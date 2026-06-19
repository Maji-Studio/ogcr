# OGCR Monorepo — Plan & Tracking

> Living document. Goal: a pnpm monorepo where **`farmer-prototype`** and the
> **`ogcr-design-system`** coexist, so farmer reuses *all* of the design system with the least
> possible friction.

> **▶ RESUME HERE (paused 2026-06-19):** the raw template is copied into `apps/farmer-prototype` but
> **not yet wired** to the design system (it still carries the template's purple brand). Pick up at
> **Phase 2 → remaining steps** below — start by renaming the package (`next-app-template` →
> `farmer-prototype`). Everything needed is spelled out there.

## Status at a glance

| Phase | What | Status |
| --- | --- | --- |
| 0 | Monorepo skeleton (`git init`, root config) | ✅ done |
| 1 | Move `design-system` in (history-preserving), verify it builds | ✅ done |
| 2 | Scaffold `apps/farmer-prototype` from `nextjs-template`, strip its design layer | 🟡 in progress — raw copy done, wiring pending |
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

## Decisions resolved (2026-06-19)

- ✅ **Fonts:** use the **OGCR design-system type** everywhere. → In Phase 2, delete
  `apps/farmer-prototype/src/styles/fonts.css` + `src/styles/fonts/*.woff2` and drop the GT-Flexa
  `@import`/`--font-*` from `globals.css`. (If the DS expects a specific web font loaded, load it via
  `next/font` — check `packages/design-system/src/styles/theme.css` font tokens when wiring.)
- ✅ **DS repo future:** keep the standalone repo as the synced **upstream**. Wired:
  remote `ds-upstream` → `/Users/kenji/Dropbox/Maji/20 OGCR/ogcr-design-system`; pull updates with
  **`pnpm ds:sync`** (`scripts/sync-design-system.sh`, uses `git merge -X subtree=packages/design-system`).
  DS development continues in the standalone repo; the monorepo pulls. (The remote is a local path —
  machine-specific, not stored in commits; re-add on another machine, or repoint to the GitHub URL.)

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

### Phase 1 — design-system in ✅
- [x] history-preserving merge into `packages/design-system` (Apple Git has no `git subtree`, so used
      the manual equivalent: `git merge -s ours --allow-unrelated-histories` + `git read-tree --prefix`;
      all 28 DS commits are reachable ancestors)
- [x] removed nested `pnpm-lock.yaml` + `pnpm-workspace.yaml` (root workspace governs)
- [x] `pnpm install` at root (links workspace; both packages resolve)
- [x] `pnpm ds:build` green — `dist/{index.js,index.d.ts,styles.css}` at root; all guards pass
      (check:merge / check:spacing / check:tokens / check:dist)

**Two gotchas hit & resolved (read before touching install/build config):**
- **pnpm 11 ignores the `pnpm` field in `package.json`.** Settings (`overrides`,
  `onlyBuiltDependencies`, `allowBuilds`) live in `pnpm-workspace.yaml` now. That's why the DS kept
  `allowBuilds` there.
- **DS build is version-sensitive.** Dropping the DS's pinned lockfile floated `vite-plugin-dts`
  `^5.0.1 → 5.0.2`, which nests declarations under `dist/src/` and fails the DS `check:dist`
  contract. Pinned back via `overrides: { vite-plugin-dts: "5.0.1" }` in `pnpm-workspace.yaml`.
  (Other build deps also floated — esbuild 0.27.7→0.28.1, etc. — but the build is green, so left as-is.)

### Phase 2 — farmer scaffold 🟡 (raw copy done, wiring pending)

**Done:**
- [x] copied `nextjs-template` → `apps/farmer-prototype` (excluded `.git`, `node_modules`, `.next`,
      lockfile, per-app `pnpm-workspace.yaml`, `*.tsbuildinfo`, `.env.local`, `.github`)

**Remaining (resume here, in order):**
- [ ] **Rename the package.** `apps/farmer-prototype/package.json` `name` is still
      `next-app-template` → set to `farmer-prototype`. Also change `dev` (currently `pnpm dev:docker`,
      which spins up Postgres) — add a plain `"dev": "next dev -p 3200"` (port 3200 to avoid clashing
      with operator's 3100), keep the docker variant as `dev:docker` if wanted.
- [ ] **Add DS dependency.** In `apps/farmer-prototype/package.json` dependencies:
      `"@majistudio/ogcr-design-system": "workspace:*"`. Peers `@base-ui/react`, `react`, `react-dom`
      are already present (template ships them). Then `pnpm install` at the root to link.
- [ ] **Swap the design layer (the core of Phase 2).** `src/app/layout.tsx:2` currently does
      `import "./globals.css";`. Rewrite `src/app/globals.css` to make the DS the brand:
      ```css
      @import "tailwindcss";                                /* farmer's own utility generation */
      @import "@majistudio/ogcr-design-system/styles.css";  /* DS tokens + reset + utilities = brand; loads last so it wins */
      /* farmer-only app CSS below */
      ```
      Delete the template's ~1200-line purple `:root`/`@theme`/typography/utility block, the GT-Flexa
      `@import "../styles/fonts.css"`, and `src/styles/fonts.css` + `src/styles/fonts/`.
      > If Tailwind v4's bundler can't resolve the package `@import`, fall back to a JS import in
      > `layout.tsx`: `import "./globals.css"; import "@majistudio/ogcr-design-system/styles.css";`
      > (globals first so the DS layer still loads last).
- [ ] **Boot env.** `src/config/env.ts:64` does `envSchema.parse(process.env)` at import → it
      **throws on boot** without valid env. Create `apps/farmer-prototype/.env.local` with
      format-valid placeholders (real DB only needed for DB routes):
      `DATABASE_URL=postgresql://localhost:5432/farmer`, `NEXT_PUBLIC_APP_URL=http://localhost:3200`,
      `BETTER_AUTH_SECRET=<32+ chars>`. (`RESEND_*`, `ADMIN_EMAIL` are optional.)
- [ ] **Verify it boots, OGCR-branded.** `pnpm --filter farmer-prototype dev`, load `:3200`. The
      template's bespoke classes (`.body-large`, `ui/button|card|input`) go unstyled until Phase 3 —
      expected. Add a tiny smoke: render a DS `<Button>` on the home page to prove the wiring
      end-to-end (import resolves, `'use client'` works in RSC, green brand + focus ring show).

> **Known intermediate state after Phase 2:** template pages (login, items, projects) still reference
> the deleted purple tokens and the template's `ui/*` components, so they'll look unstyled/broken.
> That's fine — **Phase 3** ports real screens to DS components. Phase 2 only proves the wiring.

### Phase 3 — proof ⬜
- [ ] port login screen to DS `Input`/`Button`/`Form`
- [ ] port one CRUD page (items) to DS `Table`/`Dialog`/`Card`
- [ ] visual check: green brand, DS focus rings, no leftover purple

### Phase 4 — orchestration ⬜
- [ ] reconcile DS build script with turbo (DS consumable build is `build:lib`, not `build`)
- [ ] `pnpm dev` runs DS watch + farmer dev together
- [ ] document the workflow in `README.md`
