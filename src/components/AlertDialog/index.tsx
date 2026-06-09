import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog'
import { Button } from '../Button'
import { dialogBackdropClassName, dialogPopupClassName } from '../Dialog'
import { cn } from '../../lib/cn'

export type AlertDialogTone = 'default' | 'danger'

export type AlertDialogProps = Omit<
  ComponentProps<typeof BaseAlertDialog.Popup>,
  'title' | 'children'
> & {
  title: ReactNode
  description?: ReactNode
  /** The element that opens the dialog. Cloned via Base UI's `render`. */
  trigger?: ReactElement
  /** Extra content rendered between the description and the actions. */
  children?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  onCancel?: () => void
  /** `danger` renders a destructive confirm button. */
  tone?: AlertDialogTone
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

const dangerConfirmClassName = cn(
  'bg-border-negative-strong text-white',
  'hover:not-disabled:bg-text-negative active:bg-text-negative',
)

export function AlertDialog({
  title,
  description,
  trigger,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  tone = 'default',
  open,
  defaultOpen,
  onOpenChange,
  className,
  ...rest
}: AlertDialogProps) {
  return (
    <BaseAlertDialog.Root
      open={open}
      defaultOpen={open === undefined ? defaultOpen : undefined}
      onOpenChange={onOpenChange}
    >
      {trigger && <BaseAlertDialog.Trigger render={trigger} />}
      <BaseAlertDialog.Portal>
        <BaseAlertDialog.Backdrop data-slot="alert-dialog-backdrop" className={dialogBackdropClassName} />
        <BaseAlertDialog.Popup
          {...rest}
          data-slot="alert-dialog"
          className={cn(dialogPopupClassName, 'w-[400px]', className)}
        >
          <div className="flex flex-col gap-4">
            <BaseAlertDialog.Title className="m-0 font-standard font-medium text-l leading-[1.2] text-text-primary">
              {title}
            </BaseAlertDialog.Title>
            {description && (
              <BaseAlertDialog.Description className="m-0 font-standard font-normal text-s leading-[1.45] text-text-secondary">
                {description}
              </BaseAlertDialog.Description>
            )}
          </div>
          {children && (
            <div
              data-slot="alert-dialog-body"
              className="font-standard font-normal text-m leading-[1.5] text-text-primary"
            >
              {children}
            </div>
          )}
          <footer data-slot="alert-dialog-footer" className="flex items-center justify-start gap-8">
            <BaseAlertDialog.Close
              render={
                <Button
                  variant="filled"
                  className={tone === 'danger' ? dangerConfirmClassName : undefined}
                  onClick={onConfirm}
                >
                  {confirmLabel}
                </Button>
              }
            />
            <BaseAlertDialog.Close
              render={
                <Button variant="outlined" onClick={onCancel}>
                  {cancelLabel}
                </Button>
              }
            />
          </footer>
        </BaseAlertDialog.Popup>
      </BaseAlertDialog.Portal>
    </BaseAlertDialog.Root>
  )
}
