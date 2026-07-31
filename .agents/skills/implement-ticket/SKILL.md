---
name: implement-ticket
description: Autonomously carry a GitHub issue or plan from brief to resolved review comments, delegating each phase to a subagent so the main thread stays lean.
argument-hint: "<issue number | issue URL | plan file path>"
disable-model-invocation: true
---

Drive a ticket end-to-end. The main thread is a conductor: resolve the target, then hand each
phase to a subagent and retain only compact summaries. Read
[`references/playbook.md`](references/playbook.md) for repo-specific commands, verification, and
prompt skeletons. Codex work goes through the `codex-implementation`, `codex-review`, and
`codex-computer-use` skills.

**Guardrails.** Use `pnpm`. Never commit directly to `main`; use a feature branch and PR. Preserve
unrelated work. Never read, print, or commit secrets. Never weaken auth guards. Codex and external
review bots are best-effort. Each subagent returns a structured summary under 200 words.

## Phase 1 — Brief

Resolve the target from `gh issue view` or a plan file. Start from an up-to-date `main`, create a
feature branch, and write a compact brief containing the goal, acceptance criteria, in-scope and
out-of-scope paths, branch, and verification plan. Link the issue or plan instead of pasting it.

Completion: brief written and feature branch checked out.

## Phase 2 — Build and verify

Spawn one implementer with the brief path, repo root, and `CLAUDE.md`. It must:

- Follow the design-system or farmer-prototype conventions that apply to the changed area.
- For farmer code, preserve the component → hooks → fn → data-access → db layering and auth guards.
- Keep `pnpm lint` and focused tests green; run `pnpm build` when the change can affect integration.
- Commit on the feature branch with a conventional commit explaining why.
- Verify observable behavior. For UI, use the dev server on port 3200 and the
  `codex-computer-use` skill in an interactive session, or the app's Playwright tests when suitable.
  Use an existing signed-in session; never extract credentials.

If verification fails, return the failure to the same implementer to fix. Do not publish red work.

## Phase 3 — Publish

Spawn a publisher to push the branch and open a PR against `main`. Build the title and body from the
brief and commits, and include `Closes #<n>` when the target is an issue.

Completion: PR open against `main`, with the issue linked when applicable.

## Phase 4 — Review

Run independent reviews concurrently where available:

- A fresh reviewer checks the diff against the brief and repository standards.
- A Codex reviewer uses `codex-review` and labels its PR comment as unverified.
- If an automated reviewer is configured, wait a reasonable time for its review.

Every finding must name a concrete failure mode. Review output is evidence, not authority.

## Phase 5 — Resolve

Use a fresh resolver for every review comment. Verify each against the code, fix valid findings with
the smallest safe change, decline false positives with a short reason, reply to threads, rerun the
relevant checks, and push. Leave genuinely open questions unresolved and report them.

## Phase 6 — Report

Return a compact summary: target, branch, PR URL, what shipped, verification result, review outcome,
and comments fixed versus declined.
