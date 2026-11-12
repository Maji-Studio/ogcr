// The two live maps in the Map section. Loaded lazily from ./map.tsx so MapLibre and its
// stylesheets download only when the section mounts, not with the rest of the specimen page.

import { useState } from 'react'
import 'maplibre-gl/dist/maplibre-gl.css'
import '../components/Map/map.css'
import { MapView } from '../components/Map'
import { MapLegend } from '../components/MapLegend'
import {
  CAMPAIGN,
  CAMPAIGN_FIELDS,
  collection,
  legendItems,
  POTENTIAL,
  POTENTIAL_FIELDS,
} from '../components/Map/map-fixtures'

export default function MapCanvas() {
  const [selectedId, setSelectedId] = useState<string | null>('field-01')

  return (
    <div className="specimen-maps">
      <figure className="specimen-map">
        <div className="specimen-map__frame">
          <MapView
            className="specimen-map__view"
            fitToFeatures
            features={collection(CAMPAIGN_FIELDS, selectedId)}
            onSelectFeature={(properties) => setSelectedId(properties?.parcelId ?? null)}
          />
          <MapLegend title="Your fields" items={legendItems(CAMPAIGN)} />
        </div>
        <figcaption className="specimen-map__caption">
          Satellite · campaign status · click a field to select it
        </figcaption>
      </figure>
      <figure className="specimen-map">
        <div className="specimen-map__frame">
          <MapView
            className="specimen-map__view"
            fitToFeatures
            initialBasemap="minimal"
            features={collection(POTENTIAL_FIELDS)}
          />
          <MapLegend title="Carbon potential" items={legendItems(POTENTIAL)} />
        </div>
        <figcaption className="specimen-map__caption">Minimal · carbon potential</figcaption>
      </figure>
    </div>
  )
}
