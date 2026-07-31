# Multi-Tenant Persona Prototype: Farmer, Supplier, Buyer

**Status:** Agreed specification with implementation plan — ready for implementation

**Relationship to other docs:**
[`scope-3-intermediary-flow-spec.md`](./scope-3-intermediary-flow-spec.md) remains authoritative
for the standalone walkthrough at `/scope-3-prototype` and for the canonical campaign narrative,
seed data, visibility model, and standards guardrails. This spec governs the **in-app persona
experience** that precedes and feeds that narrative. Both share one seed world. User-facing copy
follows [`ux-writing.md`](./ux-writing.md).

**Last updated:** 2026-07-31

## Purpose

Turn the main app into a persona-switched prototype (no login) that demonstrates the *supply side*
of the Scope 3 flow the walkthrough narrates:

1. A **farmer** discovers that a parcel has carbon potential, chooses a practice, understands the
   two commercialization routes, and opens the parcel for a supply-chain partnership.
2. A **supplier** (intermediary/operator, Südzucker in the seed world) reviews open parcels across
   the farms it manages, bundles them into a campaign proposal, and generates a decision-ready
   Campaign Meeting Brief for its buyer meeting (Nestlé).
3. A **buyer** (Nestlé) monitors the resulting campaign at aggregate level.

The walkthrough starts where this prototype ends: it assumes the campaign exists. This prototype
shows how it comes to exist, ending with the same farmer-approval moment the walkthrough contains.

## Decisions (grilling session 2026-07-31)

| # | Decision | Choice |
| --- | --- | --- |
| 1 | Placement | Main app shell at `(app)`; `/scope-3-prototype` walkthrough stays untouched |
| 2 | Farmer routes | Partnership route fully interactive; direct credit sale informational only |
| 3 | Access | `DEMO_MODE` env flag bypasses auth (guards stay in code); personas are URL segments with a sidebar switcher |
| 4 | Farmer action semantics | Two-step: non-binding "open for partnership" signal now, terms-attached enrollment later |
| 5 | Potential model | Seeded per-practice estimates per parcel, gated by practice history (additionality) |
| 6 | Offer lifecycle | Not offered → Open for partnership → In proposal → Awaiting approval → Enrolled |
| 7 | Supplier report | Dynamic Campaign Meeting Brief generated from selected open parcels |
| 8 | State layer | Seeded client store persisted to localStorage, visible reset, no DB |
| 9 | Seed world | One shared world: Soil & Sugar 2027, Lindenhof, Südzucker supply shed, Nestlé |
| 10 | Buyer scope | Thin read-only monitoring page this iteration |
| 11 | Loop closure | Supplier "Mark campaign agreed" action triggers the farmer enrollment approval |

## Terminology

The app never shows L1/L2 or registry jargon. UI terms, in the exact casing the UI uses:

| Term | Meaning | Notes |
| --- | --- | --- |
| Parcel | A field with boundaries, area, and practice history | The unit everything attaches to |
| Practice | Cover crop, Reduced tillage, Optimised nitrogen | Same three practices as the walkthrough |
| Carbon potential | Seeded per-practice estimate of SOC uplift or emissions reduction for a parcel | Always labelled illustrative |
| Open for partnership | Farmer's non-binding signal that a parcel + chosen practice is available for a supply-chain partnership | Farmer-initiated. Never called listing, posting, or offering |
| Supply-chain partnership | The insetting route: outcomes stay in the buyer's value chain (Scope 3) | Detail views may say "insetting" and "value chain intervention" |
| Sell carbon credits | The offsetting route: credits sold on the open market | Informational only this iteration; CRCF claim limits shown honestly |
| Campaign | An annual program run by the supplier for a buyer (Soil & Sugar 2027) | From the flow spec |
| Campaign proposal | The supplier's working selection of open parcels for a campaign | Becomes the brief |
| Campaign Meeting Brief | The buyer-ready document generated from the proposal | Same artifact as the flow spec |
| Enrollment | The terms-attached, farmer-approved participation of parcels in a campaign | Only after "campaign agreed". Industry-standard term |
| Advance payment | Pre-financing paid at enrollment ("Vorschuss") | Part of the seeded payment terms |

