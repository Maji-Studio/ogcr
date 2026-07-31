import type { FeatureCollection } from "geojson";

/**
 * Program lifecycle. Only the initiation phase ("awaiting-approval" →
 * "enrolled") is built so far; "season" and "complete" arrive with the
 * during/after dossier screens.
 */
export type ProgramStatus = "awaiting-approval" | "enrolled";

/** Map overlay status understood by MapView (see base-map statusColor). */
export type ParcelMapStatus = "enrolled" | "awaiting" | "dropped";

export interface SeasonStep {
  label: string;
  /** When this step happens, shown under the label ("April", "Summer", …). */
  timing: string;
}

/** The same five-step season timeline is shown on every program phase. */
export const SEASON_STEPS: SeasonStep[] = [
  { label: "Your approval", timing: "April" },
  { label: "Practices confirmed", timing: "May" },
  { label: "Soil team measures", timing: "Summer" },
  { label: "Harvest & results", timing: "October" },
  { label: "Payment", timing: "December" },
];

export interface ProgramParcel {
  id: string;
  name: string;
  areaHa: number;
  practice: string;
  /** Closed polygon ring, [lng, lat] pairs (last point may repeat the first). */
  ring: [number, number][];
}

export interface AgreementPoint {
  value: string;
  label: string;
  content: string;
}

export interface Program {
  slug: string;
  name: string;
  buyer: string;
  farmName: string;
  status: ProgramStatus;
  /** One-paragraph plain-words pitch shown at the top of the dossier. */
  summary: string;
  parcels: ProgramParcel[];
  /** Guaranteed payment per hectare, EUR. */
  basePerHa: number;
  /** Bonus per tonne of CO₂ stored, EUR. */
  bonusPerTonne: number;
  /** Provisional bonus estimate for the season, EUR. */
  estimatedBonus: number;
  /** "The agreement, in plain words" tab content. */
  agreement: AgreementPoint[];
  /** Reassurances listed next to the approve button. */
  assurances: string[];
  advisor: { name: string; email: string };
}

/**
 * Prototype stand-in until programs come from the database. Parcels sit near
 * the Willow Creek fixture farm the dashboard uses ([-1.32, 52.06]).
 */
export const PROGRAMS: Program[] = [
  {
    slug: "soil-and-sugar-2027",
    name: "Soil & Sugar 2027",
    buyer: "Südzucker",
    farmName: "Willow Creek Farm",
    status: "awaiting-approval",
    summary:
      "Keep your cover crops and reduced fertilizer plan on these 3 fields. Südzucker handles the paperwork. You get €1,520 guaranteed, plus a soil bonus.",
    parcels: [
      {
        id: "p1",
        name: "P1 · North field",
        areaHa: 6.1,
        practice: "Cover crop + reduced fertilizer",
        ring: [
          [-1.3305, 52.0665],
          [-1.3252, 52.0674],
          [-1.324, 52.0641],
          [-1.3296, 52.0632],
        ],
      },
      {
        id: "p2",
        name: "P2 · Creek field",
        areaHa: 5.0,
        practice: "Cover crop + reduced fertilizer",
        ring: [
          [-1.3226, 52.0612],
          [-1.3178, 52.0621],
          [-1.3164, 52.0589],
          [-1.3214, 52.0581],
        ],
      },
      {
        id: "p3",
        name: "P3 · Hill field",
        areaHa: 4.1,
        practice: "Cover crop + reduced fertilizer",
        ring: [
          [-1.3156, 52.0652],
          [-1.3114, 52.066],
          [-1.3102, 52.0629],
          [-1.3147, 52.0623],
        ],
      },
    ],
    basePerHa: 100,
    bonusPerTonne: 25,
    estimatedBonus: 210,
    agreement: [
      {
        value: "share",
        label: "What you share",
        content:
          "Your field records (crops, fertilizer, tillage) go to the soil measurement team so they can measure your result. Nobody else sees them.",
      },
      {
        value: "role",
        label: "What Südzucker does",
        content:
          "Keeps your records up to date and prepares next season's forms for you. You can take this permission back at any time.",
      },
      {
        value: "report",
        label: "Who reports results",
        content:
          "Nestlé may report the combined result of all participating farms. Your name and your field data stay private.",
      },
    ],
    assurances: [
      "You can withdraw before the season starts",
      "Your field data stays yours",
      "Nothing is final until you press approve",
    ],
    advisor: { name: "Thomas Weber", email: "thomas.weber@example.com" },
  },
];

export function getProgram(slug: string): Program | undefined {
  return PROGRAMS.find((p) => p.slug === slug);
}

export function totalAreaHa(program: Program): number {
  const total = program.parcels.reduce((sum, p) => sum + p.areaHa, 0);
  return Math.round(total * 10) / 10;
}

/** Guaranteed payment for the whole program, EUR. */
export function basePayment(program: Program): number {
  return Math.round(program.basePerHa * totalAreaHa(program));
}

/** Parcel polygons in the shape MapView expects, coloured by `status`. */
export function parcelFeatures(
  program: Program,
  status: ParcelMapStatus,
): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: program.parcels.map((parcel) => ({
      type: "Feature",
      properties: { status, name: parcel.name },
      geometry: {
        type: "Polygon",
        coordinates: [[...parcel.ring, parcel.ring[0]]],
      },
    })),
  };
}

export const EURO = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
