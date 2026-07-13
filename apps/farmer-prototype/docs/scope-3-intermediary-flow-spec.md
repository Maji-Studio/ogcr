# Scope 3 Intermediary Prototype Flow

**Status:** Agreed prototype specification — ready for implementation

**Canonical example:** Sugar-beet farmers → Südzucker → Nestlé

**Last updated:** 2026-07-13

## Purpose

Define a prototype that makes the end-to-end Scope 3 flow understandable across all participating
stakeholders. The prototype should show who acts, what they exchange, what must be attested, and how
physical inventory data differs from an intervention-contribution claim.

This document records the agreed prototype flow. Production accounting, assurance, legal, and
commercial policies remain separate future work where explicitly identified.

## Canonical scenario

### Agreed: intermediary-led flow

The main use case includes an intermediary. **Südzucker is the concrete intermediary** in the
canonical scenario. The intermediary is a reusable role rather than a hard-coded company type: a
future consultant or program operator may perform the same function across multiple farmer and
client accounts.

Südzucker currently combines several capabilities that the product model must keep distinct:

- physical processor and supplier;
- program operator;
- farmer onboarding coordinator;
- supply-shed and product-volume attestor;
- buyer allocation coordinator; and
- farmer payment rail.

A future operator may hold only some of these capabilities. Permissions must therefore be granted by
capability and delegation, not inferred solely from an organization's label.

### Agreed: ownership and delegated operation

Each farm is a first-class organization and retains ownership of its:

- farm and parcel records;
- source declarations and supporting evidence;
- assessed results associated with its land; and
- payment entitlement.

The intermediary receives explicit, scoped, and revocable authority to act for selected farms. That
authority may permit it to onboard farms, import records, coordinate MRV, and prepare or submit data.
It does not transfer ownership of the underlying farmer records.

The intermediary owns or operates the program and its annual supply-shed campaigns. Users act on
behalf of organizations; `farmer`, `operator`, `MRV provider`, `buyer`, and `verifier` are stakeholder
relationships or capabilities, not global user roles.

### Agreed: farmer-controlled activation

The intermediary may prepare and prefill a farm's enrollment, but the enrollment remains inactive
until the farmer directly approves it. An existing cultivation contract is not, by itself, treated as
approval for OGCR participation or outcome allocation.

The farmer approval must make the following visible:

- the parcels being enrolled;
- the source data and MRV access being authorized;
- the capabilities delegated to the intermediary;
- the outcome-allocation or right-to-report authority being granted; and
- the farmer's commercial and payment terms.

The interaction should be low-friction. A one-time approval link is the current proposal; requiring
a full recurring farmer account or accepting a recorded off-platform mandate remain implementation
options. Regardless of interface, the registry must retain who approved which version and when.

### Agreed: standing delegation plus campaign approval

Farmer control is split into two layers:

1. **Standing operator delegation:** revocable permission for Südzucker to maintain agreed records and
   prepare future enrollments on the farmer's behalf.
2. **Campaign-specific enrollment:** approval of the parcels, practices, data uses, allocation
   authority, and commercial terms for a particular campaign.

Campaign renewal must be a short, user-friendly review of prefilled information and material changes.
The farmer should not have to repeat identity, farm, or parcel data that is already current. The
interface should summarize what changed, permit corrections, and capture one clear confirmation.

### Agreed: minimal farmer interaction in the Before scenario

The farmer's Before experience is one prefilled approval screen reached through the simulated
invitation. It shows:

- a short campaign summary;
- the proposed parcels in a simple map and list;
- the data-sharing and operator-delegation permissions;
- the commercial and payment terms; and
- one clear **Approve participation** action.

The prototype does not require account creation, repeated farm data entry, parcel drawing, contract
authoring, or permission configuration. After approval, the same farmer changes from `Awaiting
farmer` to `Enrolled` in Südzucker's campaign overview. The prototype should make that cross-persona
effect visible.

## Outcome layers

### Agreed: both layers are required

The canonical walkthrough produces both layers and culminates in L2. These are **OGCR product
layers**, not names defined by an external standard.

#### L1 — physical inventory / product-footprint data

L1 provides MRV-assessed supplier- or program-specific emissions information for a traceable
quantity of purchased product. It supports applying an appropriate physical-inventory emission
factor to the buyer's eligible purchase volume.

L1 depends on evidence, chain of custody, an attested product quantity, and a documented allocation
method. Buyer funding is not required for L1.

#### L2 — intervention contribution / impact narrative

