// Map configuration. Both basemaps are key-free raster tile services, so the map needs no API keys
// or environment variables. Satellite is the default basemap; Minimal is the toggle alternative.

/** The two basemaps the on-map switch offers. */
export type BasemapId = 'satellite' | 'minimal'
export const DEFAULT_BASEMAP: BasemapId = 'satellite'

/** Default camera: the whole world. `center` is [lng, lat] (MapLibre order). */
export const MAP_DEFAULT_CENTER: [number, number] = [12, 25]
export const MAP_DEFAULT_ZOOM = 2.2
export const MAP_MIN_ZOOM = 1
export const MAP_MAX_ZOOM = 19
/** How far each zoom button steps. */
export const MAP_ZOOM_STEP = 1

/** Raster tile pixel size (standard web-mercator tiles). */
export const TILE_SIZE = 256

/** Esri World Imagery: free satellite raster, no API key. */
export const SATELLITE_TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
export const SATELLITE_ATTRIBUTION =
  'Esri, Maxar, Earthstar Geographics, and the GIS User Community'
export const SATELLITE_MAX_ZOOM = 19

/**
 * Esri Light Gray Canvas: the Minimal basemap, key-free. The design prototype used CARTO Positron,
 * but CARTO serves a watermark tile without an API key. Real tiles stop at z16 (z17+ is a "not yet
 * available" placeholder), so the source caps there and MapLibre overzooms the flat canvas.
 */
export const MINIMAL_TILE_URLS = [
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
]
export const MINIMAL_ATTRIBUTION =
  'Esri, HERE, Garmin, © OpenStreetMap contributors, and the GIS User Community'
export const MINIMAL_MAX_ZOOM = 16

/** Zoom ceiling when fitting to features. A single farm needs to come much closer than a shed. */
export const FIT_MAX_ZOOM = 15
/** Padding, in px, around features when fitting the camera to them. */
export const FIT_PADDING = 48