Route names in UI: **"Sell carbon credits"** (subtitle: "Open market, offsetting") and
**"Supply-chain partnership"** (subtitle: "With your buyer's value chain, Scope 3"). A parcel can
follow only one route per period; the choice is presented as exclusive.

## Access, routing, and persona switching

- **`DEMO_MODE`** (boolean, default `false`, validated in `src/config/env.ts`, set `true` in
  `.env.example`): when true, `requireAuth()` returns a seeded demo user without a session and the
  route-protection proxy skips the login redirect. Auth guard call sites do not change; flipping
  the flag restores real auth. Nothing else about auth is removed.
- **Routes:** `(app)/(personas)/farmer`, `(app)/(personas)/supplier`, `(app)/(personas)/buyer`.
  Static segments take precedence over `[projectId]`, which keeps its template features (items,
  projects) untouched.
- **Persona switcher** in the sidebar: three entries showing role and seeded organization:
  "Farmer · Lindenhof Farm", "Supplier · Südzucker (illustrative)", "Buyer · Nestlé
  (illustrative)". Switching navigates; no hidden state. `/` redirects to `/farmer` in demo mode.
- Every persona page shows the walkthrough's qualifier near the page title: "Illustrative
  prototype data" plus a **Reset demo** control.

## Seed world

One world shared with the walkthrough (`src/components/scope-3-prototype/data/`): the Plattling
supply shed, 29 prepared farms, campaign targets of 30 farms / 450 ha, forecast 0.55 tCO₂/ha SOC
and 0.36 tCO₂e/ha emissions reduction, Product Footprint 0.550 → 0.520 tCO₂e/t, €60,000 proposed
contribution, €100/ha base payment + €25/tCO₂ bonus. Shared data moves to a common module (see
plan phase 3) so walkthrough and personas cannot drift apart. The old Willow Creek dashboard
fixtures are deleted.

### The farmer's parcels (Lindenhof Farm, four parcels)

The three campaign parcels from the walkthrough, plus one ineligible parcel that teaches
additionality:

| Parcel | Area | Practice history | Best potential (seeded) | Starts as |
| --- | ---: | --- | --- | --- |
| North field | 6.8 ha | Conventional, winter fallow | Cover crop: 0.5 to 0.7 tCO₂/ha·yr | Not offered (the live demo parcel) |
| Mill meadow | 5.1 ha | Conventional tillage | Reduced tillage: 0.3 to 0.5 tCO₂/ha·yr | Not offered |
| Orchard piece | 3.1 ha | High nitrogen inputs | Optimised nitrogen: 0.2 to 0.4 tCO₂e/ha·yr (reduction, not removal) | Not offered |
| Home paddock | 2.0 ha | Cover crops since 2023 | None. Practice already adopted | Ineligible |

Each eligible parcel carries an estimate for every practice (the non-best ones lower), an
indicative payment range derived from the campaign terms, and a potential tier (High / Medium)
used for map coloring. Home paddock is outside the campaign area sums, so walkthrough totals stay
intact. SOC removals and emissions reductions stay separate quantities everywhere.

### Supplier portfolio seeding

The supplier manages the 29 supply-shed farms. Seeded pre-campaign state: 26 farms already
"Open for partnership" (their parcels aggregated at farm level), Weidenhof undecided,
Lindenhof's parcels controlled live by the demo user. This makes the farmer's action visibly
change the supplier's numbers without requiring 29 interactive farms.

## Parcel lifecycle

States and transitions (who acts):

```text
not_offered
   │  farmer: chooses practice + partnership route, confirms
   ▼
open              "Open for partnership"
   │  supplier: includes parcel in the campaign proposal
   ▼
in_proposal       "In proposal"
   │  supplier: Mark campaign agreed (Nestlé meeting assumed held)
   ▼
awaiting_approval "Terms ready for your approval"
   │  farmer: approves enrollment terms
   ▼
enrolled          "Enrolled in Soil & Sugar 2027"
```

- No withdrawal, rejection, expiry, or negotiation states (deferred, consistent with the flow
  spec). **Reset demo** returns everything to the seeded start.
- Choosing "Sell carbon credits" changes no state: it opens an informational view (route
  comparison, CRCF status, claim limits, "not yet available here") with a path back to the
  partnership route.
- Both cross-persona moments must be demonstrable live: farmer opens North field → supplier's
  portfolio shows it; supplier marks campaign agreed → farmer sees the approval task.