L2 builds on the L1 lineage and adds evidence that the buyer substantively caused or enabled the
intervention. Eligible forms of contribution may include funding, improved contract terms,
incentives, procurement requirements, or another material commitment.

A recorded funding commitment alone does not prove contribution, additionality, or claim
eligibility. The contribution must be evaluated against the program rules, proportionality, and a
credible counterfactual.

The system should evaluate the two layers independently, for example:

- `inventory_eligible`; and
- `intervention_claim_eligible`.

### Agreed: simple user-facing names

The interface does not lead with L1/L2, reporting-right, allocation, or claim terminology. It uses:

- **Campaign Results** for the complete final package;
- **Product Footprint** for the L1 result applicable to Nestlé's eligible purchased sugar; and
- **Climate Contribution** for the L2 record of what Nestlé helped enable.

The technical and standards-oriented terms remain available in evidence details and exports.

### Agreed: the result includes soil carbon, reduced emissions, and a reduced footprint

The OGCR value proposition is anchored in soil organic carbon. The prototype therefore uses a clear
result hierarchy with three separate but related measures:

1. **Soil Organic Carbon (SOC)** — the primary parcel-level OGCR result: assessed soil-carbon stock
   change, with any removal quantity kept distinct from avoided emissions.
2. **Emissions Reduction** — the intervention result against the stated baseline, for example from
   fertilizer and field-management improvements.
3. **Product Footprint** — the downstream buyer result for the eligible sugar product, expressed per
   product unit and usable for the L1 physical-inventory story.

The values may be seeded demonstration data, but they must remain internally coherent and visibly
labelled illustrative. The UI must not imply that the first two quantities can automatically be
added together or subtracted from the Product Footprint without the documented methodology.

## Timing and buyer participation

### Agreed: buyer commits before the campaign

Nestlé joins before the intervention campaign. It does not purchase a finalized quantity of
"reduction tonnes" after outcomes already exist.

The pre-campaign agreement creates provisional participation only. Final L1 allocation and L2
eligibility can be determined only after the campaign's evidence, MRV assessment, actual product
volumes, and reconciliation are available.

Later-stage or post-campaign claims are a separate future use case and are outside the canonical
prototype flow.

### Agreed: two-part buyer commitment

The canonical pre-campaign buyer commitment has two linked but distinct parts:

1. **Product commitment:** a forecast or minimum eligible purchase volume from the supply shed. This
   informs a provisional allocation cap but does not create final reportable quantities.
2. **Intervention contribution:** a separate program contribution, such as a fixed budget or per-hectare
   support, potentially combined with an outcome-based bonus.

Keeping the commitments separate prevents farmer support from depending entirely on uncertain
carbon outcomes or the buyer's final purchase volume. The prototype payment and shortfall policy is
specified below.

### Agreed: provisional-to-final allocation lifecycle

Nestlé's pre-campaign participation remains provisional until the physical product volumes and
campaign evidence have been reconciled:

1. **Before campaign:** forecast or minimum purchase volume and the intervention contribution create
   a provisional participation record and estimated cap.
2. **During campaign:** enrolled area, expected product volume, evidence coverage, and estimated
   outcomes may change. These are forecasts and are not reportable results.
3. **After campaign:** Südzucker attests eligible beet deliveries, eligible sugar output, and
   Nestlé's actual purchases. OGCR applies the documented allocation policy, finalizes the Product
   Footprint, and evaluates the Climate Contribution evidence.

The UI must distinguish forecasts from final, reportable records. A provisional allocation cannot be
exported or presented as a completed claim.

## Prototype narrative

### Agreed: before, during, and after scenarios

The prototype follows one canonical campaign through three time-based scenarios and simulates the
stakeholder exchanges between Südzucker and Nestlé.

#### Before the campaign

The walkthrough should cover the program proposal, Nestlé's product and intervention commitments,
the provisional allocation, farmer invitations and approvals, and preparation of the MRV work
package.

The first Südzucker–Nestlé exchange is supplier initiated:

1. A prefilled Campaign Meeting Brief presents Südzucker's program proposal.
2. Südzucker uses the overview to prepare for and conduct a meeting with Nestlé.
3. The narrative assumes that the meeting occurs and later shows the resulting commitments; the
   prototype does not simulate negotiation or agreement execution.

The fake campaign brief should include the program and product boundary, target hectares and farms,
eligible practices, expected product volume, MRV approach, forecast Product Footprint improvement,
intervention-contribution proposal, key dates, and material assumptions or risks.

