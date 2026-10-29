"use client";

import dynamic from "next/dynamic";

/**
 * Public map entry: the design system's MapView. MapLibre needs the DOM + WebGL and ships ~250 kB
 * gzipped, so it is dynamically imported with SSR disabled. Pages stay server components and the
 * map bundle loads only on routes that actually render a map.
 */
export const MapView = dynamic(
  () => import("./map-client").then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center rounded-16 bg-surface-neutral">
        <span className="text-body-s text-text-secondary">Loading map…</span>
      </div>
    ),
  },
);

export type {
  BasemapId,
  MapFeatureSelection,
  MapViewProps,
} from "@majistudio/ogcr-design-system/Map";
