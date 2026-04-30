import type { ReactNode } from 'react'
import { LogoMark } from './Logo'
import './Navigation.css'

export type NavItem = {
  id: string
  label: string
  icon: ReactNode
}

export type NavigationProps = {
  items: NavItem[]
  activeId: string
  onSelect?: (id: string) => void
  product?: string
  trailing?: ReactNode
  layout?: 'desktop' | 'mobile'
  className?: string
}

export function Navigation({
  items,
  activeId,
  onSelect,
  product,
  trailing,
  layout = 'desktop',
  className,
}: NavigationProps) {
  const classes = ['ogcr-nav', `ogcr-nav--${layout}`, className].filter(Boolean).join(' ')

  if (layout === 'mobile') {
    return (
      <nav className={classes} aria-label="Primary">
        <ul className="ogcr-nav__mobile-list">
          {items.map((item) => {
            const active = item.id === activeId
            return (
              <li key={item.id} className="ogcr-nav__mobile-item">
                <button
                  type="button"
                  className={`ogcr-nav__mobile-button${active ? ' ogcr-nav__mobile-button--active' : ''}`}
                  onClick={() => onSelect?.(item.id)}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="ogcr-nav__mobile-icon">{item.icon}</span>
                  <span className="ogcr-nav__mobile-label">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }

  return (
    <nav className={classes} aria-label="Primary">
      <div className="ogcr-nav__left">
        <div className="ogcr-nav__brand">
          <LogoMark width={36} className="ogcr-nav__logo" />
          {product && (
            <>
              <span className="ogcr-nav__divider" aria-hidden="true" />
              <span className="ogcr-nav__product">{product}</span>
            </>
          )}
        </div>
        <ul className="ogcr-nav__list">
          {items.map((item) => {
            const active = item.id === activeId
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`ogcr-nav__button${active ? ' ogcr-nav__button--active' : ''}`}
                  onClick={() => onSelect?.(item.id)}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="ogcr-nav__icon">{item.icon}</span>
                  <span className="ogcr-nav__label">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      {trailing && <div className="ogcr-nav__trailing">{trailing}</div>}
    </nav>
  )
}
