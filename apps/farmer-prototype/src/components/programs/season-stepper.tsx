import { cn } from "@/lib/utils";
import type { SeasonStep } from "./data";

interface SeasonStepperProps {
  steps: SeasonStep[];
  /** Index of the step happening now; everything before it renders as done. */
  currentIndex: number;
}

type StepState = "done" | "current" | "upcoming";

function stepState(index: number, currentIndex: number): StepState {
  if (index < currentIndex) return "done";
  if (index === currentIndex) return "current";
  return "upcoming";
}

/**
 * The five-step season timeline shown on every program phase: dots on a
 * dashed line, month underneath, "Now" on the active step.
 */
export function SeasonStepper({ steps, currentIndex }: SeasonStepperProps) {
  return (
    <div className="overflow-x-auto">
      <ol
        aria-label="Season timeline"
        className="relative m-0 flex min-w-[560px] list-none p-0"
      >
        <span
          aria-hidden="true"
          className="absolute left-[10%] right-[10%] top-8 border-t border-dashed border-border-strong"
        />
        {steps.map((step, index) => {
          const state = stepState(index, currentIndex);
          return (
            <li
              key={step.label}
              aria-current={state === "current" ? "step" : undefined}
              className="relative flex flex-1 flex-col items-center gap-8 text-center"
            >
              <span className="inline-flex rounded-[9999px] bg-surface-light p-4">
                <span
                  className={cn(
                    "inline-block h-12 w-12 rounded-[9999px] box-border",
                    state === "done" && "bg-interaction-primary-default",
                    state === "current" &&
                      "border-[3px] border-interaction-primary-default bg-surface-light",
                    state === "upcoming" &&
                      "border border-border-strong bg-surface-light",
                  )}
                />
              </span>
              <span
                className={cn(
                  "font-mono text-xs font-medium uppercase tracking-widest",
                  state === "current"
                    ? "text-text-primary"
                    : "text-text-secondary",
                )}
              >
                {step.label}
              </span>
              <span
                className={cn(
                  "text-body-s",
                  state === "current"
                    ? "font-medium text-text-positive"
                    : "text-text-secondary",
                )}
              >
                {state === "current" ? "Now" : step.timing}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
