import { useEffect, useRef, useState, type ComponentProps } from 'react'
import maplibregl from 'maplibre-gl'
import type { FeatureCollection, GeoJsonProperties } from 'geojson'
import { cn } from '../../lib/cn'
import { dsStrings } from '../../lib/strings'
import {
  DEFAULT_BASEMAP,
  FIT_MAX_ZOOM,
  FIT_PADDING,
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  MAP_MAX_ZOOM,
  MAP_MIN_ZOOM,
  MAP_ZOOM_STEP,
  type BasemapId,
} from './constants'
import { MapControls } from './map-controls'
import {
  addParcelLabels,
  addParcelLayers,
  featureBounds,
  PARCEL_FILL_LAYER,
  PARCEL_SOURCE,
  setParcelInk,
} from './map-parcels'
import { buildMapStyle, resolveToken, showBasemap } from './map-style'

export { DEFAULT_BASEMAP, MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM, type BasemapId } from './constants'
export {
  INACTIVE_STATUSES,
  LABEL_MIN_ZOOM,
  PARCEL_FILL_OPACITY,
  PARCEL_LINE_WIDTH,
  PARCEL_STATUS_TOKENS,
  type ParcelStatus,
} from './map-parcels'

/** Properties of the polygon under the pointer, or null when the click landed on bare basemap. */
export type MapFeatureSelection = GeoJsonProperties

export interface MapViewProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Initial camera centre as [lng, lat]. Read once, on mount. */
  center?: [number, number]
  /** Initial zoom level. Read once, on mount. */
  zoom?: number
  /** Which basemap is shown first. Defaults to satellite. */
  initialBasemap?: BasemapId
  /** Controlled basemap. When set it wins over the map's own switch, which then reports through `onBasemapChange`. */
  basemap?: BasemapId
  /** Called when the on-map basemap switch is used. */
  onBasemapChange?: (basemap: BasemapId) => void
  /**
   * Parcels to draw over the basemap. Polygons are styled by their `status` property (see
   * `PARCEL_STATUS_TOKENS`) and `selected: true`, and carry a name card from `name` and `detail`.
   * Point features become locator dots that fade out as the real parcels become legible.
   */
  features?: FeatureCollection
  /** Fit the camera to `features` on load and whenever their extent changes. */
  fitToFeatures?: boolean
  /** Padding, in px, used when fitting to features. */
  fitPadding?: number
  /** Zoom ceiling for that fit. Raise it to frame a single farm rather than a whole supply shed. */
  fitMaxZoom?: number
  /**
   * Makes the polygons clickable. Receives the properties of the topmost polygon under the pointer,
   * or null when the click landed on bare basemap, so a caller can clear its selection.
   */
  onSelectFeature?: (properties: MapFeatureSelection) => void
  /** Show the basemap switch and zoom buttons. Defaults to true. */
  showControls?: boolean
  /** Show the parcel name cards at close zoom. Defaults to true. */
  showLabels?: boolean
  basemapLabel?: string
  minimalLabel?: string
  satelliteLabel?: string
  zoomInLabel?: string
  zoomOutLabel?: string
  unavailableTitle?: string
  unavailableDescription?: string
}

/**
 * The OGCR map: a MapLibre canvas on two key-free raster basemaps (Satellite, Minimal), with
 * parcels painted from design-system tokens and DS controls in place of MapLibre's.
 *
 * Needs the `maplibre-gl` peer and two stylesheets, MapLibre's first:
 * `import 'maplibre-gl/dist/maplibre-gl.css'` then `import '@majistudio/ogcr-design-system/map.css'`.
 * Client-only (DOM + WebGL): in Next.js load it with `dynamic(..., { ssr: false })`. Without
 * WebGL it renders a message instead of crashing.
 */
