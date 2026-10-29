"use client";

import type { ReactNode } from "react";
import {
  MinusIcon,
  PlusIcon,
  ToggleGroup,
  type ToggleGroupItem,
} from "@majistudio/ogcr-design-system";
import { cn } from "@/lib/utils";
import type { BasemapId } from "@/config/geo";

const ICON_SIZE = 18;

/** Segment order is the visual order: Minimal, then Satellite. */
const BASEMAP_ITEMS: ToggleGroupItem[] = [
  { value: "minimal", label: "Minimal" },
  { value: "satellite", label: "Satellite" },
];

/**
 * The DS `segmented` appearance supplies the light tray (background, padding, radius, border) and
 * the pale-green pressed item (its fill is restated in map.css, see `.map-basemap-switch`). Only
 * positioning, pointer events and elevation belong to the app.
 */
const BASEMAP_SWITCH_CLASS =
  "map-basemap-switch pointer-events-auto absolute right-24 top-24 shadow-elevation-l";

interface MapControlsProps {
  basemap: BasemapId;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onBasemapChange: (basemap: BasemapId) => void;
}

/**
 * Themed map chrome rendered over the canvas. Built from DS components/tokens
 * instead of MapLibre's default controls so it matches the rest of the app.
 */
export function MapControls({
  basemap,
  onZoomIn,
  onZoomOut,
  onBasemapChange,
}: MapControlsProps) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <ToggleGroup
        aria-label="Basemap"
        appearance="segmented"
        size="m"
        items={BASEMAP_ITEMS}
        value={[basemap]}
        onValueChange={(next) => {
          // A pressed segment cannot be un-pressed: one basemap is always showing.
          const picked = next[0];
          if (picked === "minimal" || picked === "satellite") onBasemapChange(picked);
        }}
        className={BASEMAP_SWITCH_CLASS}
      />

      <div className="pointer-events-auto absolute bottom-24 right-24 max-sm:bottom-40 flex flex-col overflow-hidden rounded-8 bg-surface-light shadow-elevation-l">
        <ControlButton label="Zoom in" onClick={onZoomIn}>
          <PlusIcon size={ICON_SIZE} weight="bold" />
        </ControlButton>
        <ControlButton label="Zoom out" onClick={onZoomOut} divided>
          <MinusIcon size={ICON_SIZE} weight="bold" />
        </ControlButton>
      </div>
    </div>
  );
}

interface ControlButtonProps {
  label: string;
  onClick: () => void;
  divided?: boolean;
  children: ReactNode;
}

function ControlButton({
  label,
  onClick,
  divided,
  children,
}: ControlButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex h-44 w-44 items-center justify-center text-text-primary transition-colors hover:bg-surface-neutral",
        divided && "border-t border-border-light",
      )}
    >
      {children}
    </button>
  );
}