The prototype needs a decision-ready **Campaign Meeting Brief** that allows Südzucker to enter the
Nestlé meeting with a coherent overview. The prototype uses one simple, buyer-ready brief as the
shared source of truth for both organizations. It does not add a separate private-notes or internal
commercial-preparation layer.

The brief is a pre-populated, easy-to-read demonstration screen. It is not an editable proposal
builder and has no counteroffer history, negotiation chat, version-comparison interface, or approval
workflow.

#### During the campaign

The walkthrough should show campaign progress, changes to forecasts, farmer and parcel participation,
evidence coverage, the minimal MRV handoff, and structured status exchanges between Südzucker and
Nestlé. No final allocation or reportable claim exists yet.

The first prototype treats During as a transparency scenario, not an operational farm-management or
MRV application:

- **Südzucker** publishes one prefilled campaign progress update.
- **Nestlé** sees enrolled hectares, practice progress, evidence coverage, forecast product volume,
  provisional Product Footprint indicators, and material risks.
- **Farmer** sees only its own parcels, participation status, and a simple outstanding-evidence item
  if one is useful to the walkthrough.
- **MRV** appears as an external status event, such as work package received or assessment in
  progress.

Forecast metrics must be visually labelled provisional. The prototype does not include satellite
analysis, detailed field-data entry, MRV calculation, or buyer approvals during this phase. More
operational detail can be added later without changing the three-phase narrative.

#### After the campaign

The walkthrough should show MRV-assessed results, Südzucker's physical-volume attestations,
reconciliation, the final L1 product-footprint allocation, evaluation of Nestlé's L2 contribution
eligibility, and preparation of the final evidence package.

The scenario culminates in one reconciled **Campaign Results** package containing:

- the eligible sugar volume and Nestlé's allocated purchase volume;
- the final physical-inventory or product-footprint factor;
- emissions, reductions, and removals represented as distinct accounting quantities;
- the intervention result and evidence supporting Nestlé's contribution narrative;
- committed-versus-actual product volumes and contribution;
- farmer-level outcome and payment summaries; and
- MRV methodology, evidence references, and submission provenance.

Südzucker releases the package. Nestlé sees the buyer-eligible allocation and can view or download
the package. Each farmer sees only its own result and payment summary. The first prototype does not
include a separate auditor workflow.

Detailed production approvals and exception paths are deferred; the seeded walkthrough does not
need to simulate them.

### Agreed: three interactive personas in one guided prototype

The initial prototype has three interactive user perspectives:

1. **Farmer** — controls farm records, delegation, campaign enrollment, and payment entitlement.
2. **Südzucker / operator** — manages the program and enrolled farms, coordinates evidence, attests
   product volumes, and exchanges commitments and allocations with the buyer.
3. **Nestlé / buyer** — reviews the program, commits before the campaign, follows progress, and
   receives the reconciled L1 data and L2 evidence package.

These are prototype personas and organization relationships, not hard-coded global user roles. A
future consultant uses the operator perspective across the farms and client organizations for which
it has delegation.

The demonstration uses one shared campaign and an explicit **View as** switcher rather than separate
login sessions. Before, During, and After select the moment in the campaign; **View as Farmer**,
**View as Südzucker**, and **View as Nestlé** select the stakeholder perspective. Each perspective
must still respect the agreed visibility model once that model is defined.

MRV is represented as a minimal external handoff or simulated integration, not a fourth interactive
persona. OGCR is the coordinating system and system of record, not a user perspective. Independent
assurance is deferred.

### Agreed: seeded clickable walkthrough

The first prototype is a client-side narrative walkthrough with prefilled, illustrative campaign
data. It is intended to test whether the stakeholder story and handoffs are understandable.

It includes:

- the three persona perspectives;
- the Before, During, and After phase switcher;
- coherent seeded data shared across every view;
- the farmer participation approval as the primary state-changing interaction;
- simple navigation into evidence or result details; and
- a reset control for returning the demonstration to its initial state.

It does not require real authentication, organization switching, a database, server actions,
persistence, contract signing, live messaging, MRV calculation, file processing, payment execution,
or external integrations. Those capabilities must not be implied by inactive controls.

## Screen matrix

The first implementation should stay close to this nine-view matrix. Several views may share the
same page shell and components; they are conceptual states, not necessarily nine routes.

