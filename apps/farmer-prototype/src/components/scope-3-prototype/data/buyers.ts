// Buyers of the campaign's eligible sugar. Nestlé is the only interactive buyer; Buyer B exists so
// the horizontal-allocation model is visible without adding a second buyer workflow.

export interface Buyer {
  id: string;
  name: string;
  /** Pre-campaign forecast/minimum purchase volume, in tonnes of eligible sugar. */
  committed: number;
  /** What they actually purchased, known only after reconciliation. */
  actual: number;
  /** Program contribution in EUR. Separate from the product commitment by design. */
  contribution: number;
  /** Buyer B takes the Product Footprint only — no Climate Contribution claim. */
  claimsContribution: boolean;
  /** Token-backed fill used in the allocation chart. */
  color: string;
}

export const buyers: Buyer[] = [
  {
    id: "nestle",
    name: "Nestlé",
    committed: 2200,
    actual: 2000,
    contribution: 60000,
    claimsContribution: true,
    color: "var(--ds-interaction-primary-default)",
  },
  {
    id: "buyer-b",
    name: "Buyer B",
    committed: 1500,
    actual: 1500,
    contribution: 0,
    claimsContribution: false,
    color: "var(--ds-brand-blue-300)",
  },
];

export const NESTLE_ID = "nestle";

/** How Nestlé's €60,000 contribution is spent. MRV/admin absorbs the remainder. */
export const contributionUses = {
  farmerBase: "Farmer base payments",
  socBonus: "SOC outcome bonuses",
  admin: "MRV and program administration",
} as const;