export function MapView({
  className,
  center = MAP_DEFAULT_CENTER,
  zoom = MAP_DEFAULT_ZOOM,
  initialBasemap = DEFAULT_BASEMAP,
  basemap: basemapProp,
  onBasemapChange,
  features,
  fitToFeatures = false,
  fitPadding = FIT_PADDING,
  fitMaxZoom = FIT_MAX_ZOOM,
  onSelectFeature,
  showControls = true,
  showLabels = true,
  basemapLabel = dsStrings.map.basemapLabel,
  minimalLabel = dsStrings.map.minimalLabel,
  satelliteLabel = dsStrings.map.satelliteLabel,
  zoomInLabel = dsStrings.map.zoomInLabel,
  zoomOutLabel = dsStrings.map.zoomOutLabel,
  unavailableTitle = dsStrings.map.unavailableTitle,
  unavailableDescription = dsStrings.map.unavailableDescription,
  ...rest
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  // The extent the camera was last fitted to. Selection changes rewrite the feature data without
  // moving anything, and refitting on those would yank the camera back from wherever the user panned.
  const fittedExtentRef = useRef<string | null>(null)
  const [ownBasemap, setOwnBasemap] = useState<BasemapId>(initialBasemap)
  const basemap = basemapProp ?? ownBasemap
  // The basemap showing right now, so the parcel layers pick up the right outline ink without the
  // parcel effect re-running on every basemap switch.
  const basemapRef = useRef<BasemapId>(initialBasemap)
  const [failed, setFailed] = useState(false)
  // True from the map's first "load". Layer and source calls are safe from then on, even while
  // tiles stream in; isStyleLoaded() is not a usable gate because it stays false during tile loads
  // and "load" fires only once, so a deferred update could be dropped.
  const [ready, setReady] = useState(false)

  // Create the map once. Imperative DOM/WebGL init is a sanctioned effect; camera and basemap
  // props are read here as initial values only.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let map: maplibregl.Map
    try {
      map = new maplibregl.Map({
        container,
        style: buildMapStyle(initialBasemap, resolveToken('--ds-surface-neutral')),
        center,
        zoom,
        minZoom: MAP_MIN_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
        attributionControl: { compact: false },
        // A flat farm map: no rotation or pitch from any input, so label collisions only change on zoom.
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
      })
      map.touchZoomRotate.disableRotation()
      map.keyboard.disableRotation()
    } catch {
      // No WebGL: degrade to a message instead of crashing the page.
      queueMicrotask(() => setFailed(true))
      return
    }
    mapRef.current = map
    map.once('load', () => setReady(true))

    // Keep the canvas sized to its (flex / resizable) container.
    const resizeObserver = new ResizeObserver(() => map.resize())
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      map.remove()
      mapRef.current = null
      setReady(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Basemap switch: a cheap layer-visibility swap, plus outline ink that contrasts with it.
  useEffect(() => {
    basemapRef.current = basemap
    const map = mapRef.current
    if (!map || !ready) return
    showBasemap(map, basemap)
    setParcelInk(map, basemap)
  }, [basemap, ready])

  // Parcel overlay: add the source and layers once, then just setData on every change.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready || !features) return

    const existing = map.getSource(PARCEL_SOURCE)
    if (existing) (existing as maplibregl.GeoJSONSource).setData(features)
    else addParcelLayers(map, features, basemapRef.current)

    if (fitToFeatures && features.features.length > 0) {
      const bounds = featureBounds(features)
      const extent = JSON.stringify(bounds.toArray())
      if (extent !== fittedExtentRef.current) {
        fittedExtentRef.current = extent
        map.fitBounds(bounds, { padding: fitPadding, duration: 0, maxZoom: fitMaxZoom })
      }
    }
  }, [features, fitToFeatures, fitPadding, fitMaxZoom, ready])

  // Parcel name cards, rebuilt whenever the features change.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !features || !showLabels) return
    return addParcelLabels(map, features)
  }, [features, showLabels])

  // Click-to-select, registered apart from the layer setup so the handler can change without
  // tearing the source down. Guarded on getLayer() because the style may still be loading.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !onSelectFeature) return
    const canvas = map.getCanvas()

    const hitTest = (point: maplibregl.Point) =>
      map.getLayer(PARCEL_FILL_LAYER)
        ? map.queryRenderedFeatures(point, { layers: [PARCEL_FILL_LAYER] })
        : []

    const handleClick = (event: maplibregl.MapMouseEvent) => {
      onSelectFeature(hitTest(event.point)[0]?.properties ?? null)
    }
    const handleMove = (event: maplibregl.MapMouseEvent) => {
      canvas.style.cursor = hitTest(event.point).length > 0 ? 'pointer' : ''
    }

    map.on('click', handleClick)
    map.on('mousemove', handleMove)
    return () => {
      map.off('click', handleClick)
      map.off('mousemove', handleMove)
      canvas.style.cursor = ''
    }
  }, [onSelectFeature])

  if (failed) {
    return (
      <div
        data-slot="map-view"
        role="status"
        className={cn(
          'flex flex-col items-center justify-center gap-8 rounded-16 bg-surface-neutral p-24 text-center',
          className,
        )}
        {...rest}
      >
        <p className="text-h4 text-text-primary">{unavailableTitle}</p>
        <p className="text-body-s text-text-secondary">{unavailableDescription}</p>
      </div>
    )
  }

  const zoomBy = (delta: number) => {
    const map = mapRef.current
    if (!map) return
    map.easeTo({ zoom: map.getZoom() + delta })
  }

  return (
    <div
      data-slot="map-view"
      className={cn(
        'relative isolate overflow-hidden rounded-16 bg-surface-neutral shadow-elevation-l',
        className,
      )}
      {...rest}
    >
      {/* h-full (not absolute inset-0): MapLibre forces position:relative on its container,
          which would collapse an absolutely positioned box to 0px. */}
      <div ref={containerRef} className="h-full w-full" />
      {showControls && (
        <MapControls
          basemap={basemap}
          labels={{ basemapLabel, minimalLabel, satelliteLabel, zoomInLabel, zoomOutLabel }}
          onZoomIn={() => zoomBy(MAP_ZOOM_STEP)}
          onZoomOut={() => zoomBy(-MAP_ZOOM_STEP)}
          onBasemapChange={(next) => {
            setOwnBasemap(next)
            onBasemapChange?.(next)
          }}
        />
      )}
    </div>
  )
}
