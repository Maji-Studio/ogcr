"use client";

/**
 * The farmer base screen.
 *
 * Hierarchy, deliberately: the farm and its parcels first (the map and the parcel list), then the
 * carbon opportunity (the three figures above it), then the single next action. Selection is the
 * only state on this screen, and it is shared by the map and the panel so the two can never
 * disagree about which parcel the farmer is looking at.
 */

import { useState } from "react";
import { Card, TooltipProvider } from "@majistudio/ogcr-design-system";
import { findParcel } from "./data/farm";
import { FarmChrome } from "./farm-chrome";
import { FarmKpis } from "./farm-kpis";
import { FarmSummary } from "./farm-summary";
import { ParcelDetail } from "./parcel-detail";
import { ParcelMap } from "./parcel-map";
import { IllustrativeTag } from "./shared";

/** Map and panel share one height so the row reads as a single composition on desktop. */
const ROW_HEIGHT = "lg:h-[min(76vh,760px)] lg:min-h-[520px]";

export function FarmerScreen({ userName }: { userName: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedParcel = findParcel(selectedId);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-surface-page">
        <FarmChrome userName={userName} />

        <main className="mx-auto flex max-w-[1440px] flex-col gap-16 px-16 py-16 md:px-24 md:py-24">
          <IllustrativeTag className="self-start lg:hidden" />

          <FarmKpis />

          <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_384px] xl:grid-cols-[minmax(0,1fr)_432px]">
            <ParcelMap
              className={`h-[420px] ${ROW_HEIGHT}`}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />

            <Card
              padding="l"
              aria-label="Farm details"
              className={`overflow-y-auto ${ROW_HEIGHT}`}
            >
              {selectedParcel ? (
                <ParcelDetail parcel={selectedParcel} onBack={() => setSelectedId(null)} />
              ) : (
                <FarmSummary selectedId={selectedId} onSelect={setSelectedId} />
              )}
            </Card>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
