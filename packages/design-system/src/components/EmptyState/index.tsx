'use client'

import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/cn'

export type EmptyStateVariant = 'panel' | 'inline'
export type EmptyStateHeadingLevel = 2 | 3 | 4

const emptyState = cva('font-standard border border-dashed rounded-12', {
  variants: {
    variant: {
      panel: 'flex flex-col items-center gap-12 border-border-strong px-24 py-48 text-center',
      inline:
        'flex flex-wrap items-center justify-between gap-x-16 gap-y-8 border-border-medium px-16 py-12',
    },
  },
  defaultVariants: { variant: 'panel' },
})

export type EmptyStateProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  /** `panel` is the centred block; `inline` is the compact dashed row. */
  variant?: EmptyStateVariant
  /** Icon shown in the round tile (panel only). */
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** Usually a `Button`. */
  action?: ReactNode
  /** Heading element for the title in the panel variant. Pick the level that fits the page outline. */
  headingLevel?: EmptyStateHeadingLevel
}

export function EmptyState({
  variant = 'panel',
  icon,
  title,
  description,
  action,
  headingLevel = 3,
  className,
  ...rest
}: EmptyStateProps) {
  const Heading = `h${headingLevel}` as const

  if (variant === 'inline') {
    return (
      <div {...rest} data-slot="empty-state" data-variant="inline" className={cn(emptyState({ variant }), className)}>
        <p className="m-0 min-w-0 flex-1 text-s leading-[1.4] text-text-secondary">
          <span className="font-medium text-text-primary">{title}</span>
          {description && <> {description}</>}
        </p>
        {action && <div data-slot="empty-state-action" className="shrink-0">{action}</div>}
      </div>
    )
  }

  return (
    <div {...rest} data-slot="empty-state" data-variant="panel" className={cn(emptyState({ variant }), className)}>
      {icon && (
        <span
          aria-hidden="true"
          data-slot="empty-state-icon"
          className="inline-flex h-48 w-48 items-center justify-center rounded-full bg-surface-neutral text-icon-secondary [&>svg]:h-24 [&>svg]:w-24"
        >
          {icon}
        </span>
      )}
      <Heading className="m-0 text-ms font-semibold leading-[1.3] text-text-primary">{title}</Heading>
      {description && (
        <p className="m-0 max-w-[44ch] text-s leading-[1.45] text-text-secondary">{description}</p>
      )}
      {action && (
        <div data-slot="empty-state-action" className="mt-4">
          {action}
        </div>
      )}
    </div>
  )
}
