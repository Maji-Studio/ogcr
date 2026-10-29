import type { Map as MapLibreMap, StyleSpecification } from 'maplibre-gl'
import {
  MINIMAL_ATTRIBUTION,
  MINIMAL_MAX_ZOOM,
  MINIMAL_TILE_URLS,
  SATELLITE_ATTRIBUTION,
  SATELLITE_MAX_ZOOM,
  SATELLITE_TILE_URL,
  TILE_SIZE,
  type BasemapId,
} from './constants'

// Stable source/layer ids, namespaced `ogcr-` so data layers can be told apart from the basemap.
export const BACKGROUND_LAYER = 'ogcr-background'
export const SATELLITE_SOURCE = 'ogcr-satellite'
export const MINIMAL_SOURCE = 'ogcr-minimal'
export const SATELLITE_LAYER = 'ogcr-satellite-layer'
export const MINIMAL_LAYER = 'ogcr-minimal-layer'

/** Read a design-system custom property at runtime. MapLibre paint cannot read CSS variables. */
export function resolveToken(name: string): string {
  if (typeof window === 'undefined') return 'transparent'
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || 'transparent'
}

/**
 * One MapLibre style holding BOTH raster basemaps. Switching basemap is then a cheap
 * layer-visibility toggle: no style reload, no re-fetch of the other tile set.
 *
 * @param active          the basemap visible on first paint
 * @param backgroundColor a resolved brand colour, shown in tile gaps and at the poles
 */
export function buildMapStyle(active: BasemapId, backgroundColor: string): StyleSpecification {
  return {
    version: 8,
    sources: {
      [SATELLITE_SOURCE]: {
        type: 'raster',
        tiles: [SATELLITE_TILE_URL],
        tileSize: TILE_SIZE,
        maxzoom: SATELLITE_MAX_ZOOM,
        attribution: SATELLITE_ATTRIBUTION,
      },
      [MINIMAL_SOURCE]: {
        type: 'raster',
        tiles: MINIMAL_TILE_URLS,
        tileSize: TILE_SIZE,
        maxzoom: MINIMAL_MAX_ZOOM,
        attribution: MINIMAL_ATTRIBUTION,
      },
    },
    layers: [
      {
        id: BACKGROUND_LAYER,
        type: 'background',
        paint: { 'background-color': backgroundColor },
      },
      {
        id: SATELLITE_LAYER,
        type: 'raster',
        source: SATELLITE_SOURCE,
        layout: { visibility: active === 'satellite' ? 'visible' : 'none' },
      },
      {
        id: MINIMAL_LAYER,
        type: 'raster',
        source: MINIMAL_SOURCE,
        layout: { visibility: active === 'minimal' ? 'visible' : 'none' },
      },
    ],
  }
}

/** Show one basemap and hide the other. No-op until the style has its layers. */
export function showBasemap(map: MapLibreMap, basemap: BasemapId) {
  if (!map.getLayer(SATELLITE_LAYER) || !map.getLayer(MINIMAL_LAYER)) return
  map.setLayoutProperty(SATELLITE_LAYER, 'visibility', basemap === 'satellite' ? 'visible' : 'none')
  map.setLayoutProperty(MINIMAL_LAYER, 'visibility', basemap === 'minimal' ? 'visible' : 'none')
}
