/**
 * Geographic / map configuration.
 *
 * Both basemaps are key-free raster tile services, so the map needs no
 * environment variables. Satellite is the default ("priority") basemap; the
 * street basemap is the toggle alternative. All magic numbers for the map live
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

/** OpenStreetMap raster — free street basemap, no API key required. */
export const STREET_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
export const STREET_ATTRIBUTION =
  '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
export const STREET_MAX_ZOOM = 19;

/**
 * Raster paint treatment so each basemap sits calmly under brand-coloured
 * overlays — gently desaturated, with a touch of contrast. MapLibre paints to a
 * canvas (no CSS variables reach it), so these are numeric and basemap-specific:
 * satellite imagery wants a firmer hand than the already-muted street tiles.
 */
export const SATELLITE_RASTER_TREATMENT = {
  saturation: -0.22,
  contrast: 0.06,
  brightnessMin: 0.03,
} as const;
export const STREET_RASTER_TREATMENT = {
  saturation: -0.32,
  contrast: -0.04,
  brightnessMin: 0,
} as const;

export type BasemapId = "satellite" | "street";
export const DEFAULT_BASEMAP: BasemapId = "satellite";
