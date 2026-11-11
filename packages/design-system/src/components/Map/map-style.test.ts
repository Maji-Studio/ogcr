import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import type {
  LayerSpecification,
  Map as MapLibreMap,
  StyleSpecification,
} from 'maplibre-gl'
import {
  addPositron,
  BACKGROUND_LAYER,
  buildMapStyle,
  FALLBACK_MINIMAL_LAYERS,
  MINIMAL_LAYER,
  SATELLITE_LAYER,
  swapMinimalLayers,
  watchPositron,
} from './map-style'
import { MINIMAL_STYLE_TIMEOUT_MS, POSITRON_TILE_ERROR_LIMIT } from './constants'

/** Any colour string; the value only travels into the background paint. */
const BACKGROUND = 'transparent'

const positron: StyleSpecification = {
  version: 8,
  glyphs: 'https://example.test/fonts/{fontstack}/{range}.pbf',
  sprite: 'https://example.test/sprites/ofm',
  sources: { openmaptiles: { type: 'vector', url: 'https://example.test/planet' } },
  layers: [
    { id: 'background', type: 'background', paint: { 'background-color': 'white' } },
    { id: 'water', type: 'fill', source: 'openmaptiles', 'source-layer': 'water' },
    {
      id: 'hidden-roads',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      layout: { visibility: 'none' },
    },
  ],
}

/** Just enough of a MapLibre map to record what the style helpers do to it. */
function fakeMap(style: StyleSpecification) {
  const layers = style.layers.map((layer) => ({ ...layer }))
  const sources = { ...style.sources }
  const calls = { glyphs: '', sprite: '' }
  const map = {
    getSource: (id: string) => sources[id],
    addSource: (id: string, source: never) => {
      sources[id] = source
    },
    getLayer: (id: string) => layers.find((layer) => layer.id === id),
    addLayer: (layer: LayerSpecification, beforeId?: string) => {
      const index = beforeId ? layers.findIndex((l) => l.id === beforeId) : layers.length
      layers.splice(index, 0, layer)
    },
    setLayoutProperty: (id: string, _name: string, value: string) => {
      const layer = layers.find((l) => l.id === id)!
      layer.layout = { ...layer.layout, visibility: value } as never
    },
    setGlyphs: (url: string) => {
      calls.glyphs = url
    },
    setSprite: (url: string) => {
      calls.sprite = url
    },
  }
  const visibilityOf = (id: string) =>
    (layers.find((l) => l.id === id)?.layout as { visibility?: string } | undefined)?.visibility
  return { map: map as unknown as MapLibreMap, layers, sources, calls, visibilityOf }
}

describe('buildMapStyle', () => {
  it('starts on Esri tiles only: background, the Minimal raster, satellite on top', () => {
    const style = buildMapStyle('satellite', BACKGROUND)
    expect(style.layers.map((layer) => layer.id)).toEqual([
      BACKGROUND_LAYER,
      MINIMAL_LAYER,
      SATELLITE_LAYER,
    ])
    expect(style.glyphs).toBeUndefined()
    expect(JSON.stringify(style)).not.toContain('openfreemap')
  })

  it('shows only the active basemap', () => {
    const { visibilityOf } = fakeMap(buildMapStyle('minimal', BACKGROUND))
    expect(visibilityOf(MINIMAL_LAYER)).toBe('visible')
    expect(visibilityOf(SATELLITE_LAYER)).toBe('none')
  })
})

describe('addPositron', () => {
  it('adds the visible Positron layers, hidden, under satellite', () => {
    const fake = fakeMap(buildMapStyle('satellite', BACKGROUND))
    const added = addPositron(fake.map, positron)

    expect(added).toEqual(['background', 'water'])
    expect(fake.layers.map((layer) => layer.id)).toEqual([
      BACKGROUND_LAYER,
      MINIMAL_LAYER,
      'background',
      'water',
      SATELLITE_LAYER,
    ])
    expect(fake.visibilityOf('water')).toBe('none')
    expect(fake.sources.openmaptiles).toBeDefined()
    expect(fake.calls).toEqual({ glyphs: positron.glyphs, sprite: positron.sprite })
  })

  it('is harmless to run twice', () => {
    const fake = fakeMap(buildMapStyle('satellite', BACKGROUND))
    addPositron(fake.map, positron)
    expect(addPositron(fake.map, positron)).toEqual(['background', 'water'])
    expect(fake.layers.filter((layer) => layer.id === 'water')).toHaveLength(1)
  })
})

