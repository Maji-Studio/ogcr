import type {
  ErrorEvent as MapLibreErrorEvent,
  LayerSpecification,
  Map as MapLibreMap,
  MapSourceDataEvent,
  StyleSpecification,
} from 'maplibre-gl'
import {
  MINIMAL_FALLBACK_ATTRIBUTION,
  MINIMAL_FALLBACK_MAX_ZOOM,
  MINIMAL_FALLBACK_TILE_URL,
  MINIMAL_STYLE_TIMEOUT_MS,
  MINIMAL_STYLE_URL,
  POSITRON_TILE_ERROR_LIMIT,
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

/** The Minimal basemap's layers in the initial style: the Esri raster fallback. */
export const FALLBACK_MINIMAL_LAYERS = [MINIMAL_LAYER]

/** Read a design-system custom property at runtime. MapLibre paint cannot read CSS variables. */
export function resolveToken(name: string): string {
  if (typeof window === 'undefined') return 'transparent'
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || 'transparent'
}

const visibility = (shown: boolean) => (shown ? 'visible' : 'none') as 'visible' | 'none'

/**
 * The style the map starts on: background, the Esri raster as Minimal, and satellite on top. It
 * needs nothing from OpenFreeMap, so the map never waits on it; `addPositron` upgrades Minimal
 * once the Positron style arrives. Switching basemap is a layer-visibility toggle, and hidden
 * layers fetch no tiles.
 *
 * @param active          the basemap visible on first paint
 * @param backgroundColor a resolved brand colour, shown in tile gaps and at the poles
 */
export function buildMapStyle(active: BasemapId, backgroundColor: string): StyleSpecification {
  return {
    version: 8,
    sources: {
      [MINIMAL_SOURCE]: {
        type: 'raster',
        tiles: [MINIMAL_FALLBACK_TILE_URL],
        tileSize: TILE_SIZE,
        maxzoom: MINIMAL_FALLBACK_MAX_ZOOM,
        attribution: MINIMAL_FALLBACK_ATTRIBUTION,
      },
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
      {
        id: MINIMAL_LAYER,
        type: 'raster',
        source: MINIMAL_SOURCE,
        layout: { visibility: visibility(active === 'minimal') },
      },
      {
        id: SATELLITE_LAYER,
        type: 'raster',
        source: SATELLITE_SOURCE,
        layout: { visibility: visibility(active === 'satellite') },
      },
    ],
  }
}

/**
 * Fetch the OpenFreeMap Positron style for the Minimal basemap. Resolves to null when it fails,
 * times out or is malformed; Minimal then stays on the Esri raster.
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

/**
 * Add the Positron style to a loaded map, hidden, under the satellite layer (and so under every
 * parcel layer). Layers the style itself hides are skipped; layers already on the map are kept, so
 * a second call is harmless. Returns the ids of the Positron layers to toggle as Minimal. MapLibre
 * reports an invalid layer or source through its "error" event and skips it, so a bad style can
 * cost Minimal some layers but never stops the map.
 */
export function addPositron(map: MapLibreMap, positron: StyleSpecification): string[] {
  if (positron.glyphs) map.setGlyphs(positron.glyphs)
  if (typeof positron.sprite === 'string') map.setSprite(positron.sprite)
  else positron.sprite?.forEach(({ id, url }) => map.addSprite(id, url))
  for (const [id, source] of Object.entries(positron.sources)) {
    if (!map.getSource(id)) map.addSource(id, source)
  }
  const added: string[] = []
  for (const layer of positron.layers) {
    if (layer.layout?.visibility === 'none') continue
    if (!map.getLayer(layer.id)) {
      map.addLayer(
        { ...layer, layout: { ...layer.layout, visibility: 'none' } } as LayerSpecification,
        SATELLITE_LAYER,
      )
    }
    if (map.getLayer(layer.id)) added.push(layer.id)
  }
  return added
}

type SourceEvent = { sourceId?: string; tile?: unknown }

/**
 * Decide when the Positron layers may take over Minimal, and when they must give it back:
 * - `onReady` once every Positron source has its tile index (TileJSON). If that hasn't happened
 *   within `MINIMAL_STYLE_TIMEOUT_MS`, or a source fails as a whole first, Minimal stays on Esri.
 * - `onFail` after taking over, when a source fails as a whole, or when
 *   `POSITRON_TILE_ERROR_LIMIT` tiles fail before any Positron tile has loaded. Single failing
 *   tiles after that are ignored.
 * Returns a cleanup that removes the listeners.
 */
export function watchPositron(
  map: MapLibreMap,
  sourceIds: string[],
  { onReady, onFail }: { onReady: () => void; onFail: () => void },
): () => void {
  let state: 'waiting' | 'live' | 'done' = 'waiting'
  let tileLoaded = false
  let tileErrors = 0
  const pending = new Set(sourceIds.filter((id) => !map.getSource(id)?.loaded()))

  const stop = () => {
    state = 'done'
    clearTimeout(timer)
    map.off('sourcedata', handleData)
    map.off('error', handleError)
  }
  const goLive = () => {
    state = 'live'
    clearTimeout(timer)
    onReady()
  }
  const fail = () => {
    const wasLive = state === 'live'
    stop()
    if (wasLive) onFail()
  }
  const handleData = (event: MapSourceDataEvent) => {
    if (!sourceIds.includes(event.sourceId)) return
    if (event.tile) tileLoaded = true
    if (state === 'waiting' && event.sourceDataType === 'metadata') {
      pending.delete(event.sourceId)
      if (pending.size === 0) goLive()
    }
  }
  const handleError = (event: MapLibreErrorEvent) => {
    const { sourceId, tile } = event as MapLibreErrorEvent & SourceEvent
    if (sourceId === undefined || !sourceIds.includes(sourceId)) return
    if (!tile) fail()
    else if (state === 'live' && !tileLoaded && ++tileErrors >= POSITRON_TILE_ERROR_LIMIT) fail()
  }

  const timer = setTimeout(() => {
    if (state === 'waiting') stop()
  }, MINIMAL_STYLE_TIMEOUT_MS)
  map.on('sourcedata', handleData)
  map.on('error', handleError)
  if (pending.size === 0) goLive()
  return stop
}

/** Show one basemap and hide the other. Skips layers the style does not have. */
export function showBasemap(map: MapLibreMap, basemap: BasemapId, minimalLayers: string[]) {
  const showMinimal = basemap === 'minimal'
  for (const id of minimalLayers) {
    if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', visibility(showMinimal))
  }
  if (map.getLayer(SATELLITE_LAYER)) {
    map.setLayoutProperty(SATELLITE_LAYER, 'visibility', visibility(!showMinimal))
  }
}

/** Hide one set of Minimal layers and make another the Minimal basemap. */
export function swapMinimalLayers(
  map: MapLibreMap,
  basemap: BasemapId,
  from: string[],
  to: string[],
) {
  for (const id of from) {
    if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', 'none')
  }
  showBasemap(map, basemap, to)
}
