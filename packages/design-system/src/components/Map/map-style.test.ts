import { describe, it, expect } from 'vitest'
import type {
  ErrorEvent as MapLibreErrorEvent,
  LayerSpecification,
  Map as MapLibreMap,
  StyleSpecification,
} from 'maplibre-gl'
import {
  addPositron,
  BACKGROUND_LAYER,
  buildMapStyle,
  FALLBACK_MINIMAL_LAYERS,
  isSourceFailure,
  MINIMAL_LAYER,
  SATELLITE_LAYER,
  swapMinimalLayers,
} from './map-style'

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

describe('isSourceFailure', () => {
  const event = (fields: object) => fields as unknown as MapLibreErrorEvent

  it('is true when a Positron source fails as a whole', () => {
    expect(isSourceFailure(event({ sourceId: 'openmaptiles' }), ['openmaptiles'])).toBe(true)
  })

  it('ignores single-tile errors and other sources', () => {
    expect(isSourceFailure(event({ sourceId: 'openmaptiles', tile: {} }), ['openmaptiles'])).toBe(
      false,
    )
    expect(isSourceFailure(event({ sourceId: 'ogcr-satellite' }), ['openmaptiles'])).toBe(false)
    expect(isSourceFailure(event({}), ['openmaptiles'])).toBe(false)
  })
})
