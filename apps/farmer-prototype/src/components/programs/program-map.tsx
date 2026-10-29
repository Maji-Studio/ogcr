"use client";

import { MapView } from "@/components/map";
import { MapLegend } from "@/components/map/map-legend";
import { parcelFeatures, type ParcelMapStatus, type Program } from "./data";

interface ProgramMapProps {
  program: Program;
  /** How the parcels should be coloured on the map. */
  parcelStatus: ParcelMapStatus;
}

/**
 * Legend swatches mirror base-map's statusColor tokens so the floating
 * legend always matches what MapLibre draws.
 */
const LEGEND: Record<ParcelMapStatus, { label: string; token: string }> = {
  enrolled: { label: "Enrolled parcel", token: "--ds-interaction-primary-default" },
  awaiting: { label: "Included parcel", token: "--ds-orange-500" },
  dropped: { label: "Withdrawn parcel", token: "--ds-border-strong" },
};

export function ProgramMap({ program, parcelStatus }: ProgramMapProps) {
  const legend = LEGEND[parcelStatus];

  return (
    <div className="relative h-[320px]">
      {/* Remount on status change: MapView re-fits but repaints faster fresh. */}
      <MapView
        key={parcelStatus}
        className="h-full w-full"
        features={parcelFeatures(program, parcelStatus)}
        fitToFeatures
        fitPadding={64}
      />
      <MapLegend title="Your fields" items={[legend]} />
    </div>
  );
}
