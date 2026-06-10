import type { ComponentProps, ReactNode } from 'react'
import { Toast as BaseToast } from '@base-ui/react/toast'
import { overlaySurfaceClassName } from '../../lib/overlay'
import { dsStrings } from '../../lib/strings'
import { cn } from '../../lib/cn'
import {
  BellIcon,
  CheckCircleIcon,
  InfoIcon,
  WarningIcon,
  WarningOctagonIcon,
  XIcon,
} from '../icons'

export type ToastTone = 'neutral' | 'success' | 'error' | 'warning' | 'info'

/** Hook to imperatively add/close/update toasts. Re-export of Base UI's manager. */
// eslint-disable-next-line react-refresh/only-export-components -- public hook ships from the component barrel
export const useToast = BaseToast.useToastManager

const TONES: Record<ToastTone, { accent: string; icon: ReactNode; iconColor: string }> = {
  neutral: { accent: 'border-l-border-strong', icon: <BellIcon />, iconColor: 'text-icon-secondary' },
  success: { accent: 'border-l-icon-positive', icon: <CheckCircleIcon />, iconColor: 'text-icon-positive' },
  error: { accent: 'border-l-icon-negative', icon: <WarningOctagonIcon />, iconColor: 'text-icon-negative' },
  warning: { accent: 'border-l-icon-warning', icon: <WarningIcon />, iconColor: 'text-icon-warning' },
  info: { accent: 'border-l-icon-progress', icon: <InfoIcon />, iconColor: 'text-icon-progress' },
}

function isToastTone(value: string | undefined): value is ToastTone {
  return value != null && value in TONES
}

/** Props forwarded onto every per-toast `BaseToast.Root` (the styleable item surface). */
type ToastItemProps = Omit<ComponentProps<typeof BaseToast.Root>, 'toast' | 'children'> & {
  /** Accessible label for each toast's close button. */
  dismissLabel?: string
}

function ToastList({
  className,
  dismissLabel = dsStrings.toast.dismissLabel,
  ...rest
}: ToastItemProps) {
  const { toasts } = useToast()
  return toasts.map((toast) => {
    const tone = isToastTone(toast.type) ? toast.type : 'neutral'
    const { accent, icon, iconColor } = TONES[tone]
    return (
      <BaseToast.Root
        {...rest}
        key={toast.id}
        toast={toast}
        data-slot="toast"
        className={cn(
          'relative flex items-start gap-12 w-full p-16 pr-40',
          // Shared card surface; the colored left accent (border-l-4 + tone) rides on top.
          overlaySurfaceClassName,
          'border-l-4 outline-none',
          'transition-all duration-200',
          'data-[starting-style]:opacity-0 data-[starting-style]:translate-y-2',
          'data-[ending-style]:opacity-0 data-[ending-style]:translate-y-2',
          accent,
          className,
        )}
      >
        <span
          aria-hidden="true"
          className={cn('mt-1 inline-flex w-20 h-20 shrink-0 [&>svg]:w-full [&>svg]:h-full', iconColor)}
        >
          {icon}
        </span>
        <div className="flex flex-col gap-4 min-w-0 flex-1">
          <BaseToast.Title className="m-0 font-standard font-medium text-s leading-[1.4] text-text-primary" />
          <BaseToast.Description className="m-0 font-standard font-normal text-s leading-[1.4] text-text-secondary" />
          {toast.actionProps && (
            <BaseToast.Action className="mt-4 self-start font-standard font-medium text-s leading-[1.4] text-interaction-primary-default bg-transparent border-0 p-0 cursor-pointer rounded-4 outline-none hover:text-interaction-primary-hover focus-visible:shadow-focus-primary" />
          )}
        </div>
        <BaseToast.Close
          aria-label={dismissLabel}
          data-slot="toast-close"
          className="absolute top-12 right-12 inline-flex items-center justify-center w-24 h-24 bg-transparent border-0 rounded-8 cursor-pointer text-icon-secondary outline-none transition-colors duration-150 hover:bg-surface-neutral hover:text-icon-primary focus-visible:shadow-focus-primary [&>svg]:w-16 [&>svg]:h-16"
        >
          <XIcon />
        </BaseToast.Close>
      </BaseToast.Root>
    )
  })
}

export type ToastProviderProps = ToastItemProps & {
  children: ReactNode
  /** Default auto-dismiss timeout in ms. `0` disables auto-dismiss. */
  timeout?: number
  /** Maximum number of toasts shown at once. */
  limit?: number
}

/**
 * Wrap the app once. Mounts the toast viewport (bottom-right) and exposes
 * the `useToast()` hook to any descendant for imperative toasts.
 *
 * Any extra props (and `ref`) are forwarded onto every rendered toast item's
 * `BaseToast.Root` (the styleable surface carrying `data-slot="toast"`).
 */
export function ToastProvider({ children, timeout, limit, ...rest }: ToastProviderProps) {
  return (
    <BaseToast.Provider timeout={timeout} limit={limit}>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport
          data-slot="toast-viewport"
          className="fixed bottom-0 right-0 z-[var(--ds-z-toast)] flex flex-col gap-8 p-16 w-[400px] max-w-[100vw] outline-none"
        >
          <ToastList {...rest} />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  )
}
