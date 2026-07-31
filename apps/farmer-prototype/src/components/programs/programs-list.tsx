"use client";

import Link from "next/link";
import { Card, Pill } from "@majistudio/ogcr-design-system";
import {
  basePayment,
  EURO,
  PROGRAMS,
  totalAreaHa,
  type Program,
} from "./data";

interface ProgramsListProps {
  projectId: string;
}

export function ProgramsList({ projectId }: ProgramsListProps) {
  return (
    <div className="flex flex-col gap-24">
      <header className="flex flex-col gap-8">
        <h1 className="text-h2 text-text-primary">Programs</h1>
        <p className="max-w-[640px] text-body-s text-text-secondary">
          Contract offers from buyers who pay you for soil-friendly practices.
          Review each offer in plain words before you decide.
        </p>
      </header>

      <ul className="m-0 flex list-none flex-col gap-16 p-0">
        {PROGRAMS.map((program) => (
          <li key={program.slug}>
            <ProgramCard projectId={projectId} program={program} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProgramCard({
  projectId,
  program,
}: {
  projectId: string;
  program: Program;
}) {
  return (
    <Link
      href={`/${projectId}/programs/${program.slug}`}
      className="block rounded-16 transition-shadow focus-visible:shadow-focus-primary focus-visible:outline-none"
    >
      <Card
        title={program.name}
        subtitle={`Contract offer from ${program.buyer} · ${program.parcels.length} parcels · ${totalAreaHa(program)} ha`}
        trailing={
          program.status === "enrolled" ? (
            <Pill tone="positive">Enrolled</Pill>
          ) : (
            <Pill tone="warning">Awaiting your approval</Pill>
          )
        }
        className="transition-colors hover:border-border-strong"
      >
        <p className="text-body-s text-text-secondary">
          {EURO.format(basePayment(program))} guaranteed, plus a soil bonus of{" "}
          {EURO.format(program.bonusPerTonne)} per tonne of CO₂ stored.
        </p>
      </Card>
    </Link>
  );
}
