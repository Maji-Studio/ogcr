"use client";

import { useState } from "react";
import { AlertDialog, Button, CheckCircleIcon, Message, useToast } from "@majistudio/ogcr-design-system";
import { FileText, Handshake, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { REFERENCE_FOOTPRINT } from "./data/campaign";
import { generalisedParcels, lindenhofFields } from "./data/parcels";
import { timeline } from "./data/timeline";
import {
  allocation,
  buyerResult,
  completedFarms,
  contributionBreakdown,
  eligibleSugar,
  emissionsReduced,
  farmerPayment,
  lindenhof,
  productFootprint,
  socStored,
  totalArea,
} from "./data/selectors";
import { StackedBar } from "./charts/stacked-bar";
import { TrendLine } from "./charts/trend-line";
import {
  CalculationSidesheet,
  EvidenceSidesheet,
  MapLegend,
  Metric,
  Panel,
  ParcelMap,
  ResultHierarchy,
  StatRow,
  Status,
} from "./shared-ui";

const tonnes = (value: number) => `${value.toLocaleString("en-GB")} t`;
const euros = (value: number) =>
  `€${value.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Step 7 — the gate. The results exist; the operator decides when the buyer sees them. */
export function ReleaseStep({ approved, released, onRelease }: { approved: boolean; released: boolean; onRelease: () => void }) {
  const [open, setOpen] = useState(false);
  const toast = useToast();
  const completed = completedFarms(approved);
  const area = totalArea(completed);
  const sugar = eligibleSugar(area);
  const spend = contributionBreakdown(area);

  const release = () => {
    onRelease();
    toast.add({
      title: "Campaign Results released",
      description: "Nestlé can now access the reconciled buyer package.",
      type: "success",
    });
  };

  return (
    <div className="flex flex-col gap-24">
      <StatRow
        stats={[
          { label: "Completed farms", value: String(completed.length), detail: "1 dropped at reconciliation", tone: "positive" },
          { label: "Final area", value: `${area} ha`, detail: "reconciled boundary", tone: "positive" },
          { label: "Eligible sugar", value: tonnes(sugar), detail: "attested output", tone: "positive" },
          { label: "Evidence coverage", value: "100%", detail: "MRV assessed", tone: "positive" },
        ]}
      />

      <Panel
        title="Campaign results"
        subtitle="Three results, kept distinct — soil carbon is never also subtracted from the footprint"
        trailing={<Status tone={released ? "positive" : "warning"}>{released ? "Released" : "Ready to release"}</Status>}
      >
        <ResultHierarchy area={area} />
        <div className="mt-[var(--spacing-16)]">
          <CalculationSidesheet area={area} />
        </div>
      </Panel>

      <div className="grid gap-24 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Final eligible sugar allocation" subtitle={`${tonnes(sugar)} reconciled output across all buyers`}>
          <StackedBar segments={allocation(area)} />
        </Panel>

        <Panel title="Committed vs actual">
          <div className="flex flex-col gap-12 text-body-s">
            <div className="grid grid-cols-3 gap-8 text-text-secondary">
              <span />
              <span className="text-right">Committed</span>
              <span className="text-right">Actual</span>
            </div>
            <div className="grid grid-cols-3 gap-8 border-t border-border-light pt-[var(--spacing-12)]">
              <span className="text-text-secondary">Product</span>
              <span className="text-right text-text-secondary">2,200 t</span>
              <strong className="text-right text-text-primary">2,000 t</strong>
            </div>
            <div className="grid grid-cols-3 gap-8">
              <span className="text-text-secondary">Contribution</span>
              <span className="text-right text-text-secondary">€60,000</span>
              <strong className="text-right text-text-primary">€60,000</strong>
            </div>
          </div>
          <p className="mt-[var(--spacing-16)] text-body-s text-text-secondary">
            The purchase shortfall shrinks Nestlé’s allocation. It does not touch the farmer’s base payment.
          </p>
        </Panel>
      </div>

      <Panel title="Where the contribution went" subtitle={`€${spend.total.toLocaleString("en-GB")} from Nestlé`}>
        <div className="grid gap-12 md:grid-cols-3">
          <Metric label="Farmer base payments" value={`€${spend.farmerBase.toLocaleString("en-GB")}`} detail={`${area} ha × €100/ha`} />
          <Metric label="SOC outcome bonuses" value={`€${spend.socBonus.toLocaleString("en-GB")}`} detail={`${socStored(area)} tCO₂ × €25`} />
          <Metric label="MRV and administration" value={`€${spend.admin.toLocaleString("en-GB")}`} detail="remaining budget" />
        </div>
      </Panel>

      <div className="flex flex-wrap items-center justify-between gap-12">
        <EvidenceSidesheet
          approved={approved}
          trigger={<Button variant="outlined" iconLeft={<FileText />}>Review evidence package</Button>}
        />
        <AlertDialog
          open={open}
          onOpenChange={setOpen}
          title="Release Campaign Results to Nestlé?"
          description="This makes the reconciled buyer package visible to Nestlé: the final Product Footprint, the allocated volume, and the Climate Contribution evidence. Farmer identities and parcel detail are not included."
          confirmLabel="Release results"
          cancelLabel="Not yet"
          onConfirm={release}
          trigger={
            <Button disabled={released} iconLeft={released ? <CheckCircleIcon /> : <ShieldCheck />}>
              {released ? "Campaign Results released" : "Release Campaign Results"}
            </Button>
          }
        />
      </div>
    </div>
  );
}

/** Step 8 — the buyer's reconciled package, capped by what they actually bought. */
export function PackageStep({ approved }: { approved: boolean }) {
  const area = totalArea(completedFarms(approved));
  const result = buyerResult(area);

  return (
    <div className="flex flex-col gap-24">
      <StatRow
        stats={[
          { label: "Eligible purchase", value: tonnes(result.volume), detail: `of ${tonnes(result.committed)} committed`, tone: "positive" },
          { label: "Product Footprint", value: productFootprint(area).toFixed(3), detail: "tCO₂e/t sugar", tone: "positive" },
          { label: "Allocated emissions", value: `${result.allocatedEmissions.toLocaleString("en-GB")} tCO₂e`, detail: `vs ${result.referenceEmissions.toLocaleString("en-GB")} at reference` },
          { label: "Share of output", value: `${result.share}%`, detail: "of eligible sugar" },
        ]}
      />

      <div className="grid gap-24 lg:grid-cols-2">
        <Panel title="Product Footprint" subtitle="Physical inventory — applies to the sugar you bought">
          <TrendLine
            points={timeline.map((point) => ({ label: point.month, value: point.footprint, actual: point.actual }))}
            format={(value) => value.toFixed(3)}
          />
          <p className="mt-[var(--spacing-16)] text-body-s text-text-secondary">
            The settled point is the only reportable one. At the {REFERENCE_FOOTPRINT.toFixed(3)} reference,
            your {tonnes(result.volume)} would carry {result.referenceEmissions.toLocaleString("en-GB")} tCO₂e;
            at the campaign footprint it carries {result.allocatedEmissions.toLocaleString("en-GB")} tCO₂e.
          </p>
        </Panel>

        <Panel title="Climate Contribution" subtitle="Intervention impact — evaluated separately, never summed">
          <div className="flex items-center justify-between gap-12">
            <Metric label="Program contribution" value={`€${result.contribution.toLocaleString("en-GB")}`} detail="paid to the program" />
            <Handshake size={32} className="text-icon-primary" />
          </div>
          <div className="mt-[var(--spacing-16)] grid grid-cols-2 gap-12">
            <Metric label="Emissions reduction" value={`${result.contributionReduction} tCO₂e`} detail="volume-capped share" />
            <Metric label="SOC stock increase" value={`${result.contributionSoc} tCO₂`} detail="reported separately" />
          </div>
          <p className="mt-[var(--spacing-16)] rounded-12 bg-surface-neutral p-12 text-body-s text-text-secondary">
            These two quantities must not be added into one tonne balance, nor both subtracted from your
            Product Footprint.
          </p>
        </Panel>
      </div>

      <Panel
        title="Campaign geography"
        subtitle="Generalised provenance — no farm names, no exact boundaries"
        trailing={<EvidenceSidesheet approved={approved} trigger={<Button variant="outlined" iconLeft={<FileText />}>Evidence package</Button>} />}
      >
        <ParcelMap
          features={generalisedParcels()}
          legend={<MapLegend items={[{ label: "Participating farms (generalised)", color: "var(--ds-interaction-primary-default)" }]} />}
        />
      </Panel>

      <Message
        state="warning"
        title="MRV assessed — not externally verified"
        description="An accredited verifier has not signed this result. “Externally verified” is reserved for a future assurance decision this prototype does not simulate."
      />
    </div>
  );
}

/** Step 9 — where the money lands, and the point of the whole flow. */
export function PaymentStep({ approved }: { approved: boolean }) {
  const payment = farmerPayment(lindenhof);
  const campaignArea = totalArea(completedFarms(approved));

  return (
    <div className="flex flex-col gap-24">
      <StatRow
        stats={[
          { label: "Your area", value: `${lindenhof.area} ha`, detail: `of ${campaignArea} ha campaign` },
          { label: "Soil Organic Carbon", value: `${payment.soc} tCO₂`, detail: "stored on your land", tone: "positive" },
          { label: "Emissions Reduction", value: `${payment.reduced} tCO₂e`, detail: "against the baseline" },
          { label: "Total payment", value: euros(payment.total), detail: "paid by Südzucker", tone: "positive" },
        ]}
      />

      <div className="grid gap-24 lg:grid-cols-[1.15fr_0.85fr]">
        <Panel title="Your parcels" subtitle="Your own records — never shared with the buyer">
          <ParcelMap
            features={lindenhofFields(approved)}
            zoom={13}
            center={lindenhof.center}
            legend={<MapLegend items={[{ label: "Enrolled", color: "var(--ds-interaction-primary-default)" }]} />}
          />
        </Panel>

        <Panel title="Payment summary">
          <div className="flex flex-col gap-12 text-body-s">
            <div className="flex justify-between gap-12">
              <span className="text-text-secondary">Base participation · {lindenhof.area} ha × €100</span>
              <strong className="text-text-primary">{euros(payment.base)}</strong>
            </div>
            <div className="flex justify-between gap-12">
              <span className="text-text-secondary">SOC bonus · {payment.soc} tCO₂ × €25</span>
              <strong className="text-text-primary">{euros(payment.bonus)}</strong>
            </div>
            <div className="flex justify-between gap-12 border-t border-border-light pt-[var(--spacing-12)]">
              <strong className="text-text-primary">Total</strong>
              <strong className="text-text-positive">{euros(payment.total)}</strong>
            </div>
          </div>
          <p className="mt-[var(--spacing-16)] text-body-s text-text-secondary">
            Your base payment is guaranteed on participation. Only the bonus tracks the assessed result.
          </p>
        </Panel>
      </div>

      <Message
        state="success"
        title="The shortfall did not reach the farmer"
        description={`Nestlé purchased 2,000 t against 2,200 t committed. That reduced Nestlé’s allocation — not Lindenhof’s guaranteed ${euros(payment.base)} base payment. Campaign-wide emissions reduced: ${emissionsReduced(campaignArea)} tCO₂e.`}
      />
    </div>
  );
}
