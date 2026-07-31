---
name: qa
description: Full end-to-end QA walkthrough of the OGCR design system and farmer prototype, including cold-start, core flows, adversarial inputs, and an evidence-backed findings ledger.
disable-model-invocation: true
---

# QA

Drive the real app end-to-end as a farmer or administrator, then try to break it. Default behavior is
to document findings, not fix code. `/qa smoke` covers route inventory and core happy paths only.

## Rules

- One agent drives the browser because it is a shared session. Read-only code and issue research may
  be delegated while browser work continues.
- Watch console and network output. Every finding needs a route, reproduction steps, expected versus
  actual behavior, and screenshot or console evidence.
- Treat auth and project isolation as security boundaries. Never bypass guards or inspect secrets.
- Do not reset or mutate a shared database without explicit user approval. Prefer a disposable local
  database for empty-state testing.

## Process

### 1. Recon

Inventory routes under `apps/farmer-prototype/src/app`, relevant design-system stories, open issues,
and current PRs. Read `CLAUDE.md`, the farmer architecture/auth docs, and the Items CRUD reference to
build a checklist of expected behavior and validation rules.

### 2. Start safely

Run the app at `http://localhost:3200`. Use the user's existing signed-in browser session or ask them
to sign in. For cold-start coverage, use an approved disposable database and
`pnpm --filter farmer-prototype db:reset`; otherwise test non-destructively with existing data.

### 3. Route and cold-state sweep

Visit public auth routes, projects, project dashboard, items, map, settings, and admin routes allowed
for the current account. Check loading, empty, error, unauthorized, and not-found states; responsive
layout; keyboard focus; console errors; and broken network requests.

### 4. Core operator walk

Through the UI, create or select a project, create/edit/archive an item, verify list refresh and
persistence after reload, inspect dashboard and map behavior, and exercise project settings. For
admin coverage, verify access control and the user-management surface without sending real email or
changing unrelated accounts. Record key screenshots.

### 5. Adversarial pass

Test empty and whitespace-only input, oversized strings, invalid numbers and dates, double submits,
reload/back navigation during forms, stale data, and failed requests. Attempt cross-project deep
links and unauthorized admin routes to confirm server-side guards prevent data leakage. Check
icon-only labels, keyboard navigation, focus restoration, contrast, and narrow/mobile layouts.

### 6. Design-system pass

Exercise changed components in Storybook and their consuming app screens. Look for token drift,
missing states, focus regressions, and mismatches between the design-system spec and implementation.
Run focused unit tests and `test:a11y` when appropriate.

### 7. Findings ledger

Write `docs/qa/YYYY-MM-DD-qa.md` with a severity-ranked table: Area | Severity (P0–P3) | Type
(UX/Engineering/Security/A11y) | Repro | Expected vs Actual | Evidence | Root cause (`file:line` when
known) | Suggested fix. Deduplicate against open issues. Show the user proposed new issues before
filing them. End with the five highest-value fixes and the largest operator-experience gap.
