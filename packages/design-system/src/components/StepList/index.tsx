'use client'

import type { ComponentPropsWithoutRef, MouseEventHandler, ReactNode } from 'react'
import { cva } from 'class-variance-authority'
import { NavElement, type NavRender } from '../../lib/nav-element'
import { dsStrings } from '../../lib/strings'
import { cn } from '../../lib/cn'
import { ArrowRightIcon, CheckIcon, LockIcon, WarningIcon } from '../icons'

export type StepListVariant = 'bordered' | 'plain'
export type StepState = 'todo' | 'current' | 'done' | 'attention' | 'locked'

export type StepListProps = ComponentPropsWithoutRef<'ol'> & {
  /** `bordered`: a rounded stack with dividers. `plain`: no outer border. */
  variant?: StepListVariant
  /** Dotted vertical line between the circles. Plain variant only. */
  connector?: boolean
}

const list = cva('group/steps list-none m-0 p-0', {
  variants: {
    variant: {
      bordered: 'bg-surface-light border border-border-light rounded-12',
      plain: 'flex flex-col',
    },
  },
  defaultVariants: { variant: 'bordered' },
})

export function StepList({ variant = 'bordered', connector = false, className, children, ...rest }: StepListProps) {
  return (
    <ol
      {...rest}
      data-slot="step-list"
      data-variant={variant}
      data-connector={connector && variant === 'plain' ? '' : undefined}
      className={cn(list({ variant }), className)}
    >
      {children}
    </ol>
  )
}

export type StepListItemProps = Omit<ComponentPropsWithoutRef<'li'>, 'title' | 'onClick' | 'children'> & {
  state: StepState
  title: ReactNode
  description?: ReactNode
  /** Small status chips under the description (expect `Pill`s). */
  tags?: ReactNode
  /** Right-aligned meta, e.g. a duration. Sits inside the row, so keep it non-interactive. */
  trailing?: ReactNode
  /** Replaces the state glyph with a neutral icon tile. State is still announced in text. */
  icon?: ReactNode
  /** Makes the row a button. Ignored when `state` is `locked`. */
  onClick?: MouseEventHandler<HTMLElement>
  /** Makes the row a link. Ignored when `state` is `locked`. */
  href?: string
  /** Base UI `render` escape hatch for framework links (`render={<Link href="/parcels" />}`). */
  render?: NavRender
  /** Visually hidden state text. Defaults come from `dsStrings.stepList`. */
  stateLabel?: string
}

const circle = cva(
  'inline-flex items-center justify-center shrink-0 w-28 h-28 mt-2 rounded-full box-border [&>svg]:w-16 [&>svg]:h-16',
  {
    variants: {
      state: {
        todo: 'border-[1.5px] border-border-strong',
        current: 'bg-interaction-primary-default text-surface-page',
        done: 'bg-surface-positive text-icon-positive',
        attention: 'border-[1.5px] border-border-warning-strong bg-surface-warning text-icon-warning',
        locked: 'border border-border-light bg-surface-neutral text-icon-secondary',
      },
    },
  },
)

const stateIcon: Record<StepState, ReactNode> = {
  todo: null,
  current: <ArrowRightIcon />,
  done: <CheckIcon />,
  attention: <WarningIcon />,
  locked: <LockIcon />,
}

export function StepListItem({
  state,
  title,
  description,
  tags,
  trailing,
  icon,
  onClick,
  href,
  render,
  stateLabel = dsStrings.stepList[state],
  className,
  ...rest
}: StepListItemProps) {
  const interactive = state !== 'locked' && (onClick != null || href != null || render != null)

  const content = (
    <>
      <span
        data-slot="step-list-marker"
        data-state={state}
        aria-hidden="true"
        className={
          icon
            ? 'inline-flex items-center justify-center shrink-0 w-28 h-28 mt-2 rounded-full box-border border border-border-light bg-surface-neutral text-icon-secondary [&>svg]:w-16 [&>svg]:h-16'
            : circle({ state })
        }
      >
        {icon ?? stateIcon[state]}
      </span>
      <span className="flex-1 min-w-0 flex flex-col text-left">
        <span
          data-slot="step-list-title"
          className={cn(
            'font-standard font-semibold text-ms leading-[1.4]',
            state === 'done' && 'line-through text-text-secondary',
            state === 'locked' && 'text-text-secondary',
            state !== 'done' && state !== 'locked' && 'text-text-primary',
          )}
        >
          <span className="sr-only">{stateLabel}: </span>
          {title}
        </span>
        {description && (
          <span
            data-slot="step-list-description"
            className="mt-2 font-standard font-normal text-s leading-[1.4] text-text-secondary"
          >
            {description}
          </span>
        )}
        {tags && (
          <span data-slot="step-list-tags" className="flex flex-wrap gap-8 mt-8">
            {tags}
          </span>
        )}
      </span>
      {trailing && (
        <span
          data-slot="step-list-trailing"
          className="shrink-0 self-center ml-auto font-standard font-normal text-s text-text-secondary whitespace-nowrap"
        >
          {trailing}
        </span>
      )}
    </>
  )

  const rowClassName = cn(
    'flex items-start gap-12 w-full min-h-40 px-16 py-16 rounded-[inherit] border-0 bg-transparent no-underline',
    'group-data-[variant=plain]/steps:px-12 group-data-[variant=plain]/steps:py-12',
    interactive &&
      'cursor-pointer transition-[background-color] duration-150 motion-reduce:transition-none hover:bg-surface-neutral focus-visible:outline-none focus-visible:shadow-focus-primary',
  )

  return (
    <li
      {...rest}
      data-slot="step-list-item"
      data-state={state}
      aria-current={state === 'current' ? 'step' : undefined}
      className={cn(
        'group/item relative text-text-primary',
        // bordered: dividers + rounded ends; plain: each row rounds on its own
        'group-data-[variant=bordered]/steps:border-t group-data-[variant=bordered]/steps:border-border-light',
        'group-data-[variant=bordered]/steps:first:border-t-0 group-data-[variant=bordered]/steps:first:rounded-t-12',
        'group-data-[variant=bordered]/steps:last:rounded-b-12 group-data-[variant=plain]/steps:rounded-12',
        className,
      )}
    >
      {interactive ? (
        <NavElement
          href={href}
          render={render}
          props={{ className: rowClassName, onClick, children: content }}
        />
      ) : (
        <div data-slot="step-list-row" className={rowClassName}>
          {content}
        </div>
      )}
      <span
        data-slot="step-list-connector"
        aria-hidden="true"
        className={cn(
          'hidden group-data-[connector]/steps:block group-last/item:hidden! absolute w-0 pointer-events-none',
          'border-l-2 border-dotted border-border-medium -translate-x-1/2',
          'left-[calc(var(--spacing-12)+var(--spacing-28)/2)]',
          'top-[calc(var(--spacing-12)+var(--spacing-28)+var(--spacing-2)+var(--spacing-4))]',
          'bottom-[calc(var(--spacing-4)-var(--spacing-12))]',
        )}
      />
    </li>
  )
}
