"use client";

/**
 * The panel's detail state, opened from the parcel list, the map, or the next-action card.
 *
 * The structural decision here is the grouping: estimates are grouped under "Soil carbon removals"
 * and "Emissions reductions" rather than listed as one table of practices. Removals and reductions
 * are different quantities that must never be summed, and a heading enforces that better than a
 * footnote does.
 */

import { ArrowLeftIcon, Button, Pill, Separator } from "@majistudio/ogcr-design-system";
import {
  formatArea,
  formatRange,
  isEligible,
  outcomeLabel,
  parcelPotential,
  recommendedPractice,
  unitFor,
  type FarmerParcel,
  type OutcomeKind,
  type PracticePotential,
} from "./data/farm";
import { SectionLabel, TierPill } from "./shared";

const OUTCOME_ORDER: OutcomeKind[] = ["removal", "reduction"];

interface ParcelDetailProps {
  parcel: FarmerParcel;
  onBack: () => void;
}

export function ParcelDetail({ parcel, onBack }: ParcelDetailProps) {
  const eligible = isEligible(parcel);
  const recommended = recommendedPractice(parcel);

  return (
    <>
      <div>
        <Button variant="text" size="s" iconLeft={<ArrowLeftIcon />} onClick={onBack}>
          Your farm
        </Button>
      </div>

      <header className="flex items-start justify-between gap-16">
        <div className="flex flex-col items-start gap-8">
          <h1 className="text-h3 text-text-primary">{parcel.name}</h1>
          <TierPill tier={parcel.tier} />
        </div>
        <p className="flex shrink-0 items-baseline gap-4">
          <span className="text-h2 tabular-nums text-text-positive">{formatArea(parcel.area)}</span>
          <span className="text-body-s text-text-secondary">ha</span>
        </p>
      </header>

      <Separator />

      <section className="flex flex-col gap-8">
        <SectionLabel>Practice history</SectionLabel>
        <p className="text-body-s text-text-secondary">{parcel.history}</p>
      </section>

      {!eligible && <IneligibleNotice parcel={parcel} />}

      {eligible && recommended && (
        <>
          <Separator />
          <section className="flex flex-col gap-16">
            <div className="flex items-center justify-between gap-12">
              <SectionLabel>Carbon potential</SectionLabel>
              <Pill tone="neutral">Illustrative</Pill>
            </div>
            {OUTCOME_ORDER.map((kind) => (
              <OutcomeGroup
                key={kind}
                kind={kind}
                parcel={parcel}
                practices={parcel.practices.filter((practice) => practice.kind === kind)}
                recommended={recommended}
              />
            ))}
          </section>
        </>
      )}

    </>
  );
}

/** The empty state: a parcel with nothing to offer, and the reason why, instead of a dead action. */
function IneligibleNotice({ parcel }: { parcel: FarmerParcel }) {
  return (
    <section className="flex flex-col gap-8 rounded-12 border border-border-light bg-surface-page p-16">
      <p className="text-body-s font-medium text-text-primary">No carbon potential to show</p>
      <p className="text-body-s text-text-secondary">{parcel.ineligibleReason}</p>
      <p className="text-body-s text-text-secondary">
        Keep farming {parcel.name} as you are. Nothing is needed here.
      </p>
    </section>
  );
}

interface OutcomeGroupProps {
  kind: OutcomeKind;
  parcel: FarmerParcel;
  practices: PracticePotential[];
  recommended: PracticePotential;
}

function OutcomeGroup({ kind, parcel, practices, recommended }: OutcomeGroupProps) {
  if (practices.length === 0) return null;

  return (
    <div className="flex flex-col gap-8">
      <p className="text-body-s font-medium text-text-secondary">{outcomeLabel(kind)}</p>
      <ul className="flex flex-col gap-8">
        {practices.map((practice) => {
          const total = parcelPotential(parcel, practice);
          const isRecommended = practice.practice === recommended.practice;
          return (
            <li
              key={practice.practice}
              className="flex flex-col gap-4 rounded-8 border border-border-light bg-surface-light px-12 py-8"
            >
              <span className="flex items-center justify-between gap-8">
                <span className="text-body text-text-primary">{practice.practice}</span>
                {isRecommended && <Pill tone="positive">Recommended</Pill>}
              </span>
              <span className="flex items-baseline justify-between gap-8 text-body-s text-text-secondary">
                <span className="tabular-nums">
                  {formatRange(total)} {unitFor(practice.kind)} per year
                </span>
                <span className="tabular-nums">
                  {formatRange(practice)} per ha
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
