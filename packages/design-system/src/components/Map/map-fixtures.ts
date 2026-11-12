// Sample parcels shared by the Map stories and the demo page. Not part of the published library:
// nothing on the package's entry points imports this file.

import type { Feature, FeatureCollection, Point, Polygon } from 'geojson'
import type { MapLegendItem } from '../MapLegend'
import { PARCEL_STATUS_TOKENS, type ParcelStatus } from './map-parcels'

// Rectangular fields on a grid around a farm near Plattling (Bavaria), so every status can be seen
// side by side. Real screens pass surveyed polygons.

const FARM: [number, number] = [12.858, 48.792]
/** Metres per degree at 48.79° N. */
const M_PER_DEG_LAT = 111_320
const M_PER_DEG_LNG = 73_400
const M2_PER_HA = 10_000
const FIELD_WIDTH_M = 150
const FIELD_DEPTH_M = 110
const FIELD_GAP_M = 14

export const STATUS_LABEL: Record<ParcelStatus, string> = {
  enrolled: 'Enrolled',
  awaiting: 'Included',
  dropped: 'Withdrawn',
  high: 'High potential',
  medium: 'Medium potential',
  ineligible: 'Not eligible',
}
export const CAMPAIGN: ParcelStatus[] = ['enrolled', 'awaiting', 'dropped']
export const POTENTIAL: ParcelStatus[] = ['high', 'medium', 'ineligible']

type ParcelProps = {
  parcelId: string
  name: string
  status: string
  detail: string
  selected: boolean
}

function fields(
  statuses: ParcelStatus[],
  columns: number,
  origin: [number, number] = FARM,
): Feature<Polygon, ParcelProps>[] {
  const rows = Math.ceil(statuses.length / columns)
  return statuses.map((status, index) => {
    const col = index % columns
    const row = Math.floor(index / columns)
    // Some fields are a little narrower so the shapes and areas are not all identical.
    const widthM = FIELD_WIDTH_M - ((col * 7 + row * 13) % 5) * 12
    const west = (col - (columns - 1) / 2) * (FIELD_WIDTH_M + FIELD_GAP_M) - widthM / 2
    const north = ((rows - 1) / 2 - row) * (FIELD_DEPTH_M + FIELD_GAP_M) + FIELD_DEPTH_M / 2
    const at = (x: number, y: number): [number, number] => [
      origin[0] + x / M_PER_DEG_LNG,
      origin[1] + y / M_PER_DEG_LAT,
    ]
    const label = String(index + 1).padStart(2, '0')
    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            at(west, north),
            at(west + widthM, north),
            at(west + widthM, north - FIELD_DEPTH_M),
            at(west, north - FIELD_DEPTH_M),
            at(west, north),
          ],
        ],
      },
      properties: {
        parcelId: `field-${label}`,
        name: `Field ${label}`,
        status,
        detail: `${((widthM * FIELD_DEPTH_M) / M2_PER_HA).toFixed(1)} ha`,
        selected: false,
      },
    }
  })
}

export function collection(features: Feature[], selectedId: string | null = null): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: features.map((feature) => ({
      ...feature,
      properties: {
        ...feature.properties,
        selected: feature.properties?.parcelId === selectedId,
      },
    })),
  }
}

export const POTENTIAL_FIELDS = fields(['high', 'medium', 'high', 'ineligible', 'medium', 'high'], 3)
export const CAMPAIGN_FIELDS = fields(
  ['enrolled', 'enrolled', 'awaiting', 'dropped', 'enrolled', 'awaiting'],
  3,
)

/** Farms across a ~30 km supply shed: a locator dot plus two fields each. */
const SHED_FARMS: { offsetKm: [number, number]; status: ParcelStatus }[] = [
  { offsetKm: [0, 0], status: 'enrolled' },
  { offsetKm: [-9, 6], status: 'enrolled' },
  { offsetKm: [7, 8], status: 'awaiting' },
  { offsetKm: [12, -4], status: 'enrolled' },
  { offsetKm: [-6, -9], status: 'awaiting' },
  { offsetKm: [3, -12], status: 'dropped' },
  { offsetKm: [-14, -2], status: 'enrolled' },
]
export const SHED_FEATURES: Feature[] = SHED_FARMS.flatMap(({ offsetKm, status }) => {
  const centre: [number, number] = [
    FARM[0] + (offsetKm[0] * 1000) / M_PER_DEG_LNG,
    FARM[1] + (offsetKm[1] * 1000) / M_PER_DEG_LAT,
  ]
  const dot: Feature<Point> = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: centre },
    properties: { status },
  }
  return [dot, ...fields([status, status], 2, centre)]
})

export const legendItems = (statuses: ParcelStatus[]): MapLegendItem[] =>
  statuses.map((status) => ({ label: STATUS_LABEL[status], token: PARCEL_STATUS_TOKENS[status] }))
