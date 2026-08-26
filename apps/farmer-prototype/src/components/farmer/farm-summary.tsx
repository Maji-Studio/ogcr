"use client";

/**
 * The default state of the side panel: the farm, its parcels, and the one thing worth doing next.
 *
 * The reference operator screen lists land *types* here. A farmer does not think in land types,
 * they think in named fields, so the parcels themselves take that slot and carry the potential
 * tier the map is painting.
 */

import { ArrowRightIcon, Button, Separator } from "@majistudio/ogcr-design-system";
import { cn } from "@/lib/utils";
import {
  farm,
  FEATURED_PARCEL_ID,
  findParcel,
  formatArea,
  isEligible,
  parcelCount,
  parcels,
  totalArea,
  type FarmerParcel,
} from "./data/farm";
import { SectionLabel, TIER_META, TierSwatch } from "./shared";

interface FarmSummaryProps {
  selectedId: string | null;
  onSelect: (parcelId: string) => void;
}

export function FarmSummary({ selectedId, onSelect }: FarmSummaryProps) {
  const featured = findParcel(FEATURED_PARCEL_ID);

  return (
    <>
      <header className="flex items-start justify-between gap-16">
        <div className="flex flex-col gap-4">
          <h1 className="text-h3 text-text-primary">{farm.name}</h1>
          <p className="text-body-s text-text-secondary">
            {parcelCount(parcels.length)} · {farm.place}
          </p>
        </div>
        <p className="flex shrink-0 items-baseline gap-4">
          <span className="text-h2 tabular-nums text-text-positive">{formatArea(totalArea)}</span>
          <span className="text-body-s text-text-secondary">ha</span>
        </p>
      </header>

      <Separator />

      <section className="flex flex-col gap-12">
        <SectionLabel>Your land</SectionLabel>
        <ul className="flex flex-col gap-4">
          {parcels.map((parcel) => (
            <li key={parcel.id}>
              <ParcelRow
                parcel={parcel}
                selected={parcel.id === selectedId}
                onSelect={() => onSelect(parcel.id)}
              />
            </li>
          ))}
        </ul>
      </section>

      <Separator />

      {featured && (
        <section className="flex flex-col gap-12">
          <SectionLabel>Your next action</SectionLabel>
          <div className="flex flex-col gap-12 rounded-12 border border-border-light bg-surface-page p-16">
            <div className="flex flex-col gap-4">
              <p className="text-h4 text-text-primary">Choose a practice for {featured.name}</p>
              <p className="text-body-s text-text-secondary">
                {featured.name} has the highest carbon potential on your farm. Review its estimates
                before you decide.
              </p>
            </div>
            <Button
              fullWidth
              iconRight={<ArrowRightIcon />}
              onClick={() => onSelect(featured.id)}
            >
              Open {featured.name}
            </Button>
          </div>
        </section>
      )}
    </>
  );
}

interface ParcelRowProps {
  parcel: FarmerParcel;
  selected: boolean;
  onSelect: () => void;
}

function ParcelRow({ parcel, selected, onSelect }: ParcelRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex w-full flex-col gap-2 rounded-8 border border-transparent px-12 py-8 text-left transition-colors",
        "hover:bg-surface-neutral focus-visible:outline-none focus-visible:shadow-focus-primary",
        selected && "border-border-positive-light bg-surface-positive",
      )}
    >
      <span className="flex items-baseline justify-between gap-12">
        <span className="flex min-w-0 items-center gap-8">
          <TierSwatch tier={parcel.tier} />
          <span className="truncate text-body text-text-primary">{parcel.name}</span>
        </span>
        <span className="shrink-0 text-body-s tabular-nums text-text-secondary">
          {formatArea(parcel.area)} ha
        </span>
      </span>
      {/* Potential before history: the opportunity is what the farmer is scanning this list for. */}
      <span className="pl-16 text-body-s text-text-secondary">
        <span className={cn(isEligible(parcel) ? "text-text-primary" : "text-text-secondary")}>
          {TIER_META[parcel.tier].label}
        </span>
        {" · "}
        {parcel.history}
      </span>
    </button>
  );
}
