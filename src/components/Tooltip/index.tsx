import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip'
import {
  OVERLAY_SIDE_OFFSET,
  OverlayArrowSvg,
  overlayArrowClassName,
  overlayMotionClassName,
} from '../../lib/overlay'
import { cn } from '../../lib/cn'

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left'
export type TooltipAlign = 'start' | 'center' | 'end'

export type TooltipProviderProps = ComponentProps<typeof BaseTooltip.Provider>

/**
 * Shares open-delay state across many tooltips. Mount once near the app root so
 * that moving between adjacent tooltips skips the reopen delay (Base UI delay
 * grouping). Individual `Tooltip`s still work without a provider.
 */
export function TooltipProvider({ delay = 200, closeDelay = 0, ...rest }: TooltipProviderProps) {
  return <BaseTooltip.Provider delay={delay} closeDelay={closeDelay} {...rest} />
}

export type TooltipProps = Omit<ComponentProps<typeof BaseTooltip.Popup>, 'children' | 'title'> & {
  /** The hovered/focused element. Cloned via Base UI's `render`. */
  trigger: ReactElement
  /** Tooltip contents. */
  children: ReactNode
  side?: TooltipSide
  align?: TooltipAlign
  sideOffset?: number
  showArrow?: boolean
  /** Delay before opening, ms. Skipped for adjacent tooltips sharing a `TooltipProvider`. */
  delay?: number
  /** Delay before closing, ms. */
  closeDelay?: number
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Tooltip({
  trigger,
  children,
  side = 'top',
  align = 'center',
  sideOffset = OVERLAY_SIDE_OFFSET,
  showArrow = true,
  delay = 200,
  closeDelay = 0,
  open,
  defaultOpen,
  onOpenChange,
  className,
  ...rest
}: TooltipProps) {
  return (
    <BaseTooltip.Root
      open={open}
      defaultOpen={open === undefined ? defaultOpen : undefined}
      onOpenChange={onOpenChange}
    >
      <BaseTooltip.Trigger render={trigger} delay={delay} closeDelay={closeDelay} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          className="z-[var(--ds-z-overlay)]"
        >
          <BaseTooltip.Popup
            {...rest}
            data-slot="tooltip"
            className={cn(
              'px-12 py-8 max-w-[260px] bg-surface-strong text-surface-light rounded-8 shadow-elevation-l',
              'font-standard font-medium text-s leading-[1.4]',
              overlayMotionClassName,
              className,
            )}
          >
            {showArrow && (
              <BaseTooltip.Arrow data-slot="tooltip-arrow" className={overlayArrowClassName}>
                {/* Dark surface: single foreground path (no border halo), filled to match. */}
                <OverlayArrowSvg border={false} fillClassName="fill-surface-strong" />
              </BaseTooltip.Arrow>
            )}
            {children}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  )
}
