"use client";

/**
 * The view switcher that moves between the farmer and supplier sides of the prototype.
 *
 * It changes which screen you are looking at and nothing else: no session, no account, no
 * permission. Every option here points at a route that exists, so the control never promises a
 * destination it cannot reach.
 */

import { useRouter } from "next/navigation";
import { Select } from "@majistudio/ogcr-design-system";
import { cn } from "@/lib/utils";

export type RoleView = "farmer" | "supplier";

const ROLE_VIEWS: { value: RoleView; label: string; href: string }[] = [
  { value: "farmer", label: "Farmer", href: "/farmer" },
  { value: "supplier", label: "Supplier", href: "/supplier" },
];

const OPTIONS = ROLE_VIEWS.map(({ value, label }) => ({ value, label }));

const HREF: Record<RoleView, string> = Object.fromEntries(
  ROLE_VIEWS.map(({ value, href }) => [value, href]),
) as Record<RoleView, string>;

/**
 * The design-system Select is a full-width form control by default. In the top chrome it sits
 * beside a 32px avatar, so it is trimmed to the height of the surrounding bar and sized to its
 * longest label, which keeps it from stretching or reflowing when the value changes.
 */
const TRIGGER =
  "h-36 w-auto min-w-120 shrink-0 gap-8 rounded-8 px-12 text-body-s";

export function RoleSwitcher({
  current,
  className,
}: {
  current: RoleView;
  className?: string;
}) {
  const router = useRouter();

  // Controlled by the route, not by local state: whichever screen renders the switcher tells it
  // what is on screen, so the value can never drift away from the page the farmer is looking at.
  return (
    <Select
      aria-label="Switch user view"
      options={OPTIONS}
      value={current}
      onValueChange={(next) => {
        if (!next || next === current) return;
        router.push(HREF[next as RoleView]);
      }}
      className={cn(TRIGGER, className)}
    />
  );
}
