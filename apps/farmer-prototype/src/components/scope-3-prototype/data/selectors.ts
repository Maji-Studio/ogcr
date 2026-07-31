// Every figure the dashboards show is computed here from the seed data. Nothing downstream hardcodes
// a total, a percentage, or a result — which is what makes approving Lindenhof actually move the
// operator's enrollment, area, coverage, and allocation numbers.

import {
  BEET_YIELD_T_PER_HA,
  EUR_PER_HA,
  EUR_PER_TCO2,
  REDUCTION_PER_HA,
  REFERENCE_FOOTPRINT,
  SOC_PER_HA,
  SUGAR_YIELD,
} from "./campaign";
import { buyers, NESTLE_ID } from "./buyers";
import { farms, LINDENHOF_ID, type Farm } from "./farms";

/** Lindenhof is enrolled only once the farmer has approved. Everyone else was already enrolled. */
export function isEnrolled(farm: Farm, lindenhofApproved: boolean): boolean {
  return farm.id === LINDENHOF_ID ? lindenhofApproved : true;
}

export function enrolledFarms(lindenhofApproved: boolean): Farm[] {
  return farms.filter((farm) => isEnrolled(farm, lindenhofApproved));
}

/** The farms that make it through reconciliation — the final accounting boundary. */
export function completedFarms(lindenhofApproved: boolean): Farm[] {
  return enrolledFarms(lindenhofApproved).filter((farm) => farm.completes);
}

export function totalArea(list: Farm[]): number {
  return round(list.reduce((sum, farm) => sum + farm.area, 0), 1);
}

export function evidenceCoverage(list: Farm[]): number {
  const expected = list.reduce((sum, farm) => sum + farm.evidenceExpected, 0);
  if (expected === 0) return 0;
  const received = list.reduce((sum, farm) => sum + farm.evidenceReceived, 0);
  return round((received / expected) * 100, 0);
}

export function eligibleBeet(areaHa: number): number {
  return round(areaHa * BEET_YIELD_T_PER_HA, 0);
}

export function eligibleSugar(areaHa: number): number {
  return round(eligibleBeet(areaHa) * SUGAR_YIELD, 0);
}

/**
 * Two decimal places, not one: a 15 ha farm stores 8.25 tCO₂, and rounding that to 8.3 before the
 * €25/tCO₂ bonus is applied would overpay the farmer. Campaign-scale values stay whole (420 ha → 231).
 */
export function socStored(areaHa: number): number {
  return round(areaHa * SOC_PER_HA, 2);
}

export function emissionsReduced(areaHa: number): number {
  return round(areaHa * REDUCTION_PER_HA, 1);
}

/**
 * The reference footprint less the field-emissions reduction spread over the eligible sugar.
 * SOC is deliberately NOT subtracted here — it is reported as its own result, never twice.
 */
export function productFootprint(areaHa: number): number {
  const sugar = eligibleSugar(areaHa);
  if (sugar === 0) return REFERENCE_FOOTPRINT;
  return round(REFERENCE_FOOTPRINT - emissionsReduced(areaHa) / sugar, 3);
}

export interface Allocation {
  id: string;
  name: string;
  volume: number;
  share: number;
  color: string;
}

/** Per-buyer share of the final eligible output, plus whatever nobody bought. */
export function allocation(areaHa: number): Allocation[] {
  const sugar = eligibleSugar(areaHa);
  const sold = buyers.reduce((sum, buyer) => sum + buyer.actual, 0);
  const rows: Allocation[] = buyers.map((buyer) => ({
    id: buyer.id,
    name: buyer.name,
    volume: buyer.actual,
    share: round((buyer.actual / sugar) * 100, 1),
    color: buyer.color,
  }));

  const unallocated = round(sugar - sold, 0);
  rows.push({
    id: "unallocated",
    name: "Unallocated",
    volume: unallocated,
    share: round((unallocated / sugar) * 100, 1),
    color: "var(--ds-border-medium)",
  });

  return rows;
}

export const nestle = buyers.find((buyer) => buyer.id === NESTLE_ID)!;

/** What Nestlé may report, capped by the volume it actually purchased. */
export function buyerResult(areaHa: number) {
  const sugar = eligibleSugar(areaHa);
  const footprint = productFootprint(areaHa);
  const share = nestle.actual / sugar;

  return {
    volume: nestle.actual,
    committed: nestle.committed,
    share: round(share * 100, 1),
    /** Emissions carried by the sugar Nestlé bought, at the campaign footprint. */
    allocatedEmissions: round(nestle.actual * footprint, 0),
    /** The same volume at the untreated reference footprint. */
    referenceEmissions: round(nestle.actual * REFERENCE_FOOTPRINT, 0),
    /** Volume-capped share of the campaign reduction. Kept separate from SOC — never summed. */
    contributionReduction: round(emissionsReduced(areaHa) * share, 1),
    contributionSoc: round(socStored(areaHa) * share, 1),
    contribution: nestle.contribution,
  };
}

/** A farm's own payment: a guaranteed base, plus a bonus that tracks its assessed SOC result. */
export function farmerPayment(farm: Farm) {
  const soc = socStored(farm.area);
  const base = round(farm.area * EUR_PER_HA, 2);
  const bonus = round(soc * EUR_PER_TCO2, 2);
  return { base, bonus, total: round(base + bonus, 2), soc, reduced: emissionsReduced(farm.area) };
}

/** How the buyer's contribution is spent across the program. MRV/admin absorbs the remainder. */
export function contributionBreakdown(areaHa: number) {
  const farmerBase = round(areaHa * EUR_PER_HA, 0);
  const socBonus = round(socStored(areaHa) * EUR_PER_TCO2, 0);
  return {
    farmerBase,
    socBonus,
    admin: round(nestle.contribution - farmerBase - socBonus, 0),
    total: nestle.contribution,
  };
}

export const lindenhof = farms.find((farm) => farm.id === LINDENHOF_ID)!;

function round(value: number, places: number): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}
