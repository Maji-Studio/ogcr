import type {
  LayerSpecification,
  Map as MapLibreMap,
  SourceSpecification,
  StyleSpecification,
} from 'maplibre-gl'
import {
  MINIMAL_FALLBACK_ATTRIBUTION,
  MINIMAL_FALLBACK_MAX_ZOOM,
  MINIMAL_FALLBACK_TILE_URL,
  MINIMAL_STYLE_TIMEOUT_MS,
  MINIMAL_STYLE_URL,
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
 * Fetch the OpenFreeMap Positron style for the Minimal basemap. Resolves to null when it fails,
 * times out or is malformed, so the map can start on the raster fallback instead of waiting.
 */
export async function loadMinimalStyle(signal: AbortSignal): Promise<StyleSpecification | null> {
  try {
    const response = await fetch(MINIMAL_STYLE_URL, {
      signal: AbortSignal.any([signal, AbortSignal.timeout(MINIMAL_STYLE_TIMEOUT_MS)]),
    })
    if (!response.ok) return null
    const style = (await response.json()) as Partial<StyleSpecification>
    if (!style.sources || !Array.isArray(style.layers)) return null
    return style as StyleSpecification
  } catch {
    return null
  }
}

/** A MapLibre style plus the layers that make up the Minimal basemap, for `showBasemap`. */
export interface BasemapStyle {
  style: StyleSpecification
  minimalLayers: string[]
}

const visibility = (shown: boolean) => (shown ? 'visible' : 'none') as 'visible' | 'none'

/**
 * One MapLibre style holding BOTH basemaps: the Minimal layers first, the satellite raster over
 * them. Switching basemap is then a cheap layer-visibility toggle with no style reload, and hidden
 * layers fetch no tiles.
 *
 * @param active          the basemap visible on first paint
 * @param backgroundColor a resolved brand colour, shown in tile gaps and at the poles
 * @param minimal         the Positron style from `loadMinimalStyle`, or null for the raster fallback
 */
export function buildMapStyle(
  active: BasemapId,
  backgroundColor: string,
  minimal: StyleSpecification | null,
): BasemapStyle {
  const showMinimal = active === 'minimal'
  let minimalSources: Record<string, SourceSpecification>
  let minimalLayers: LayerSpecification[]

  if (minimal) {
    minimalSources = minimal.sources
    // Layers the style itself hides stay hidden; only the visible ones join the toggle.
    minimalLayers = minimal.layers
      .filter((layer) => layer.layout?.visibility !== 'none')
      .map(
        (layer) =>
          ({
            ...layer,
            layout: { ...layer.layout, visibility: visibility(showMinimal) },
          }) as LayerSpecification,
      )
  } else {
    minimalSources = {
      [MINIMAL_SOURCE]: {
        type: 'raster',
        tiles: [MINIMAL_FALLBACK_TILE_URL],
        tileSize: TILE_SIZE,
        maxzoom: MINIMAL_FALLBACK_MAX_ZOOM,
        attribution: MINIMAL_FALLBACK_ATTRIBUTION,
      },
    }
    minimalLayers = [
      {
        id: MINIMAL_LAYER,
        type: 'raster',
        source: MINIMAL_SOURCE,
        layout: { visibility: visibility(showMinimal) },
      },
    ]
  }

  return {
    minimalLayers: minimalLayers.map((layer) => layer.id),
    style: {
      version: 8,
      ...(minimal?.glyphs && { glyphs: minimal.glyphs }),
      ...(minimal?.sprite && { sprite: minimal.sprite }),
      sources: {
        ...minimalSources,
        [SATELLITE_SOURCE]: {
          type: 'raster',
          tiles: [SATELLITE_TILE_URL],
          tileSize: TILE_SIZE,
          maxzoom: SATELLITE_MAX_ZOOM,
          attribution: SATELLITE_ATTRIBUTION,
        },
      },
      layers: [
        {
          id: BACKGROUND_LAYER,
          type: 'background',
          paint: { 'background-color': backgroundColor },
        },
        ...minimalLayers,
        {
          id: SATELLITE_LAYER,
          type: 'raster',
          source: SATELLITE_SOURCE,
          layout: { visibility: visibility(!showMinimal) },
        },
      ],
    },
  }
}

/** Show one basemap and hide the other. Skips layers the style does not have (yet). */
export function showBasemap(map: MapLibreMap, basemap: BasemapId, minimalLayers: string[]) {
  const showMinimal = basemap === 'minimal'
  for (const id of minimalLayers) {
    if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', visibility(showMinimal))
  }
  if (map.getLayer(SATELLITE_LAYER)) {
    map.setLayoutProperty(SATELLITE_LAYER, 'visibility', visibility(!showMinimal))
  }
}
