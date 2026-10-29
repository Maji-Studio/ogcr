import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { MinusIcon, PlusIcon } from '../icons'
import { ToggleGroup, type ToggleGroupItem } from '../Toggle'
import type { BasemapId } from './constants'

const ICON_SIZE = 18

export interface MapControlsLabels {
  basemapLabel: string
  minimalLabel: string
  satelliteLabel: string
  zoomInLabel: string
  zoomOutLabel: string
}

interface MapControlsProps {
  basemap: BasemapId
  labels: MapControlsLabels
  onZoomIn: () => void
  onZoomOut: () => void
  onBasemapChange: (basemap: BasemapId) => void
}

/**
 * Map chrome over the canvas, built from DS parts instead of MapLibre's default controls: the
 * segmented basemap switch top right, the zoom stack bottom right. The `map-basemap-switch` class
 * is the hook map.css uses to keep the pressed fill when an app's own utilities outrank the DS's.
 */
export function MapControls({
  basemap,
  labels,
  onZoomIn,
  onZoomOut,
  onBasemapChange,
}: MapControlsProps) {
  // Segment order is the visual order: Minimal, then Satellite.
  const items: ToggleGroupItem[] = [
    { value: 'minimal', label: labels.minimalLabel },
    { value: 'satellite', label: labels.satelliteLabel },
  ]

  return (
    <div data-slot="map-controls" className="pointer-events-none absolute inset-0">
      <ToggleGroup
        aria-label={labels.basemapLabel}
        appearance="segmented"
        size="m"
        items={items}
        value={[basemap]}
        onValueChange={(next) => {
          // A pressed segment cannot be un-pressed: one basemap is always showing.
          const picked = next[0]
          if (picked === 'minimal' || picked === 'satellite') onBasemapChange(picked)
        }}
        className="map-basemap-switch pointer-events-auto absolute right-24 top-24 shadow-elevation-l"
      />

      <div className="pointer-events-auto absolute bottom-24 right-24 max-sm:bottom-40 flex flex-col rounded-8 bg-surface-light shadow-elevation-l">
        <ZoomButton label={labels.zoomInLabel} onClick={onZoomIn}>
          <PlusIcon size={ICON_SIZE} weight="bold" />
        </ZoomButton>
        <ZoomButton label={labels.zoomOutLabel} onClick={onZoomOut} divided>
          <MinusIcon size={ICON_SIZE} weight="bold" />
        </ZoomButton>
      </div>
    </div>
  )
}

interface ZoomButtonProps {
  label: string
  onClick: () => void
  divided?: boolean
  children: ReactNode
}

function ZoomButton({ label, onClick, divided, children }: ZoomButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'flex h-48 w-48 cursor-pointer items-center justify-center text-text-primary transition-colors hover:bg-surface-neutral',
        // The stack has no overflow-hidden (it would clip the focus ring), so each end rounds itself.
        'first:rounded-t-8 last:rounded-b-8 focus-visible:outline-none focus-visible:shadow-focus-primary',
        divided && 'border-t border-border-light',
      )}
    >
      {children}
    </button>
  )
}
