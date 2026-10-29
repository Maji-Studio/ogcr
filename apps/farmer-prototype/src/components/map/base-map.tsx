"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import "./map.css";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import type { FeatureCollection, GeoJsonProperties } from "geojson";
import { cn } from "@/lib/utils";
import {
  DEFAULT_BASEMAP,
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  MAP_MAX_ZOOM,
  MAP_MIN_ZOOM,
  MAP_ZOOM_STEP,
  type BasemapId,
} from "@/config/geo";
import { buildMapStyle, MINIMAL_LAYER, SATELLITE_LAYER } from "./map-style";
import { MapControls } from "./map-controls";

/** Read a design-system token at runtime, with a literal fallback. */
function resolveToken(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

// `ogcr-` namespace, kept distinct from the basemap layers.
const PARCEL_SOURCE = "ogcr-parcels";
const PARCEL_FILL_LAYER = "ogcr-parcels-fill";
const PARCEL_LINE_LAYER = "ogcr-parcels-line";
const PARCEL_LINE_INACTIVE_LAYER = "ogcr-parcels-line-inactive";
const PARCEL_POINT_LAYER = "ogcr-parcels-point";

/** Zoom ceiling when fitting to features. A single farm needs to come much closer than a shed. */
const FIT_MAX_ZOOM = 15;
/** Statuses drawn faint and dashed: parcels that are out of the campaign. */
const INACTIVE_STATUSES = ["dropped", "ineligible"];
/** Fill and outline emphasis per parcel state. */
const FILL_OPACITY_ACTIVE = 0.72;
const FILL_OPACITY_INACTIVE = 0.18;
const FILL_OPACITY_SELECTED = 0.85;
const LINE_WIDTH_ACTIVE = 2.5;
const LINE_WIDTH_INACTIVE = 1.5;
const LINE_WIDTH_SELECTED = 4;
/** 4px dashes at the inactive width. MapLibre dash arrays are in line-width units: 4 / 1.5. */
const INACTIVE_DASH_PX = 4;
const INACTIVE_DASH_ARRAY = [
  INACTIVE_DASH_PX / LINE_WIDTH_INACTIVE,
  INACTIVE_DASH_PX / LINE_WIDTH_INACTIVE,
];
/** Locator dot stroke width, in px. */
const POINT_STROKE_WIDTH = 2;
/** Parcel name cards stay hidden below this zoom so the supply-shed view is not buried in cards. */
const LABEL_MIN_ZOOM = 13;
const LABEL_CLASS =
  "pointer-events-none inline-flex flex-col items-center whitespace-nowrap rounded-8 bg-surface-light px-8 py-4 text-center shadow-elevation-l";
const LABEL_NAME_CLASS = "text-xxs font-bold text-text-primary";
const LABEL_DETAIL_CLASS = "text-xxs font-normal text-text-secondary";

/** Bounding box of every coordinate in a collection, for fitBounds. */
function featureBounds(collection: FeatureCollection): maplibregl.LngLatBoundsLike {
  const bounds = new maplibregl.LngLatBounds();
  for (const feature of collection.features) {
    const { geometry } = feature;
    if (geometry.type === "Polygon") {
      for (const ring of geometry.coordinates) {
        for (const [lng, lat] of ring) bounds.extend([lng, lat]);
      }
    } else if (geometry.type === "Point") {
      const [lng, lat] = geometry.coordinates;
      bounds.extend([lng, lat]);
    }
  }
  return bounds;
}

/** Properties of the polygon under the pointer, or null when the click landed on bare basemap. */
export type MapFeatureSelection = GeoJsonProperties;

export interface BaseMapProps {
  className?: string;
  /** Initial camera centre as [lng, lat]. */
  center?: [number, number];
  /** Initial zoom level. */
  zoom?: number;
  /** Which basemap is shown first. Defaults to satellite. */
  initialBasemap?: BasemapId;
  /**
   * Polygons to draw over the basemap. Each feature is filled by its `status` property
   * (`enrolled` / `awaiting` / `dropped`), so the same collection can express enrollment state.
   */
  features?: FeatureCollection;
  /** Fit the camera to `features` on load and whenever their extent changes. */
  fitToFeatures?: boolean;
  /** Padding, in px, used when fitting to features. */
  fitPadding?: number;
  /** Zoom ceiling for that fit. Raise it to frame a single farm rather than a whole supply shed. */
  fitMaxZoom?: number;
  /**
   * Makes the polygons clickable. Receives the properties of the topmost polygon under the pointer,
   * or null when the click landed on bare basemap — so a caller can clear its selection.
   */
  onSelectFeature?: (properties: MapFeatureSelection) => void;
}

/**
 * Fill/line colour per feature status. MapLibre paint properties cannot read CSS custom properties,
 * so the design-system tokens are resolved to literals at draw time (same trick the background
 * colour already uses) and the palette stays the single source of truth.
 */
function statusColor(): maplibregl.ExpressionSpecification {
  return [
    "match",
    ["get", "status"],
    // Campaign lifecycle — the supply-shed and walkthrough views.
    "enrolled",
    resolveToken("--ds-interaction-primary-default", "#4f8263"),
    "awaiting",
    resolveToken("--ds-orange-500", "#f97316"),
    "dropped",
    resolveToken("--ds-border-strong", "#a8a29e"),
    // Carbon-potential tiers — the farmer's own view of parcels that are not yet in a campaign.
    // A warm two-step ramp reads as a sequence against green fields, where a green fill would not.
    "high",
    resolveToken("--ds-orange-500", "#f97316"),
    "medium",
    resolveToken("--ds-amber-300", "#fcd34d"),
    "ineligible",
    resolveToken("--ds-border-strong", "#a8a29e"),
    resolveToken("--ds-interaction-primary-default", "#4f8263"),
  ];
}

/** Outline "ink": white over satellite imagery, the primary text colour over the light minimal map. */
function inkColor(basemap: BasemapId): string {
  return basemap === "satellite"
    ? resolveToken("--ds-white", "#ffffff")
    : resolveToken("--ds-text-primary", "#0f3655");
}

const isSelected: maplibregl.ExpressionSpecification = ["==", ["get", "selected"], true];
const isInactive: maplibregl.ExpressionSpecification = [
  "in",
  ["get", "status"],
  ["literal", INACTIVE_STATUSES],
];
const isPolygon: maplibregl.ExpressionSpecification = ["==", ["geometry-type"], "Polygon"];

/** Picks a number by parcel state: selected wins, then inactive, otherwise active. */
function stateNumber(
  selected: number,
  inactive: number,
  active: number,
): maplibregl.ExpressionSpecification {
  return ["case", isSelected, selected, isInactive, inactive, active];
}

/**
 * Area centroid of a polygon's outer ring, as [lng, lat]. Unlike the bounding-box centre it stays
 * inside a thin, rotated strip. Planar maths is fine at parcel scale.
 */
function polygonCentre(ring: number[][]): [number, number] {
  let twiceArea = 0;
  let lng = 0;
  let lat = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x0, y0] = ring[i];
    const [x1, y1] = ring[i + 1];
    const cross = x0 * y1 - x1 * y0;
    twiceArea += cross;
    lng += (x0 + x1) * cross;
    lat += (y0 + y1) * cross;
  }
  if (twiceArea === 0) return [ring[0][0], ring[0][1]];
  return [lng / (3 * twiceArea), lat / (3 * twiceArea)];
}

