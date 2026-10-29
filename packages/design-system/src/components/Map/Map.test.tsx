import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// jsdom has no WebGL, so a real MapLibre map cannot start. Stand in a constructor that throws the
// way MapLibre does without a WebGL context, which exercises the fallback path.
vi.mock('maplibre-gl', () => {
  class Map {
    constructor() {
      throw new Error('Failed to initialize WebGL')
    }
  }
  return { default: { Map, LngLatBounds: class {}, Marker: class {} } }
})

import { MapView } from '.'

describe('MapView', () => {
  it('shows a message instead of crashing when WebGL is unavailable', async () => {
    render(<MapView className="h-320" />)
    expect(await screen.findByText('Map unavailable')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveClass('h-320')
  })

  it('lets the caller override the fallback copy', async () => {
    render(<MapView unavailableTitle="Karte nicht verfügbar" />)
    expect(await screen.findByText('Karte nicht verfügbar')).toBeInTheDocument()
  })
})
