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
      progress: 'bg-icon-progress',
    },
  },
  defaultVariants: { tone: 'positive' },
})

export type KpiTone = NonNullable<VariantProps<typeof accent>['tone']>

export type KpiProps = ComponentPropsWithoutRef<'article'> & {
  label: ReactNode
  value: ReactNode
  secondaryText?: ReactNode
  /** Small decorative glyph rendered before the label. Sized to 20px, `aria-hidden`. */
  icon?: ReactNode
  /** Tone is sourced from Pill so the two cannot drift. */
  status?: { label: ReactNode; tone?: PillTone }
  tone?: KpiTone
  /**
   * The 6px top accent bar. On by default (spec §4.11 — it is the primary status
   * signal); turn it off for quiet, icon-led stat tiles in a dense dashboard row.
   */
  accentBar?: boolean
}

export function Kpi({
  label,
  value,
  secondaryText,
  icon,
  status,
  tone = 'positive',
  accentBar = true,
  className,
  ...rest
}: KpiProps) {
  return (
    <article
      {...rest}
      data-slot="kpi"
      data-tone={tone}
      className={cn(
        'relative flex flex-col gap-4 px-24 py-16 bg-surface-light border border-border-medium rounded-12 overflow-hidden',
        className,
      )}
    >
      {accentBar && (
        <div data-slot="kpi-accent" aria-hidden="true" className={accent({ tone })} />
      )}
      <header
        data-slot="kpi-header"
        className={cn('flex items-center justify-between gap-12', accentBar && 'pt-4')}
      >
        <span className="inline-flex min-w-0 items-center gap-8">
          {icon && (
            <span
              data-slot="kpi-icon"
              aria-hidden="true"
              className="inline-flex w-20 h-20 shrink-0 items-center justify-center text-icon-secondary [&>svg]:w-full [&>svg]:h-full"
            >
              {icon}
            </span>
          )}
          <span className="font-standard font-normal text-s leading-[1.4] text-text-secondary">
            {label}
          </span>
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
