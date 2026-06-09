import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type BreadcrumbItem = {
  label: ReactNode
  href?: string
  onClick?: () => void
}

export type BreadcrumbProps = Omit<ComponentProps<'nav'>, 'children'> & {
  items: BreadcrumbItem[]
  /** Separator between crumbs. Defaults to a chevron. */
  separator?: ReactNode
  /** Accessible name for the nav landmark. */
  label?: string
}

function ChevronSeparator() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="w-16 h-16">
      <path
        d="M6 4l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const crumbBase =
  'font-standard font-medium text-s leading-[1.4] transition-colors duration-150 rounded-4 focus-visible:outline-none focus-visible:shadow-focus-primary'
const crumbLink =
  'text-text-secondary hover:text-text-primary cursor-pointer bg-transparent border-0 p-0'

export function Breadcrumb({ items, separator, label = 'Breadcrumb', className, ...rest }: BreadcrumbProps) {
  return (
    <nav {...rest} aria-label={label} data-slot="breadcrumb" className={className}>
      <ol className="flex items-center gap-8 list-none m-0 p-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="inline-flex items-center gap-8 min-w-0">
              {isLast ? (
                <span
                  aria-current="page"
                  data-slot="breadcrumb-current"
                  className={cn(crumbBase, 'text-text-primary truncate')}
                >
                  {item.label}
                </span>
              ) : item.href ? (
                <a href={item.href} onClick={item.onClick} className={cn(crumbBase, crumbLink, 'truncate')}>
                  {item.label}
                </a>
              ) : item.onClick ? (
                <button type="button" onClick={item.onClick} className={cn(crumbBase, crumbLink, 'truncate')}>
                  {item.label}
                </button>
              ) : (
                <span className={cn(crumbBase, 'text-text-secondary truncate')}>{item.label}</span>
              )}
              {!isLast && (
                <span aria-hidden="true" className="inline-flex shrink-0 text-icon-secondary">
                  {separator ?? <ChevronSeparator />}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
