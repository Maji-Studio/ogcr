# implement-ticket playbook

Repository-specific commands and prompt skeletons for `Maji-Studio/ogcr`.

## Repository workflow

- Base branch: `main`.
- Feature branch: a short `<type>/<kebab-description>` name; never commit directly to `main`.
- Pull requests target `main`.
- No OGCR ProjectV2 board is currently configured. Skip board operations unless the repository
  documentation or the user supplies a board.
- Root checks: `pnpm lint`, `pnpm test`, and `pnpm build` when integration could be affected.
- Focus a package with `pnpm --filter farmer-prototype <command>` or
  `pnpm --filter @majistudio/ogcr-design-system <command>`.

## UI verification

The farmer prototype runs at `http://localhost:3200`. Check it before starting another server. If it
is down, `pnpm dev` starts the design-system watcher and farmer app; DB-backed flows may additionally
need `pnpm --filter farmer-prototype dev:docker`.

In an interactive session, use `.claude/skills/codex-computer-use/SKILL.md` for browser automation
and screenshots. Use the user's existing signed-in browser session; if authentication is required,
ask the user to sign in. Never read or print credentials.

When a stable Playwright test is the better verification, add or extend a spec under the farmer
prototype and run it with `pnpm --filter farmer-prototype test:e2e -- <spec-or-grep>`. Backend-only
changes use focused unit/integration tests. Design-system components should also run their unit test,
library build, and `test:a11y` when the change affects accessibility or stories.

Always report what was exercised and what was observed.

## Codex review

Follow `.claude/skills/codex-review/SKILL.md`. Prefer a custom prompt naming
`git diff main...HEAD` plus the brief requirements. The no-context form is:

```bash
"$CODEX" -C "$PWD" review --base main > "$REPORT"
```

Post findings only after checking that the report exists and the command succeeded. Resolver work
must independently verify every finding.

## Subagent prompt skeletons

**Implementer**

> Implement `<brief path>` in `<repo root>`, following `CLAUDE.md`. Preserve unrelated changes and
> use pnpm. Follow the package-specific architecture and design-system rules. Run `pnpm lint`, focused
> tests, and `pnpm build` when warranted. Commit on the current feature branch. Verify the behavior
> using the UI verification section above. Return under 200 words: files changed, key decisions,
> checks, observed behavior, and blockers. Do not paste diffs or file contents.

**Publisher**

> Push the current feature branch and open a PR to `main` for `Maji-Studio/ogcr`. Build the title and
> body from `<brief path>` and the branch commits; include `Closes #<n>` when applicable. Return only
> the PR number and URL.

**Fresh reviewer**

> Review PR #`<n>` against `<brief/issue>` and `CLAUDE.md`. Verify each finding against actual code.
> Post one PR comment signed `session-local reviewer`. Return under 200 words with findings ranked by
> severity.

**Codex reviewer**

> Review PR #`<n>` against `main` using `.claude/skills/codex-review/SKILL.md`, including the brief in
> the prompt. Post substantive findings in one comment headed `Codex review`, clearly marked
> unverified. If Codex fails, post nothing and return the error.

**Resolver**

> Address every review comment on PR #`<n>`. Verify each finding, make the smallest safe fix, decline
> false positives with a reason, reply and resolve addressed threads, rerun relevant checks, and push.
> Return under 200 words with comment → verdict.
