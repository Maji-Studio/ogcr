"use client";

// The app chrome. The page is a real product screen; the walkthrough is a layer over it — a step nav
// on the left and a guide bar at the bottom that can be collapsed away entirely.

import { useState, type ReactNode } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Breadcrumb,
  Button,
  CaretDownIcon,
  InfoIcon,
  LogoMark,
  SideNavigation,
  type SideNavigationItem,
} from "@majistudio/ogcr-design-system";
import { ArrowClockwise, CheckCircle, Factory, Lock, Package, Plant } from "@phosphor-icons/react/dist/ssr";
import { campaign } from "./data/campaign";
import { PrototypeLabel } from "./shared-ui";
import { actorLabels, actorRoles, phaseLabels, steps, type Actor, type Phase, type Step } from "./types";

const actorIcons: Record<Actor, typeof Plant> = { farmer: Plant, operator: Factory, buyer: Package };
const phaseIcons: Record<Phase, typeof Plant> = { before: Plant, during: Factory, after: Package };
const phaseOrder: Phase[] = ["before", "during", "after"];

interface FlowShellProps {
  step: Step;
  index: number;
  /** Furthest step reached; later steps stay locked so the gates can't be skipped. */
  maxReached: number;
  gateOpen: boolean;
  onSelectStep: (index: number) => void;
  onBack: () => void;
  onNext: () => void;
  onReset: () => void;
  /** Right-hand slot in the page header — a status Pill, an action, etc. */
  action?: ReactNode;
  children: ReactNode;
}

function navItems(maxReached: number): SideNavigationItem[] {
  return phaseOrder.map((phase) => {
    const PhaseIcon = phaseIcons[phase];
    return {
      id: phase,
      label: phaseLabels[phase],
      icon: <PhaseIcon size={18} />,
      children: steps
        .map((step, index) => ({ step, index }))
        .filter(({ step }) => step.phase === phase)
        .map(({ step, index }) => ({
          id: step.id,
          label: step.nav,
          badge:
            index < maxReached ? (
              <CheckCircle size={14} weight="fill" className="text-icon-positive" />
            ) : index > maxReached ? (
              <Lock size={14} className="text-icon-secondary" />
            ) : undefined,
        })),
    };
  });
}

export function FlowShell({
  step,
  index,
  maxReached,
  gateOpen,
  onSelectStep,
  onBack,
  onNext,
  onReset,
  action,
  children,
}: FlowShellProps) {
  const [guideOpen, setGuideOpen] = useState(true);
  const ActorIcon = actorIcons[step.actor];
  const next = steps[index + 1];
  const previous = steps[index - 1];
  const blocked = Boolean(step.gate) && !gateOpen;

  const select = (id: string) => {
    const target = steps.findIndex((item) => item.id === id);
    if (target !== -1 && target <= maxReached) onSelectStep(target);
  };

  return (
    <div className="min-h-screen bg-surface-page lg:grid lg:grid-cols-[280px_1fr]">
      <SideNavigation
        items={navItems(maxReached)}
        activeId={step.id}
        onSelect={select}
        product="Scope 3 walkthrough"
        defaultExpandedIds={phaseOrder}
        user={{
          name: actorLabels[step.actor],
          role: actorRoles[step.actor],
          initials: actorLabels[step.actor].slice(0, 2).toUpperCase(),
        }}
        trailing={
          <Button variant="text" iconLeft={<ArrowClockwise size={16} />} onClick={onReset} className="w-full">
            Restart walkthrough
          </Button>
        }
        className="hidden lg:!flex"
      />

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-40 flex h-56 items-center justify-between gap-16 border-b border-border-light bg-surface-light px-16 md:px-24">
          <div className="flex min-w-0 items-center gap-8">
            <LogoMark width={28} />
            <span className="truncate text-body-s font-bold text-text-primary">{campaign.name}</span>
            <span className="hidden font-mono text-xs text-text-secondary sm:!inline">{campaign.id}</span>
          </div>
          <div className="flex items-center gap-8">
            {/* Whose account you are looking at — the product's own context, not a demo control. */}
            <span className="hidden items-center gap-4 rounded-full bg-surface-neutral px-12 py-4 text-body-s text-text-secondary md:!inline-flex">
              <ActorIcon size={14} weight="fill" />
              {actorLabels[step.actor]}
            </span>
            <PrototypeLabel compact />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1080px] flex-1 px-16 pt-24 pb-[var(--spacing-64)] md:px-24">
          <div className="flex flex-col gap-24">
            <div className="flex flex-col gap-8">
              <Breadcrumb items={[{ label: campaign.name }, { label: step.crumb }]} />
              <div className="flex flex-wrap items-center justify-between gap-12">
                <h1 className="text-h1 text-text-primary">{step.screen}</h1>
                {action}
              </div>
            </div>

            {children}
          </div>
        </main>

        {/* The guide bar. Collapsible — with it closed, what remains is just the product. */}
        <div className="sticky bottom-0 z-40 border-t border-border-light bg-surface-light/95 backdrop-blur">
          <div className="mx-auto max-w-[1080px] px-16 py-12 md:px-24">
            {guideOpen ? (
              <div className="flex flex-wrap items-center gap-12">
                <div className="flex min-w-0 flex-1 items-start gap-8">
                  <InfoIcon size={18} className="mt-2 shrink-0 text-icon-positive" weight="fill" />
                  <p className="min-w-0 text-body-s text-text-secondary">
                    <strong className="text-text-primary">
                      Step {index + 1} of {steps.length}
                    </strong>{" "}
                    · {step.guide}
                  </p>
                  <button
                    type="button"
                    onClick={() => setGuideOpen(false)}
                    aria-label="Hide the walkthrough guide"
                    className="ml-auto shrink-0 rounded-8 p-4 text-icon-secondary hover:bg-surface-neutral focus-visible:shadow-focus-primary focus-visible:outline-none"
                  >
                    <CaretDownIcon size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-8">
                  <Button variant="text" iconLeft={<ArrowLeftIcon />} onClick={onBack} disabled={!previous}>
                    Back
                  </Button>
                  {next ? (
                    <Button iconRight={<ArrowRightIcon />} onClick={onNext} disabled={blocked}>
                      {blocked ? "Action needed above" : next.nav}
                    </Button>
                  ) : (
                    <Button variant="outlined" iconLeft={<ArrowClockwise size={16} />} onClick={onReset}>
                      Restart
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="flex items-center gap-8 rounded-8 text-body-s text-text-secondary hover:text-text-primary focus-visible:shadow-focus-primary focus-visible:outline-none"
              >
                <InfoIcon size={16} weight="fill" className="text-icon-positive" />
                Show walkthrough guide · step {index + 1} of {steps.length}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
