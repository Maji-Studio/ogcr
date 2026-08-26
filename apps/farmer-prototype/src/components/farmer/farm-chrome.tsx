"use client";

/**
 * The farmer screen owns its top chrome. The project sidebar is scoped to a project the farmer
 * does not have, and the operator's platform bar addresses the wrong person: this bar puts the
 * farm at the top of the page.
 *
 * Left to right it answers three questions in order: which product (wordmark and platform name),
 * which part of it (the farm sections), and who is looking (the view switcher, the farm, the
 * account). The switcher sits with the account rather than with the wordmark because it changes
 * whose screen you are reading, not which product you are in.
 */

import { Avatar, HouseIcon, Separator, Tooltip } from "@majistudio/ogcr-design-system";
import { cn } from "@/lib/utils";
import { PlatformBrand, PlatformHeader, RoleSwitcher } from "@/components/platform";
import { farm } from "./data/farm";
import { IllustrativeTag } from "./shared";

const FARM_ICON_SIZE = 18;

interface NavItem {
  label: string;
  active: boolean;
  /** Present when the destination does not exist yet. The item renders disabled, never as a link. */
  unavailableReason?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Farm overview", active: true },
  {
    label: "Performance",
    active: false,
    unavailableReason: "This part of the prototype is not built yet.",
  },
];

export function FarmChrome({ userName }: { userName: string }) {
  return (
    <PlatformHeader>
      <PlatformBrand label="Farmer platform" />

      <nav aria-label="Farm sections" className="flex items-center gap-4">
        {NAV_ITEMS.map((item) => (
          <NavButton key={item.label} item={item} />
        ))}
      </nav>

      {/* This cluster wraps too, so the switcher and the farm name never crowd each other off a
          320px screen. */}
      <div className="ml-auto flex flex-wrap items-center justify-end gap-x-16 gap-y-8">
        <IllustrativeTag className="hidden lg:inline-flex" />
        <RoleSwitcher current="farmer" />
        <Separator orientation="vertical" className="hidden h-24 sm:block" />
        <span className="flex min-w-0 items-center gap-8 text-text-primary">
          <HouseIcon size={FARM_ICON_SIZE} className="shrink-0 text-icon-secondary" />
          <span className="flex min-w-0 flex-col leading-none">
            <span className="truncate text-body-s font-medium">{farm.name}</span>
            <span className="hidden truncate pt-2 text-body-s text-text-secondary md:inline">
              {farm.place}
            </span>
          </span>
        </span>
        <Avatar name={userName} size="s" />
        <span className="sr-only">Signed in as {userName}</span>
      </div>
    </PlatformHeader>
  );
}

function NavButton({ item }: { item: NavItem }) {
  const unavailable = Boolean(item.unavailableReason);

  // `aria-disabled` rather than `disabled`: the item stays focusable and hoverable, which is the
  // only way the tooltip can explain why it does nothing. It carries no click handler either way.
  const button = (
    <button
      type="button"
      aria-disabled={unavailable || undefined}
      aria-current={item.active ? "page" : undefined}
      className={cn(
        "flex items-center gap-8 rounded-8 px-12 py-8 text-label-navigation transition-colors",
        "focus-visible:outline-none focus-visible:shadow-focus-primary",
        item.active && "bg-surface-positive text-text-positive",
        !item.active && !unavailable && "text-text-secondary hover:bg-surface-neutral",
        unavailable && "cursor-not-allowed text-text-neutral",
      )}
    >
      {item.label}
    </button>
  );

  if (!unavailable) return button;

  return (
    <Tooltip side="bottom" trigger={button}>
      {item.unavailableReason}
    </Tooltip>
  );
}