| Phase | Farmer perspective | Südzucker perspective | Nestlé perspective |
| --- | --- | --- | --- |
| **Before** | Review campaign, parcels, permissions, and payment terms; approve participation | View the Campaign Meeting Brief and farmer enrollment summary | Read the same Campaign Meeting Brief and proposed commitments |
| **During** | See own enrolled parcels, participation status, and one evidence-status item | See the shared campaign progress overview and simulated MRV status | See aggregate progress, provisional Product Footprint indicators, and risks |
| **After** | See own SOC result, emissions result, and payment summary | Review and release the seeded Campaign Results and multi-buyer allocation | See eligible Product Footprint, Climate Contribution, and downloadable-looking evidence summary |

### Shared shell

Every conceptual view uses the same compact orientation controls:

- campaign identity and campaign year;
- phase switcher: `Before`, `During`, `After`;
- persona switcher: `Farmer`, `Südzucker`, `Nestlé`;
- visible `Illustrative prototype data` label; and
- reset demonstration control.

### Cross-perspective demonstration moment

The farmer approval is the one required state-changing handoff:

1. start in Südzucker / Before and show one farmer as `Awaiting farmer`;
2. switch to Farmer / Before and approve participation;
3. switch back to Südzucker / Before and show the farmer as `Enrolled`.

All other stakeholder exchanges may be represented by seeded status, activity, and artifact cards.

## Prototype acceptance criteria

The prototype is successful when a viewer can:

1. identify what the farmer, Südzucker, and Nestlé each control;
2. explain what changes Before, During, and After the campaign;
3. see that the farmer approves participation and retains control of its detailed data;
4. distinguish provisional progress from final Campaign Results;
5. understand SOC as the primary OGCR result, Emissions Reduction as the intervention result, and
   Product Footprint as the downstream buyer result;
6. distinguish Product Footprint from Climate Contribution without seeing L1/L2 jargon;
7. understand that Nestlé sees aggregate evidence rather than farmer-identifying details;
8. see that Nestlé's final eligible result is reconciled against actual product purchases;
9. see a simple multi-buyer allocation without encountering another buyer workflow; and
10. recognize every number, organization, assurance state, and document as illustrative prototype
    content rather than a real claim or verification.

## Seeded demonstration scenario

All figures in this section are coherent **illustrative prototype data**, not reported Südzucker,
Nestlé, farmer, MRV, or assurance results. The UI must show that qualification near the campaign
name and wherever a result could otherwise be mistaken for a real claim.

### Campaign identity

| Field | Seed value |
| --- | --- |
| Campaign | Soil & Sugar 2027 |
| Supply context | Illustrative Südzucker beet program |
| Crop and product | Sugar beet → eligible white sugar |
| Farmer shown in the persona view | One fictional participating farm |
| Campaign period | 2027 campaign year |

### Before, During, and After values

| Metric | Before | During | After / final |
| --- | ---: | ---: | ---: |
| Farms | 30 target | 29 enrolled | 28 completed |
| Enrolled beet area | 450 ha target | 435 ha | 420 ha |
| Beet yield | 75 t/ha forecast | 73 t/ha forecast | 75 t/ha actual |
| Eligible beet | 33,750 t | 31,755 t | 31,500 t |
| Eligible white-sugar yield | 16.0% | 16.0% | 16.0% |
| Eligible white sugar | 5,400 t | 5,081 t | 5,040 t |
| Nestlé product volume | 2,200 t committed | 2,100 t forecast | 2,000 t purchased |
| SOC stock increase | 0.55 tCO₂/ha forecast | 0.50 tCO₂/ha provisional | 0.55 tCO₂/ha; 231 tCO₂ MRV-assessed/modelled |
| Field-emissions reduction | 0.36 tCO₂e/ha forecast | 0.34 tCO₂e/ha provisional | 0.36 tCO₂e/ha; 151.2 tCO₂e |
| Product Footprint | 0.520 vs 0.550 tCO₂e/t forecast | 0.523 tCO₂e/t provisional | 0.520 tCO₂e/t; 5.5% lower |
| Evidence coverage | Work package prepared | 82% | 100% MRV-assessed |
| Nestlé contribution | €60,000 committed | €60,000 committed | €60,000 paid to program |

The `16.0%` conversion is a prototype eligible-white-sugar yield, not measured beet sugar content.
If the UI explains it, represent it as `17.0% sugar content × 94.1% recovery and allocation factor ≈
16.0% eligible white sugar`; the recovery and allocation factor is itself an illustrative policy.

### Campaign Results

The After view leads with the agreed result hierarchy:

