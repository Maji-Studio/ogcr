// Campaign identity and the accounting rules every figure in the walkthrough derives from.
// Nothing here is a reported Südzucker, Nestlé, MRV, or assurance result — it is illustrative
// prototype data chosen to be internally coherent and inspectable.

/** Farmer commercial terms (placeholder policy — see the flow spec). */
export const EUR_PER_HA = 100;
export const EUR_PER_TCO2 = 25;

/** Beet → eligible white sugar. 17.0% sugar content × 94.1% recovery/allocation ≈ 16.0%. */
export const SUGAR_YIELD = 0.16;
export const BEET_YIELD_T_PER_HA = 75;

/** The TÜV SÜD Plattling conventional-sugar comparison, reused only as a recognisable PCF anchor. */
export const REFERENCE_FOOTPRINT = 0.55;

/** Per-hectare intervention results, assessed/modelled. Kept as separate quantities by design. */
export const SOC_PER_HA = 0.55;
export const REDUCTION_PER_HA = 0.36;

export const campaign = {
  id: "27-SS-01",
  name: "Soil & Sugar 2027",
  year: "2027 campaign year",
  supplyShed: "Südzucker Plattling",
  product: "Sugar beet → eligible white sugar",
  targetFarms: 30,
  targetArea: 450,
  /** Plattling, Bavaria — the factory the supply shed is built around. */
  center: [12.87, 48.78] as [number, number],
  dates: [
    { label: "Farmer approvals", date: "15 Mar 2027" },
    { label: "Campaign start", date: "01 Apr 2027" },
    { label: "MRV assessment", date: "15 Dec 2027" },
    { label: "Results release", date: "28 Feb 2028" },
  ],
} as const;

export const practices = [
  "Cover crops between beet rotations",
  "Reduced tillage where agronomically suitable",
  "Optimised nitrogen planning and application",
] as const;

export const permissions = [
  "Maintain farm and parcel records for this campaign",
  "Share authorised parcel and source data with the MRV provider",
  "Prepare evidence and submit campaign records on the farm’s behalf",
  "Allocate eligible outcomes under the campaign’s reporting policy",
] as const;
