// The Map section: the parcel map on both basemaps with its legend. The maps themselves load
// lazily (./map-canvas.tsx) because MapLibre is the heaviest dependency on the page.

import { lazy, Suspense } from 'react'
import { Skeleton } from '../components/Skeleton'
import { SectionHead } from './section-head'
import { sec } from './section-meta'

const MapCanvas = lazy(() => import('./map-canvas'))

export function MapSpecimen() {
  return (
    <section id="map" className="section reveal">
      <SectionHead meta={sec('map')} />
      <div className="section__body">
        <Suspense fallback={<Skeleton variant="rectangular" className="specimen-map__view" />}>
          <MapCanvas />
        </Suspense>
        <p className="specimen-map__more">
          Every parcel state, with the exact fill, outline and opacity, is in the{' '}
          <a href="/storybook/?path=/story/components-map--styling-reference">
            Storybook styling reference
          </a>
          .
        </p>
      </div>
    </section>
  )
}