| Result | Seeded value | Plain-language interpretation |
| --- | ---: | --- |
| **Soil Organic Carbon** | 231 tCO₂ stored | Primary OGCR parcel-level result, reported separately as MRV-assessed/modelled stock change |
| **Emissions Reduction** | 151.2 tCO₂e | Field-emissions change against the illustrative baseline |
| **Product Footprint** | 0.520 tCO₂e/t sugar | Final cradle-to-factory-gate footprint for the eligible seeded product volume |

The arithmetic is deliberately simple and inspectable:

```text
eligible sugar = 420 ha × 75 t beet/ha × 16.0% = 5,040 t sugar
SOC stock increase = 420 ha × 0.55 tCO₂/ha = 231 tCO₂
field-emissions reduction = 420 ha × 0.36 tCO₂e/ha = 151.2 tCO₂e
Product Footprint = 0.550 − (151.2 / 5,040) = 0.520 tCO₂e/t sugar
```

SOC is not subtracted again from the Product Footprint in this scenario. It remains a separately
reported result so the prototype does not double count it.

### Buyer allocation

| Recipient | Final eligible sugar | Share of eligible output | Prototype use |
| --- | ---: | ---: | --- |
| Nestlé | 2,000 t | 39.7% | Product Footprint and Climate Contribution |
| Buyer B | 1,500 t | 29.8% | Product Footprint only |
| Unallocated | 1,540 t | 30.6% | No buyer result issued |

For Nestlé, the Product Footprint corresponds to `2,000 × 0.520 = 1,040 tCO₂e`, compared with
`2,000 × 0.550 = 1,100 tCO₂e` at the seeded reference footprint. The resulting 60 tCO₂e difference
is the same 39.7% product share of the campaign's 151.2 tCO₂e field-emissions reduction.

Nestlé's seeded Climate Contribution may show the two campaign quantities attributable under the
prototype's volume-cap policy as separate lines:

- `60.0 tCO₂e` field-emissions reduction; and
- `91.7 tCO₂` assessed SOC stock increase.

They must not be added into one generic tonne balance or both subtracted from Nestlé's Product
Footprint.

### Farmer payment

The seeded €60,000 Nestlé contribution is allocated as follows:

| Use | Calculation | Seeded value |
| --- | --- | ---: |
| Farmer base payments | 420 ha × €100/ha | €42,000 |
| SOC outcome bonuses | 231 tCO₂ × €25/tCO₂ | €5,775 |
| MRV and program administration | Remaining seeded budget | €12,225 |

These commercial values are UX assumptions, not public contract terms. The representative farmer
view should calculate its own base payment and bonus from its seeded hectares and result rather than
showing the campaign-wide farmer total.

### Plausibility anchors

The seed data is not evidence about the actual program. The following sources only anchor its order
of magnitude:

