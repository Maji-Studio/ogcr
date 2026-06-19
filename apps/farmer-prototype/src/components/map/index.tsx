"use client";

import dynamic from "next/dynamic";

/**
 * Public map entry. MapLibre needs the DOM + WebGL and ships ~250 kB gzipped, so
 * it is dynamically imported with SSR disabled — pages stay server components
 * and the map bundle loads only on routes that actually render a map.
 */
export const MapView = dynamic(
  () => import("./base-map").then((mod) => mod.BaseMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center rounded-16 border border-border-medium bg-surface-light">
        <span className="text-body-s text-text-secondary">Loading map…</span>
      </div>
    ),
  },
);

export type { BaseMapProps } from "./base-map";
