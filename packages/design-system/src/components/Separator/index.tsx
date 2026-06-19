import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Separator as BaseSeparator } from '@base-ui/react/separator'
import { cn } from '../../lib/cn'

export type SeparatorOrientation = 'horizontal' | 'vertical'

export type SeparatorProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  orientation?: SeparatorOrientation
  /** Optional centered label. Only rendered for horizontal separators. */
  label?: ReactNode
}

export function Separator({
  orientation = 'horizontal',
  label,
  className,
  ...rest
}: SeparatorProps) {
  const vertical = orientation === 'vertical'

  if (label && !vertical) {
    return (
      <div
        data-slot="separator"
        role="separator"
        aria-orientation="horizontal"
        // The visible label is the separator's accessible name when it's a plain
        // string; arbitrary nodes fall back to the visible text in the DOM.
        aria-label={typeof label === 'string' ? label : undefined}
        className={cn('flex items-center gap-12 w-full', className)}
        {...rest}
      >
        <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
        <span className="shrink-0 font-standard font-medium text-s leading-none text-text-secondary whitespace-nowrap">
          {label}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-border-light" />
      </div>
    )
  }

  return (
    <BaseSeparator
      orientation={orientation}
      data-slot="separator"
      className={cn(
        'shrink-0 border-0 bg-border-light',
        vertical ? 'w-px self-stretch min-h-[1em]' : 'h-px w-full',
        className,
      )}
      {...rest}
    />
  )
}