## Screens

### Farmer (`/farmer`)

1. **Dashboard**: welcome header (Lindenhof Farm), KPI row (parcels open / in proposal /
   enrolled, total potential of eligible parcels, expected payment once terms exist), the parcel
   map (MapLibre, parcels colored by state, potential tier shown for `not_offered`), parcel
   cards with state pill and one-line status, activity feed of demo events.
2. **Parcel detail** (panel or route `/farmer/parcels/[parcelId]`): practice history, per-practice
   potential estimates with the recommended one first, indicative payment range, primary action
   **Explore partnership options**. Ineligible parcel explains why and names no action.
3. **Route choice dialog** (the educational moment): two cards.
   - *Sell carbon credits*: market price uncertainty, payment after verification (often years),
     farmer carries delivery risk; CRCF units currently support EU climate contribution claims,
     not general offsetting claims. Ends in "Not yet available here".
   - *Supply-chain partnership*: advance payment at enrollment, guaranteed base payment per
     hectare, outcome bonus per tCO₂, multi-year relationship, agronomic support, MRV handled by
     the program. One line on exclusivity: a parcel can follow only one route per period.
   - Confirm step: parcel, chosen practice, route, and the sentence "This signals interest. You
     approve the actual terms before anything becomes binding." Confirm sets `open`.
4. **Enrollment approval** (appears when `awaiting_approval`): the flow spec's approval screen,
   scoped to Lindenhof's included parcels: campaign summary, parcel list + map, data-sharing and
   operator-delegation permissions, payment terms (base €100/ha, bonus €25/tCO₂, advance payment
   share at enrollment), one **Approve participation** action → `enrolled`.

### Supplier (`/supplier`)

1. **Dashboard**: portfolio KPIs (farms managed, parcels open for partnership, hectares, forecast
   SOC and emissions reduction of open parcels), supply-shed map colored by state, farm/parcel
   table with open parcels surfaced first.
2. **Campaign proposal builder** (`/supplier/proposal`): select open parcels/farms; a live
   roll-up panel recomputes hectares, farm count, practice breakdown, forecast SOC, forecast
   emissions reduction, forecast Product Footprint delta, proposed contribution, and cost per
   tonne as the selection changes. Action: **Generate meeting brief**.
3. **Campaign Meeting Brief** (`/supplier/brief`): the flow spec's brief, print-friendly, built
   from the current selection: program and product boundary, target hectares and farms, eligible
   practices, expected product volume, MRV approach, forecast Product Footprint improvement,
   intervention-contribution proposal, key dates, assumptions and risks, plus one value-flow
   diagram: practices on enrolled parcels → SOC + emissions reduction → lower Product Footprint
   for purchased sugar → Nestlé Scope 3 / SBTi FLAG story → Climate Contribution evidence.
   Numbers roll up from the selection; static structure comes from the flow spec. Action:
   **Mark campaign agreed** → all `in_proposal` parcels become `awaiting_approval`.

### Buyer (`/buyer`)

One read-only monitoring page from seeded aggregates, respecting the visibility model: campaign
status card, enrolled hectares and farm count, practice adoption summary, provisional Product
Footprint indicator, contribution status (€60,000 committed), generalized supply-shed map
(existing `generalisedParcels()`, no farm names or exact boundaries), link-styled reference to
the received Campaign Meeting Brief. No interactions. Fuller buyer work is deferred.

## State layer

