"use client";

/**
 * The farm overview, in three figures. They sit above the map because the map answers "which
 * land", and these answer "what could change" without introducing a commercial offer.
 *
 * Removals and reductions get a card each. They are never combined into a single headline number,
 * because they are different quantities and adding them would be the exact error the registry
 * exists to prevent.
 */

import type { ReactNode } from "react";
import { Kpi, LeafIcon, MapIcon, PlantIcon } from "@majistudio/ogcr-design-system";
import {
  eligibleArea,
  farmPotential,
  formatArea,
  formatRange,
  parcelCount,
  parcelsContributing,
} from "./data/farm";
import { InfoHint } from "./shared";

const ICON_SIZE = 20;

export function FarmKpis() {
  const removals = farmPotential("removal");
  const reductions = farmPotential("reduction");
  const reductionParcels = parcelsContributing("reduction");

  return (
    <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
      <Kpi
        accentBar={false}
        icon={<PlantIcon size={ICON_SIZE} />}
        label={
          <Label hint="About soil carbon potential" text="Soil carbon potential">
            An estimate of the extra carbon your soil could store each year if you adopt the
            recommended practice on each eligible parcel. It is an estimate, not a measured result.
          </Label>
        }
        status={{ label: "Illustrative", tone: "neutral" }}
        value={<Value figure={formatRange(removals)} unit="tCO₂ per year" />}
        secondaryText={`From the recommended practice on ${parcelCount(parcelsContributing("removal").length)}.`}
      />

      <Kpi
        accentBar={false}
        icon={<LeafIcon size={ICON_SIZE} />}
        label={
          <Label hint="About emissions reduction potential" text="Emissions reduction potential">
            An estimate of the field emissions you could avoid each year. Emissions reductions stay
            separate from soil carbon removals. The two are never added together.
          </Label>
        }
        status={{ label: "Illustrative", tone: "neutral" }}
        value={<Value figure={formatRange(reductions)} unit="tCO₂e per year" />}
        secondaryText={`From optimised nitrogen on ${reductionParcels.map((parcel) => parcel.name).join(", ")}.`}
      />

      <Kpi
        accentBar={false}
        icon={<MapIcon size={ICON_SIZE} />}
        label={
          <Label hint="About land with potential" text="Land with potential">
            The combined area of parcels where a new practice could create an illustrative carbon
            opportunity. This is not a measured result or an enrollment decision.
          </Label>
        }
        status={{ label: "Illustrative", tone: "neutral" }}
        value={<Value figure={formatArea(eligibleArea)} unit="ha" />}
        secondaryText={`${parcelCount(parcelsContributing("removal").length + reductionParcels.length)} ready to review.`}
      />
    </div>
  );
}

function Label({ text, hint, children }: { text: string; hint: string; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-6">
      {text}
      <InfoHint label={hint}>{children}</InfoHint>
    </span>
  );
}

/** The unit sits under the figure so a range stays readable at narrow widths. */
function Value({ figure, unit }: { figure: string; unit: string }) {
  return (
    <span className="flex flex-col">
      <span className="tabular-nums">{figure}</span>
      <span className="text-body-s font-normal text-text-secondary">{unit}</span>
    </span>
  );
}
