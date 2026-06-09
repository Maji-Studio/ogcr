import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const pill = cva(
  'inline-flex items-center gap-8 px-8 py-4 rounded-8 font-standard font-normal text-s leading-[1.4] whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral: 'bg-surface-neutral text-text-primary',
        positive: 'bg-surface-positive text-text-positive',
        warning: 'bg-surface-warning text-text-warning',
        negative: 'bg-surface-negative text-text-negative',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
)

export type PillTone = NonNullable<VariantProps<typeof pill>['tone']>

export type PillProps = ComponentPropsWithoutRef<'span'> & {
  children: ReactNode
  tone?: PillTone
}

export function Pill({ tone, children, className, ...rest }: PillProps) {
  return (
    <span {...rest} data-slot="pill" className={cn(pill({ tone }), className)}>
      {children}
    </span>
  )
}
