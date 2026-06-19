"use client";

import type { ReactNode } from "react";
import {
  CornersOut,
  GlobeHemisphereWest,
  MapTrifold,
  Minus,
  Plus,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import type { BasemapId } from "@/config/geo";

const ICON_SIZE = 18;

interface MapControlsProps {
  basemap: BasemapId;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onToggleBasemap: () => void;
}

/**
 * Themed map chrome rendered over the canvas. Built from DS components/tokens
 * instead of MapLibre's default controls so it matches the rest of the app.
 */
export function MapControls({
  basemap,
  onZoomIn,
  onZoomOut,
  onReset,
  onToggleBasemap,
}: MapControlsProps) {
  // The toggle shows the basemap you'd switch TO.
  const toStreet = basemap === "satellite";

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="pointer-events-auto absolute right-[12px] top-[12px] flex flex-col overflow-hidden rounded-12 border border-border-medium bg-surface-light shadow-elevation-l">
        <ControlButton label="Zoom in" onClick={onZoomIn}>
          <Plus size={ICON_SIZE} weight="bold" />
        </ControlButton>
        <ControlButton label="Zoom out" onClick={onZoomOut} divided>
          <Minus size={ICON_SIZE} weight="bold" />
        </ControlButton>
        <ControlButton label="Reset view" onClick={onReset} divided>
          <CornersOut size={ICON_SIZE} />
        </ControlButton>
      </div>

      <button
        type="button"
        onClick={onToggleBasemap}
        aria-label={toStreet ? "Show street map" : "Show satellite imagery"}
        className="pointer-events-auto absolute bottom-[12px] left-[12px] flex items-center gap-8 rounded-12 border border-border-medium bg-surface-light px-12 py-8 text-body-s text-text-primary shadow-elevation-l transition-colors hover:bg-surface-neutral"
      >
        {toStreet ? (
          <MapTrifold size={ICON_SIZE} />
        ) : (
          <GlobeHemisphereWest size={ICON_SIZE} />
        )}
        <span>{toStreet ? "Street" : "Satellite"}</span>
      </button>
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
        "flex h-40 w-40 items-center justify-center text-text-primary transition-colors hover:bg-surface-neutral",
        divided && "border-t border-border-medium",
      )}
    >
      {children}
    </button>
  );
}
