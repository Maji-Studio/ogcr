/**
 * Lindenhof Farm, seen from the farmer's own side of the screen.
 *
 * Everything here is illustrative prototype data for the farmer base screen. Parcel areas,
 * practice history, and potential tiers stay local to this feature so the screen does not depend
 * on another prototype or commercial workflow.
 *
 * Two rules this module enforces in its shape, not just in its copy:
 *   1. Soil carbon removals and emissions reductions are separate quantities. Every estimate
 *      carries its `kind`, and no selector ever sums across the two.
 *   2. Nothing here is a measured or assessed result. Callers render every figure with an
 *      "Illustrative" label.
 */

export type PracticeName = "Cover crop" | "Reduced tillage" | "Optimised nitrogen";

/**
 * What a practice produces. Soil carbon is a removal (tCO₂); avoided field emissions are a
 * reduction (tCO₂e). They are reported side by side and never added together.
 */
export type OutcomeKind = "removal" | "reduction";

/** Map colouring and the list badge. `ineligible` parcels have no potential at all. */
export type PotentialTier = "high" | "medium" | "ineligible";

export interface PracticePotential {
  practice: PracticeName;
  kind: OutcomeKind;
  /** Low end of the seeded per-hectare, per-year estimate. */
  low: number;
  /** High end of the same estimate. */
  high: number;
}

export interface FarmerParcel {
  id: string;
  name: string;
  /** Hectares. */
  area: number;
  /** How the parcel has been farmed so far. Drives eligibility. */
  history: string;
  tier: PotentialTier;
  /** Estimates for every practice, recommended one first. Empty when the parcel is not eligible. */
  practices: PracticePotential[];
  /** Set only when `practices` is empty: why this parcel earns nothing new. */
  ineligibleReason?: string;
}

export interface Range {
  low: number;
  high: number;
}

/** The farm identity shown in the top chrome. Centre is [longitude, latitude]. */
export const farm = {
  id: "lindenhof",
  name: "Lindenhof Farm",
  place: "Plattling, Bavaria",
  center: [12.858, 48.792] as [number, number],
};

/**
 * The four parcels. Three carry illustrative potential; Home paddock already grows cover crops,
 * so the screen does not present the existing practice as a new opportunity.
 */
export const parcels: FarmerParcel[] = [
  {
    id: "north-field",
    name: "North field",
    area: 6.8,
    history: "Conventional, winter fallow",
    tier: "high",
    practices: [
      { practice: "Cover crop", kind: "removal", low: 0.5, high: 0.7 },
      { practice: "Reduced tillage", kind: "removal", low: 0.2, high: 0.4 },
      { practice: "Optimised nitrogen", kind: "reduction", low: 0.1, high: 0.2 },
    ],
  },
  {
    id: "mill-meadow",
    name: "Mill meadow",
    area: 5.1,
    history: "Conventional tillage",
    tier: "medium",
    practices: [
      { practice: "Reduced tillage", kind: "removal", low: 0.3, high: 0.5 },
      { practice: "Cover crop", kind: "removal", low: 0.2, high: 0.4 },
      { practice: "Optimised nitrogen", kind: "reduction", low: 0.1, high: 0.2 },
    ],
  },
  {
    id: "orchard-piece",
    name: "Orchard piece",
    area: 3.1,
    history: "High nitrogen inputs",
    tier: "medium",
    practices: [
      { practice: "Optimised nitrogen", kind: "reduction", low: 0.2, high: 0.4 },
      { practice: "Cover crop", kind: "removal", low: 0.1, high: 0.3 },
      { practice: "Reduced tillage", kind: "removal", low: 0.1, high: 0.2 },
    ],
  },
  {
    id: "home-paddock",
    name: "Home paddock",
    area: 2.0,
    history: "Cover crops since 2023",
    tier: "ineligible",
    practices: [],
    ineligibleReason:
      "Home paddock already grows cover crops. A practice that is already in place cannot count as new carbon potential.",
  },
];

/** The parcel the next-action card points at: the highest potential on the farm. */
export const FEATURED_PARCEL_ID = "north-field";

export function findParcel(id: string | null): FarmerParcel | null {
  if (!id) return null;
  return parcels.find((parcel) => parcel.id === id) ?? null;
}

export function isEligible(parcel: FarmerParcel): boolean {
  return parcel.practices.length > 0;
}

/** The practice shown first and used for every roll-up on this screen. */
export function recommendedPractice(parcel: FarmerParcel): PracticePotential | null {
  return parcel.practices[0] ?? null;
}

export const eligibleParcels = parcels.filter(isEligible);

export const totalArea = round1(sum(parcels.map((parcel) => parcel.area)));
export const eligibleArea = round1(sum(eligibleParcels.map((parcel) => parcel.area)));

/** Per-parcel yearly estimate for one practice, in tonnes. */
export function parcelPotential(parcel: FarmerParcel, practice: PracticePotential): Range {
  return { low: practice.low * parcel.area, high: practice.high * parcel.area };
}

/**
 * Farm-wide potential for one outcome kind, using each parcel's recommended practice. Removals and
 * reductions are requested separately by design: there is no selector that returns their total.
 */
export function farmPotential(kind: OutcomeKind): Range {
  return eligibleParcels.reduce<Range>(
    (total, parcel) => {
      const practice = recommendedPractice(parcel);
      if (!practice || practice.kind !== kind) return total;
      const { low, high } = parcelPotential(parcel, practice);
      return { low: total.low + low, high: total.high + high };
    },
    { low: 0, high: 0 },
  );
}

/** How many parcels contribute to a given outcome kind, for the KPI caption. */
export function parcelsContributing(kind: OutcomeKind): FarmerParcel[] {
  return eligibleParcels.filter((parcel) => recommendedPractice(parcel)?.kind === kind);
}

/* --- formatting ------------------------------------------------------------ */

/** "0.5 to 0.7". Uses the word, never a dash — see docs/ux-writing.md. */
export function formatRange(range: Range, digits = 1): string {
  return `${range.low.toFixed(digits)} to ${range.high.toFixed(digits)}`;
}

export function formatArea(area: number): string {
  return area.toFixed(1);
}

/** "tCO₂" for a removal, "tCO₂e" for a reduction. The suffix is part of the honesty. */
export function unitFor(kind: OutcomeKind): string {
  return kind === "removal" ? "tCO₂" : "tCO₂e";
}

export function outcomeLabel(kind: OutcomeKind): string {
  return kind === "removal" ? "Soil carbon removals" : "Emissions reductions";
}

/** "1 parcel" / "3 parcels" — plurals are written out, never "parcel(s)". */
export function parcelCount(count: number): string {
  return count === 1 ? "1 parcel" : `${count} parcels`;
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}
