import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { Button } from '../Button'
import { XIcon } from '../icons'
import { overlayBackdropClassName, overlaySurfaceClassName } from '../../lib/overlay'
import { dsStrings } from '../../lib/strings'
import { cn } from '../../lib/cn'

export type DialogSize = 's' | 'm' | 'l'

export type DialogAction = {
  label: string
  variant?: 'filled' | 'outlined' | 'text'
  onClick?: () => void
  /** When `true`, the action closes the dialog after `onClick` runs. Defaults to `true`. */
  closeOnClick?: boolean
}

export type DialogProps = Omit<
  ComponentProps<typeof BaseDialog.Popup>,
  'title' | 'children'
> & {
  title: ReactNode
  /** The element that opens the dialog. Cloned via Base UI's `render`. */
  trigger?: ReactElement
  /** Supporting copy under the title; wires `aria-describedby`. */
  description?: ReactNode
  children?: ReactNode
  primaryAction?: DialogAction
  secondaryAction?: DialogAction
  /** Render the corner close affordance. Defaults to `true`. */
  showClose?: boolean
  /** Accessible label for the corner close button. */
  closeLabel?: string
  size?: DialogSize
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

const sizeWidth: Record<DialogSize, string> = {
  s: 'w-[400px]',
  m: 'w-[512px]',
  l: 'w-[640px]',
}

/** Shared centered backdrop used by Dialog and AlertDialog. */
// eslint-disable-next-line react-refresh/only-export-components -- shared class string reused by AlertDialog
export const dialogBackdropClassName = cn(overlayBackdropClassName, 'z-[var(--ds-z-overlay)]')

/** Shared centered popup chrome used by Dialog and AlertDialog. */
// eslint-disable-next-line react-refresh/only-export-components -- shared class string reused by AlertDialog
export const dialogPopupClassName = cn(
  'fixed left-1/2 top-1/2 z-[var(--ds-z-overlay)] -translate-x-1/2 -translate-y-1/2',
  'flex flex-col gap-16 p-24 max-w-[calc(100vw-32px)] max-h-[calc(100dvh-32px)] overflow-y-auto',
  // Centered modal: the shared card surface, but rounded-16 (vs the popup default 12) and a
  // longer, origin-center transition rather than the anchored positioned-popup motion.
  overlaySurfaceClassName,
  'rounded-16 outline-none',
  'origin-center transition-[transform,opacity] duration-200',
  'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
  'data-[starting-style]:scale-95 data-[ending-style]:scale-95',
)

export function Dialog({
  title,
  trigger,
  description,
  children,
  primaryAction,
  secondaryAction,
  showClose = true,
  closeLabel = dsStrings.dialog.closeLabel,
  size = 'm',
  open,
  defaultOpen,
  onOpenChange,
  className,
  ...rest
}: DialogProps) {
  return (
    <BaseDialog.Root
      open={open}
      defaultOpen={open === undefined ? defaultOpen : undefined}
      onOpenChange={onOpenChange}
    >
      {trigger && <BaseDialog.Trigger render={trigger} />}
      <BaseDialog.Portal>
        <BaseDialog.Backdrop data-slot="dialog-backdrop" className={dialogBackdropClassName} />
        <BaseDialog.Popup
          {...rest}
          data-slot="dialog"
          className={cn(dialogPopupClassName, sizeWidth[size], className)}
        >
          <header data-slot="dialog-header" className="flex items-start justify-between gap-16">
            <div className="flex flex-col gap-4 min-w-0">
              <BaseDialog.Title className="m-0 font-standard font-medium text-l leading-[1.2] text-text-primary">
                {title}
              </BaseDialog.Title>
              {description && (
                <BaseDialog.Description className="m-0 font-standard font-normal text-s leading-[1.45] text-text-secondary">
                  {description}
                </BaseDialog.Description>
              )}
            </div>
            {showClose && (
              <BaseDialog.Close
                aria-label={closeLabel}
                className="inline-flex items-center justify-center w-32 h-32 -mr-4 -mt-4 shrink-0 bg-transparent border-0 rounded-8 cursor-pointer text-icon-secondary transition-colors duration-150 hover:bg-surface-neutral hover:text-icon-primary focus-visible:outline-none focus-visible:shadow-focus-primary [&>svg]:w-20 [&>svg]:h-20"
              >
                <XIcon />
              </BaseDialog.Close>
            )}
          </header>
          {children && (
            <div
              data-slot="dialog-body"
              className="flex flex-col gap-16 font-standard font-normal text-m leading-[1.5] text-text-primary"
            >
              {children}
            </div>
          )}
          {(primaryAction || secondaryAction) && (
            <footer data-slot="dialog-footer" className="flex items-center justify-start gap-8">
              {primaryAction && (
                <DialogActionButton action={primaryAction} fallbackVariant="filled" />
              )}
              {secondaryAction && (
                <DialogActionButton action={secondaryAction} fallbackVariant="outlined" />
              )}
            </footer>
          )}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}

function DialogActionButton({
  action,
  fallbackVariant,
}: {
  action: DialogAction
  fallbackVariant: DialogAction['variant']
}) {
  const button = (
    <Button variant={action.variant ?? fallbackVariant} onClick={action.onClick}>
      {action.label}
    </Button>
  )
  // Default to closing on click; opt out with `closeOnClick: false`.
  return action.closeOnClick === false ? button : <BaseDialog.Close render={button} />
}
