# AGENTS.md

Compatibility instructions for coding agents working in `ogcr`.

## Source Of Truth

`./.claude/CLAUDE.md` is the authoritative instruction file for this repository.

Read `./.claude/CLAUDE.md` before making changes. If this file and `CLAUDE.md` ever differ,
`CLAUDE.md` wins.

This file is intentionally brief so agent guidance does not drift across two maintained documents.

## Non-Negotiables

- Use `pnpm` only.
- Do not bypass authentication or authorization checks. Enforce them in the farmer app's
  `src/data-access/` layer (`requireAuth()` / `requireProjectMember()`).
- Do not commit secrets, API keys, credentials, or `.env` files.
- Do not log PII such as names or email addresses. Prefer stable IDs (`userId`).
- Do not let files grow past roughly 1000 lines. Split modules before adding more complexity.
- Do not hard-code reusable values or magic numbers. Extract constants near the top of the file or
  into `@/config`; style only via design-system tokens, never hardcoded hex/px.
- Do not re-declare design tokens in an app — extend `@majistudio/ogcr-design-system` instead.
- Do not build the design-system demo (`build`) when you need the library: only `build:lib`
  produces the `dist/` that apps import (the two builds share `dist/` and clobber each other).
