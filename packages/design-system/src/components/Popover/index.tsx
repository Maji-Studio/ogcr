import type { ComponentProps, ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react'
import { Popover as BasePopover } from '@base-ui/react/popover'
import {
  OVERLAY_SIDE_OFFSET,
  OverlayArrowSvg,
  overlayArrowClassName,
  overlayPopupClassName,
  overlayWidths,
  type OverlayWidth,
} from '../../lib/overlay'
import { cn } from '../../lib/cn'

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
export type PopoverAlign = 'start' | 'center' | 'end'
/** `s` 256px · `m` 280px (spec default) · `l` 320px · `auto` shrink-to-content. */
export type PopoverWidth = OverlayWidth

export type PopoverProps = Omit<
  ComponentProps<typeof BasePopover.Popup>,
  'children' | 'title' | 'width'
> & {
  /** The element that opens the popover. Cloned via Base UI's `render`. */
  trigger: ReactElement
  children?: ReactNode
  /** Optional heading rendered inside the popup (wires `aria-labelledby`). */
  title?: ReactNode
  /** Optional supporting copy (wires `aria-describedby`). */
  description?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  side?: PopoverSide
  align?: PopoverAlign
  sideOffset?: number
  showArrow?: boolean
  /** Traps focus + locks page scroll while open. */
  modal?: boolean
  /** Popup width. Defaults to `m` (280px, spec §4.29). */
  width?: PopoverWidth
}

/**
 * Standard pointer used by every floating surface.
 * @deprecated Back-compat re-export of the shared internal arrow (`OverlayArrowSvg`). Prefer
 * letting `Popover`/`Tooltip`/`Menu` render their own arrows via `showArrow`.
 */
export function PopoverArrowSvg(props: ComponentPropsWithoutRef<'svg'>) {
  return <OverlayArrowSvg {...props} />
}

export function Popover({
  trigger,
  children,
  title,
  description,
  open,
  defaultOpen,
  onOpenChange,
  side = 'bottom',
  align = 'center',
  sideOffset = OVERLAY_SIDE_OFFSET,
  showArrow = false,
  modal = false,
  width = 'm',
  className,
  ...rest
}: PopoverProps) {
  return (
    <BasePopover.Root
      open={open}
      defaultOpen={open === undefined ? defaultOpen : undefined}
      onOpenChange={onOpenChange}
      modal={modal}
    >
      <BasePopover.Trigger render={trigger} />
      <BasePopover.Portal>
        <BasePopover.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          className="z-[var(--ds-z-overlay)]"
        >
          <BasePopover.Popup
            {...rest}
            data-slot="popover"
            data-width={width}
            className={cn(
              'flex flex-col gap-8 p-16 max-w-[calc(100vw-32px)]',
              overlayWidths[width],
              overlayPopupClassName,
              className,
            )}
          >
            {showArrow && (
              <BasePopover.Arrow data-slot="popover-arrow" className={overlayArrowClassName}>
                <OverlayArrowSvg />
              </BasePopover.Arrow>
            )}
            {title && (
              <BasePopover.Title className="m-0 font-standard font-medium text-m leading-[1.2] text-text-primary">
                {title}
              </BasePopover.Title>
            )}
            {description && (
              <BasePopover.Description className="m-0 font-standard font-normal text-s leading-[1.4] text-text-secondary">
                {description}
              </BasePopover.Description>
            )}
            {children}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  )
}
