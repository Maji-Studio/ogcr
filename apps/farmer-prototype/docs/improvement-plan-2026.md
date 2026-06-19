# Next.js App Template Improvement Plan (2026)

**Last updated**: 2026-06-11 (full-codebase audit: 10 specialized reviewers + duplication/type scans + online research)
**Supersedes**: the 2026-02-01 plan — its Tier 1–2 items (testing, CI, projects CRUD, rate limiting) have since shipped and are removed here.

---

## Current State Assessment

### ✅ Verified strong (June 2026 audit)

- Typecheck, ESLint, and unit tests (14/14) all green; Playwright + CI workflow in place
- Zero `any` types, all server boundaries Zod-validated, env centralized in `src/config/env.ts`
- Layered architecture (components → hooks → fn → data-access → db) consistently followed
- Auth guards enforced in data-access layer (`requireAuth`, `requireProjectMember`, ownership checks) — no IDOR found across all 20 server entry points
- Project create + owner membership correctly wrapped in a transaction
- No secrets in repo, no XSS sinks, no open redirects, no server code in client bundles
- Better Auth configured defensibly: invite-only, rate-limit rules on auth endpoints, sanitized token logging, cookieCache

### ❌ Gaps found (this audit)

Severity-ranked below. Counts: **7 high** (all fixed 2026-06-11, see per-item status), ~20 medium, ~10 low.

---

## TIER 1: Bugs and correctness (fix first)

### 1.1 Duplicate, conflicting proxy entry points — API middleware guards are dead code

> **✅ Fixed 2026-06-11**: root `proxy.ts` deleted; the active proxy is the `proxy` function in `src/proxy.ts`, whose `config.matcher` now **includes** `/api`, so the API 401/email-verification guards run. The description below is the historical finding.

Two proxy files existed: root `proxy.ts` (default export, matcher **includes** `/api`) and `src/proxy.ts` (named export, matcher **excludes** `/api`). With a `src/` directory Next.js uses `src/proxy.ts`, so the middleware's API 401 guard and email-verification 403 gate (`src/lib/auth/middleware.ts:71-97`) never run for `/api/*`. Consequence: an authenticated-but-unverified user has full project CRUD via the REST routes while the page path blocks them.

**Fix**: delete root `proxy.ts`; decide deliberately whether the matcher covers `/api`; add `emailVerified` checks in the REST handlers (and server actions) regardless — middleware-only enforcement is the CVE-2025-29927 lesson.

### 1.2 `deleteProject` fails on any project containing items

> **✅ Fixed 2026-06-11**: `onDelete: "cascade"` added (migration `0003`). Owner-transfer semantics for user deletion still undecided.

`items.projectId` FK had no `onDelete` (`src/db/schema/items.ts:10-12`) → Postgres rejects the delete the moment a project has one item. Hidden in dev because the DB is usually near-empty. `project_members` cascades; the asymmetry looks unintentional. Also: `projects.ownerId → users.id` is `no action`, so user deletion will be blocked the day a delete-user flow is added.

**Fix**: add `onDelete: "cascade"` (or archive/delete items in a transaction inside `deleteProject`), generate a migration. Decide owner-transfer semantics for user deletion and document.

### 1.3 `use-items.ts` swallows mutation failures — errors look like success

> **✅ Fixed 2026-06-11**: hooks unwrap `ActionResult` and throw; `item-list.tsx` renders `ServerError` with the `project-list.tsx` pattern.

`useCreateItem`/`useUpdateItem`/`useArchiveItem` return the `ActionResult` without unwrapping, so `onSuccess` fires and queries invalidate even on `{ success: false }`; `item-list.tsx` renders no error either (archive ignores the result entirely). The sibling `use-projects.ts:26-31` does this correctly (unwrap and throw + `ServerError` UI).

**Fix**: mirror the `use-projects.ts` pattern in `use-items.ts` and adopt `project-list.tsx`'s error rendering in `item-list.tsx`.

### 1.4 No `error.tsx`, `not-found.tsx`, or `loading.tsx` anywhere

> **✅ Fixed 2026-06-11**: root `error.tsx` + `not-found.tsx` added, `loading.tsx` for `(app)` and `[projectId]`; non-members get `notFound()` (chosen over `/unauthorized` to avoid confirming project existence); both lists branch on `isError` with retry.

Any server-component throw renders Next's unstyled "Application error" screen. Concrete reachable path: a non-member (or removed member) hitting a project URL — `requireProjectMember` throws in `(app)/[projectId]/layout.tsx:16`. Query failures in both lists render as "No items/projects yet" (error masked as empty state).

