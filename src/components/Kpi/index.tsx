import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Pill, type PillTone } from '../Pill'
import { cn } from '../../lib/cn'

const accent = cva('absolute inset-x-0 top-0 h-[6px]', {
  variants: {
    tone: {
      positive: 'bg-icon-positive',
      warning: 'bg-icon-warning',
      negative: 'bg-icon-negative',
      neutral: 'bg-text-neutral',
    },
  },
  defaultVariants: { tone: 'positive' },
})

export type KpiTone = NonNullable<VariantProps<typeof accent>['tone']>

export type KpiProps = ComponentPropsWithoutRef<'article'> & {
  label: ReactNode
  value: ReactNode
  secondaryText?: ReactNode
  /** Tone is sourced from Pill so the two cannot drift. */
  status?: { label: ReactNode; tone?: PillTone }
  tone?: KpiTone
}

export function Kpi({
  label,
  value,
  secondaryText,
  status,
  tone = 'positive',
  className,
  ...rest
}: KpiProps) {
  return (
    <article
      {...rest}
      data-slot="kpi"
      className={cn(
        'relative flex flex-col gap-4 px-24 py-16 bg-surface-light border border-border-medium rounded-12 overflow-hidden',
        className,
      )}
    >
      <div data-slot="kpi-accent" aria-hidden="true" className={accent({ tone })} />
      <header data-slot="kpi-header" className="flex items-center justify-between gap-12 pt-4">
        <span className="font-standard font-normal text-s leading-[1.4] text-text-secondary">
          {label}
        </span>
        {status && <Pill tone={status.tone ?? 'neutral'}>{status.label}</Pill>}
      </header>
      <div
        data-slot="kpi-value"
        className="font-standard font-medium text-xl leading-[1.2] text-text-primary"
      >
        {value}
      </div>
      {secondaryText && (
        <p
          data-slot="kpi-secondary"
          className="m-0 font-standard font-normal text-s leading-[1.4] text-text-secondary"
        >
          {secondaryText}
        </p>
      )}
    </article>
  )
}
