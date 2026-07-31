"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, CheckCircle, Plant } from "@phosphor-icons/react/dist/ssr";
import {
  Breadcrumb,
  Card,
  Message,
  Pill,
  Tabs,
} from "@majistudio/ogcr-design-system";
import { Button } from "@majistudio/ogcr-design-system/Button";
import { Table } from "@majistudio/ogcr-design-system/Table";
import { ProgramMap } from "./program-map";
import { SeasonStepper } from "./season-stepper";
import {
  basePayment,
  EURO,
  SEASON_STEPS,
  totalAreaHa,
  type Program,
  type ProgramParcel,
} from "./data";

const PARCEL_COLUMNS: ColumnDef<ProgramParcel>[] = [
  { accessorKey: "name", header: "Parcel" },
  {
    accessorKey: "areaHa",
    header: "Area",
    cell: ({ row }) => `${row.original.areaHa} ha`,
  },
  { accessorKey: "practice", header: "Practice" },
];

interface ProgramDossierProps {
  projectId: string;
  program: Program;
}

/**
 * The program dossier, initiation phase: review the contract offer and
 * approve participation. Approval is local state until programs move to
 * the database with the during/after phases.
 */
export function ProgramDossier({ projectId, program }: ProgramDossierProps) {
  const [approved, setApproved] = useState(program.status === "enrolled");

  const areaHa = totalAreaHa(program);
  const base = basePayment(program);

  return (
    <div className="flex flex-col gap-24">
      <Breadcrumb
        items={[
          { label: "Programs", href: `/${projectId}/programs` },
          { label: program.name },
        ]}
      />

      <header className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center gap-12">
          <h1 className="text-h2 text-text-primary">{program.name}</h1>
          {approved ? (
            <Pill tone="positive">Enrolled</Pill>
          ) : (
            <Pill tone="warning">Awaiting your approval</Pill>
          )}
        </div>
        <p className="text-body-s text-text-secondary">
          {approved ? "Contract with" : "Contract offer from"} {program.buyer}{" "}
          · {program.farmName} · {program.parcels.length} parcels · {areaHa} ha
        </p>
      </header>

      <Card>
        <SeasonStepper steps={SEASON_STEPS} currentIndex={approved ? 1 : 0} />
      </Card>

      <div className="grid grid-cols-1 items-start gap-24 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-24">
          <Message state="neutral" title="In short" description={program.summary} />

          <ProgramMap
            program={program}
            parcelStatus={approved ? "enrolled" : "awaiting"}
          />

          <Card
            title="Your fields"
            subtitle="What you keep doing on each parcel"
          >
            <Table columns={PARCEL_COLUMNS} data={program.parcels} />
          </Card>

          <Card
            title="The agreement, in plain words"
            subtitle="Three things worth knowing — no legal language"
          >
            <Tabs
              items={program.agreement.map((point) => ({
                value: point.value,
                label: point.label,
                content: (
                  <p className="text-body-s text-text-secondary">
                    {point.content}
                  </p>
                ),
              }))}
            />
          </Card>
        </div>

        <div className="flex flex-col gap-16">
          <Card
            title="Your payment"
            subtitle={`Paid by ${program.buyer} after the season`}
          >
            <div className="flex flex-col">
              <PaymentRow
                icon={<CheckCircle size={16} />}
                label="Guaranteed base"
                detail={`${EURO.format(program.basePerHa)} per ha × ${areaHa} ha`}
                amount={EURO.format(base)}
                divider
              />
              <PaymentRow
                icon={<Plant size={16} />}
                label="Soil bonus"
                detail={`${EURO.format(program.bonusPerTonne)} per t CO₂ stored`}
                amount={`est. ${EURO.format(program.estimatedBonus)}`}
              />
              <p className="border-t border-border-light pt-8 text-body-s text-text-secondary">
                The guaranteed part never shrinks.
              </p>
            </div>
          </Card>

          {approved ? (
            <Message
              state="success"
              title="You're in"
              description={`${program.buyer} has been notified. Nothing else to do until the season starts — you can still withdraw before then.`}
            />
          ) : (
            <Card title="Ready to join?">
              <div className="flex flex-col gap-12">
                {program.assurances.map((assurance) => (
                  <div key={assurance} className="flex items-start gap-8">
                    <span className="mt-2 inline-flex shrink-0 text-icon-positive">
                      <CheckCircle size={16} />
                    </span>
                    <span className="text-body-s text-text-secondary">
                      {assurance}
                    </span>
                  </div>
                ))}
                <Button
                  className="w-full"
                  iconLeft={<Check />}
                  onClick={() => setApproved(true)}
                >
                  Approve participation
                </Button>
              </div>
            </Card>
          )}

          <p className="px-4 text-body-s text-text-secondary">
            Prefer to talk it through? Your {program.buyer} advisor knows this
            offer —{" "}
            <a
              className="text-text-primary underline"
              href={`mailto:${program.advisor.email}`}
            >
              email {program.advisor.name}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

interface PaymentRowProps {
  icon: React.ReactNode;
  label: string;
  detail: string;
  amount: string;
  divider?: boolean;
}

function PaymentRow({ icon, label, detail, amount, divider }: PaymentRowProps) {
  return (
    <div
      className={
        divider
          ? "flex justify-between gap-12 border-b border-dashed border-border-light py-8"
          : "flex justify-between gap-12 py-8"
      }
    >
      <span className="flex items-start gap-8">
        <span className="mt-2 inline-flex shrink-0 text-icon-positive">
          {icon}
        </span>
        <span className="text-body-s text-text-secondary">
          {label}
          <br />
          {detail}
        </span>
      </span>
      <span className="text-body-s font-medium tabular-nums text-text-primary">
        {amount}
      </span>
    </div>
  );
}