**Fix**: add root `error.tsx` + `not-found.tsx`, per-group `error.tsx`, `loading.tsx` for `(app)/[projectId]`; redirect non-members to `/unauthorized` instead of throwing; branch on `isError` in both lists with a retry button.

### 1.5 Auth email pipeline: PII logged + silent send failures

> **✅ Fixed 2026-06-11**: `email=` dropped from logs; Resend `{ error }` checked and thrown. Full-URL logging remains dev-only (no `AUTH_DEBUG_LINKS` flag introduced).

- `src/lib/auth/better-auth.ts:41` logs `email=...` — violates this repo's own "never log PII" rule, in a path that runs in production when Resend is unconfigured.
- Resend's SDK returns `{ data, error }` and does **not throw** — the result is never checked (`better-auth.ts:66-71`), so reset/verification emails can silently fail while the flow reports success. In an invite-only app this strands new users.
- Full magic-link URL (token included) logged whenever `NODE_ENV !== "production"` — includes previews/staging.

**Fix**: drop `email=` from the log; destructure and check `error` from `resend.emails.send()`; gate URL logging behind an explicit `AUTH_DEBUG_LINKS` flag.

### 1.6 REST routes are dead, already-drifted duplicates of server actions

> **✅ Fixed 2026-06-11**: both route files deleted. `getProjectById` remains in data-access only (no `fn/` wrapper — nothing consumes it yet).

`src/app/api/projects/` had zero runtime consumers (UI flows through hooks → `src/fn/projects.ts`), uses a different response envelope, and re-implements auth/validation/error handling (~190 LOC of 2× duplication). 2025/2026 consensus: server actions for internal mutations; route handlers only for webhooks/external clients — shipping both for the same resource is an anti-pattern.

**Fix**: delete both route files (and port the one capability that exists only there — `getProjectById` — to an `fn/` wrapper), or explicitly document them as the external-API example and add `emailVerified` + origin checks.

### 1.7 Missing indexes + unbounded item fetch

> **✅ Fixed 2026-06-11**: composite index `(project_id, status, created_at DESC)` on items (migration `0004`), index on `project_members.user_id` (migration `0003`); `status = 'active'` filter pushed into the query. No fetch limit yet.

- No index on `items.project_id` — every items-page load is a full table scan + sort (`src/data-access/items.ts:16-20`).
- No index on `project_members.user_id` — projects list sequential-scans memberships.
- `getProjectItems` has no status filter or limit: archived items accumulate forever, are fetched and shipped to the client, then discarded by a client-side filter.

**Fix**: add `index().on(projectId, status, createdAt)` and `index().on(userId)`; push the `status = 'active'` filter into the query; add a limit.

---

## TIER 2: Security hardening

| Item | Detail | Effort |
|---|---|---|
| Security headers | `next.config.ts` has none — add HSTS, `frame-ancestors`/X-Frame-Options, nosniff, Referrer-Policy; optional nonce-CSP example in proxy | 2h |
| Email enumeration | `mapBetterAuthError` returns "No account found with this email" on sign-in/resend; raw `error.message` fallthrough. Collapse to neutral messages (forgot-password already does this right) | 1h |
| Rate limiting | In-memory store resets per instance/cold-start — set `rateLimit.storage: "database"` for prod; add a rule for `/send-verification-email` (email-spam vector under the 100/min default) | 1h |
| Defense in depth | Admin gate lives only in `admin/layout.tsx` (layouts are not a reliable auth boundary) — add `requireAdmin()` in pages; add `emailVerified` checks in `fn/` actions; repeat membership checks in `[projectId]` pages that fetch server-side | 2h |
| 500 hygiene | API routes return raw `error.message` to clients (and use message-sniffing for status codes) — return generic messages, use typed errors, log server-side | 2h |
| Misc | Origin-check helper for cookie-authed non-GET handlers (incl. signout); bind docker Postgres to `127.0.0.1`; comment the 5-min cookieCache revocation delay | 2h |

---

## TIER 3: Consistency and code quality

