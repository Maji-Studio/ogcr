"use client";

import { Message, ProgressBar } from "@majistudio/ogcr-design-system";
import { Database } from "@phosphor-icons/react/dist/ssr";
import { campaign, REFERENCE_FOOTPRINT } from "./data/campaign";
import { farms } from "./data/farms";
import { generalisedParcels, supplyShedParcels } from "./data/parcels";
import { CHECKPOINT_DATE, checkpoint, timeline } from "./data/timeline";
import { enrolledFarms, evidenceCoverage, nestle, totalArea } from "./data/selectors";
import { TrendLine } from "./charts/trend-line";
import { MapLegend, Metric, Panel, ParcelMap, StatRow, Status } from "./shared-ui";

/** The During phase is frozen at the September checkpoint — everything after it is still unknown. */
const upToCheckpoint = timeline.slice(0, timeline.findIndex((point) => point.month === checkpoint.month) + 1);

const tonnes = (value: number) => `${value.toLocaleString("en-GB")} t`;

/** Evidence coverage by practice, derived from the farms actually doing each practice. */
function coverageByPractice(approved: boolean) {
  const enrolled = enrolledFarms(approved);
  const practices = [...new Set(farms.map((farm) => farm.practice))];

  return practices.map((practice) => {
    const group = enrolled.filter((farm) => farm.practice === practice);
    return { practice, coverage: evidenceCoverage(group), farms: group.length };
  });
}

/** Step 5 — the campaign runs. The MRV provider is a handoff, not a persona. */
export function ProgressStep({ approved }: { approved: boolean }) {
  const enrolled = enrolledFarms(approved);
  const area = totalArea(enrolled);
  const coverage = evidenceCoverage(enrolled);

  const legend = [
    { label: "Evidence on track", color: "var(--ds-interaction-primary-default)" },
    { label: "Awaiting farmer", color: "var(--ds-orange-500)" },
    { label: "Evidence incomplete", color: "var(--ds-border-strong)" },
  ];

  return (
    <div className="flex flex-col gap-24">
      <StatRow
        stats={[
          { label: "Enrolled farms", value: `${enrolled.length} / ${campaign.targetFarms}`, tone: "positive" },
          { label: "Enrolled area", value: `${area} ha` },
          { label: "Evidence coverage", value: `${coverage}%`, detail: "of the MRV package", tone: coverage < 100 ? "warning" : "positive" },
          { label: "Eligible sugar", value: tonnes(checkpoint.eligibleSugar), detail: "latest forecast" },
        ]}
      />

      <div className="grid gap-24 lg:grid-cols-[1.15fr_0.85fr]">
        <Panel title="Evidence by practice" subtitle={`Checkpoint · ${CHECKPOINT_DATE}`}>
          <div className="flex flex-col gap-16">
            {coverageByPractice(approved).map((row) => (
              <ProgressBar
                key={row.practice}
                label={`${row.practice} · ${row.farms} farms`}
                value={row.coverage}
                showValue
                tone={row.coverage < 80 ? "orange" : "default"}
              />
            ))}
          </div>
        </Panel>

        <Panel title="MRV handoff" trailing={<Status>In progress</Status>}>
          <div className="flex items-start gap-8">
            <Database size={22} className="mt-2 shrink-0 text-icon-secondary" />
            <p className="text-body-s text-text-secondary">
              The external provider received the farmer-authorised parcel work package on 30 June. Its
              calculation engine is outside this prototype — only the handoff and the signed result are.
            </p>
          </div>
          <div className="mt-[var(--spacing-16)] flex flex-col gap-8">
            <div className="flex justify-between gap-12 rounded-12 bg-surface-neutral p-12 text-body-s">
              <span className="text-text-secondary">Work package sent</span>
              <strong className="text-text-primary">30 Jun 2027</strong>
            </div>
            <div className="flex justify-between gap-12 rounded-12 bg-surface-neutral p-12 text-body-s">
              <span className="text-text-secondary">Records received</span>
              <strong className="text-text-primary">
                {enrolled.reduce((sum, farm) => sum + farm.evidenceReceived, 0)} of{" "}
                {enrolled.reduce((sum, farm) => sum + farm.evidenceExpected, 0)}
              </strong>
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Supply shed" subtitle="Evidence status by farm">
        <ParcelMap features={supplyShedParcels(approved)} legend={<MapLegend items={legend} />} />
      </Panel>

      <Message
        state="warning"
        title="Material risks"
        description="One farm may not complete its evidence package, and dry conditions may reduce eligible beet volume. Farmer base payments stay protected either way."
      />
    </div>
  );
}

/** Step 6 — the buyer's view of the same moment: aggregate, de-identified, un-exportable. */
export function CheckpointStep() {
  return (
    <div className="flex flex-col gap-24">
      <StatRow
        stats={[
          { label: "Enrolled area", value: "435 ha", detail: "aggregate" },
          { label: "Evidence coverage", value: `${checkpoint.coverage}%`, tone: "warning" },
          { label: "Forecast eligible sugar", value: tonnes(checkpoint.eligibleSugar) },
          { label: "Provisional footprint", value: checkpoint.footprint.toFixed(3), detail: "tCO₂e/t", tone: "warning" },
        ]}
      />

      <div className="grid gap-24 lg:grid-cols-2">
        <Panel title="Forecast eligible sugar" trailing={<Status tone="warning">Provisional</Status>}>
          <TrendLine points={upToCheckpoint.map((p) => ({ label: p.month, value: p.eligibleSugar, actual: false }))} format={tonnes} />
          <p className="mt-[var(--spacing-16)] text-body-s text-text-secondary">
            The dashed line is what it is: a forecast. Nothing here can be exported as a claim.
          </p>
        </Panel>

        <Panel title="Your expected volume" trailing={<Status tone="warning">Not reportable</Status>}>
          <div className="grid grid-cols-2 gap-12">
            <Metric label="Committed" value={tonnes(nestle.committed)} detail="pre-campaign" />
            <Metric label="Forecast" value="2,100 t" detail="latest" />
          </div>
          <p className="mt-[var(--spacing-16)] text-body-s text-text-secondary">
            Final eligibility is capped by what you actually purchase, against a reference footprint of{" "}
            {REFERENCE_FOOTPRINT.toFixed(3)} tCO₂e/t. This number still has to settle.
          </p>
        </Panel>
      </div>

      <Panel title="Campaign geography" subtitle="Generalised — exact boundaries and farm identities are withheld">
        <ParcelMap
          features={generalisedParcels()}
          legend={<MapLegend items={[{ label: "Participating farms (generalised)", color: "var(--ds-interaction-primary-default)" }]} />}
        />
      </Panel>

      <Message
        state="neutral"
        title="What Nestlé does not see"
        description="No farm names, no exact parcel boundaries, no raw source documents, and no individual farmer payments — only aggregate, de-identified progress."
      />
    </div>
  );
}
