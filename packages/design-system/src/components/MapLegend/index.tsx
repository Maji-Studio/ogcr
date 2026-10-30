import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'

export interface MapLegendItem {
  label: string
  /** A design-system custom property, e.g. `--ds-orange-500`. Use the token the map paints. */
  token: string
}

export interface MapLegendProps extends ComponentProps<'div'> {
  title: string
  items: MapLegendItem[]
}

/**
 * Reading key pinned to the bottom-left of a map. Place it inside the map's positioned parent.
 * Not a control: it ignores the pointer so it never blocks panning. Swatches should use the
 * tokens from `PARCEL_STATUS_TOKENS` (`/Map`) so they match what the map paints. Lives apart from
 * Map so a page can render the legend without pulling in the maplibre-gl peer.
 */
export function MapLegend({ title, items, className, ...rest }: MapLegendProps) {
  return (
    <div
      data-slot="map-legend"
      className={cn(
        'pointer-events-none absolute bottom-24 left-24 z-10 max-sm:bottom-40 rounded-8 bg-surface-light px-12 py-10 shadow-elevation-l',
        className,
      )}
      {...rest}
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
  )
}
