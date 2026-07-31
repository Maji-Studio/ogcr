import type { KpiTone } from "@majistudio/ogcr-design-system";
import type { PillTone } from "@majistudio/ogcr-design-system";

export interface FarmKpis {
  /** Latest measured soil organic carbon stock, t C/ha. */
  currentSoc: number;
  /** Modelled end-of-season SOC estimate, t C/ha. */
  estimatedSoc: number;
  /** Signed % difference vs the regional peer median. */
  peerDeltaPct: number;
}

export interface Farm {
  id: string;
  name: string;
  /** [lng, lat] centre used by the map once farm geometry is wired in. */
  center: [number, number];
  kpis: FarmKpis;
}

/** Prototype stand-ins until farms come from the database. */
export const FARMS: Farm[] = [
  {
    id: "willow-creek",
    name: "Willow Creek Farm",
    center: [-1.32, 52.06],
    kpis: { currentSoc: 42.3, estimatedSoc: 44.1, peerDeltaPct: 8 },
  },
  {
    id: "north-field",
    name: "North Field Estate",
    center: [-0.87, 52.24],
    kpis: { currentSoc: 38.6, estimatedSoc: 39.2, peerDeltaPct: -3 },
  },
  {
    id: "hazel-down",
    name: "Hazel Down",
    center: [-1.55, 51.9],
    kpis: { currentSoc: 45.8, estimatedSoc: 47.5, peerDeltaPct: 12 },
  },
];

export type ActivityKind = "sampling" | "practice" | "verification" | "report";

export interface Activity {
  id: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  /** ISO date, rendered as a friendly label. */
  date: string;
}

/** Prototype activity feed, newest first. */
export const ACTIVITIES: Activity[] = [
  {
    id: "a1",
    kind: "sampling",
    title: "Soil samples collected",
    detail: "24 cores across parcels 3–7",
    date: "2026-07-14",
  },
  {
    id: "a2",
    kind: "practice",
    title: "Cover crop logged",
    detail: "Clover mix drilled on parcel 5",
    date: "2026-07-10",
  },
  {
    id: "a3",
    kind: "verification",
    title: "Verification visit scheduled",
    detail: "Auditor on-site 28 Jul",
    date: "2026-07-08",
  },
  {
    id: "a4",
    kind: "report",
    title: "Q2 carbon report issued",
    detail: "Shared with 2 buyers",
    date: "2026-07-01",
  },
  {
    id: "a5",
    kind: "practice",
    title: "Reduced tillage recorded",
    detail: "Min-till pass on parcels 1–2",
    date: "2026-06-26",
  },
];

export function peerTone(deltaPct: number): {
  kpi: KpiTone;
  pill: PillTone;
} {
  if (deltaPct > 0) return { kpi: "positive", pill: "positive" };
  if (deltaPct < 0) return { kpi: "warning", pill: "warning" };
  return { kpi: "neutral", pill: "neutral" };
}
