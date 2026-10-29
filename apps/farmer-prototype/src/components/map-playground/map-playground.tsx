"use client";

/**
 * Click-through of every map style, driven by a settings panel. Nothing here is saved: it is local
 * state over the real `MapView`, so what you see is what `/farmer` and the program page draw.
 */

import { useState } from "react";
import {
  Card,
  MapLegend,
  TooltipProvider,
  type MapLegendItem,
} from "@majistudio/ogcr-design-system";
import { MapView, type MapFeatureSelection } from "@/components/map";
import { farm, findParcel } from "@/components/farmer/data/farm";
import { ParcelDetail } from "@/components/farmer/parcel-detail";
import { TIER_META } from "@/components/farmer/shared";
import {
  closeUpCentre,
  playgroundFeatures,
  presetParcels,
  STATUS_LABEL,
  type ParcelStatus,
} from "./playground-data";
import {
  PlaygroundPanel,
  type LegendId,
  type PlaygroundSettings,
  type ViewportId,
} from "./playground-panel";

/** Close enough to read field boundaries and see the name cards. */
const CLOSE_ZOOM = 17;
/** Far enough out that the locator dots carry the parcels and the name cards are hidden. */
const WIDE_ZOOM = 11;
const FIT_PADDING = 72;
const FIT_MAX_ZOOM = 17;
/** With nothing to fit, frame the farm area instead of the whole world. */
const EMPTY_ZOOM = 14;

const DEFAULT_SETTINGS: PlaygroundSettings = {
  // MapView's own default. Not imported: a runtime import of /Map would load MapLibre eagerly.
  basemap: "satellite",
  preset: "farm",
  programStatus: "enrolled",
  selectedId: null,
  showLabels: true,
  showDots: false,
  showControls: true,
  legend: "carbon",
  viewport: "fit",
};

/** Same swatches the real pages pass, so the legend variants match them. */
const CARBON_LEGEND: MapLegendItem[] = [
  { label: TIER_META.high.label, token: "--ds-orange-500" },
  { label: TIER_META.medium.label, token: "--ds-amber-300" },
  { label: TIER_META.ineligible.label, token: "--ds-border-strong" },
];
const PROGRAM_LEGEND: Record<Exclude<LegendId, "off" | "carbon">, MapLegendItem> = {
  enrolled: { label: "Enrolled parcel", token: "--ds-interaction-primary-default" },
  awaiting: { label: "Included parcel", token: "--ds-orange-500" },
  dropped: { label: "Withdrawn parcel", token: "--ds-border-strong" },
};

function legendFor(id: LegendId): { title: string; items: MapLegendItem[] } | null {
  if (id === "off") return null;
  if (id === "carbon") return { title: "Carbon potential", items: CARBON_LEGEND };
  return { title: "Your fields", items: [PROGRAM_LEGEND[id]] };
}

function cameraFor(
  settings: PlaygroundSettings,
): { fit: boolean; center?: [number, number]; zoom?: number } {
  if (settings.viewport === "fit") {
    // Fitting moves the camera, so the start camera is MapView's default; with no parcels to fit,
    // frame the farm instead.
    return settings.preset === "none"
      ? { fit: true, center: farm.center, zoom: EMPTY_ZOOM }
      : { fit: true };
  }
  const zoom: Record<Exclude<ViewportId, "fit">, number> = { close: CLOSE_ZOOM, wide: WIDE_ZOOM };
  return {
    fit: false,
    center: closeUpCentre(settings.preset, settings.programStatus),
    zoom: zoom[settings.viewport],
  };
}

export function MapPlayground() {
  const [settings, setSettings] = useState<PlaygroundSettings>(DEFAULT_SETTINGS);
  const update = (patch: Partial<PlaygroundSettings>) =>
    setSettings((current) => ({ ...current, ...patch }));

  const parcels = presetParcels(settings.preset, settings.programStatus);
  const features = playgroundFeatures(
    settings.preset,
    settings.programStatus,
    settings.selectedId,
    settings.showDots,
  );
  const selectedFeature = features.features.find(
    (feature) => feature.properties?.selected === true && feature.geometry.type === "Polygon",
  );
  const selected = selectedFeature?.properties
    ? {
        name: String(selectedFeature.properties.name),
        status:
          STATUS_LABEL[selectedFeature.properties.status as ParcelStatus] ??
          String(selectedFeature.properties.status),
        detail: String(selectedFeature.properties.detail ?? ""),
      }
    : null;
  // The real farmer screen opens this panel for a selected Lindenhof parcel.
  const farmParcel = settings.preset === "farm" ? findParcel(settings.selectedId) : null;

  const handleSelectFeature = (properties: MapFeatureSelection) => {
    const parcelId = properties?.parcelId;
    update({ selectedId: typeof parcelId === "string" ? parcelId : null });
  };

  const camera = cameraFor(settings);
  const legend = legendFor(settings.legend);
  // A new camera, dataset or locator-dot choice remounts the map so it re-frames from scratch.
  const mapKey = [
    settings.preset,
    settings.programStatus,
    settings.showDots,
    settings.viewport,
  ].join("|");

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-surface-page">
        <main className="mx-auto flex max-w-[1440px] flex-col gap-16 px-16 py-16 md:px-24 md:py-24">
          <header className="flex flex-col gap-4">
            <h1 className="text-h2 text-text-primary">Map playground</h1>
            <p className="text-body text-text-secondary">
              This page shows every map style in one place. Changes here are not saved.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_400px]">
            <div className="flex flex-col gap-16 lg:sticky lg:top-16 lg:self-start">
              <div className="relative h-[420px] lg:h-[min(76vh,760px)] lg:min-h-[520px]">
                <MapView
                  key={mapKey}
                  className="h-full w-full"
                  center={camera.center}
                  zoom={camera.zoom}
                  features={features}
                  fitToFeatures={camera.fit}
                  fitPadding={FIT_PADDING}
                  fitMaxZoom={FIT_MAX_ZOOM}
                  basemap={settings.basemap}
                  onBasemapChange={(basemap) => update({ basemap })}
                  showControls={settings.showControls}
                  showLabels={settings.showLabels}
                  onSelectFeature={handleSelectFeature}
                />
                {legend && <MapLegend title={legend.title} items={legend.items} />}
              </div>

              {farmParcel && (
                <Card padding="l" aria-label="Parcel details">
                  <div className="flex flex-col gap-16">
                    <ParcelDetail parcel={farmParcel} onBack={() => update({ selectedId: null })} />
                  </div>
                </Card>
              )}
            </div>

            <Card padding="l" aria-label="Map settings">
              <PlaygroundPanel
                settings={settings}
                onChange={update}
                parcels={parcels}
                selected={selected}
                onReset={() => setSettings(DEFAULT_SETTINGS)}
              />
            </Card>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
