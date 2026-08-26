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
import { buildMapStyle, SATELLITE_LAYER, STREET_LAYER } from "./map-style";
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
const PARCEL_POINT_LAYER = "ogcr-parcels-point";

/** Zoom ceiling when fitting to features. A single farm needs to come much closer than a shed. */
const FIT_MAX_ZOOM = 15;
/** Emphasis applied to the feature whose `selected` property is true. */
const FILL_OPACITY = 0.45;
const FILL_OPACITY_SELECTED = 0.68;
const LINE_WIDTH = 2;
const LINE_WIDTH_SELECTED = 3;

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
    resolveToken("--ds-interaction-primary-default", "#2f7a4d"),
    "awaiting",
    resolveToken("--ds-orange-500", "#e8833a"),
    "dropped",
    resolveToken("--ds-border-strong", "#9aa4ad"),
    // Carbon-potential tiers — the farmer's own view of parcels that are not yet in a campaign.
    // A warm two-step ramp reads as a sequence against green fields, where a green fill would not.
    "high",
    resolveToken("--ds-orange-500", "#e8833a"),
    "medium",
    resolveToken("--ds-amber-300", "#f5c26b"),
    "ineligible",
    resolveToken("--ds-border-strong", "#9aa4ad"),
    resolveToken("--ds-interaction-primary-default", "#2f7a4d"),
  ];
}

/** Line colour: the selected polygon is outlined in white so it reads over any imagery. */
function lineColor(): maplibregl.ExpressionSpecification {
  return [
    "case",
    ["==", ["get", "selected"], true],
    resolveToken("--ds-surface-light", "#ffffff"),
    statusColor(),
  ];
}

function selectedNumber(whenSelected: number, otherwise: number): maplibregl.ExpressionSpecification {
  return ["case", ["==", ["get", "selected"], true], whenSelected, otherwise];
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
          resolveToken("--ds-surface-strong", "#0f3655"),
        ),
        center,
        zoom,
        minZoom: MAP_MIN_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
        attributionControl: { compact: true },
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
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Basemap toggle → cheap layer-visibility swap (no style reload).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      if (!map.getLayer(SATELLITE_LAYER) || !map.getLayer(STREET_LAYER)) return;
      map.setLayoutProperty(
        SATELLITE_LAYER,
        "visibility",
        basemap === "satellite" ? "visible" : "none",
      );
      map.setLayoutProperty(
        STREET_LAYER,
        "visibility",
        basemap === "street" ? "visible" : "none",
      );
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
          filter: ["==", ["geometry-type"], "Polygon"],
          paint: {
            "fill-color": statusColor(),
            "fill-opacity": selectedNumber(FILL_OPACITY_SELECTED, FILL_OPACITY),
          },
        });
        map.addLayer({
          id: PARCEL_LINE_LAYER,
          type: "line",
          source: PARCEL_SOURCE,
          filter: ["==", ["geometry-type"], "Polygon"],
          paint: {
            "line-color": lineColor(),
            "line-width": selectedNumber(LINE_WIDTH_SELECTED, LINE_WIDTH),
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
            "circle-stroke-color": resolveToken("--ds-surface-light", "#ffffff"),
            "circle-stroke-width": 2,
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
  }, [features, fitToFeatures, fitPadding, fitMaxZoom]);

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
          "flex flex-col items-center justify-center gap-8 rounded-16 border border-border-medium bg-surface-light p-24 text-center",
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
        "relative isolate overflow-hidden rounded-16 border border-border-medium bg-[var(--ds-surface-strong)] shadow-elevation-l",
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
        onReset={() => mapRef.current?.easeTo({ center, zoom })}
        onToggleBasemap={() =>
          setBasemap((current) =>
            current === "satellite" ? "street" : "satellite",
          )
        }
      />
    </div>
  );
}
