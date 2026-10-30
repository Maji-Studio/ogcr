"use client";

/**
 * The farm from above, and the anchor of the whole screen. The parcel list, this map and the side
 * panel are one instrument: selecting in any of them moves the other two.
 */

import { MapView, type MapFeatureSelection } from "@/components/map";
import { MapLegend } from "@majistudio/ogcr-design-system";
import { farm } from "./data/farm";
import { lindenhofParcelFeatures } from "./data/geometry";
import { TIER_META } from "./shared";
import type { PotentialTier } from "./data/farm";

/** Close enough to read individual field boundaries; the whole farm is only ~400 m across. */
const FARM_ZOOM = 16;
const FIT_PADDING = 56;

/** Swatch tokens mirror base-map's statusColor() for the same tiers. */
const LEGEND_TIERS: { tier: PotentialTier; token: string }[] = [
  { tier: "high", token: "--ds-orange-500" },
  { tier: "medium", token: "--ds-amber-300" },
  { tier: "ineligible", token: "--ds-border-strong" },
];
const LEGEND_ITEMS = LEGEND_TIERS.map(({ tier, token }) => ({
  label: TIER_META[tier].label,
  token,
}));

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
        <MapLegend title="Carbon potential" items={LEGEND_ITEMS} />
      </div>
    </div>
  );
}