- One client store module (`src/components/personas/store/`): seeded initial state, parcel state
  machine, derived selectors (roll-ups reuse the walkthrough's selector patterns), persisted to
  localStorage (`ogcr.personas.demo.v1`), `Reset demo` clears it. Implementation:
  `useSyncExternalStore` or a minimal zustand store (no server round trip).
- Persona routes are server-rendered shells; interactive regions are client components reading
  the store. `DEMO_MODE` gates the auth bypass only, not rendering.
- The store's record shapes (Parcel, Farm, CampaignProposal) are written as if they were Drizzle
  rows (ids, foreign keys, timestamps as ISO strings) so a later migration to the layered
  architecture (`schemas → db → data-access → fn → hooks`) is a transport swap, not a redesign.

## Demo arc (the acceptance script)

1. Open `/farmer` with `DEMO_MODE=true` and no session. No login redirect.
2. North field shows High potential. Open parcel detail: history, per-practice estimates,
   payment range.
3. Choose Cover crop, open the route dialog, read both routes, pick Supply-chain partnership,
   confirm. North field shows "Open for partnership" on map and card.
4. Home paddock explains additionality and offers no action.
5. Switch persona to Supplier. Portfolio shows North field among open parcels; KPIs include it.
6. Build the proposal: select open parcels, watch roll-ups change, generate the brief.
7. Brief shows reconciling numbers (~30 farms, ~450 ha target, footprint 0.550 → 0.520) and the
   value-flow diagram. Print preview is readable.
8. Mark campaign agreed. Switch to Farmer: approval task present; terms show base, bonus, and
   advance payment. Approve. Parcels show "Enrolled in Soil & Sugar 2027".
9. Switch to Buyer: aggregates only, no farm names, generalized map.
10. Reset demo returns everything to step 1 state. All pages show "Illustrative prototype data".

## Out of scope (this iteration)

Interactive credit-sale route; buyer-initiated contracts; negotiation, withdrawal, rejection, and
expiry; real DB persistence and the layered backend for personas; the walkthrough's During/After
content inside the app (the walkthrough already covers it); email/notifications; multi-farm
farmer accounts; MRV interactions. The flow spec's deferred list continues to apply.

---

# Implementation plan

Phases are sequential; each ends demoable. Steps within a phase are ordered. Run quality gates
(`pnpm lint`, `pnpm --filter farmer-prototype build`) at the end of every phase.

## Phase 1 — Foundation: demo mode + persona scaffold

1. Commit the pending dashboard work as-is (it gets reshaped in phase 4, but history should show
   the port).
2. Add `DEMO_MODE` to `src/config/env.ts` (optional boolean, default false) and `.env.example`
   (`true`), documented names only.
3. Auth bypass: `requireAuth()` (and the session helper it uses) returns a seeded demo user when
   `DEMO_MODE`; `src/proxy.ts` / `updateSession()` skips the redirect. Guard call sites unchanged.
4. Create `(app)/(personas)/{farmer,supplier,buyer}/page.tsx` placeholder pages sharing the app
   shell; root redirect to `/farmer` in demo mode.
5. Sidebar persona switcher (role + organization labels, active state), "Illustrative prototype
   data" tag and Reset control in the shared persona layout (Reset is a no-op until phase 3).
6. Update the stale CLAUDE.md note about the dashboard/template chrome.

**Done when:** with placeholder env and no DB, `/farmer`, `/supplier`, `/buyer` render behind no
login and the switcher navigates between them.

## Phase 2 — Shared seed world module

1. Extract the walkthrough's farm/parcel/campaign seed data into a shared module (e.g.
   `src/lib/scope3-seed/` or `src/components/scope-3-shared/`), leaving the walkthrough's imports
   working (re-export from old paths). No walkthrough behavior change.
2. Extend seeds for personas: per-parcel practice history, per-practice potential estimates and
   tiers, Home paddock (ineligible), payment-term constants, supplier portfolio pre-seeding
   (26 farms open, Weidenhof undecided).
3. Verify the walkthrough still renders identically (visual pass) and totals still reconcile
   (unit test on the sums: 435 ha during, 420 ha final, brief targets).

**Done when:** one seed module feeds both surfaces; walkthrough unchanged; sums tested.

## Phase 3 — Client store + lifecycle

1. Store module with seeded initial state, localStorage persistence, versioned key, reset.
2. Parcel state machine (`not_offered → open → in_proposal → awaiting_approval → enrolled`) with
   guarded transitions (only legal transitions possible; illegal calls are no-ops in prod,
   throw in dev).
3. Derived selectors: farmer KPIs, supplier portfolio roll-ups, proposal roll-ups, brief numbers.
4. Unit tests: transitions, persistence round-trip, roll-up math (including that adding/removing
   North field changes hectares and forecast tonnes by exactly its seeded contribution).
5. Wire Reset demo.

**Done when:** tests pass; state survives reload; reset restores seeds.

## Phase 4 — Farmer experience

1. Rebuild `/farmer` dashboard on the store: header, KPI row, parcel cards with state pills,
   activity feed. Replace `src/components/dashboard` fixtures; delete Willow Creek data.
