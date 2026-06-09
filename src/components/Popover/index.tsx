import type { ComponentProps, ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react'
import { Popover as BasePopover } from '@base-ui/react/popover'
import { cn } from '../../lib/cn'

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
export type PopoverAlign = 'start' | 'center' | 'end'

export type PopoverProps = Omit<ComponentProps<typeof BasePopover.Popup>, 'children' | 'title'> & {
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
}

/** Standard pointer used by every floating surface (Popover, Tooltip). */
export function PopoverArrowSvg(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        className="fill-surface-light"
      />
      <path
        d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L20 7L20 8L18.5349 8.00001C17.5468 8.00001 16.5936 7.63424 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8L0 8L0 7L2.13172 7C2.87284 7 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
        className="fill-border-light"
      />
    </svg>
  )
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
  sideOffset = 8,
  showArrow = false,
  modal = false,
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
        <BasePopover.Positioner side={side} align={align} sideOffset={sideOffset} className="z-50">
          <BasePopover.Popup
            {...rest}
            data-slot="popover"
            className={cn(
              'flex flex-col gap-8 p-16 w-[280px] max-w-[calc(100vw-32px)]',
              'bg-surface-light border border-border-light rounded-12 shadow-elevation-l',
              'outline-none origin-[var(--transform-origin)] transition-[transform,opacity] duration-150',
              'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
              'data-[starting-style]:scale-95 data-[ending-style]:scale-95',
              className,
            )}
          >
            {showArrow && (
              <BasePopover.Arrow
                data-slot="popover-arrow"
                className={cn(
                  'data-[side=bottom]:top-[-8px] data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180',
                  'data-[side=left]:right-[-13px] data-[side=left]:rotate-90',
                  'data-[side=right]:left-[-13px] data-[side=right]:-rotate-90',
                )}
              >
                <PopoverArrowSvg />
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
