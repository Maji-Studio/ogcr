"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import "./map.css";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
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

export interface BaseMapProps {
  className?: string;
  /** Initial camera centre as [lng, lat]. */
  center?: [number, number];
  /** Initial zoom level. */
  zoom?: number;
  /** Which basemap is shown first. Defaults to satellite. */
  initialBasemap?: BasemapId;
}

export function BaseMap({
  className,
  center = MAP_DEFAULT_CENTER,
  zoom = MAP_DEFAULT_ZOOM,
  initialBasemap = DEFAULT_BASEMAP,
}: BaseMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
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
