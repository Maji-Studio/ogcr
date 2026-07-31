// The 29 farms Südzucker prepared for the campaign, scattered around the Plattling supply shed.
//
// Areas are chosen so the campaign totals the walkthrough narrates fall out of the data rather than
// being asserted: all 29 sum to 435.0 ha (the During figure), and dropping Weidenhof — the one farm
// whose evidence package never completes — leaves 420.0 ha as the final reconciled boundary.
//
// Lindenhof is the farm the viewer approves as, so its enrollment status is derived from the
// walkthrough's approval gate and is deliberately NOT seeded here.

export type Practice = "Cover crop" | "Reduced tillage" | "Optimised nitrogen";

export interface Farm {
  id: string;
  name: string;
  /** Hectares of enrolled beet area. */
  area: number;
  /** [lng, lat] — the farmstead, used to place it in the supply shed. */
  center: [number, number];
  practice: Practice;
  evidenceExpected: number;
  evidenceReceived: number;
  /** False for the farm that never completes its evidence package and drops at reconciliation. */
  completes: boolean;
}

/** The farm the viewer approves as. Its parcels are drawn in detail in `parcels.ts`. */
export const LINDENHOF_ID = "lindenhof";

/** The farm that drops out at reconciliation — 435.0 ha enrolled becomes 420.0 ha final. */
export const WEIDENHOF_ID = "weidenhof";

export const farms: Farm[] = [
  { id: LINDENHOF_ID, name: "Lindenhof Farm", area: 15.0, center: [12.858, 48.792], practice: "Cover crop", evidenceExpected: 10, evidenceReceived: 9, completes: true },
  { id: WEIDENHOF_ID, name: "Weidenhof", area: 15.0, center: [12.912, 48.741], practice: "Reduced tillage", evidenceExpected: 5, evidenceReceived: 2, completes: false },

  { id: "bachhof", name: "Bachhof", area: 12.4, center: [12.803, 48.826], practice: "Cover crop", evidenceExpected: 5, evidenceReceived: 5, completes: true },
  { id: "eichenhof", name: "Eichenhof", area: 17.6, center: [12.942, 48.812], practice: "Optimised nitrogen", evidenceExpected: 5, evidenceReceived: 5, completes: true },
  { id: "sonnenacker", name: "Sonnenacker", area: 9.7, center: [12.771, 48.758], practice: "Cover crop", evidenceExpected: 5, evidenceReceived: 5, completes: true },
  { id: "muhlfeld", name: "Mühlfeld", area: 20.3, center: [12.989, 48.769], practice: "Reduced tillage", evidenceExpected: 5, evidenceReceived: 5, completes: true },
  { id: "birkenhof", name: "Birkenhof", area: 22.1, center: [12.834, 48.703], practice: "Optimised nitrogen", evidenceExpected: 5, evidenceReceived: 4, completes: true },
  { id: "steinacker", name: "Steinacker", area: 7.9, center: [12.901, 48.848], practice: "Cover crop", evidenceExpected: 5, evidenceReceived: 4, completes: true },
  { id: "rosenhof", name: "Rosenhof", area: 14.6, center: [12.744, 48.801], practice: "Reduced tillage", evidenceExpected: 5, evidenceReceived: 4, completes: true },
  { id: "hollerhof", name: "Hollerhof", area: 15.4, center: [13.012, 48.822], practice: "Cover crop", evidenceExpected: 5, evidenceReceived: 4, completes: true },
  { id: "ahornhof", name: "Ahornhof", area: 16.9, center: [12.867, 48.869], practice: "Optimised nitrogen", evidenceExpected: 5, evidenceReceived: 4, completes: true },
  { id: "feldkamp", name: "Feldkamp", area: 13.1, center: [12.792, 48.716], practice: "Cover crop", evidenceExpected: 5, evidenceReceived: 4, completes: true },
  { id: "wiesengut", name: "Wiesengut", area: 11.3, center: [12.958, 48.699], practice: "Reduced tillage", evidenceExpected: 5, evidenceReceived: 4, completes: true },
  { id: "erlenhof", name: "Erlenhof", area: 18.7, center: [12.721, 48.847], practice: "Cover crop", evidenceExpected: 5, evidenceReceived: 4, completes: true },
  { id: "kirschgut", name: "Kirschgut", area: 21.4, center: [13.036, 48.751], practice: "Optimised nitrogen", evidenceExpected: 5, evidenceReceived: 4, completes: true },
  { id: "tannenhof", name: "Tannenhof", area: 8.6, center: [12.881, 48.681], practice: "Cover crop", evidenceExpected: 5, evidenceReceived: 4, completes: true },
  { id: "lerchenfeld", name: "Lerchenfeld", area: 13.8, center: [12.817, 48.878], practice: "Reduced tillage", evidenceExpected: 5, evidenceReceived: 4, completes: true },
  { id: "buchenhof", name: "Buchenhof", area: 16.2, center: [12.976, 48.888], practice: "Cover crop", evidenceExpected: 5, evidenceReceived: 4, completes: true },
  { id: "haselgut", name: "Haselgut", area: 19.5, center: [12.759, 48.687], practice: "Optimised nitrogen", evidenceExpected: 5, evidenceReceived: 4, completes: true },
  { id: "brunnenhof", name: "Brunnenhof", area: 10.5, center: [13.058, 48.803], practice: "Cover crop", evidenceExpected: 5, evidenceReceived: 4, completes: true },
  { id: "moosacker", name: "Moosacker", area: 8.9, center: [12.702, 48.772], practice: "Reduced tillage", evidenceExpected: 5, evidenceReceived: 4, completes: true },
  { id: "sandhof", name: "Sandhof", area: 21.1, center: [12.929, 48.918], practice: "Cover crop", evidenceExpected: 5, evidenceReceived: 4, completes: true },
  { id: "rainhof", name: "Rainhof", area: 17.2, center: [12.848, 48.663], practice: "Optimised nitrogen", evidenceExpected: 5, evidenceReceived: 4, completes: true },
  { id: "espenhof", name: "Espenhof", area: 12.8, center: [13.001, 48.679], practice: "Cover crop", evidenceExpected: 5, evidenceReceived: 4, completes: true },
  { id: "kornfeld", name: "Kornfeld", area: 18.3, center: [12.688, 48.828], practice: "Reduced tillage", evidenceExpected: 5, evidenceReceived: 4, completes: true },
  { id: "weidengut", name: "Weidengut", area: 11.7, center: [13.079, 48.729], practice: "Cover crop", evidenceExpected: 5, evidenceReceived: 4, completes: true },
  { id: "quellenhof", name: "Quellenhof", area: 10.4, center: [12.783, 48.899], practice: "Optimised nitrogen", evidenceExpected: 5, evidenceReceived: 4, completes: true },
  { id: "distelhof", name: "Distelhof", area: 19.6, center: [12.895, 48.634], practice: "Cover crop", evidenceExpected: 5, evidenceReceived: 4, completes: true },
  { id: "hochfeld", name: "Hochfeld", area: 15.0, center: [12.735, 48.649], practice: "Reduced tillage", evidenceExpected: 5, evidenceReceived: 4, completes: true },
];

/** Lindenhof's three parcels — the ones the farmer actually approves. Sum to its 15.0 ha. */
export const lindenhofParcels = [
  { id: "north-field", name: "North field", area: 6.8, practice: "Cover crop" as const },
  { id: "mill-meadow", name: "Mill meadow", area: 5.1, practice: "Reduced tillage" as const },
  { id: "orchard-piece", name: "Orchard piece", area: 3.1, practice: "Optimised nitrogen" as const },
];
