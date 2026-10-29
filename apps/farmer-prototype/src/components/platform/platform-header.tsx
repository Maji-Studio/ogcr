"use client";

/**
 * The chrome both platform views share.
 *
 * Neither the farmer nor the supplier screen sits inside the project sidebar, so each brings its
 * own top bar. The shell and the brand block live here so the two bars line up exactly: same
 * height, same gutters, same wordmark, and one place to change them.
 */

import type { ReactNode } from "react";
import { Logo, Separator } from "@majistudio/ogcr-design-system";
import { cn } from "@/lib/utils";

const LOGO_WIDTH = 112;

/** Page width shared with the main column of both screens. */
const CONTENT_WIDTH = "max-w-[1440px]";

export function PlatformHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 border-b border-border-medium bg-surface-light",
        className,
      )}
    >
      {/* The row wraps rather than scrolls: on a narrow phone the clusters stack instead of
          pushing the bar sideways. */}
      <div
        className={cn(
          "mx-auto flex flex-wrap items-center gap-x-24 gap-y-12 px-16 py-12 md:px-24",
          CONTENT_WIDTH,
        )}
      >
        {children}
      </div>
    </header>
  );
}

/** The wordmark and the name of the platform you are in. */
export function PlatformBrand({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-16">
      <Logo width={LOGO_WIDTH} />
      <Separator orientation="vertical" className="hidden h-24 sm:block" />
      <span className="hidden text-h4 text-text-primary sm:inline">{label}</span>
    </div>
  );
}