1. **`""` vs `NULL` divergence** — create normalizes empty description to NULL, update persists `""` (both projects and items; items update schema can't express "clear to NULL" at all). Pick NULL, normalize in the Zod schema.
2. **`items.status` enforced only in Zod** — DB column is plain text, data-access types it as bare `string`. Add a `pgEnum`/CHECK constraint and a shared exported union type.
3. **Soft-delete leakage** — archived items returned by default data-access query; enforce `status != 'archived'` at the data layer with an explicit `includeArchived` option.
4. **Duplicate `cn()`** — `src/lib/utils.ts` and `src/utils/cn.ts` are the same function; keep one.
5. **Dead code** — `src/stores/ui-store.ts` (zustand) has zero consumers; `signUpWithPassword` in `better-auth-server.ts` is never called. Delete both (and the zustand dependency) or wire them into an example.
6. **Auth module over-layering** — 8 files for one provider; `AuthUser` defined twice (`lib/auth/types.ts` and `providers/better-auth-client.ts`); `useAuth()` is a zero-value pass-through; `index.ts` re-exports everything. Consolidate types, flatten `providers/`, export an explicit public API.
7. **Magic numbers** — session/rate-limit/timeout/redirect-delay constants scattered (`60*60*24*7`, `2000`, `10000`, `30000`); hoist into `src/config/`.
8. **Auth forms copy-paste** — the four auth forms share ~60% structure (serverError/success state, success alert, token-from-URL, 2s redirect). Extract a success-alert component and a small shared hook.
9. **Concurrency** — verify-email `useEffect` fires the token POST twice (StrictMode, no AbortController/cancel flag) and the losing response can overwrite a success as "failed"; seed script isn't crash-idempotent (wrap in one transaction + `onConflictDoNothing`); `updateItem` is a non-transactional read-check-write (consider `WHERE id = ? AND updated_at = ?` optimistic concurrency as the taught pattern); fold owner checks into the write (`UPDATE ... WHERE owner_id = ?`).
10. **Accessibility** — `DeleteConfirmDialog` never restores focus on close (early `return null` skips `dialog.close()`); `FormError`/helper text not wired via `aria-describedby`; redundant `aria-label`s on auth inputs override and mismatch visible labels (WCAG 2.5.3); per-row Edit/Delete buttons need item names in accessible names; sidebar active link needs `aria-current="page"`.
11. **Item archive UX** — uses `window.confirm` with no pending state while the sibling delete flow uses `DeleteConfirmDialog` with pending wiring; align them.

---

## TIER 4: Modernization (research-backed, teaching-oriented)

1. **Cache Components** — enable `cacheComponents: true` and demonstrate `"use cache"` + `cacheLife`/`cacheTag` + `updateTag()` in the items example. PPR flags are gone in Next 16; this is the pattern a 2026 template must teach. ([nextjs.org/blog/next-16](https://nextjs.org/blog/next-16))
2. **RSC prefetch + HydrationBoundary** — show one page using server `prefetchQuery` + `<HydrationBoundary>` with a `cache()`-wrapped `getQueryClient`, alongside the existing client-side hooks; document "RSC prefetches, client owns the query". ([TanStack Advanced SSR](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr))
3. **`server-only` guards** — `pnpm add server-only`; import it first in `src/db/index.ts`, `src/config/env.ts`, `src/lib/auth/better-auth.ts`, `src/data-access/*`. Today the boundary holds only because every client import of `@/db/schema` happens to be `import type`. Also re-export row types from `src/types/` so client components stop importing from `@/db/schema`.
4. **Fonts via `next/font/local`** — replace CSS `@font-face` (5 woff2, ~258KB, late discovery, FOUT/CLS) with `next/font/local` in `src/app/layout.tsx` for preload + metric-matched fallback.
5. **Root landing page** — drop `'use client'`; replace `router.push` with `<Link>` and `window.open` with `<a target="_blank" rel="noopener">`.
6. **`React.cache()` around `getUser`** — dedupes the duplicate session resolution from nested layouts in a single render.
7. **Structured logging + error reporting** — no logger, no Sentry; `fn/projects.ts` catches log nothing server-side. Minimum: consistent `console.error` with `{ userId, op, err }` at every boundary; recommended: pino + Sentry stubs documented but off by default (next-forge model).
8. **drizzle-zod** — derive base schemas with `createInsertSchema` so DB and validation can't drift; note drizzle-orm v1 will fold validators into core.
9. **Optional**: `@t3-oss/env-nextjs` (adds client/server leak protection over the hand-rolled `env.ts`), `@next/bundle-analyzer` script.

---

## Suggested order of work

1. **Sprint 1 — correctness**: Tier 1 items 1.1–1.5 (proxy dedupe, FK cascade, use-items unwrap, error/loading boundaries, email pipeline). All are small, high-blast-radius fixes.
2. **Sprint 2 — security + schema**: Tier 2 table + Tier 3 items 1–3 (one migration covers cascade, enum/check, indexes).
3. **Sprint 3 — quality + modernization**: Tier 3 items 4–11, then Tier 4 as the template's "what good looks like in 2026" showcase.
