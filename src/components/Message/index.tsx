import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Button } from '../Button'
import {
  CheckCircleIcon,
  InfoIcon,
  WarningIcon,
  WarningOctagonIcon,
  XIcon,
} from '../icons'
import { dsStrings } from '../../lib/strings'
import { cn } from '../../lib/cn'

const wrapper = cva(
  'flex items-center gap-16 p-16 rounded-16 border-[1.5px]',
  {
    variants: {
      state: {
        neutral: 'bg-surface-page border-border-light text-text-neutral',
        success: 'bg-surface-positive border-border-positive-light text-text-positive',
        warning: 'bg-surface-warning border-border-warning-light text-text-warning',
        error: 'bg-surface-negative border-border-negative-light text-text-negative',
      },
      type: {
        inline: '',
        floating: 'shadow-elevation-l',
      },
    },
    defaultVariants: { state: 'neutral', type: 'inline' },
  },
)

const iconColor: Record<MessageState, string> = {
  neutral: 'text-icon-neutral',
  success: 'text-icon-positive',
  warning: 'text-icon-warning',
  error: 'text-icon-negative',
}

const STATE_ICONS: Record<MessageState, ReactNode> = {
  neutral: <InfoIcon />,
  success: <CheckCircleIcon />,
  warning: <WarningIcon />,
  error: <WarningOctagonIcon />,
}

export type MessageState = NonNullable<VariantProps<typeof wrapper>['state']>
export type MessageType = NonNullable<VariantProps<typeof wrapper>['type']>

export type MessageProps = ComponentPropsWithoutRef<'div'> & {
  title: ReactNode
  description?: ReactNode
  state?: MessageState
  type?: MessageType
  actionLabel?: string
  onAction?: () => void
  onDismiss?: () => void
  /** Accessible label for the dismiss button (floating type only). */
  dismissLabel?: string
}

export function Message({
  title,
  description,
  state = 'neutral',
  type = 'inline',
  actionLabel,
  onAction,
  onDismiss,
  dismissLabel = dsStrings.message.dismissLabel,
  className,
  ...rest
}: MessageProps) {
  return (
    <div
      {...rest}
      data-slot="message"
      data-state={state}
      role={state === 'error' || state === 'warning' ? 'alert' : 'status'}
      className={cn(wrapper({ state, type }), className)}
    >
      <div data-slot="message-content" className="flex items-start gap-12 flex-1 min-w-0">
        <span
          data-slot="message-icon"
          aria-hidden="true"
          className={cn('inline-flex w-24 h-24 shrink-0 pt-[2px] [&>svg]:w-full [&>svg]:h-full', iconColor[state])}
        >
          {STATE_ICONS[state]}
        </span>
        <div data-slot="message-text" className="flex flex-col gap-4 min-w-0">
          <p className="m-0 font-standard font-medium text-m leading-[1.5]">{title}</p>
          {description && (
            <p className="m-0 font-standard font-normal text-s leading-[1.4]">{description}</p>
          )}
        </div>
      </div>
      {actionLabel && (
        <Button
          variant="outlined"
          onClick={onAction}
          className="shrink-0 bg-transparent border-current text-inherit hover:not-disabled:bg-white/40"
        >
          {actionLabel}
        </Button>
      )}
      {type === 'floating' && (
        <button
          data-slot="message-close"
          type="button"
          aria-label={dismissLabel}
          onClick={onDismiss}
          className="inline-flex items-center justify-center w-40 h-40 shrink-0 bg-transparent border border-current rounded-12 cursor-pointer transition-colors duration-150 hover:bg-white/40 focus-visible:outline-none focus-visible:shadow-focus-primary [&>svg]:w-24 [&>svg]:h-24"
        >
          <XIcon />
        </button>
      )}
    </div>
  )
}