describe('swapMinimalLayers', () => {
  it('moves Minimal from the Esri raster to Positron and back', () => {
    const fake = fakeMap(buildMapStyle('minimal', BACKGROUND))
    const added = addPositron(fake.map, positron)

    swapMinimalLayers(fake.map, 'minimal', FALLBACK_MINIMAL_LAYERS, added)
    expect(fake.visibilityOf(MINIMAL_LAYER)).toBe('none')
    expect(fake.visibilityOf('water')).toBe('visible')
    expect(fake.visibilityOf(SATELLITE_LAYER)).toBe('none')

    swapMinimalLayers(fake.map, 'minimal', added, FALLBACK_MINIMAL_LAYERS)
    expect(fake.visibilityOf(MINIMAL_LAYER)).toBe('visible')
    expect(fake.visibilityOf('water')).toBe('none')
  })
})

/** A map that only handles events, for watchPositron. `loaded` lists sources whose index is in. */
function eventedMap(loaded: string[] = []) {
  const handlers: Record<string, Set<(event: object) => void>> = {}
  const map = {
    getSource: (id: string) => ({ loaded: () => loaded.includes(id) }),
    on: (type: string, handler: (event: object) => void) => {
      ;(handlers[type] ??= new Set()).add(handler)
    },
    off: (type: string, handler: (event: object) => void) => handlers[type]?.delete(handler),
  }
  const fire = (type: string, event: object) => handlers[type]?.forEach((h) => h(event))
  return { map: map as unknown as MapLibreMap, fire, handlers }
}

describe('watchPositron', () => {
  const metadata = { sourceId: 'openmaptiles', sourceDataType: 'metadata' }
  let onReady = vi.fn<() => void>()
  let onFail = vi.fn<() => void>()
  beforeEach(() => {
    vi.useFakeTimers()
    onReady = vi.fn<() => void>()
    onFail = vi.fn<() => void>()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('takes over Minimal only once the tile index is in', () => {
    const { map, fire } = eventedMap()
    watchPositron(map, ['openmaptiles'], { onReady, onFail })
    expect(onReady).not.toHaveBeenCalled()
    fire('sourcedata', metadata)
    expect(onReady).toHaveBeenCalledOnce()
  })

  it('takes over at once when the tile index is already in', () => {
    watchPositron(eventedMap(['openmaptiles']).map, ['openmaptiles'], { onReady, onFail })
    expect(onReady).toHaveBeenCalledOnce()
  })

  it('leaves Minimal on Esri when the tile index hangs or fails', () => {
    const hanging = eventedMap()
    watchPositron(hanging.map, ['openmaptiles'], { onReady, onFail })
    vi.advanceTimersByTime(MINIMAL_STYLE_TIMEOUT_MS)
    hanging.fire('sourcedata', metadata)

    const failing = eventedMap()
    watchPositron(failing.map, ['openmaptiles'], { onReady, onFail })
    failing.fire('error', { sourceId: 'openmaptiles' })
    failing.fire('sourcedata', metadata)

    expect(onReady).not.toHaveBeenCalled()
    expect(onFail).not.toHaveBeenCalled()
  })

  it('gives Minimal back when a source fails after taking over', () => {
    const { map, fire } = eventedMap(['openmaptiles'])
    watchPositron(map, ['openmaptiles'], { onReady, onFail })
    fire('error', { sourceId: 'ogcr-satellite' })
    expect(onFail).not.toHaveBeenCalled()
    fire('error', { sourceId: 'openmaptiles' })
    expect(onFail).toHaveBeenCalledOnce()
  })

  it('gives Minimal back when tiles keep failing before any has loaded', () => {
    const { map, fire, handlers } = eventedMap(['openmaptiles'])
    watchPositron(map, ['openmaptiles'], { onReady, onFail })
    for (let i = 1; i < POSITRON_TILE_ERROR_LIMIT; i++) {
      fire('error', { sourceId: 'openmaptiles', tile: {} })
    }
    expect(onFail).not.toHaveBeenCalled()
    fire('error', { sourceId: 'openmaptiles', tile: {} })
    expect(onFail).toHaveBeenCalledOnce()
    expect(handlers.error.size).toBe(0)
  })

  it('ignores failing tiles once a Positron tile has loaded', () => {
    const { map, fire } = eventedMap(['openmaptiles'])
    watchPositron(map, ['openmaptiles'], { onReady, onFail })
    fire('sourcedata', { sourceId: 'openmaptiles', tile: {} })
    for (let i = 0; i < POSITRON_TILE_ERROR_LIMIT * 2; i++) {
      fire('error', { sourceId: 'openmaptiles', tile: {} })
    }
    expect(onFail).not.toHaveBeenCalled()
  })
})
