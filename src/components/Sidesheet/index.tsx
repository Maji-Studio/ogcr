import type { ReactElement, ReactNode } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { Button } from '../Button'
import { Pill } from '../Pill'
import { ArrowLeftIcon, XIcon } from '../icons'
import { cn } from '../../lib/cn'

export type SidesheetAction = {
  label: string
  variant?: 'filled' | 'outlined' | 'text'
  onClick?: () => void
}

export type SidesheetProps = {
  title: ReactNode
  trigger?: ReactElement
  navLabel?: string
  status?: string
  onBack?: () => void
  primaryAction?: SidesheetAction
  secondaryAction?: SidesheetAction
  children?: ReactNode
  className?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** When `true`, traps focus and locks page scroll. */
  modal?: boolean | 'trap-focus'
}

export function Sidesheet({
  title,
  trigger,
  navLabel,
  status,
  onBack,
  primaryAction,
  secondaryAction,
  children,
  className,
  open,
  defaultOpen,
  onOpenChange,
  modal = true,
}: SidesheetProps) {
  return (
    <Dialog.Root
      open={open}
      defaultOpen={open === undefined ? defaultOpen : undefined}
      onOpenChange={onOpenChange}
      modal={modal}
    >
      {trigger && <Dialog.Trigger render={trigger} />}
      <Dialog.Portal>
        <Dialog.Backdrop
          data-slot="sidesheet-backdrop"
          className={cn(
            'fixed inset-0 bg-black/40 z-40',
            'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
            'transition-opacity duration-200',
          )}
        />
        <Dialog.Popup
          data-slot="sidesheet"
          className={cn(
            'fixed top-0 right-0 z-50 flex flex-col w-[480px] h-screen max-w-[100vw] bg-surface-light shadow-elevation-l overflow-hidden',
            'outline-none',
            'data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full',
            'transition-transform duration-200 ease-out',
            className,
          )}
        >
          <div
            data-slot="sidesheet-nav"
            className="flex items-center justify-between gap-12 p-16"
          >
            {navLabel ? (
              <Button variant="outlined" iconLeft={<ArrowLeftIcon />} onClick={onBack}>
                {navLabel}
              </Button>
            ) : (
              <span />
            )}
            <Dialog.Close
              aria-label="Close"
              className="inline-flex items-center justify-center w-40 h-40 bg-surface-light border border-border-medium rounded-12 cursor-pointer text-icon-primary transition-colors duration-150 hover:bg-surface-neutral focus-visible:outline-none focus-visible:shadow-focus-primary [&>svg]:w-24 [&>svg]:h-24"
            >
              <XIcon />
            </Dialog.Close>
          </div>
          <header
            data-slot="sidesheet-header"
            className="flex items-center justify-between gap-12 px-16 pb-16"
          >
            <Dialog.Title className="m-0 font-standard font-medium text-xl leading-[1.2] text-text-primary">
              {title}
            </Dialog.Title>
            {status && <Pill tone="neutral">{status}</Pill>}
          </header>
          <div
            data-slot="sidesheet-body"
            className="flex-1 overflow-y-auto p-16 flex flex-col gap-16 border-t border-b border-border-light"
          >
            {children}
          </div>
          {(primaryAction || secondaryAction) && (
            <footer data-slot="sidesheet-footer" className="flex gap-8 p-16">
              {primaryAction && (
                <Button
                  variant={primaryAction.variant ?? 'filled'}
                  onClick={primaryAction.onClick}
                >
                  {primaryAction.label}
                </Button>
              )}
              {secondaryAction && (
                <Button
                  variant={secondaryAction.variant ?? 'outlined'}
                  onClick={secondaryAction.onClick}
                >
                  {secondaryAction.label}
                </Button>
              )}
            </footer>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
