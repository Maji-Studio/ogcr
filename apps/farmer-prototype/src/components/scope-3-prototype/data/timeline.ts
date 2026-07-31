// The campaign month by month. Drives the trend charts, so forecasts visibly move over time and the
// final column is the only one that is an actual rather than a projection.

export interface TimelinePoint {
  month: string;
  /** Evidence records received as a share of expected, 0–100. */
  coverage: number;
  /** Forecast (or, at close, actual) eligible white sugar in tonnes. */
  eligibleSugar: number;
  /** Provisional (or final) product footprint in tCO₂e per tonne of sugar. */
  footprint: number;
  /** False until the campaign closes — everything before is a forecast, not a reportable result. */
  actual: boolean;
}

export const timeline: TimelinePoint[] = [
  { month: "Apr", coverage: 12, eligibleSugar: 5400, footprint: 0.52, actual: false },
  { month: "May", coverage: 24, eligibleSugar: 5380, footprint: 0.521, actual: false },
  { month: "Jun", coverage: 38, eligibleSugar: 5310, footprint: 0.521, actual: false },
  { month: "Jul", coverage: 51, eligibleSugar: 5240, footprint: 0.522, actual: false },
  { month: "Aug", coverage: 67, eligibleSugar: 5160, footprint: 0.523, actual: false },
  { month: "Sep", coverage: 82, eligibleSugar: 5081, footprint: 0.523, actual: false },
  { month: "Oct", coverage: 91, eligibleSugar: 5060, footprint: 0.522, actual: false },
  { month: "Nov", coverage: 97, eligibleSugar: 5048, footprint: 0.521, actual: false },
  { month: "Dec", coverage: 100, eligibleSugar: 5040, footprint: 0.52, actual: true },
];

/** The checkpoint the During phase is frozen at. */
export const CHECKPOINT_MONTH = "Sep";
export const CHECKPOINT_DATE = "18 September 2027";

export const checkpoint = timeline.find((point) => point.month === CHECKPOINT_MONTH)!;
export const close = timeline[timeline.length - 1];
