"use client";

import { type ReactElement, type ReactNode, useState } from "react";
import {
  Button,
  Card,
  CheckCircleIcon,
  InfoIcon,
  Kpi,
  Pill,
  Sidesheet,
} from "@majistudio/ogcr-design-system";
import { FileText } from "@phosphor-icons/react/dist/ssr";
import type { FeatureCollection } from "geojson";
import { MapView } from "@/components/map";
import { campaign, REFERENCE_FOOTPRINT } from "./data/campaign";
import {
  completedFarms,
  eligibleSugar,
  emissionsReduced,
  productFootprint,
  socStored,
  totalArea,
} from "./data/selectors";

/** Map viewport: big enough to read as a real map, never taller than the fold. */
const MAP_HEIGHT = "h-[46vh] min-h-[var(--spacing-320)]";

export function PrototypeLabel({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-4 rounded-full border border-border-positive-light bg-surface-positive text-text-positive ${compact ? "px-8 py-4 text-xs" : "px-12 py-4 text-body-s"}`}>
      <InfoIcon size={16} weight="fill" />
      Illustrative prototype data
    </span>
  );
}

export function Status({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "positive" | "warning" | "negative" }) {
  return <Pill tone={tone} className="text-body-s">{tone === "positive" && <CheckCircleIcon size={16} weight="fill" />}{children}</Pill>;
}

export function Panel({ children, className = "", title, subtitle, trailing, floating = false }: {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  floating?: boolean;
}) {
  return (
    <Card title={title} subtitle={subtitle} trailing={trailing} floating={floating} className={`p-24 ${className}`}>
      {children}
    </Card>
  );
}

export function Metric({ label, value, detail, inverse = false }: { label: string; value: string; detail?: string; inverse?: boolean }) {
  return (
    <div className="min-w-0">
      <p className={`text-body-s ${inverse ? "text-surface-light/70" : "text-text-secondary"}`}>{label}</p>
      <p className={`mt-4 text-h3 ${inverse ? "text-surface-light" : "text-text-primary"}`}>{value}</p>
      {detail && <p className={`mt-4 text-body-s ${inverse ? "text-surface-light/70" : "text-text-secondary"}`}>{detail}</p>}
    </div>
  );
}

export interface Stat {
  label: string;
  value: string;
  detail?: string;
  tone?: "positive" | "warning" | "negative" | "neutral";
}

/** The KPI row every dashboard opens with. */
export function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <section className="grid grid-cols-2 gap-16 xl:grid-cols-4" aria-label="Campaign metrics">
      {stats.map((stat) => (
        <Kpi
          key={stat.label}
          label={stat.label}
          value={stat.value}
          secondaryText={stat.detail}
          tone={stat.tone ?? "neutral"}
          className="min-w-0"
        />
      ))}
    </section>
  );
}

/** The real MapLibre map, given a height and a set of parcels to draw. */
export function ParcelMap({
  features,
  zoom,
  center = campaign.center,
  fit = true,
  legend,
}: {
  features: FeatureCollection;
  zoom?: number;
  center?: [number, number];
  fit?: boolean;
  legend?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className={MAP_HEIGHT}>
        <MapView className="h-full w-full" features={features} fitToFeatures={fit} center={center} zoom={zoom ?? 11} />
      </div>
      {legend}
    </div>
  );
}

export function MapLegend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap gap-16">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-4 text-body-s text-text-secondary">
          <span aria-hidden="true" className="h-[10px] w-[10px] rounded-full" style={{ backgroundColor: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

/** The three results, in the order the product insists on: SOC first, footprint last. */
export function ResultHierarchy({ area }: { area: number }) {
  const items = [
    { label: "Soil Organic Carbon", value: `${socStored(area)} tCO₂`, detail: "Primary OGCR result · assessed/modelled stock change" },
    { label: "Emissions Reduction", value: `${emissionsReduced(area)} tCO₂e`, detail: "Field-emissions change against the baseline" },
    { label: "Product Footprint", value: `${productFootprintLabel(area)} tCO₂e/t`, detail: `Reference ${REFERENCE_FOOTPRINT.toFixed(3)} tCO₂e/t` },
  ];

  return (
    <div className="grid gap-16 md:grid-cols-3">
      {items.map((item, index) => (
        <Kpi
          key={item.label}
          label={item.label}
          value={item.value}
          secondaryText={item.detail}
          tone={index === 0 ? "positive" : "neutral"}
          className="min-w-0"
        />
      ))}
    </div>
  );
}

function productFootprintLabel(area: number): string {
  return productFootprint(area).toFixed(3);
}

/** The one permitted drill-down: every number in the walkthrough is reachable from here. */
export function CalculationSidesheet({ area }: { area: number }) {
  const [open, setOpen] = useState(false);
  const sugar = eligibleSugar(area);

  return (
    <Sidesheet
      open={open}
      onOpenChange={setOpen}
      title="How this was calculated"
      status="Illustrative"
      trigger={<Button variant="text" iconLeft={<InfoIcon />}>How this was calculated</Button>}
    >
      <div className="flex flex-col gap-16">
        <p className="text-body-s text-text-secondary">
          Every figure below is derived from the enrolled farms, not entered by hand.
        </p>
        <div className="flex flex-col gap-8 rounded-12 bg-surface-neutral p-16 font-mono text-body-s text-text-secondary">
          <p>eligible sugar = {area} ha × 75 t beet/ha × 16.0% = {sugar.toLocaleString("en-GB")} t</p>
          <p>SOC stock increase = {area} ha × 0.55 tCO₂/ha = {socStored(area)} tCO₂</p>
          <p>field-emissions reduction = {area} ha × 0.36 tCO₂e/ha = {emissionsReduced(area)} tCO₂e</p>
          <p>Product Footprint = 0.550 − ({emissionsReduced(area)} ÷ {sugar.toLocaleString("en-GB")}) = {productFootprintLabel(area)} tCO₂e/t</p>
        </div>
        <div className="rounded-12 border border-border-warning-light bg-surface-warning p-16">
          <p className="text-body-s font-bold text-text-primary">SOC is not subtracted twice</p>
          <p className="mt-4 text-body-s text-text-secondary">
            Soil carbon is reported as its own result. It is never also subtracted from the Product
            Footprint — that would double count it.
          </p>
        </div>
        <p className="text-body-s text-text-secondary">
          The 16.0% conversion is a prototype eligible-white-sugar yield, not measured beet sugar
          content: 17.0% sugar content × 94.1% recovery and allocation factor.
        </p>
      </div>
    </Sidesheet>
  );
}

export function EvidenceSidesheet({ trigger, approved }: { trigger: ReactElement; approved: boolean }) {
  const [open, setOpen] = useState(false);
  const area = totalArea(completedFarms(approved));
  const records = [
    ["Parcel & practice evidence", `100% coverage · ${completedFarms(approved).length} farms · farmer-authorised`],
    ["MRV methodology", "Model v2.1 · signed provider submission"],
    ["Product attestation", `${eligibleSugar(area).toLocaleString("en-GB")} t eligible sugar · Südzucker`],
    ["Allocation record", "2,000 t to Nestlé · reconciled"],
  ];

  const download = () => {
    const content = `ILLUSTRATIVE PROTOTYPE DATA\n${campaign.name}\nMRV status: Assessed/modelled — not externally verified\nEligible sugar: ${eligibleSugar(area)} t\nProduct Footprint: ${productFootprintLabel(area)} tCO2e/t\n`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "illustrative-campaign-results.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Sidesheet
      open={open}
      onOpenChange={setOpen}
      title="Evidence package"
      status="MRV assessed · not externally verified"
      trigger={trigger}
      primaryAction={{ label: "Download illustrative summary", onClick: download }}
    >
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-8">
          {records.map(([title, detail]) => (
            <div key={title} className="flex gap-8 rounded-12 bg-surface-neutral p-12">
              <FileText size={18} className="shrink-0 text-icon-positive" />
              <div>
                <p className="text-body-s font-bold text-text-primary">{title}</p>
                <p className="text-body-s text-text-secondary">{detail}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-12 border border-border-light p-16">
          <p className="text-body-s font-bold text-text-primary">What the buyer never receives</p>
          <p className="mt-4 text-body-s text-text-secondary">
            No farm names, exact parcel boundaries, raw source documents, or individual farmer payments
            appear in the buyer package.
          </p>
        </div>
      </div>
    </Sidesheet>
  );
}
