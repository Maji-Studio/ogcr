"use client";

/**
 * The farm from above, and the anchor of the whole screen. The parcel list, this map and the side
 * panel are one instrument: selecting in any of them moves the other two.
 */

import { MapView, type MapFeatureSelection } from "@/components/map";
import { farm } from "./data/farm";
import { lindenhofParcelFeatures } from "./data/geometry";
import { TIER_META, TierSwatch } from "./shared";
import type { PotentialTier } from "./data/farm";

/** Close enough to read individual field boundaries; the whole farm is only ~400 m across. */
const FARM_ZOOM = 16;
const FIT_PADDING = 56;

const LEGEND_TIERS: PotentialTier[] = ["high", "medium", "ineligible"];

interface ParcelMapProps {
  selectedId: string | null;
  onSelect: (parcelId: string | null) => void;
  className?: string;
}

export function ParcelMap({ selectedId, onSelect, className }: ParcelMapProps) {
  // React Compiler memoises this, so the map's setData effect only fires when selection changes.
  const features = lindenhofParcelFeatures(farm.center, selectedId);

  const handleSelectFeature = (properties: MapFeatureSelection) => {
    const parcelId = properties?.parcelId;
    onSelect(typeof parcelId === "string" ? parcelId : null);
  };

  return (
    <div className={className}>
      <div className="relative h-full w-full">
        <MapView
          className="h-full w-full"
          center={farm.center}
          zoom={FARM_ZOOM}
          features={features}
          fitToFeatures
          fitPadding={FIT_PADDING}
          fitMaxZoom={FARM_ZOOM + 1}
          onSelectFeature={handleSelectFeature}
        />
        <Legend />
      </div>
    </div>
  );
}

/**
 * Reading key, not a control. It sits top-left, the one corner the map does not already use for
 * its zoom buttons, basemap toggle or tile attribution.
 */
function Legend() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <div className="absolute left-12 top-12 flex flex-col gap-8 rounded-12 border border-border-medium bg-surface-light px-12 py-8 shadow-elevation-l">
        <p className="text-body-s font-medium text-text-primary">Carbon potential</p>
        <ul className="flex flex-col gap-4">
          {LEGEND_TIERS.map((tier) => (
            <li key={tier} className="flex items-center gap-8 text-body-s text-text-secondary">
              <TierSwatch tier={tier} />
              {TIER_META[tier].label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