/** A permanent name card for one parcel. Plain DOM because the style has no glyph source for symbol layers. */
function createLabelElement(name: string, detail: string | null): HTMLDivElement {
  const element = document.createElement("div");
  element.className = LABEL_CLASS;
  const nameLine = document.createElement("span");
  nameLine.className = LABEL_NAME_CLASS;
  nameLine.textContent = name;
  element.appendChild(nameLine);
  if (detail) {
    const detailLine = document.createElement("span");
    detailLine.className = LABEL_DETAIL_CLASS;
    detailLine.textContent = detail;
    element.appendChild(detailLine);
  }
  return element;
}

export function BaseMap({
  className,
  center = MAP_DEFAULT_CENTER,
  zoom = MAP_DEFAULT_ZOOM,
  initialBasemap = DEFAULT_BASEMAP,
  features,
  fitToFeatures = false,
  fitPadding = 48,
  fitMaxZoom = FIT_MAX_ZOOM,
  onSelectFeature,
}: BaseMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  // The extent the camera was last fitted to. Selection changes rewrite the feature data without
  // moving anything, and refitting on those would yank the camera back from wherever the user panned.
  const fittedExtentRef = useRef<string | null>(null);
  const [basemap, setBasemap] = useState<BasemapId>(initialBasemap);
  const [failed, setFailed] = useState(false);
  const labelMarkersRef = useRef<maplibregl.Marker[]>([]);

  // Create the map once. Imperative DOM/WebGL init is a sanctioned useEffect
  // use case; camera + basemap props are read here as initial values only.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
        container,
        style: buildMapStyle(
          initialBasemap,
          resolveToken("--ds-surface-neutral", "#f5f5f4"),
        ),
        center,
        zoom,
        minZoom: MAP_MIN_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
        attributionControl: { compact: false },
        dragRotate: false,
        pitchWithRotate: false,
      });
    } catch {
      // No WebGL — degrade to a message instead of crashing the page.
      queueMicrotask(() => setFailed(true));
      return;
    }
    mapRef.current = map;

    // Keep the canvas sized to its (flex / resizable) container.
    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      labelMarkersRef.current.forEach((marker) => marker.remove());
      labelMarkersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Basemap toggle → cheap layer-visibility swap (no style reload), plus the outline ink that
  // has to contrast with whichever basemap is showing.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      if (!map.getLayer(SATELLITE_LAYER) || !map.getLayer(MINIMAL_LAYER)) return;
      map.setLayoutProperty(
        SATELLITE_LAYER,
        "visibility",
        basemap === "satellite" ? "visible" : "none",
      );
      map.setLayoutProperty(
        MINIMAL_LAYER,
        "visibility",
        basemap === "minimal" ? "visible" : "none",
      );
      for (const layer of [PARCEL_LINE_LAYER, PARCEL_LINE_INACTIVE_LAYER]) {
        if (map.getLayer(layer)) map.setPaintProperty(layer, "line-color", inkColor(basemap));
      }
    };
    if (map.isStyleLoaded()) apply();
    else map.once("styledata", apply);
  }, [basemap]);

  // Parcel overlay: add the source + fill/line layers once, then just setData on every change.
  // Guarded on isStyleLoaded() because the style may still be in flight on first paint.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !features) return;

    const apply = () => {
      const existing = map.getSource(PARCEL_SOURCE);
      if (existing) {
        (existing as maplibregl.GeoJSONSource).setData(features);
      } else {
        map.addSource(PARCEL_SOURCE, { type: "geojson", data: features });
        map.addLayer({
          id: PARCEL_FILL_LAYER,
          type: "fill",
          source: PARCEL_SOURCE,
          filter: isPolygon,
          paint: {
            "fill-color": statusColor(),
            "fill-opacity": stateNumber(
              FILL_OPACITY_SELECTED,
              FILL_OPACITY_INACTIVE,
              FILL_OPACITY_ACTIVE,
            ),
          },
        });
        // Active (and selected) parcels: solid outline.
        map.addLayer({
          id: PARCEL_LINE_LAYER,
          type: "line",
          source: PARCEL_SOURCE,
          filter: ["all", isPolygon, ["any", isSelected, ["!", isInactive]]],
          paint: {
            "line-color": inkColor(basemap),
            "line-width": stateNumber(LINE_WIDTH_SELECTED, LINE_WIDTH_INACTIVE, LINE_WIDTH_ACTIVE),
          },
        });
        // Inactive parcels: a separate dashed layer, since dasharray cannot be data-driven.
        map.addLayer({
          id: PARCEL_LINE_INACTIVE_LAYER,
          type: "line",
          source: PARCEL_SOURCE,
          filter: ["all", isPolygon, ["!", isSelected], isInactive],
          paint: {
            "line-color": inkColor(basemap),
            "line-width": LINE_WIDTH_INACTIVE,
            "line-dasharray": INACTIVE_DASH_ARRAY,
          },
        });
        // A locator dot per farm. A 15 ha field is ~400 m across but the supply shed spans ~30 km,
        // so at shed zoom the true geometry is a speck. The dot carries the farm at low zoom and
        // fades out as you zoom in and the real parcel becomes legible.
        map.addLayer({
          id: PARCEL_POINT_LAYER,
          type: "circle",
          source: PARCEL_SOURCE,
          filter: ["==", ["geometry-type"], "Point"],
          paint: {
            "circle-color": statusColor(),
            "circle-stroke-color": resolveToken("--ds-white", "#ffffff"),
            "circle-stroke-width": POINT_STROKE_WIDTH,
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 9, 7, 13, 9, 14, 0],
            "circle-opacity": ["interpolate", ["linear"], ["zoom"], 12.5, 1, 14, 0],
            "circle-stroke-opacity": ["interpolate", ["linear"], ["zoom"], 12.5, 1, 14, 0],
          },
        });
      }

      if (fitToFeatures && features.features.length > 0) {
        const bounds = featureBounds(features);
        const extent = JSON.stringify(bounds);
        if (extent !== fittedExtentRef.current) {
          fittedExtentRef.current = extent;
          map.fitBounds(bounds, { padding: fitPadding, duration: 0, maxZoom: fitMaxZoom });
        }
      }
    };

    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
    // basemap is read only to pick the ink when the layers are first added; the toggle effect
    // re-inks them afterwards.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features, fitToFeatures, fitPadding, fitMaxZoom]);

  // Parcel name cards: one DOM marker per named polygon, rebuilt whenever the features change and
  // hidden below LABEL_MIN_ZOOM.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !features) return;

    const markers: maplibregl.Marker[] = [];
    for (const feature of features.features) {
      const { geometry, properties } = feature;
      if (geometry.type !== "Polygon" || typeof properties?.name !== "string") continue;
      // Like the design prototype, only parcels in play carry a card; inactive ones stay quiet.
      if (INACTIVE_STATUSES.includes(String(properties.status))) continue;
      const detail = typeof properties.detail === "string" ? properties.detail : null;
      const marker = new maplibregl.Marker({
        element: createLabelElement(properties.name, detail),
        anchor: "center",
      })
        .setLngLat(polygonCentre(geometry.coordinates[0]))
        .addTo(map);
      // The selected parcel's card is placed first so collisions never hide it.
      if (properties.selected === true) markers.unshift(marker);
      else markers.push(marker);
    }
    labelMarkersRef.current = markers;

    // Cards keep their relative positions while panning, so collisions only change on zoom.
    const syncVisibility = () => {
      const zoomedIn = map.getZoom() >= LABEL_MIN_ZOOM;
      const placed: DOMRect[] = [];
      for (const marker of markers) {
        const element = marker.getElement();
        element.style.visibility = "";
        element.style.display = zoomedIn ? "" : "none";
        if (!zoomedIn) continue;
        const rect = element.getBoundingClientRect();
        const collides = placed.some(
          (other) =>
            rect.left < other.right &&
            rect.right > other.left &&
            rect.top < other.bottom &&
            rect.bottom > other.top,
        );
        // visibility, not display, so a hidden card keeps its box for the next measure.
        if (collides) element.style.visibility = "hidden";
        else placed.push(rect);
      }
    };
    syncVisibility();
    map.on("zoom", syncVisibility);

    return () => {
      map.off("zoom", syncVisibility);
      markers.forEach((marker) => marker.remove());
      labelMarkersRef.current = [];
    };
  }, [features]);

  // Click-to-select. Registered separately from the layer setup so the handler can change without
  // tearing the source down, and guarded on getLayer() because the style may still be loading.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !onSelectFeature) return;
    const canvas = map.getCanvas();

    const hitTest = (point: maplibregl.Point) =>
      map.getLayer(PARCEL_FILL_LAYER)
        ? map.queryRenderedFeatures(point, { layers: [PARCEL_FILL_LAYER] })
        : [];

    const handleClick = (event: maplibregl.MapMouseEvent) => {
      onSelectFeature(hitTest(event.point)[0]?.properties ?? null);
    };
    const handleMove = (event: maplibregl.MapMouseEvent) => {
      canvas.style.cursor = hitTest(event.point).length > 0 ? "pointer" : "";
    };

    map.on("click", handleClick);
    map.on("mousemove", handleMove);
    return () => {
      map.off("click", handleClick);
      map.off("mousemove", handleMove);
      canvas.style.cursor = "";
    };
  }, [onSelectFeature]);

  if (failed) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-8 rounded-16 bg-surface-neutral p-24 text-center",
          className,
        )}
      >
        <p className="text-h4 text-text-primary">Map unavailable</p>
        <p className="text-body-s text-text-secondary">
          Your browser could not start the map renderer (WebGL).
        </p>
      </div>
    );
  }

  const zoomBy = (delta: number) => {
    const map = mapRef.current;
    if (!map) return;
    map.easeTo({ zoom: map.getZoom() + delta });
  };

  return (
    <div
      data-slot="base-map"
      className={cn(
        "relative isolate overflow-hidden rounded-16 bg-surface-neutral shadow-elevation-l",
        className,
      )}
    >
      {/* h-full (not absolute inset-0): MapLibre forces position:relative on its
          container, which would collapse an absolutely-positioned box to 0px. */}
      <div ref={containerRef} className="h-full w-full" />
      <MapControls
        basemap={basemap}
        onZoomIn={() => zoomBy(MAP_ZOOM_STEP)}
        onZoomOut={() => zoomBy(-MAP_ZOOM_STEP)}
        onBasemapChange={setBasemap}
      />
    </div>
  );
}
