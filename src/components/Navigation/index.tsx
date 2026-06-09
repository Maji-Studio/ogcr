import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { LogoMark } from '../Logo'
import { cn } from '../../lib/cn'

export type NavItem = {
  id: string
  label: string
  icon: ReactNode
}

export type NavigationLayout = 'desktop' | 'mobile'

export type NavigationProps = Omit<ComponentPropsWithoutRef<'nav'>, 'children' | 'onSelect'> & {
  items: NavItem[]
  activeId: string
  onSelect?: (id: string) => void
  product?: string
  trailing?: ReactNode
  layout?: NavigationLayout
}

const desktopButton = (active: boolean) =>
  cn(
    'inline-flex items-center gap-12 h-32 px-8 bg-transparent border-0 rounded-8 cursor-pointer',
    'font-standard font-medium text-s tracking-[0.28px]',
    'transition-[background-color,color] duration-150',
    'hover:bg-surface-neutral hover:text-text-primary',
    'focus-visible:outline-none focus-visible:shadow-focus-primary',
    active ? 'bg-interaction-primary-focus text-text-primary' : 'text-text-secondary',
  )

const mobileButton = (active: boolean) =>
  cn(
    'flex flex-col items-center justify-center gap-8 w-full p-4 bg-transparent border-0 rounded-8 cursor-pointer',
    'font-standard font-medium text-s tracking-[0.28px]',
    'transition-[background-color,color] duration-150',
    'focus-visible:outline-none focus-visible:shadow-focus-primary',
    active ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary',
  )

export function Navigation({
  items,
  activeId,
  onSelect,
  product,
  trailing,
  layout = 'desktop',
  className,
  ...rest
}: NavigationProps) {
  if (layout === 'mobile') {
    return (
      <nav
        aria-label="Primary"
        {...rest}
        data-slot="navigation"
        data-layout="mobile"
        className={cn('w-full bg-surface-light py-12 px-16 rounded-16 shadow-elevation-l', className)}
      >
        <ul className="flex items-stretch justify-between gap-8 list-none m-0 p-0">
          {items.map((item) => {
            const active = item.id === activeId
            return (
              <li key={item.id} className="flex-1">
                <button
                  type="button"
                  onClick={() => onSelect?.(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={mobileButton(active)}
                >
                  <span
                    className={cn(
                      'inline-flex w-48 h-48 items-center justify-center rounded-8 transition-colors duration-150 [&>svg]:w-24 [&>svg]:h-24',
                      active && 'bg-interaction-primary-focus',
                    )}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }

  return (
    <nav
      aria-label="Primary"
      {...rest}
      data-slot="navigation"
      data-layout="desktop"
      className={cn(
        'flex items-center gap-32 w-full min-h-[80px] py-16 px-24 bg-surface-light border-b border-border-light rounded-t-12',
        className,
      )}
    >
      <div className="flex items-center gap-32 flex-1 min-w-0">
        <div className="inline-flex items-center gap-16 shrink-0">
          <LogoMark width={36} className="inline-flex shrink-0 h-auto" />
          {product && (
            <>
              <span aria-hidden="true" className="inline-block w-px h-24 bg-border-medium" />
              <span className="font-standard font-medium text-s text-text-primary">{product}</span>
            </>
          )}
        </div>
        <ul className="flex items-center gap-8 list-none m-0 p-0">
          {items.map((item) => {
            const active = item.id === activeId
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect?.(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={desktopButton(active)}
                >
                  <span className="inline-flex w-24 h-24 [&>svg]:w-full [&>svg]:h-full">{item.icon}</span>
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      {trailing && (
        <div className="inline-flex items-center gap-8 shrink-0">{trailing}</div>
      )}
    </nav>
  )
}
