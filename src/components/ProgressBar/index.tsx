import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Progress } from '@base-ui/react/progress'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const fill = cva('h-full rounded-8 transition-[width] duration-200 ease-[cubic-bezier(0.2,0,0,1)]', {
  variants: {
    tone: {
      default: 'bg-interaction-primary-default',
      blue: 'bg-icon-progress',
      orange: 'bg-icon-warning',
      neutral: 'bg-text-neutral',
    },
  },
  defaultVariants: { tone: 'default' },
})

export type ProgressBarTone = NonNullable<VariantProps<typeof fill>['tone']>

export type ProgressBarProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'value'
> & {
  value: number | null
  label?: string
  labelIcon?: ReactNode
  showValue?: boolean
  tone?: ProgressBarTone
  min?: number
  max?: number
}

export function ProgressBar({
  value,
  label,
  labelIcon,
  showValue = true,
  tone = 'default',
  min = 0,
  max = 100,
  className,
  ...rest
}: ProgressBarProps) {
  const numericValue = value ?? 0
  const range = Math.max(1, max - min)
  const percent = Math.max(0, Math.min(100, ((numericValue - min) / range) * 100))

  return (
    <Progress.Root
      {...rest}
      value={value}
      min={min}
      max={max}
      aria-label={rest['aria-label'] ?? label}
      data-slot="progress"
      className={cn('flex flex-col gap-4 w-full', className)}
    >
      {(label || showValue) && (
        <div data-slot="progress-text" className="flex items-start gap-12">
          {label && (
            <Progress.Label className="inline-flex items-center gap-8 font-standard font-normal text-s leading-[1.4] text-text-secondary">
              <span>{label}</span>
              {labelIcon && (
                <span aria-hidden="true" className="inline-flex w-20 h-20 text-icon-secondary [&>svg]:w-full [&>svg]:h-full">
                  {labelIcon}
                </span>
              )}
            </Progress.Label>
          )}
          {showValue && (
            <Progress.Value className="ml-auto font-standard font-medium text-s leading-[1.4] text-text-primary" />
          )}
        </div>
      )}
      <Progress.Track
        data-slot="progress-track"
        className="relative w-full h-8 bg-border-medium rounded-12 overflow-hidden"
      >
        <Progress.Indicator
          data-slot="progress-fill"
          className={fill({ tone })}
          style={{ width: `${percent}%` }}
        />
      </Progress.Track>
    </Progress.Root>
  )
}
