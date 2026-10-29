import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Progress } from '@base-ui/react/progress'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'
import { dsStrings } from '../../lib/strings'

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

/** Status tones for stacked segments: accepted = positive, pending = neutral, declined = warning. */
const segmentFill = cva('', {
  variants: {
    tone: {
      positive: 'bg-icon-positive',
      neutral: 'bg-border-strong',
      warning: 'bg-icon-warning',
      negative: 'bg-icon-negative',
      progress: 'bg-icon-progress',
    },
  },
  defaultVariants: { tone: 'neutral' },
})

export type ProgressBarSegmentTone = NonNullable<VariantProps<typeof segmentFill>['tone']>

export type ProgressBarSegment = {
  value: number
  tone: ProgressBarSegmentTone
  label: string
}

type ProgressBarCommonProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'value'
> & {
  label?: string
  labelIcon?: ReactNode
  showValue?: boolean
  tone?: ProgressBarTone
  min?: number
  /** Single fill: scale top (default 100). Segments: scale top, defaults to the sum of the segment values. */
  max?: number
  /** Dot + label + value row under a stacked bar. Defaults to `true` when `segments` is given. */
  legend?: boolean
  /** Accessible name builder for the stacked bar. Defaults to the `dsStrings.progressBar` copy. */
  summary?: (parts: ReadonlyArray<{ label: string; value: number }>, total: number) => string
}

export type ProgressBarProps = ProgressBarCommonProps &
  (
    | {
        /** Single fill. `null` = indeterminate. */
        value: number | null
        segments?: undefined
      }
    | {
        value?: undefined
        /**
         * Stacked bar: segments side by side, widths as a share of `max`; anything past `max` is
         * clipped. Renders a composite meter (`role="img"` named by `summary`), not a `progressbar`.
         * `showValue` is ignored.
         */
        segments: ProgressBarSegment[]
      }
  )

export function ProgressBar({
  value = null,
  label,
  labelIcon,
  showValue = true,
  tone = 'default',
  min = 0,
  max,
  segments,
  legend = true,
  summary = dsStrings.progressBar.segmentsSummary,
  className,
  ...rest
}: ProgressBarProps) {
  if (segments) {
    const total = max ?? segments.reduce((sum, segment) => sum + segment.value, 0)
    const shown = segments.filter((segment) => segment.value > 0)
    const name = rest['aria-label'] ?? [label, summary(segments, total)].filter(Boolean).join(': ')
    return (
      <div
        {...rest}
        role="img"
        aria-label={name}
        data-slot="progress"
        data-variant="segments"
        className={cn('flex flex-col gap-4 w-full', className)}
      >
        {label && (
          <span className="inline-flex items-center gap-8 font-standard font-normal text-s leading-[1.4] text-text-secondary">
            {label}
            {labelIcon && (
              <span aria-hidden="true" className="inline-flex w-20 h-20 text-icon-secondary [&>svg]:w-full [&>svg]:h-full">
                {labelIcon}
              </span>
            )}
          </span>
        )}
        <div data-slot="progress-track" className="flex w-full h-10 bg-surface-neutral rounded-full overflow-hidden">
          {shown.map((segment, index) => (
            <div
              key={index}
              data-slot="progress-segment"
              data-tone={segment.tone}
              className={cn(
                'h-full shrink-0 transition-[width] duration-200 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none',
                segmentFill({ tone: segment.tone }),
              )}
              style={{ width: `${total > 0 ? Math.min(100, (segment.value / total) * 100) : 0}%` }}
            />
          ))}
        </div>
        {legend && (
          <ul data-slot="progress-legend" className="flex flex-wrap gap-x-16 gap-y-4 m-0 p-0 list-none">
            {segments.map((segment, index) => (
              <li
                key={index}
                className="inline-flex items-center gap-8 font-standard font-normal text-s leading-[1.4] text-text-secondary"
              >
                <span
                  aria-hidden="true"
                  className={cn('inline-block w-10 h-10 shrink-0 rounded-full', segmentFill({ tone: segment.tone }))}
                />
                {segment.label}
                <span className="font-medium text-text-primary">{segment.value}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  const upper = max ?? 100
  const numericValue = value ?? 0
  const range = Math.max(1, upper - min)
  const percent = Math.max(0, Math.min(100, ((numericValue - min) / range) * 100))

  return (
    <Progress.Root
      {...rest}
      value={value}
      min={min}
      max={upper}
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
