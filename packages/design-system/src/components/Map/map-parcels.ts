import maplibregl from 'maplibre-gl'
import type { ExpressionSpecification, Map as MapLibreMap } from 'maplibre-gl'
import type { FeatureCollection } from 'geojson'
import type { BasemapId } from './constants'
import { resolveToken } from './map-style'

// The parcel overlay: how a field looks on the map in every state. Each feature is styled by its
// `status` property and an optional `selected: true`; polygons get a name card from `name` and
// `detail`, and Point features become locator dots for the zoomed-out supply-shed view.

// `ogcr-` namespace, kept distinct from the basemap layers.
export const PARCEL_SOURCE = 'ogcr-parcels'
export const PARCEL_FILL_LAYER = 'ogcr-parcels-fill'
const PARCEL_LINE_LAYER = 'ogcr-parcels-line'
const PARCEL_LINE_INACTIVE_LAYER = 'ogcr-parcels-line-inactive'
const PARCEL_POINT_LAYER = 'ogcr-parcels-point'

/**
 * Status → design-system colour token. Campaign lifecycle (supply-shed and walkthrough views) and
 * carbon-potential tiers (the farmer's own fields before a campaign). The warm two-step potential
 * ramp reads as a sequence against green fields, where a green fill would not.
 */
export const PARCEL_STATUS_TOKENS = {
  enrolled: '--ds-interaction-primary-default',
  awaiting: '--ds-orange-500',
  dropped: '--ds-border-strong',
  high: '--ds-orange-500',
  medium: '--ds-amber-300',
  ineligible: '--ds-border-strong',
} as const
export type ParcelStatus = keyof typeof PARCEL_STATUS_TOKENS
/** Colour for a feature whose status is missing or unknown. */
const DEFAULT_STATUS_TOKEN = '--ds-interaction-primary-default'

/** Statuses drawn faint and dashed: parcels that are out of the campaign. */
export const INACTIVE_STATUSES: ParcelStatus[] = ['dropped', 'ineligible']

/** Fill opacity and outline width per parcel state. */
export const PARCEL_FILL_OPACITY = { active: 0.72, inactive: 0.18, selected: 0.85 } as const
export const PARCEL_LINE_WIDTH = { active: 2.5, inactive: 1.5, selected: 4 } as const
/** Dash length, in px, of an inactive outline. */
export const INACTIVE_DASH_PX = 4
/** MapLibre dash arrays are in line-width units, so 4px dashes at the inactive width. */
const INACTIVE_DASH_ARRAY = [
  INACTIVE_DASH_PX / PARCEL_LINE_WIDTH.inactive,
  INACTIVE_DASH_PX / PARCEL_LINE_WIDTH.inactive,
]
/** Locator dot stroke width, in px. */
const POINT_STROKE_WIDTH = 2
/** Name cards stay hidden below this zoom so the supply-shed view is not buried in cards. */
export const LABEL_MIN_ZOOM = 13

const LABEL_CLASS =
  'pointer-events-none inline-flex flex-col items-center whitespace-nowrap rounded-8 bg-surface-light px-8 py-4 text-center shadow-elevation-l'
const LABEL_NAME_CLASS = 'text-xxs font-semibold text-text-primary'
const LABEL_DETAIL_CLASS = 'text-xxs font-normal text-text-secondary'

/** Fill/dot colour per status, with the tokens resolved to literals at draw time. */
function statusColor(): ExpressionSpecification {
  const pairs = Object.entries(PARCEL_STATUS_TOKENS).flatMap(([status, token]) => [
    status,
    resolveToken(token),
  ])
  // The spread loses the tuple shape MapLibre's types want; the pairs are well-formed by construction.
  return [
    'match',
    ['get', 'status'],
    ...pairs,
    resolveToken(DEFAULT_STATUS_TOKEN),
  ] as unknown as ExpressionSpecification
}

/** Outline "ink": white over satellite imagery, the primary text colour over the light Minimal map. */
function inkColor(basemap: BasemapId): string {
  return resolveToken(basemap === 'satellite' ? '--ds-white' : '--ds-text-primary')
}

const isSelected: ExpressionSpecification = ['==', ['get', 'selected'], true]
const isInactive: ExpressionSpecification = [
  'in',
  ['get', 'status'],
  ['literal', INACTIVE_STATUSES],
]
const isPolygon: ExpressionSpecification = ['==', ['geometry-type'], 'Polygon']

/** Picks a number by parcel state: selected wins, then inactive, otherwise active. */
function stateNumber(values: {
  selected: number
  inactive: number
  active: number
}): ExpressionSpecification {
  return ['case', isSelected, values.selected, isInactive, values.inactive, values.active]
}

