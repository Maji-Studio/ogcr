# OGCR Monorepo — Plan & Tracking

> Living document. Goal: a pnpm monorepo where **`farmer-prototype`** and the
> **`ogcr-design-system`** coexist, so farmer reuses *all* of the design system with the least
> possible friction.

> **▶ STATUS (2026-06-19): all four phases done — the plan is complete.** Farmer is wired to the
> DS (green brand, Inter via next/font), login + items CRUD are ported to DS components, and turbo
> `build`/`dev` are reconciled around `build:lib`. `pnpm build` and `pnpm dev` both verified green.
> Next, optional work beyond this plan: port the remaining template chrome (sidebar, projects,
> dashboard, other auth forms) off the dead template tokens — see the Phase 3 "deferred" note.

## Status at a glance

| Phase | What | Status |
| --- | --- | --- |
| 0 | Monorepo skeleton (`git init`, root config) | ✅ done |
| 1 | Move `design-system` in (history-preserving), verify it builds | ✅ done |
| 2 | Scaffold `apps/farmer-prototype` from `nextjs-template`, strip its design layer | ✅ done |
| 3 | Proof: port login + one CRUD screen to DS components | ✅ done |
| 4 | Turbo `dev`/`build` orchestration + reconcile DS build script | ✅ done |

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

### Phase 2 — farmer scaffold ✅

- [x] copied `nextjs-template` → `apps/farmer-prototype` (excluded `.git`, `node_modules`, `.next`,
      lockfile, per-app `pnpm-workspace.yaml`, `*.tsbuildinfo`, `.env.local`, `.github`)
- [x] **Renamed the package** → `farmer-prototype`; `dev` is now plain `next dev -p 3200` (docker
      variant kept as `dev:docker`; `dev:manual` also on 3200).
- [x] **Added DS dependency** `"@majistudio/ogcr-design-system": "workspace:*"`; `pnpm install`
      links it (symlink `node_modules/@majistudio/ogcr-design-system` → `packages/design-system`).
- [x] **Swapped the design layer.** `globals.css` is now just `@import "tailwindcss"` →
      `@import "@majistudio/ogcr-design-system/styles.css"` (DS loads last, wins) → a farmer
      `:root` override mapping `--font-standard` to the next/font Inter var. The ~1200-line purple
      block + `styles/fonts.css` + `styles/fonts/` are deleted. **Tailwind v4 resolved the package
      `@import` fine** — no JS-import fallback needed. Fonts: Inter loaded via `next/font/google`
      in `layout.tsx` (8 `@font-face` emitted), `--font-mono` left to fall back to system mono.
- [x] **Boot env.** `apps/farmer-prototype/.env.local` created with format-valid placeholders
      (gitignored). Dev server boots clean: `✓ Ready`, `Environments: .env.local`.
- [x] **Verified OGCR-branded.** `pnpm --filter farmer-prototype build` is **green** (compiled +
      TypeScript pass + 14/14 routes generated). Home `/` is `○ (Static)` and prerenders the DS
      `<Button>` with `bg-interaction-primary-default` + `text-surface-page` +
      `focus-visible:shadow-focus-primary` + `rounded-12`; the compiled `styles.css` carries 203
      `--ds-*` tokens and the `interaction-primary`/`surface-page` utilities. Wiring proven:
      import resolves, RSC→client boundary works, green brand + focus ring present.
      > Note: at runtime `/` redirects to `/login` because the auth proxy's `getSession()` hits the
      > (not-running) placeholder DB and fails closed — expected without `pnpm dev:docker`. The
      > build prerender is the authoritative smoke.

> **Known intermediate state after Phase 2:** template pages (login, items, projects) still reference
> the deleted purple tokens and the template's `ui/*` components, so they'll look unstyled/broken.
> That's fine — **Phase 3** ports real screens to DS components. Phase 2 only proves the wiring.

### Phase 3 — proof ✅
- [x] **Login → DS.** `login-form.tsx` now uses DS `Input` (RHF `register` rides React 19
      ref-as-prop through the DS Input's `{...rest}` spread), `Button` (`variant="filled"`,
      `className="w-full"`), and `Message` (server error / resend-verification / success). `login/
      page.tsx` uses DS `Card` (`floating`) + `text-h2`; `(auth)/layout.tsx` uses `bg-surface-page`.
- [x] **Items CRUD → DS.** `item-list.tsx` renders the DS `Table` (deep import, needs
      `@tanstack/react-table` — added at `^8.21.3`) with a `ColumnDef<Item>[]` (title / description /
      status `Pill` / created / actions); create+edit go through DS `Dialog` wrapping the DS form;
      archive uses DS `AlertDialog` (`tone="danger"`); errors via DS `Message`. `item-form.tsx` uses
      DS `Input`/`Textarea`/`Button`. `item-card.tsx` deleted (table replaces the card list).
- [x] **Verified.** `pnpm --filter farmer-prototype build` green — TypeScript validates all DS props
      (Table columns + `meta.align`, icon-only Buttons, Dialog/AlertDialog controlled-open). Login
      (public route) renders 200 with 2 DS `Input`s + DS `Button`, the green `interaction-primary`
      brand, and the `focus-within:shadow-focus-primary` ring. No purple renders in the ported
      screens (the only `--clr-dark-purple` strings left are dead/undefined tokens in *unported*
      framework chrome — `not-found.tsx`/`error.tsx` boundary payload, the sidebar, projects/
      dashboard/verify-email — which resolve to transparent, not purple).
      > A browser screenshot of `/login` was attempted but the localhost:3200 automation permission
      > was declined; the rendered-HTML + compiled-CSS checks above stand in for it.

> **Still on the template's design layer (deferred — not Phase 3 scope):** the sidebar/navigation,
> projects + dashboard pages, the remaining auth forms (forgot/reset/set-password, verify-email),
> and `components/ui/*` + `components/forms/*` still carry dead template classes. They render
> unstyled (undefined tokens), not purple. Port them when those screens become real.

### Phase 4 — orchestration ✅
- [x] **Reconciled DS build with turbo.** The DS's `build` is the demo (shares + clobbers `dist/`);
      the consumable build is `build:lib`. `turbo.json`: app `build` now `dependsOn: ["^build:lib"]`
      (was `^build`), plus a `build:lib` task (`outputs: dist/**`). Root `build` is
      `turbo run build --filter=./apps/*` so the DS demo `build` is **never** invoked — verified:
      `pnpm build` runs exactly 2 tasks (`@majistudio/ogcr-design-system:build:lib` +
      `farmer-prototype:build`), `dist/` stays the library, farmer compiles green.
- [x] **`pnpm dev` runs DS watch + farmer dev.** `scripts/dev.sh`: initial `ds:build`, then
      `ds:watch` (`turbo watch build:lib`) in the background + `next dev -p 3200` in the foreground
      (trap kills the watcher on exit). Verified both processes run and `/login` serves 200. The DS
      watch re-runs the **full** `build:lib` so `dist/` stays RSC-safe (`'use client'` injected — a
      bare `vite --watch` would not, since Rolldown strips in-source directives) and token-checked.
- [x] **Documented in `README.md`** — scripts table, the `build:lib`-vs-`build` gotcha, the
      CSS-once/components-per-import consumption model, near-live DS iteration caveat, and `ds:sync`.