2. Parcel map: MapLibre layer over Lindenhof's four parcels (geometry via the shared
   `fieldPolygon` approach), colored by state, potential tier badge for `not_offered`, click
   opens parcel detail.
3. Parcel detail panel: history, per-practice estimates (DS components; recommended practice
   first), payment range, Explore partnership options CTA; ineligible variant for Home paddock.
4. Route choice dialog (DS `Dialog`): two route cards with the seeded benefit content, CRCF
   claim-limit line, exclusivity line, confirm step, state change to `open`. Copy per
   `ux-writing.md` (no em dashes, action-first, terms from the terminology table).
5. Enrollment approval screen (used in phase 5's arc): campaign summary, parcels, permissions,
   payment terms with advance payment, Approve participation → `enrolled`.
6. Component tests for the dialog flow and state pill rendering.

**Done when:** demo arc steps 1 to 4 pass manually.

## Phase 5 — Supplier experience

1. `/supplier` dashboard: portfolio KPIs, supply-shed map (state coloring; reuse walkthrough map
   patterns), farm/parcel table (DS `Table` deep import) with open parcels first.
2. Proposal builder: selection UI + live roll-up panel from store selectors.
3. Campaign Meeting Brief page: flow-spec structure, dynamic numbers, value-flow diagram
   (DS-tokened SVG/flex diagram, no new charting dep), print stylesheet, Mark campaign agreed
   action flipping included parcels to `awaiting_approval`.
4. Cross-persona checks: farmer's open parcel appears; agreed campaign creates the farmer
   approval task.
5. Tests: roll-up rendering, agreed-action transition fan-out.

**Done when:** demo arc steps 5 to 8 pass manually.

## Phase 6 — Buyer monitoring page

1. `/buyer`: status card, aggregates, provisional footprint indicator, contribution status,
   generalized map via `generalisedParcels()`, brief reference. Read-only.
2. Visibility check: no farm names, exact boundaries, or farmer payments reachable from `/buyer`.

**Done when:** demo arc step 9 passes.

## Phase 7 — End-to-end verification and iteration loop

1. `pnpm lint`, workspace `pnpm test`, `pnpm --filter farmer-prototype build`.
2. Drive the full demo arc (steps 1 to 10) in the running app with browser automation
   (codex-computer-use; claude-in-chrome fallback), capturing a screenshot per step.
3. File every mismatch against the arc as a fix; apply fixes; re-run the failed steps. Repeat
   until the arc passes twice cleanly, including a reload mid-arc (persistence) and a reset.
4. Copy review pass against `ux-writing.md`'s checklist for every new user-facing string.
5. Update docs: CLAUDE.md persona section, this spec's decision log if anything shifted, brief
   README note on running the demo (`DEMO_MODE=true`, no DB needed).

**Done when:** the arc passes end-to-end twice, screenshots archived, gates green.

## Decision log

| Date | Decision | Status |
| --- | --- | --- |
| 2026-07-31 | Persona experience lives in the main app shell; the walkthrough stays standalone. | Agreed |
| 2026-07-31 | Partnership route interactive; credit-sale route informational with honest CRCF limits. | Agreed |
| 2026-07-31 | `DEMO_MODE` flag bypasses auth without removing guards; personas are URL segments. | Agreed |
| 2026-07-31 | Farmer action is a non-binding "open for partnership" signal; enrollment stays terms-attached and campaign-specific. | Agreed |
| 2026-07-31 | Parcel potential is seeded per practice and gated by practice history. | Agreed |
| 2026-07-31 | Five-state parcel lifecycle; no negotiation or withdrawal states. | Agreed |
| 2026-07-31 | The supplier report is the flow spec's Campaign Meeting Brief, generated dynamically. | Agreed |
| 2026-07-31 | Demo state lives in a seeded, localStorage-persisted client store shaped like future DB rows. | Agreed |
| 2026-07-31 | One seed world across walkthrough and personas (Lindenhof, Plattling shed, Soil & Sugar 2027). | Agreed |
| 2026-07-31 | Buyer gets a thin monitoring page this iteration. | Agreed |
| 2026-07-31 | "Mark campaign agreed" closes the loop into the farmer's enrollment approval. | Agreed |
| 2026-07-31 | UX copy follows the adapted noma UX writing guide. | Agreed |
