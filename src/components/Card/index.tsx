import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export type CardProps = Omit<ComponentPropsWithoutRef<'section'>, 'title'> & {
  title?: ReactNode
  subtitle?: ReactNode
  trailing?: ReactNode
  floating?: boolean
  /** Heading level rendered for the title. Defaults to 3 to slot inside a page section. */
  headingLevel?: HeadingLevel
  children?: ReactNode
}

export function Card({
  title,
  subtitle,
  trailing,
  floating = false,
  headingLevel = 3,
  className,
  children,
  ...rest
}: CardProps) {
  const hasHeader = title || subtitle || trailing
  const Heading = `h${headingLevel}` as const
  return (
    <section
      {...rest}
      data-slot="card"
      className={cn(
        'flex flex-col gap-16 p-16 bg-surface-light border border-border-medium rounded-16',
        floating && 'shadow-elevation-l',
        className,
      )}
    >
      {hasHeader && (
        <header data-slot="card-header" className="flex items-center justify-between gap-12">
          <div data-slot="card-titles" className="flex flex-col gap-4 min-w-0">
            {title && (
              <Heading className="m-0 font-standard font-medium text-m leading-[1.2] text-text-primary">
                {title}
              </Heading>
            )}
            {subtitle && (
              <p className="m-0 font-standard font-normal text-s leading-[1.4] text-text-secondary">
                {subtitle}
              </p>
            )}
          </div>
          {trailing && (
            <div data-slot="card-trailing" className="inline-flex items-center gap-8 shrink-0">
              {trailing}
            </div>
          )}
        </header>
      )}
      {children && (
        <div data-slot="card-body" className="flex flex-col gap-16">
          {children}
        </div>
      )}
    </section>
  )
}
