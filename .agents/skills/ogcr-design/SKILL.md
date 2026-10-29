---
name: ogcr-design
description: OGCR's UI layer on top of maji-design-app. Points to the design-system package, the Knowledge Repository design-system folder and the prototype changelogs, and covers what is specific here (segmented control limit, side-sheet tasks, sourced and marked numbers, uncertainty as shape, EN and DE copy, concept prototypes as one HTML file). Use for any UI work in OGCR, such as building or changing a screen, form, dialog, side sheet, table, chart or map, choosing between layouts, writing interface copy (English or German), prototyping, or reviewing a UI PR.
---

# OGCR design

Load `maji-design-app` first and follow its steps. This skill adds what OGCR decides differently or more precisely. `$KR` is the MAJI knowledge repository, `$KR/04_Client Projects/ogcr/`.

## Sources (read the target before the work)

- `packages/design-system/docs/design-system.md` and `packages/design-system/README.md`: tokens, components, accessibility (§8). Storybook: `pnpm ds:storybook`. Extend the package, never re-declare tokens in an app (`AGENTS.md`).
- `$KR/04_Client Projects/ogcr/design-system/`: the vendored spec and `ogcr-tokens.css` for standalone HTML work. The project home (`project-home.md`) links every prototype and open-questions register.
- `$KR/04_Client Projects/ogcr/outputs/prototypes/supplier-aggregator/_src/README.md` (v1 to v56) and the header comment of `.../prototypes/farmer/*-farmer-setup-prototype-v94.html`: the decisions record. OGCR keeps no `docs/design-decisions.md`; these changelogs and `working-notes/` hold what was tried and rejected. Read the entries for your surface before proposing anything.
- `apps/farmer-prototype/docs/ux-writing.md`: terms, message structure, no en or em dashes. The terminology table in `multi-tenant-personas-spec.md` overrides casual words.

## OGCR specifics

- **Segmented control for at most 3 options**, a dropdown above that.
- **Tasks open in a side sheet** over the current page, not on a new page.
- **Every number explains its source one click away** (the number opens a sheet with its derivation). Unverified or modelled figures carry the tag: "Modelled", "not verified".
- **Uncertainty is shape, not a second number**: the range sits inside the value, with a band on a fixed scale. A mark that needs its own explanation is furniture; cut it.
- **Same thing, same place**: a parcel looks the same wherever it appears; sibling pages share spacing and the position of their quantities.
- **At rest only what the decision needs**: label, range, bar. Trend sentences and explanations live in the tooltip.
- **Colour carries status or level**; categories such as land use use icons, never swatches.
- **Copy** is English with a German switch in "Sie". Hit targets are 40 by 40 at least (DS §8); `Button` defaults to 48.

## Prototypes in OGCR

- **Concept work without code:** follow `$KR/01_Skills/prototype/`: one self-contained HTML file with a versioned changelog explaining why each change was made. Fork the newest version rather than editing it.
- **App work:** run the farmer app (`pnpm dev`, http://localhost:3200, `MOCK_DATA=true`, no `.env.local`). Dev variants follow `maji-design-app` step 4.

## Evidence and review

- Screenshots at 1440 and 390 via `codex-computer-use`.
- Every UI PR carries Before | After at both widths, plus a GIF for interactions.
- UI PRs wait for the user's OK before merging.