- The public Südzucker–Nestlé partnership describes 8 German growers across 122 ha and 20 French
  growers across roughly 300 ha, supporting a demonstration near 28 growers and 420 ha:
  [Südzucker partnership overview](https://www.suedzucker.com/sudzucker-nestle-teaming-up-for-sustaining-tomorrow/).
- Südzucker reports recent group-level sugar-segment yields above the conservative seeded 75 t
  beet/ha and provides sugar-content and sugar-yield context:
  [Südzucker 2025/26 Sugar segment report](https://www.suedzuckergroup.com/sites/default/files/2026-05/GB_2025-26_Sugar-segment.pdf).
- A German field study provides context for cultivation emissions and the importance of nitrogen:
  [peer-reviewed sugar-beet cultivation study](https://www.sciencedirect.com/science/article/pii/S116103011630154X).
- German sugar-beet rotation research provides an order-of-magnitude anchor for the illustrative SOC
  change:
  [SOIL cover-crop study](https://soil.copernicus.org/articles/11/489/2025/soil-11-489-2025.pdf).
- TÜV SÜD's real Plattling statement reports `0.550 tCO₂e/t` for its defined conventional-sugar
  comparison. The prototype reuses that number only as a recognizable PCF reference; the real
  `0.313 tCO₂e/t` biogas result is a different factory-energy case and is not attributed to this
  fictional farm intervention:
  [TÜV SÜD verification statement](https://www.suedzucker.com/wp-content/uploads/2023/12/VS_3868839-ext_PCF_SZ-Plattling_231116_neu.pdf).

## Accounting boundary

### Agreed: traceable enrolled land and output

The canonical L1 boundary includes only enrolled, traceable land management units and the beet
output attributable to them. It does not treat results from participating farms as representative of
Südzucker's entire factory catchment.

Südzucker must attest the eligible beet delivered from enrolled land and maintain an auditable chain
of custody through processing into an eligible sugar product group. Physical commingling may be
represented through a documented mass-balance model, but the model must preserve auditable inputs,
outputs, conversion rules, eligible proportions, and the reconciliation period.

The annual supply-shed campaign therefore provides the geographic and operational context, while
the enrolled land and attributable output define the eligible accounting boundary.

## Farmer payment and shortfall policy

### Agreed: protect the base payment

The prototype uses the following placeholder commercial policy:

- a farmer earns a guaranteed base payment for participation and confirmed eligible-practice
  adoption;
- an optional outcome bonus varies with the MRV-assessed result;
- a lower-than-forecast Nestlé purchase volume reduces Nestlé's final eligible allocation, not the
  farmer's base payment; and
- Südzucker is the farmer's payment counterparty and manages the buyer-side commercial shortfall.

If the campaign outcome is lower than forecast, only the outcome-dependent bonus changes under the
placeholder policy. The exact payment basis, values, evidence threshold, dates, and treatment of
farmer non-performance require production specification; the prototype values are seeded above.

## Data visibility

### Agreed: aggregate buyer view, farmer-controlled detail

Nestlé receives the aggregate evidence needed to evaluate the campaign and use its eligible output:

- enrolled hectares and generalized geography;
- practice-adoption and evidence-coverage summaries;
- methodology and data-quality indicators;
- eligible product volume and calculated campaign results; and
- an anonymized or generalized parcel visualization if it materially helps explain provenance.

Nestlé does not receive farm names, direct farmer identifiers, exact parcel boundaries, raw source
documents, or individual farmer payments in the canonical prototype.

The working access model is:

| Perspective | Visible information |
| --- | --- |
| Farmer | Its own records, parcels, permissions, assessed result, and payment |
| Südzucker/operator | Program aggregates and the farm-level detail covered by active delegation |
| Nestlé/buyer | Aggregated and de-identified campaign, evidence, product, allocation, and contribution information |
| MRV provider | Only the authorized parcel and source data needed for its assigned work package |

Future assurance access may expose controlled parcel-level evidence to an auditor without changing
the buyer's normal visibility.

This visibility policy is specific to the canonical Südzucker–Nestlé scenario. It should not become
an irreversible platform-wide rule; a future program may define a different buyer evidence policy
with farmer consent.

## Multi-buyer context

### Agreed: demonstrate without adding another persona

Nestlé is the only interactive buyer, but Südzucker's overview should make the shared-program model
visible through one compact, read-only allocation bar or table containing:

- Nestlé;
- one seeded, non-interactive `Buyer B`; and
- remaining unallocated eligible volume.

This visualization demonstrates horizontal allocation and remaining capacity without adding buyer
onboarding, another role-switched perspective, or a second buyer workflow. The values may be seeded
for the initial prototype.

## Working interaction model

The prototype should distinguish four flows rather than presenting every actor as one linear chain:

1. **Physical product:** farmer → Südzucker processor/supplier → Nestlé.
2. **Evidence:** farmer and source systems → MRV provider → registry record. A future assurance flow
   adds an independent verifier before a result receives an externally verified status.
3. **Money and commercial commitments:** Nestlé → Südzucker/program → participating farmers; the
   intermediary may separately procure MRV and verification.
4. **Accounting and claim lineage:** attestations → OGCR rule checks and records → Nestlé's inventory
   and contribution evidence → future auditor review.

OGCR is the system of record and policy-enforcement layer. It can validate permissions, signatures,
schemas, state transitions, and allocations recorded within the system. It does not independently
know that a farm practice occurred or that a commercial volume is true; those facts require named
attestors.

### Agreed: external verification is deferred from the prototype

The canonical interactive prototype does not include a separate verifier workflow. The MRV provider
calculates and submits the parcel or campaign result, and OGCR records its provenance.

The language and status model must not imply assurance that did not occur. A provider-submitted
result may be called `MRV assessed` or `calculated`; `externally verified` is reserved for a future
signed assurance decision. The data model should leave room for that later decision without making
the verifier a prototype stakeholder now.

An accredited assurance organization such as TÜV SÜD could perform this future role. In the existing
Plattling example, Südzucker commissioned TÜV SÜD Industrie Service GmbH to independently verify a
partial product carbon footprint under DIN EN ISO 14067. That statement covers the defined PCF and
mass-balance approach for the biogas-produced sugar; it is not automatically verification of the
farm-intervention and parcel-MRV flow proposed here. A future engagement would need an assurance
scope appropriate to those records and claims.

### Agreed: minimal MRV-provider handoff

The MRV provider remains visible in the prototype only to make provenance and responsibility clear.
Its minimal interaction is:

1. receive a work package containing the campaign and farmer-authorized parcel data;
2. return or submit calculated results with methodology and evidence references; and
3. sign the submission as the assessing organization.

The prototype does not implement or simulate the internal calculation engine. Submitted results are
shown as `MRV assessed`, not externally verified.

### Agreed: simulated assurance branding

The concept prototype may show TÜV SÜD as a simulated future assurance actor. Any such representation
must be adjacent to an unambiguous **Simulated — no verification performed** label and must not make a
fabricated farm-level result appear certified.

TÜV SÜD's published mark-use rules reserve the company logo to TÜV SÜD entities and verification
marks to the holder of a valid certificate for the specified object or process. The simulated asset
is therefore an internal prototype device only; it must be replaced with neutral branding or cleared
with the mark owner before external distribution. It is not a verification mark.

## Standards guardrails and prototype policies

The following distinctions correct or qualify assumptions in the source concept draft:

- GHG Protocol LSRS supports a documented right-to-report arrangement, but **Reporting Right** is not
  yet a standardized transferable asset. The prototype should initially represent a documented
  allocation and claim lineage, not a freely transferable token.
- Physical inventory accounting carries current emissions factors and separately accounted removals.
  Baseline-to-project reduction deltas belong to intervention or impact accounting; they must not
  also be subtracted as detachable tonnes in the physical inventory.
- Vertical reporting across organizations in one value chain and horizontal allocation within a tier
  require explicit lineage and allocation rules. The registry can prevent conflicting allocations
  inside its own ledger, but cannot guarantee that no off-platform claim exists.
- The draft formula `(buyer volume / factory output) × pool outcome` is a **prototype allocation
  policy**, not a formula prescribed by the standard. It still needs methodology and verifier review,
  including product boundaries, processing yields, losses, co-products, transfers, and inventory
  timing.
- Farm outcomes are generally upstream Scope 3 Category 1 for both the processor and downstream
  buyer; they are not the processor's Scope 1 emissions.
- Reductions and removals require separate quantities and evidence. Removals additionally require
  stock-change accounting, monitoring, uncertainty treatment, and reversal responsibility.

Current primary references:

- [GHG Protocol Land Sector and Removals Standard v1.1](https://ghgprotocol.org/sites/default/files/2026-06/Land-Sector-and-Removals-Standard-v1.1.pdf)
- [GHG Protocol Land Sector and Removals Guidance](https://ghgprotocol.org/land-sector-and-removals-guidance)
- [GHG Protocol Guidance, Chapter 5: Chain of Custody](https://ghgprotocol.org/sites/default/files/2026-06/Land-Sector-and-Removals-Guidance-v1.0-Chapter5.pdf)
- [GHG Protocol Guidance, Chapter 13: Right to Report](https://ghgprotocol.org/sites/default/files/2026-06/Land-Sector-and-Removals-Guidance-v1.0-Chapter13.pdf)
- [Value Change Initiative interventions guidance](https://valuechangeinitiative.com/wp-content/uploads/sites/2/2021/10/11.Value-Change-Interventions-Guidance.pdf)
- [Südzucker's TÜV SÜD-verified Plattling product-footprint example](https://www.suedzucker.com/new-officially-tuv-verified-co2-reduced-beet-sugar-by-sudzucker-now-available/)
- [TÜV SÜD verification statement for that example](https://www.suedzucker.com/wp-content/uploads/2023/12/VS_3868839-ext_PCF_SZ-Plattling_231116_neu.pdf)
- [TÜV SÜD rules for logo and verification-mark use](https://www.tuvsud.com/de-de/ueber-uns/unsere-gesellschaften/industrie-service/pz-nutzung)

## Scope boundary

### Included

- Südzucker-led intermediary scenario;
- independently owned farm records with delegated operation;
- direct farmer approval before an enrollment becomes active;
- pre-campaign Nestlé participation;
- enrolled, traceable land and attributable product output as the accounting boundary;
- L1 physical inventory data and L2 contribution evidence;
- soil-carbon removals, farm-emission reductions, and the resulting Product Footprint as distinct
  result measures;
- a multi-stakeholder walkthrough through final reconciliation and evidence packaging;
- before, during, and after campaign scenarios with simulated Südzucker–Nestlé exchanges;
- three role-switched perspectives without repeated login and logout;
- a supplier-created campaign proposal and meeting overview for the first buyer exchange; and
- a compact read-only multi-buyer allocation context.

### Deferred

- claims first requested after campaign completion;
- a direct farmer-to-buyer scenario without an intermediary;
- retailer or further-downstream propagation;
- on-platform escrow and payment execution;
- an interactive independent-verifier workflow;
- tradable carbon-credit issuance;
- detailed proposal negotiation, corrections, disputes, withdrawal, non-performance, and reversal
  workflows;
- real workflow signatures and approval-state machines;
- production implementation; and
- real backend behavior or persistence in the first clickable walkthrough.

## Remaining implementation choices

The stakeholder decisions, screen matrix, seed data, and prototype boundaries are settled. Visual
composition within the design system remains an implementation choice. Keep drill-downs limited to
one simple **How this was calculated** panel and the evidence summary already described.

Production-grade evidence thresholds, allocation methodology, signatures, corrections, disputes,
withdrawal, non-performance, and removal-reversal policy require separate specification and
assurance review.

## Decision log

| Date | Decision | Status |
| --- | --- | --- |
| 2026-07-13 | Südzucker is the canonical intermediary; the role can later be performed by a multi-account consultant/operator. | Agreed |
| 2026-07-13 | Farms own their records and entitlements; intermediaries work through scoped, revocable delegation. | Agreed |
| 2026-07-13 | The walkthrough contains L1 and L2 and culminates in L2. | Agreed |
| 2026-07-13 | Nestlé commits before the campaign; post-campaign claims are a separate use case. | Agreed |
| 2026-07-13 | Buyer product commitment and intervention contribution are modeled separately. | Agreed |
| 2026-07-13 | L1 covers enrolled, traceable land and attributable output rather than extrapolating to the entire factory catchment. | Agreed |
| 2026-07-13 | Südzucker may prepare enrollment, but the farmer must directly approve it before activation. | Agreed |
| 2026-07-13 | Operator delegation may persist, but parcel enrollment and material terms require simple campaign-specific farmer approval. | Agreed |
| 2026-07-13 | Independent verification is not an interactive prototype step; provider-assessed and externally verified statuses remain distinct. | Agreed |
| 2026-07-13 | MRV remains a minimal visible handoff; its calculation engine is outside the prototype. | Agreed |
| 2026-07-13 | TÜV SÜD may appear only as a clearly labelled simulated future actor; no actual verification is implied. | Agreed |
| 2026-07-13 | Buyer participation remains provisional until actual product volumes and evidence are reconciled after the campaign. | Agreed |
| 2026-07-13 | The prototype is organized into before, during, and after scenarios for one campaign. | Agreed |
| 2026-07-13 | The guided prototype has Farmer, Südzucker/operator, and Nestlé/buyer perspectives; MRV is a simulated external handoff. | Agreed |
| 2026-07-13 | Südzucker initiates the buyer exchange with a prefilled campaign-proposal overview. | Agreed |
| 2026-07-13 | The Before scenario includes a decision-ready campaign overview for the Nestlé meeting. | Agreed |
| 2026-07-13 | Südzucker and Nestlé use the same buyer-ready meeting brief; private preparation notes are out of scope. | Agreed |
| 2026-07-13 | The meeting brief is prefilled and readable; proposal authoring and negotiation interactions are out of scope. | Agreed |
| 2026-07-13 | The farmer's Before flow is one prefilled campaign-and-parcel review followed by a clear participation approval. | Agreed |
| 2026-07-13 | During is a prefilled transparency checkpoint, not an operational farm-data or MRV workflow. | Agreed |
| 2026-07-13 | After culminates in one reconciled Campaign Results package released by Südzucker. | Agreed |
| 2026-07-13 | The UI names are Campaign Results, Product Footprint, and Climate Contribution; technical labels stay in details. | Agreed |
| 2026-07-13 | Soil carbon stored, farm emissions reduced, and the reduced Product Footprint are all central to the seeded result story. | Agreed |
| 2026-07-13 | SOC is the primary OGCR result; Emissions Reduction and Product Footprint are downstream intervention and buyer results. | Agreed |
| 2026-07-13 | The first prototype is a seeded client-side walkthrough with one farmer-approval state change and no production backend. | Agreed |
| 2026-07-13 | Farmers retain a base participation/adoption payment; outcome bonuses and buyer allocations may vary with shortfalls. | Agreed placeholder |
| 2026-07-13 | Nestlé sees aggregate, de-identified campaign evidence; farmer identities and detailed records remain restricted. | Agreed |
| 2026-07-13 | A read-only Nestlé / Buyer B / unallocated visualization demonstrates multi-buyer allocation without another persona. | Agreed |