/** Add the parcel source and its fill, outline and locator-dot layers. */
export function addParcelLayers(map: MapLibreMap, features: FeatureCollection, basemap: BasemapId) {
  map.addSource(PARCEL_SOURCE, { type: 'geojson', data: features })
  map.addLayer({
    id: PARCEL_FILL_LAYER,
    type: 'fill',
    source: PARCEL_SOURCE,
    filter: isPolygon,
    paint: { 'fill-color': statusColor(), 'fill-opacity': stateNumber(PARCEL_FILL_OPACITY) },
  })
  // Active (and selected) parcels: solid outline.
  map.addLayer({
    id: PARCEL_LINE_LAYER,
    type: 'line',
    source: PARCEL_SOURCE,
    filter: ['all', isPolygon, ['any', isSelected, ['!', isInactive]]],
    paint: { 'line-color': inkColor(basemap), 'line-width': stateNumber(PARCEL_LINE_WIDTH) },
  })
  // Inactive parcels: a separate dashed layer, since dasharray cannot be data-driven.
  map.addLayer({
    id: PARCEL_LINE_INACTIVE_LAYER,
    type: 'line',
    source: PARCEL_SOURCE,
    filter: ['all', isPolygon, ['!', isSelected], isInactive],
    paint: {
      'line-color': inkColor(basemap),
      'line-width': PARCEL_LINE_WIDTH.inactive,
      'line-dasharray': INACTIVE_DASH_ARRAY,
    },
  })
  // A locator dot per farm. A 15 ha field is ~400 m across but a supply shed spans ~30 km, so at
  // shed zoom the true geometry is a speck. The dot carries the farm at low zoom and fades out as
  // the real parcel becomes legible.
  map.addLayer({
    id: PARCEL_POINT_LAYER,
    type: 'circle',
    source: PARCEL_SOURCE,
    filter: ['==', ['geometry-type'], 'Point'],
    paint: {
      'circle-color': statusColor(),
      'circle-stroke-color': resolveToken('--ds-white'),
      'circle-stroke-width': POINT_STROKE_WIDTH,
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 9, 7, 13, 9, 14, 0],
      'circle-opacity': ['interpolate', ['linear'], ['zoom'], 12.5, 1, 14, 0],
      'circle-stroke-opacity': ['interpolate', ['linear'], ['zoom'], 12.5, 1, 14, 0],
    },
  })
}

/** Re-ink the outlines so they contrast with whichever basemap is showing. */
export function setParcelInk(map: MapLibreMap, basemap: BasemapId) {
  for (const layer of [PARCEL_LINE_LAYER, PARCEL_LINE_INACTIVE_LAYER]) {
    if (map.getLayer(layer)) map.setPaintProperty(layer, 'line-color', inkColor(basemap))
  }
}

/** Bounding box of every coordinate in a collection, for fitBounds. */
export function featureBounds(collection: FeatureCollection): maplibregl.LngLatBounds {
  const bounds = new maplibregl.LngLatBounds()
  for (const { geometry } of collection.features) {
    if (geometry.type === 'Polygon') {
      for (const ring of geometry.coordinates) {
        for (const [lng, lat] of ring) bounds.extend([lng, lat])
      }
    } else if (geometry.type === 'Point') {
      const [lng, lat] = geometry.coordinates
      bounds.extend([lng, lat])
    }
  }
  return bounds
}

/**
 * Area centroid of a polygon's outer ring, as [lng, lat]. Unlike the bounding-box centre it stays
 * inside a thin, rotated strip. Planar maths is fine at parcel scale.
 */
function polygonCentre(ring: number[][]): [number, number] {
  let twiceArea = 0
  let lng = 0
  let lat = 0
  for (let i = 0; i < ring.length - 1; i++) {
    const [x0, y0] = ring[i]
    const [x1, y1] = ring[i + 1]
    const cross = x0 * y1 - x1 * y0
    twiceArea += cross
    lng += (x0 + x1) * cross
    lat += (y0 + y1) * cross
  }
  if (twiceArea === 0) return [ring[0][0], ring[0][1]]
  return [lng / (3 * twiceArea), lat / (3 * twiceArea)]
}

/** A permanent name card for one parcel. Plain DOM because the style has no glyph source for symbol layers. */
function createLabelElement(name: string, detail: string | null): HTMLDivElement {
  const element = document.createElement('div')
  element.className = LABEL_CLASS
  element.dataset.slot = 'map-parcel-label'
  const nameLine = document.createElement('span')
  nameLine.className = LABEL_NAME_CLASS
  nameLine.textContent = name
  element.appendChild(nameLine)
  if (detail) {
    const detailLine = document.createElement('span')
    detailLine.className = LABEL_DETAIL_CLASS
    detailLine.textContent = detail
    element.appendChild(detailLine)
  }
  return element
}

/**
 * Name cards for every named polygon that is in play, hidden below LABEL_MIN_ZOOM and thinned so
 * they never overlap. Returns a cleanup that removes them.
 */
export function addParcelLabels(map: MapLibreMap, features: FeatureCollection): () => void {
  const markers: maplibregl.Marker[] = []
  for (const { geometry, properties } of features.features) {
    if (geometry.type !== 'Polygon' || typeof properties?.name !== 'string') continue
    // Only parcels in play carry a card; inactive ones stay quiet.
    if ((INACTIVE_STATUSES as string[]).includes(String(properties.status))) continue
    const detail = typeof properties.detail === 'string' ? properties.detail : null
    const marker = new maplibregl.Marker({
      element: createLabelElement(properties.name, detail),
      anchor: 'center',
    })
      .setLngLat(polygonCentre(geometry.coordinates[0]))
      .addTo(map)
    // The selected parcel's card is placed first so collisions never hide it.
    if (properties.selected === true) markers.unshift(marker)
    else markers.push(marker)
  }

  // Cards keep their relative positions while panning, so collisions only change on zoom.
  const syncVisibility = () => {
    const zoomedIn = map.getZoom() >= LABEL_MIN_ZOOM
    const placed: DOMRect[] = []
    for (const marker of markers) {
      const element = marker.getElement()
      element.style.visibility = ''
      element.style.display = zoomedIn ? '' : 'none'
      if (!zoomedIn) continue
      const rect = element.getBoundingClientRect()
      const collides = placed.some(
        (other) =>
          rect.left < other.right &&
          rect.right > other.left &&
          rect.top < other.bottom &&
          rect.bottom > other.top,
      )
      // visibility, not display, so a hidden card keeps its box for the next measure.
      if (collides) element.style.visibility = 'hidden'
      else placed.push(rect)
    }
  }
  syncVisibility()
  map.on('zoom', syncVisibility)

  return () => {
    map.off('zoom', syncVisibility)
    markers.forEach((marker) => marker.remove())
  }
}
