import { cn } from "@/lib/utils";

export interface MapLegendItem {
  label: string;
  /** A design-system custom property, e.g. `--ds-orange-500`. */
  token: string;
}

interface MapLegendProps {
  title: string;
  items: MapLegendItem[];
  className?: string;
}

/**
 * Reading key pinned to the bottom-left of a map. Not a control: it ignores the pointer so it never
 * blocks panning. Swatch tokens should match what the map paints (see `statusColor` in base-map).
 */
export function MapLegend({ title, items, className }: MapLegendProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute bottom-24 left-24 z-10 max-sm:bottom-40 rounded-8 bg-surface-light px-12 py-10 shadow-elevation-l",
        className,
      )}
    >
      <p className="mb-6 text-xxs font-medium text-text-primary">{title}</p>
      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-6 text-xxs text-text-secondary">
            <span
              aria-hidden="true"
              className="inline-block h-10 w-10 shrink-0 rounded-full"
              style={{ background: `var(${item.token})` }}
            />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
