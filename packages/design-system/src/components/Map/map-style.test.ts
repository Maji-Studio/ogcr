import { describe, it, expect } from 'vitest'
import type { StyleSpecification } from 'maplibre-gl'
import {
  BACKGROUND_LAYER,
  buildMapStyle,
  MINIMAL_LAYER,
  MINIMAL_SOURCE,
  SATELLITE_LAYER,
  SATELLITE_SOURCE,
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

const visibilityOf = (style: StyleSpecification, id: string) =>
  (style.layers.find((layer) => layer.id === id)?.layout as { visibility?: string } | undefined)
    ?.visibility

describe('buildMapStyle', () => {
  it('stacks background, the Positron layers, then satellite on top', () => {
    const { style, minimalLayers } = buildMapStyle('satellite', BACKGROUND, positron)
    expect(style.layers.map((layer) => layer.id)).toEqual([
      BACKGROUND_LAYER,
      'background',
      'water',
      SATELLITE_LAYER,
    ])
    expect(minimalLayers).toEqual(['background', 'water'])
    expect(Object.keys(style.sources)).toEqual(['openmaptiles', SATELLITE_SOURCE])
    expect(style.glyphs).toBe(positron.glyphs)
    expect(style.sprite).toBe(positron.sprite)
  })

  it('shows only the active basemap', () => {
    const satellite = buildMapStyle('satellite', BACKGROUND, positron).style
    expect(visibilityOf(satellite, 'water')).toBe('none')
    expect(visibilityOf(satellite, SATELLITE_LAYER)).toBe('visible')

    const minimal = buildMapStyle('minimal', BACKGROUND, positron).style
    expect(visibilityOf(minimal, 'water')).toBe('visible')
    expect(visibilityOf(minimal, SATELLITE_LAYER)).toBe('none')
  })

  it('falls back to the Esri raster when Positron did not load', () => {
    const { style, minimalLayers } = buildMapStyle('minimal', BACKGROUND, null)
    expect(minimalLayers).toEqual([MINIMAL_LAYER])
    expect(Object.keys(style.sources)).toEqual([MINIMAL_SOURCE, SATELLITE_SOURCE])
    expect(style.glyphs).toBeUndefined()
    expect(visibilityOf(style, MINIMAL_LAYER)).toBe('visible')
  })
})
