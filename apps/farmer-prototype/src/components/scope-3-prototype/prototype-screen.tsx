"use client";

// The Scope 3 walkthrough. State is deliberately tiny: where you are, and the two actions the story
// waits on (the farmer approving, and Südzucker releasing). Every number on every screen is derived
// from those two flags plus the seed data — nothing is hardcoded downstream.

import { useState } from "react";
import { ToastProvider } from "@majistudio/ogcr-design-system";
import { FlowShell } from "./flow-shell";
import { ApprovalStep, CommitmentStep, EnrollmentProgress, EnrollmentStep, ProposalStep } from "./step-before";
import { CheckpointStep, ProgressStep } from "./step-during";
import { PackageStep, PaymentStep, ReleaseStep } from "./step-after";
import { Status } from "./shared-ui";
import { steps } from "./types";

function Walkthrough() {
  const [index, setIndex] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [farmerApproved, setFarmerApproved] = useState(false);
  const [resultsReleased, setResultsReleased] = useState(false);

  const step = steps[index];
  const gateOpen =
    step.gate === "farmerApproved" ? farmerApproved : step.gate === "resultsReleased" ? resultsReleased : true;

  const goTo = (target: number) => {
    setIndex(target);
    setMaxReached((current) => Math.max(current, target));
  };

  const reset = () => {
    setIndex(0);
    setMaxReached(0);
    setFarmerApproved(false);
    setResultsReleased(false);
  };

  const body = () => {
    switch (step.id) {
      case "proposal":
        return <ProposalStep />;
      case "commitment":
        return <CommitmentStep />;
      case "approval":
        return <ApprovalStep approved={farmerApproved} onApprove={() => setFarmerApproved(true)} />;
      case "enrollment":
        return <EnrollmentStep approved={farmerApproved} />;
      case "progress":
        return <ProgressStep approved={farmerApproved} />;
      case "checkpoint":
        return <CheckpointStep />;
      case "release":
        return <ReleaseStep approved={farmerApproved} released={resultsReleased} onRelease={() => setResultsReleased(true)} />;
      case "package":
        return <PackageStep approved={farmerApproved} />;
      case "payment":
        return <PaymentStep approved={farmerApproved} />;
      default:
        return null;
    }
  };

  /** The page header's right-hand slot — real page chrome, not a walkthrough control. */
  const action = () => {
    switch (step.id) {
      case "approval":
        return farmerApproved ? <Status tone="positive">Enrolled</Status> : <Status tone="warning">Approval needed</Status>;
      case "enrollment":
        return <EnrollmentProgress approved={farmerApproved} />;
      case "progress":
      case "checkpoint":
        return <Status tone="warning">Provisional</Status>;
      case "release":
        return resultsReleased ? <Status tone="positive">Released</Status> : <Status tone="warning">Ready to release</Status>;
      case "package":
        return <Status tone="positive">Released by Südzucker</Status>;
      case "payment":
        return <Status tone="positive">Complete</Status>;
      default:
        return null;
    }
  };

  return (
    <FlowShell
      step={step}
      index={index}
      maxReached={maxReached}
      gateOpen={gateOpen}
      onSelectStep={goTo}
      onBack={() => goTo(Math.max(0, index - 1))}
      onNext={() => goTo(Math.min(steps.length - 1, index + 1))}
      onReset={reset}
      action={action()}
    >
      {body()}
    </FlowShell>
  );
}

export function ScopeThreePrototypeScreen() {
  return (
    <ToastProvider>
      <Walkthrough />
    </ToastProvider>
  );
}
