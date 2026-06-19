import type { StyleSpecification } from "maplibre-gl";
import {
  SATELLITE_ATTRIBUTION,
  SATELLITE_MAX_ZOOM,
  SATELLITE_RASTER_TREATMENT,
  SATELLITE_TILE_URL,
  STREET_ATTRIBUTION,
  STREET_MAX_ZOOM,
  STREET_RASTER_TREATMENT,
  STREET_TILE_URL,
  TILE_SIZE,
  type BasemapId,
} from "@/config/geo";

/**
 * Stable source/layer ids. Namespaced with `ogcr-` so future custom data layers
 * (markers, polygons) can be told apart from the basemap.
 */
export const BACKGROUND_LAYER = "ogcr-background";
export const SATELLITE_SOURCE = "ogcr-satellite";
export const STREET_SOURCE = "ogcr-street";
export const SATELLITE_LAYER = "ogcr-satellite-layer";
export const STREET_LAYER = "ogcr-street-layer";

/**
 * One MapLibre style holding BOTH raster basemaps. Switching basemap is then a
 * cheap layer-visibility toggle — no style reload, no re-fetch of the other set.
 *
 * @param active          the basemap visible on first paint
 * @param backgroundColor a brand-token colour (resolved from `--ds-*` at the
 *                        call site) shown in tile gaps and at the poles
 */
export function buildMapStyle(
  active: BasemapId,
  backgroundColor: string,
): StyleSpecification {
  return {
    version: 8,
    sources: {
      [SATELLITE_SOURCE]: {
        type: "raster",
        tiles: [SATELLITE_TILE_URL],
        tileSize: TILE_SIZE,
        maxzoom: SATELLITE_MAX_ZOOM,
        attribution: SATELLITE_ATTRIBUTION,
      },
      [STREET_SOURCE]: {
        type: "raster",
        tiles: [STREET_TILE_URL],
        tileSize: TILE_SIZE,
        maxzoom: STREET_MAX_ZOOM,
        attribution: STREET_ATTRIBUTION,
      },
    },
    layers: [
      {
        id: BACKGROUND_LAYER,
        type: "background",
        paint: { "background-color": backgroundColor },
      },
      {
        id: SATELLITE_LAYER,
        type: "raster",
        source: SATELLITE_SOURCE,
        layout: { visibility: active === "satellite" ? "visible" : "none" },
        paint: {
          "raster-saturation": SATELLITE_RASTER_TREATMENT.saturation,
          "raster-contrast": SATELLITE_RASTER_TREATMENT.contrast,
          "raster-brightness-min": SATELLITE_RASTER_TREATMENT.brightnessMin,
        },
      },
      {
        id: STREET_LAYER,
        type: "raster",
        source: STREET_SOURCE,
        layout: { visibility: active === "street" ? "visible" : "none" },
        paint: {
          "raster-saturation": STREET_RASTER_TREATMENT.saturation,
          "raster-contrast": STREET_RASTER_TREATMENT.contrast,
          "raster-brightness-min": STREET_RASTER_TREATMENT.brightnessMin,
        },
      },
    ],
  };
}
