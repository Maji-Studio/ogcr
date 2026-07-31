"use client";

import { useState } from "react";
import {
  Button,
  CheckCircleIcon,
  CheckIcon,
  Dialog,
  Message,
  ProgressBar,
  useToast,
} from "@majistudio/ogcr-design-system";
import { DataTable } from "@majistudio/ogcr-design-system/Table";
import type { ColumnDef } from "@tanstack/react-table";
import { Handshake, LockKey, Package, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { campaign, permissions, practices, EUR_PER_HA, EUR_PER_TCO2 } from "./data/campaign";
import { lindenhofParcels, type Farm } from "./data/farms";
import { lindenhofFields, supplyShedParcels } from "./data/parcels";
import {
  allocation,
  eligibleSugar,
  enrolledFarms,
  lindenhof,
  nestle,
  productFootprint,
  totalArea,
} from "./data/selectors";
import { StackedBar } from "./charts/stacked-bar";
import { MapLegend, Metric, Panel, ParcelMap, StatRow, Status } from "./shared-ui";

const legend = [
  { label: "Enrolled", color: "var(--ds-interaction-primary-default)" },
  { label: "Awaiting farmer", color: "var(--ds-orange-500)" },
  { label: "Evidence incomplete", color: "var(--ds-border-strong)" },
];

/** Step 1 — the shared brief. One page, read by both organisations. */
export function ProposalStep() {
  // The brief is written against the campaign target, before anyone has approved anything.
  const target = campaign.targetArea;

  return (
    <div className="flex flex-col gap-24">
      <StatRow
        stats={[
          { label: "Target farms", value: String(campaign.targetFarms) },
          { label: "Target area", value: `${target} ha` },
          { label: "Eligible sugar", value: `${eligibleSugar(target).toLocaleString("en-GB")} t`, detail: "forecast output" },
          { label: "Product Footprint", value: `${productFootprint(target).toFixed(3)}`, detail: "tCO₂e/t forecast" },
        ]}
      />

      <Panel title="Supply shed" subtitle={`${campaign.supplyShed} · beet within the campaign boundary`}>
        <ParcelMap features={supplyShedParcels(false)} legend={<MapLegend items={legend} />} />
      </Panel>

      <div className="grid gap-24 lg:grid-cols-2">
        <Panel title="Eligible practices">
          <ul className="flex flex-col gap-12">
            {practices.map((practice) => (
              <li key={practice} className="flex items-start gap-8">
                <CheckIcon size={18} className="mt-2 shrink-0 text-icon-positive" weight="bold" />
                <span className="text-body-s text-text-secondary">{practice}</span>
              </li>
            ))}
          </ul>
          <p className="mt-[var(--spacing-16)] rounded-12 bg-surface-neutral p-12 text-body-s text-text-secondary">
            <strong className="text-text-primary">Boundary:</strong> enrolled beet through eligible white
            sugar at factory gate, on an illustrative mass-balance policy. Results are never extrapolated
            to the whole factory catchment.
          </p>
        </Panel>

        <Panel title="Key dates">
          <div className="grid gap-12 sm:grid-cols-2">
            {campaign.dates.map((item, index) => (
              <div key={item.label} className="rounded-12 bg-surface-neutral p-16">
                <span className="text-label-button font-bold text-text-positive">0{index + 1}</span>
                <p className="mt-8 text-body-s font-bold text-text-primary">{item.label}</p>
                <p className="mt-4 text-body-s text-text-secondary">{item.date}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

/** Step 2 — the two commitments, side by side and never summed. */
export function CommitmentStep() {
  const target = campaign.targetArea;
  const sugar = eligibleSugar(target);
  const cap = [
    { id: "nestle", name: "Nestlé (provisional cap)", volume: nestle.committed, share: Math.round((nestle.committed / sugar) * 1000) / 10, color: "var(--ds-interaction-primary-default)" },
    { id: "rest", name: "Available to other buyers", volume: sugar - nestle.committed, share: Math.round(((sugar - nestle.committed) / sugar) * 1000) / 10, color: "var(--ds-border-medium)" },
  ];

  return (
    <div className="flex flex-col gap-24">
      <div className="grid gap-24 lg:grid-cols-2">
        <Panel
          title="Product commitment"
          trailing={<Status tone="warning">Provisional</Status>}
        >
          <div className="flex items-start justify-between gap-12">
            <Metric label="Forecast purchase volume" value={`${nestle.committed.toLocaleString("en-GB")} t`} detail="eligible white sugar" />
            <Package size={28} className="text-icon-positive" />
          </div>
          <p className="mt-[var(--spacing-16)] text-body-s text-text-secondary">
            Sets an estimated cap only. The final allocation depends on what Nestlé actually buys and on
            reconciliation — it is not a reportable quantity.
          </p>
        </Panel>

        <Panel title="Intervention contribution" trailing={<Status>Committed</Status>}>
          <div className="flex items-start justify-between gap-12">
            <Metric label="Program support" value={`€${nestle.contribution.toLocaleString("en-GB")}`} detail="paid to the program" />
            <Handshake size={28} className="text-icon-primary" />
          </div>
          <p className="mt-[var(--spacing-16)] text-body-s text-text-secondary">
            Separate money for farmer base payments, outcome bonuses, MRV, and administration. It does not
            move with the purchase volume.
          </p>
        </Panel>
      </div>

      <Panel title="Provisional allocation cap" subtitle={`Against ${sugar.toLocaleString("en-GB")} t forecast eligible sugar`}>
        <StackedBar segments={cap} />
      </Panel>

      <Message
        state="neutral"
        title="Why the two commitments stay separate"
        description="If farmer support depended on the purchase volume, a buyer shortfall would land on the farmer. It does not. The contribution is committed up front; the product commitment only caps what Nestlé can later report."
      />
    </div>
  );
}

/** Step 3 — the gate. Südzucker prepared everything; the farm still has to say yes. */
export function ApprovalStep({ approved, onApprove }: { approved: boolean; onApprove: () => void }) {
  const [open, setOpen] = useState(false);
  const toast = useToast();

  const approve = () => {
    onApprove();
    toast.add({
      title: "Participation approved",
      description: `${lindenhof.name} is now enrolled in ${campaign.name}.`,
      type: "success",
    });
  };

  return (
    <div className="flex flex-col gap-24">
      <div className="grid gap-24 lg:grid-cols-[1.15fr_0.85fr]">
        <Panel title="Your parcels" subtitle={`${lindenhof.area} ha · ${lindenhofParcels.length} parcels proposed for enrollment`}>
          <ParcelMap
            features={lindenhofFields(approved)}
            zoom={13}
            center={lindenhof.center}
            legend={<MapLegend items={legend.slice(0, 2)} />}
          />
          <div className="mt-[var(--spacing-16)] flex flex-col gap-8">
            {lindenhofParcels.map((parcel) => (
              <div key={parcel.id} className="flex items-center justify-between gap-16 rounded-12 border border-border-light p-12">
                <div>
                  <p className="text-body-s font-bold text-text-primary">{parcel.name}</p>
                  <p className="text-body-s text-text-secondary">{parcel.practice}</p>
                </div>
                <strong className="text-body-s text-text-positive">{parcel.area} ha</strong>
              </div>
            ))}
          </div>
        </Panel>

        <div className="flex flex-col gap-24">
          <Panel title="What you authorise">
            <div className="flex flex-col gap-12">
              {permissions.map((permission) => (
                <div key={permission} className="flex items-start gap-8">
                  <CheckIcon size={18} className="mt-2 shrink-0 text-icon-positive" weight="bold" />
                  <p className="text-body-s text-text-secondary">{permission}</p>
                </div>
              ))}
            </div>
            <div className="mt-[var(--spacing-16)] flex gap-8 rounded-12 bg-surface-neutral p-12">
              <LockKey size={18} className="shrink-0 text-icon-secondary" />
              <p className="text-body-s text-text-secondary">
                Scoped and revocable. This enrollment covers only the parcels and terms shown.
              </p>
            </div>
          </Panel>

          <Panel title="Your terms">
            <div className="grid grid-cols-2 gap-12">
              <Metric label="Guaranteed base" value={`€${EUR_PER_HA}/ha`} detail="on participation" />
              <Metric label="SOC bonus" value={`€${EUR_PER_TCO2}/tCO₂`} detail="on the assessed result" />
            </div>
            <p className="mt-[var(--spacing-16)] text-body-s text-text-secondary">
              Südzucker is your payment counterparty. A buyer shortfall does not reduce your base payment.
            </p>

            <Dialog
              open={open}
              onOpenChange={setOpen}
              size="m"
              title="Approve participation"
              description={`You are enrolling ${lindenhofParcels.length} parcels (${lindenhof.area} ha) in ${campaign.name} and granting Südzucker the delegated permissions listed.`}
              trigger={
                <Button disabled={approved} iconLeft={approved ? <CheckCircleIcon /> : <ShieldCheck />} className="mt-[var(--spacing-16)] w-full">
                  {approved ? "Participation approved" : "Review and approve"}
                </Button>
              }
              primaryAction={{ label: "Approve participation", onClick: approve }}
              secondaryAction={{ label: "Not yet", variant: "outlined" }}
            >
              <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-4 rounded-12 bg-surface-neutral p-12">
                  {lindenhofParcels.map((parcel) => (
                    <div key={parcel.id} className="flex justify-between gap-12 text-body-s">
                      <span className="text-text-secondary">{parcel.name} · {parcel.practice}</span>
                      <strong className="text-text-primary">{parcel.area} ha</strong>
                    </div>
                  ))}
                </div>
                <p className="text-body-s text-text-secondary">
                  Your farm keeps ownership of its records, its assessed result, and its payment
                  entitlement. You can revoke the delegation later.
                </p>
              </div>
            </Dialog>
          </Panel>
        </div>
      </div>

      {approved && (
        <Message
          state="success"
          title="Enrolled"
          description="Your approval is what activated this enrollment — not the cultivation contract, and not Südzucker preparing it."
        />
      )}
    </div>
  );
}

const rosterColumns: ColumnDef<Farm & { enrolled: boolean }>[] = [
  { accessorKey: "name", header: "Farm" },
  { accessorKey: "area", header: "Area", cell: (info) => `${info.getValue<number>()} ha`, meta: { numeric: true } },
  { accessorKey: "practice", header: "Practice" },
  {
    id: "evidence",
    header: "Evidence",
    cell: ({ row }) => `${row.original.evidenceReceived} / ${row.original.evidenceExpected}`,
    meta: { numeric: true },
  },
  {
    id: "status",
    header: "Enrollment",
    cell: ({ row }) =>
      row.original.enrolled ? <Status tone="positive">Enrolled</Status> : <Status tone="warning">Awaiting farmer</Status>,
  },
];

/** Step 4 — the payoff: the farmer's action, seen from the operator's side. */
export function EnrollmentStep({ approved }: { approved: boolean }) {
  const enrolled = enrolledFarms(approved);
  const area = totalArea(enrolled);
  const rows = enrolled.map((farm) => ({ ...farm, enrolled: true }));
  // Lindenhof only appears as a row at all once it exists in the roster; before approval it is
  // pending, so surface it explicitly rather than hiding the farm the viewer just acted as.
  const roster = approved
    ? rows
    : [{ ...lindenhof, enrolled: false }, ...rows.filter((farm) => farm.id !== lindenhof.id)];

  return (
    <div className="flex flex-col gap-24">
      <StatRow
        stats={[
          {
            label: "Enrolled farms",
            value: `${enrolled.length} / ${campaign.targetFarms}`,
            detail: approved ? "roster complete" : "1 awaiting approval",
            tone: approved ? "positive" : "warning",
          },
          { label: "Enrolled area", value: `${area} ha`, detail: `of ${campaign.targetArea} ha target` },
          { label: "Eligible sugar", value: `${eligibleSugar(area).toLocaleString("en-GB")} t`, detail: "forecast at this area" },
          {
            label: "Nestlé cap",
            value: `${allocation(area).find((row) => row.id === "nestle")?.share ?? 0}%`,
            detail: "of eligible output",
          },
        ]}
      />

      <Panel title="Supply shed" subtitle="Enrollment status by farm">
        <ParcelMap features={supplyShedParcels(approved)} legend={<MapLegend items={legend} />} />
      </Panel>

      <Panel title="Campaign roster" trailing={<Status tone={approved ? "positive" : "warning"}>{enrolled.length} enrolled</Status>}>
        <DataTable columns={rosterColumns} data={roster} regionLabel="Enrolled farms" initialSorting={[{ id: "status", desc: false }]} />
      </Panel>

      <Message
        state={approved ? "success" : "warning"}
        title={approved ? `${lindenhof.name} moved to Enrolled` : "One approval outstanding"}
        description={
          approved
            ? "The roster, the enrolled area, the eligible sugar, and the map all changed because the farmer approved — the same event, seen from the operator’s side."
            : "Südzucker can prepare records under delegation, but the enrollment only becomes active on direct farmer approval. Go back one step and approve."
        }
      />
    </div>
  );
}

/** Shown in the page header on the enrollment screen. */
export function EnrollmentProgress({ approved }: { approved: boolean }) {
  const enrolled = enrolledFarms(approved).length;
  return (
    <div className="w-[200px]">
      <ProgressBar label="Roster" value={(enrolled / campaign.targetFarms) * 100} showValue />
    </div>
  );
}
