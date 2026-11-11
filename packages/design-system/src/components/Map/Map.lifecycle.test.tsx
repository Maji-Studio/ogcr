import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { act, render } from '@testing-library/react'
import type { LayerSpecification, StyleSpecification } from 'maplibre-gl'

// A stand-in MapLibre map: keeps the style's layers in order, records visibility, and lets the
// test fire map events by hand. Only what MapView and the style helpers call is implemented.
type Handler = (event: object) => void
const { FakeMap, maps } = vi.hoisted(() => {
const maps: InstanceType<typeof FakeMap>[] = []
class FakeMap {
  layers: LayerSpecification[]
  sources: Record<string, unknown>
  handlers = new Map<string, Set<Handler>>()
  touchZoomRotate = { disableRotation: () => {} }
  keyboard = { disableRotation: () => {} }
  constructor({ style }: { style: StyleSpecification }) {
    this.layers = style.layers.map((layer) => ({ ...layer }))
    this.sources = { ...style.sources }
    maps.push(this)
  }
  on(type: string, handler: Handler) {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set())
    this.handlers.get(type)!.add(handler)
  }
  once(type: string, handler: Handler) {
    const wrapped: Handler = (event) => {
      this.off(type, wrapped)
      handler(event)
    }
    this.on(type, wrapped)
  }
  off(type: string, handler: Handler) {
    this.handlers.get(type)?.delete(handler)
  }
  fire(type: string, event: object = {}) {
    for (const handler of [...(this.handlers.get(type) ?? [])]) handler(event)
  }
  getLayer = (id: string) => this.layers.find((layer) => layer.id === id)
  getSource = (id: string) => this.sources[id]
  addSource = (id: string, source: unknown) => {
    this.sources[id] = source
  }
  addLayer = (layer: LayerSpecification, beforeId?: string) => {
    const index = beforeId ? this.layers.findIndex((l) => l.id === beforeId) : this.layers.length
    this.layers.splice(index, 0, layer)
  }
  setLayoutProperty = (id: string, _name: string, value: string) => {
    const layer = this.getLayer(id)!
    layer.layout = { ...layer.layout, visibility: value } as never
  }
  setPaintProperty = () => {}
  setGlyphs = () => {}
  setSprite = () => {}
  addSprite = () => {}
  getCanvas = () => document.createElement('canvas')
  resize = () => {}
  remove = () => {}
  visibility = (id: string) =>
    (this.getLayer(id)?.layout as { visibility?: string } | undefined)?.visibility
}
return { FakeMap, maps }
})

vi.mock('maplibre-gl', () => ({
  default: { Map: FakeMap, LngLatBounds: class {}, Marker: class {} },
}))

import { MapView } from '.'
import { MINIMAL_LAYER, SATELLITE_LAYER } from './map-style'

const positron: StyleSpecification = {
  version: 8,
  sources: { openmaptiles: { type: 'vector', url: 'https://example.test/planet' } },
  layers: [{ id: 'water', type: 'fill', source: 'openmaptiles', 'source-layer': 'water' }],
}

let resolveFetch: (style: StyleSpecification) => void
beforeEach(() => {
  maps.length = 0
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} })
  vi.stubGlobal(
    'fetch',
    vi.fn(
      () =>
        new Promise((resolve) => {
          resolveFetch = (style) => resolve({ ok: true, json: async () => style })
        }),
    ),
  )
})
afterEach(() => {
  vi.unstubAllGlobals()
})

describe('MapView basemaps', () => {
  it('starts on Esri at once, upgrades Minimal to Positron, and falls back if Positron fails', async () => {
    render(<MapView initialBasemap="minimal" showControls={false} />)
    const map = maps.at(-1)!
    act(() => map.fire('style.load'))

    // Before OpenFreeMap answers, Minimal is the Esri raster.
    expect(map.visibility(MINIMAL_LAYER)).toBe('visible')
    expect(map.visibility(SATELLITE_LAYER)).toBe('none')

    await act(async () => resolveFetch(positron))
    expect(map.layers.map((layer) => layer.id).indexOf('water')).toBeLessThan(
      map.layers.map((layer) => layer.id).indexOf(SATELLITE_LAYER),
    )
    expect(map.visibility('water')).toBe('visible')
    expect(map.visibility(MINIMAL_LAYER)).toBe('none')

    // A failing tile changes nothing; the TileJSON failing as a whole brings Esri back.
    act(() => map.fire('error', { sourceId: 'openmaptiles', tile: {} }))
    expect(map.visibility('water')).toBe('visible')
    act(() => map.fire('error', { sourceId: 'openmaptiles' }))
    expect(map.visibility('water')).toBe('none')
    expect(map.visibility(MINIMAL_LAYER)).toBe('visible')
  })
})
