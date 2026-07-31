// The prototype is one linear story told across nine real product screens. Each step is a single
// moment with a single actor. Two steps are gates: the story cannot advance until that actor acts.
// Those two actions are the only state the walkthrough carries.
//
// `screen`/`crumb` name the page as the product would name it. `guide` is the narration — it lives
// in the guide bar layered over the app, never in the page itself.

export type Phase = "before" | "during" | "after";
export type Actor = "farmer" | "operator" | "buyer";
export type Gate = "farmerApproved" | "resultsReleased";

export interface Step {
  id: string;
  phase: Phase;
  actor: Actor;
  /** Label in the step nav. */
  nav: string;
  /** The product page's own title. */
  screen: string;
  /** Breadcrumb tail, under the campaign. */
  crumb: string;
  /** One sentence of narration, shown in the guide bar. */
  guide: string;
  /** When set, Next stays disabled until this flag is true. */
  gate?: Gate;
}

export const steps: readonly Step[] = [
  {
    id: "proposal",
    phase: "before",
    actor: "operator",
    nav: "Program proposal",
    screen: "Campaign brief",
    crumb: "Brief",
    guide:
      "Südzucker opens the conversation with one shared brief. Both organisations read the same page — there is no private proposal.",
  },
  {
    id: "commitment",
    phase: "before",
    actor: "buyer",
    nav: "Buyer commitment",
    screen: "Commitments",
    crumb: "Commitments",
    guide:
      "Nestlé commits twice, separately: a product volume and an intervention contribution. Keeping them apart is what protects the farmer later.",
  },
  {
    id: "approval",
    phase: "before",
    actor: "farmer",
    nav: "Farmer approval",
    screen: "Your enrollment",
    crumb: "Enrollment",
    guide:
      "Südzucker prepared this enrollment under delegation, but it stays inactive until the farmer approves it directly. Approve to continue.",
    gate: "farmerApproved",
  },
  {
    id: "enrollment",
    phase: "before",
    actor: "operator",
    nav: "Enrollment closes",
    screen: "Enrollment",
    crumb: "Enrollment",
    guide:
      "The same approval, seen from the operator’s side — the roster, the area, and the map all moved because the farmer said yes.",
  },
  {
    id: "progress",
    phase: "during",
    actor: "operator",
    nav: "Campaign progress",
    screen: "Campaign progress",
    crumb: "Progress",
    guide:
      "Evidence accumulates and forecasts move. Südzucker hands an authorised work package to the MRV provider and waits.",
  },
  {
    id: "checkpoint",
    phase: "during",
    actor: "buyer",
    nav: "Buyer checkpoint",
    screen: "Campaign progress",
    crumb: "Progress",
    guide:
      "Nestlé sees aggregate, de-identified progress. Every figure here is a forecast, and a forecast cannot be exported as a claim.",
  },
  {
    id: "release",
    phase: "after",
    actor: "operator",
    nav: "Reconcile & release",
    screen: "Campaign results",
    crumb: "Results",
    guide:
      "MRV results arrive and volumes are attested. Südzucker decides when the buyer package goes out. Release to continue.",
    gate: "resultsReleased",
  },
  {
    id: "package",
    phase: "after",
    actor: "buyer",
    nav: "Buyer results",
    screen: "Your results",
    crumb: "Results",
    guide:
      "The footprint applies to what Nestlé actually bought — 2,000 t, not the 2,200 t committed. Contribution is evaluated separately.",
  },
  {
    id: "payment",
    phase: "after",
    actor: "farmer",
    nav: "Farmer payout",
    screen: "Your payout",
    crumb: "Payout",
    guide:
      "Nestlé bought less than it committed. That shrank Nestlé’s allocation — not the farmer’s guaranteed base payment.",
  },
] as const;

export const phaseLabels: Record<Phase, string> = {
  before: "Before the campaign",
  during: "During the campaign",
  after: "After the campaign",
};

export const actorLabels: Record<Actor, string> = {
  farmer: "Lindenhof Farm",
  operator: "Südzucker",
  buyer: "Nestlé",
};

export const actorRoles: Record<Actor, string> = {
  farmer: "Farmer",
  operator: "Program operator",
  buyer: "Buyer",
};
