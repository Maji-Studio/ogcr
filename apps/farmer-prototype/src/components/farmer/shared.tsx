"use client";

/** Small pieces the farmer screen repeats. Each one exists because it appears more than once. */

import type { ReactNode } from "react";
import { InfoIcon, Pill, Tooltip } from "@majistudio/ogcr-design-system";
import { cn } from "@/lib/utils";
import type { PotentialTier } from "./data/farm";

const INFO_ICON_SIZE = 16;

/** Standing reminder that nothing on this screen is a measured or assessed result. */
export function IllustrativeTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-4 rounded-full border border-border-positive-light bg-surface-positive px-8 py-4 text-body-s text-text-positive",
        className,
      )}
    >
      <InfoIcon size={INFO_ICON_SIZE} weight="fill" />
      Illustrative prototype data
    </span>
  );
}

/** The quiet label that opens a section inside the side panel. */
export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-body-s font-medium text-text-primary", className)}>{children}</h3>
  );
}

/**
 * An info affordance beside a figure. It is a real button so it is reachable by keyboard, and it
 * carries the explanation every seeded number on this screen needs.
 */
export function InfoHint({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Tooltip
      trigger={
        <button
          type="button"
          aria-label={label}
          className="inline-flex shrink-0 items-center justify-center rounded-full text-icon-secondary transition-colors hover:text-icon-primary focus-visible:outline-none focus-visible:shadow-focus-primary"
        >
          <InfoIcon size={INFO_ICON_SIZE} />
        </button>
      }
      side="bottom"
    >
      {children}
    </Tooltip>
  );
}

interface TierMeta {
  label: string;
  /** Matches the colour the map paints for this tier. */
  swatch: string;
}

export const TIER_META: Record<PotentialTier, TierMeta> = {
  high: { label: "High potential", swatch: "bg-orange-500" },
  medium: { label: "Medium potential", swatch: "bg-amber-300" },
  ineligible: { label: "Not eligible", swatch: "bg-border-strong" },
};

export function TierPill({ tier }: { tier: PotentialTier }) {
  return (
    <Pill
      tone="neutral"
      leading={<TierSwatch tier={tier} />}
      className="shrink-0"
    >
      {TIER_META[tier].label}
    </Pill>
  );
}

export function TierSwatch({ tier, className }: { tier: PotentialTier; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block h-8 w-8 shrink-0 rounded-2", TIER_META[tier].swatch, className)}
    />
  );
}
