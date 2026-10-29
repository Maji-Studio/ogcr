import type { StyleSpecification } from "maplibre-gl";
import {
  MINIMAL_ATTRIBUTION,
  MINIMAL_MAX_ZOOM,
  MINIMAL_TILE_URLS,
  SATELLITE_ATTRIBUTION,
  SATELLITE_MAX_ZOOM,
  SATELLITE_TILE_URL,
  TILE_SIZE,
  type BasemapId,
} from "@/config/geo";

/**
 * Stable source/layer ids. Namespaced with `ogcr-` so future custom data layers
 * (markers, polygons) can be told apart from the basemap.
 */
export const BACKGROUND_LAYER = "ogcr-background";
export const SATELLITE_SOURCE = "ogcr-satellite";
export const MINIMAL_SOURCE = "ogcr-minimal";
export const SATELLITE_LAYER = "ogcr-satellite-layer";
export const MINIMAL_LAYER = "ogcr-minimal-layer";

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
      [MINIMAL_SOURCE]: {
        type: "raster",
        tiles: MINIMAL_TILE_URLS,
        tileSize: TILE_SIZE,
        maxzoom: MINIMAL_MAX_ZOOM,
        attribution: MINIMAL_ATTRIBUTION,
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
      },
      {
        id: MINIMAL_LAYER,
        type: "raster",
        source: MINIMAL_SOURCE,
        layout: { visibility: active === "minimal" ? "visible" : "none" },
      },
    ],
  };
}
