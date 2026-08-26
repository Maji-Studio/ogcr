"use client";

/**
 * The supplier top bar. Same shell, same wordmark, same account cluster as the farmer bar, so
 * switching views changes the contents of the page and not the furniture around it.
 *
 * There is no section nav here. The farmer bar can show one because its sections exist; inventing
 * one for the supplier view would advertise screens that have not been built.
 */

import { Avatar } from "@majistudio/ogcr-design-system";
import { PlatformBrand, PlatformHeader, RoleSwitcher } from "@/components/platform";

export function SupplierChrome({ userName }: { userName: string }) {
  return (
    <PlatformHeader>
      <PlatformBrand label="Supplier platform" />

      <div className="ml-auto flex flex-wrap items-center justify-end gap-x-16 gap-y-8">
        <RoleSwitcher current="supplier" />
        <Avatar name={userName} size="s" />
        <span className="sr-only">Signed in as {userName}</span>
      </div>
    </PlatformHeader>
  );
}
