/**
 * Geographic / map configuration.
 *
 * Both basemaps are key-free raster tile services, so the map needs no
 * environment variables. Satellite is the default ("priority") basemap; the
 * minimal basemap is the toggle alternative. All magic numbers for the map live
 * here per the repo's no-magic-numbers rule.
 */

/** Default map camera. `center` is [lng, lat] (MapLibre order). */
export const MAP_DEFAULT_CENTER: [number, number] = [12, 25];
export const MAP_DEFAULT_ZOOM = 2.2;
export const MAP_MIN_ZOOM = 1;
export const MAP_MAX_ZOOM = 19;

/** How far each zoom button steps. */
export const MAP_ZOOM_STEP = 1;

/** Raster tile pixel size (standard web-mercator tiles). */
export const TILE_SIZE = 256;

/** Esri World Imagery — free satellite raster, no API key required. */
export const SATELLITE_TILE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
export const SATELLITE_ATTRIBUTION =
  "Esri, Maxar, Earthstar Geographics, and the GIS User Community";
export const SATELLITE_MAX_ZOOM = 19;

/**
 * Esri Light Gray Canvas — the "minimal" basemap, key-free. The design prototype uses CARTO
 * Positron, but CARTO now serves a watermark tile without an API key; this is the nearest
 * key-free match. Real tiles stop at z16 (z17+ is a "not yet available" placeholder), so the
 * source caps there and MapLibre overzooms the flat canvas for farm-level views.
 */
export const MINIMAL_TILE_URLS = [
  "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
];
export const MINIMAL_ATTRIBUTION =
  "Esri, HERE, Garmin, © OpenStreetMap contributors, and the GIS User Community";
export const MINIMAL_MAX_ZOOM = 16;

export type BasemapId = "satellite" | "minimal";
export const DEFAULT_BASEMAP: BasemapId = "satellite";
