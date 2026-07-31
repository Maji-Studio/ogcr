"use client";

import { MapView } from "@/components/map";
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
      <div className="absolute bottom-16 left-16 flex flex-col gap-8 rounded-12 border border-border-medium bg-surface-light px-12 py-8">
        <span className="text-body-s font-medium text-text-primary">
          Your fields
        </span>
        <span className="flex items-center gap-8 text-body-s text-text-secondary">
          <span
            aria-hidden="true"
            className="inline-block h-12 w-12 rounded-4"
            style={{ background: `var(${legend.token})` }}
          />
          {legend.label}
        </span>
      </div>
    </div>
  );
}
