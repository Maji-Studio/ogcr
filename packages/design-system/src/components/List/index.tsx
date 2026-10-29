'use client'

import type { ComponentPropsWithoutRef, MouseEventHandler, ReactNode } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/cn'
import { NavElement, type NavRender } from '../../lib/nav-element'
import { CaretRightIcon } from '../icons'

export type ListVariant = 'bordered' | 'plain'
export type ListItemHighlight = 'warning'

const list = cva('m-0 list-none p-0 font-standard', {
  variants: {
    variant: {
      bordered: 'overflow-hidden rounded-12 border border-border-light bg-surface-light',
      plain: 'bg-transparent',
    },
  },
  defaultVariants: { variant: 'bordered' },
})

export type ListProps = ComponentPropsWithoutRef<'ul'> & {
  /** `bordered` is a framed card of rows. `plain` is the borderless divided stack used inside a sheet. */
  variant?: ListVariant
}

export function List({ variant = 'bordered', className, ...rest }: ListProps) {
  return <ul {...rest} data-slot="list" data-variant={variant} className={cn(list({ variant }), className)} />
}

const row = cva(
  [
    'relative flex items-center border-t border-border-light first:border-t-0',
    'transition-colors duration-150 motion-reduce:transition-none',
  ],
  {
    variants: {
      interactive: { true: 'hover:bg-surface-neutral', false: '' },
      selected: { true: 'bg-interaction-primary-focus hover:bg-interaction-primary-focus', false: '' },
      highlight: { warning: 'bg-surface-warning hover:bg-surface-warning', none: '' },
      strikethrough: { true: 'bg-surface-neutral', false: '' },
    },
    defaultVariants: { interactive: false, selected: false, highlight: 'none', strikethrough: false },
  },
)

export type ListItemProps = Omit<ComponentPropsWithoutRef<'li'>, 'title' | 'onClick'> & {
  /** Icon, avatar, initials, radio or checkbox. Any node. */
  leading?: ReactNode
  title: ReactNode
  /** Secondary line under the title. */
  description?: ReactNode
  /** Right-aligned value (tabular numbers), e.g. an area in ha. */
  trailing?: ReactNode
  /**
   * A separate control at the row end (button, icon button). It is a sibling of the row's
   * button or link, never nested inside it, and stays at full opacity on a `strikethrough` row.
   */
  action?: ReactNode
  /** Title in the secondary colour. */
  muted?: boolean
  /** Excluded row: struck-through, dimmed, `action` (e.g. Restore) stays at full strength. */
  strikethrough?: boolean
  selected?: boolean
  highlight?: ListItemHighlight
  /** Makes the row a `<button>` (or the `render` element). */
  onClick?: MouseEventHandler<HTMLElement>
  /** Makes the row an `<a href>` and adds a trailing chevron. */
  href?: string
  /** Your framework's link element, merged like Navigation items (Base UI `render`). */
  render?: NavRender
  /** Trailing chevron on a navigational row. Defaults to on when `href` is set. */
  chevron?: boolean
}

export function ListItem({
  leading,
  title,
  description,
  trailing,
  action,
  muted = false,
  strikethrough = false,
  selected = false,
  highlight,
  onClick,
  href,
  render,
  chevron,
  className,
  ...rest
}: ListItemProps) {
  const interactive = Boolean(onClick || href || render)
  const showChevron = chevron ?? Boolean(href)

  const inner = (
    <>
      {leading && (
        <span data-slot="list-item-leading" className="inline-flex shrink-0 items-center justify-center text-icon-secondary">
          {leading}
        </span>
      )}
      <span data-slot="list-item-body" className="flex min-w-0 flex-1 flex-col gap-2">
        <span
          data-slot="list-item-title"
          className={cn(
            'text-ms font-medium leading-[1.4]',
            muted || strikethrough ? 'text-text-secondary' : 'text-text-primary',
            strikethrough && 'line-through',
          )}
        >
          {title}
        </span>
        {description && (
          <span
            data-slot="list-item-description"
            className={cn('text-s leading-[1.4] text-text-secondary', strikethrough && 'line-through')}
          >
            {description}
          </span>
        )}
      </span>
      {trailing && (
        <span data-slot="list-item-trailing" className="shrink-0 text-s tabular-nums text-text-primary">
          {trailing}
        </span>
      )}
      {showChevron && (
        <CaretRightIcon data-slot="list-item-chevron" className="h-16 w-16 shrink-0 text-icon-secondary" />
      )}
    </>
  )

  const mainClass = cn(
    'flex min-w-0 flex-1 items-center gap-16 py-16 pl-16 text-left',
    action ? 'pr-8' : 'pr-16',
    strikethrough && 'opacity-60',
  )

  return (
    <li
      {...rest}
      data-slot="list-item"
      data-selected={selected || undefined}
      data-strikethrough={strikethrough || undefined}
      className={cn(
        row({ interactive, selected, highlight: highlight ?? 'none', strikethrough }),
        className,
      )}
    >
      {interactive ? (
        <NavElement
          href={href}
          render={render}
          props={{
            onClick,
            'aria-current': selected ? 'true' : undefined,
            'data-slot': 'list-item-main',
            className: cn(
              mainClass,
              'cursor-pointer border-0 bg-transparent font-standard text-inherit no-underline',
              'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-interaction-primary-default',
            ),
            children: inner,
          }}
        />
      ) : (
        <div data-slot="list-item-main" className={mainClass}>
          {inner}
        </div>
      )}
      {action && (
        <div data-slot="list-item-action" className="flex shrink-0 items-center py-8 pr-16">
          {action}
        </div>
      )}
    </li>
  )
}
