import { useState, type ReactNode } from 'react'
import { LogoMark } from './Logo'
import { CaretDownIcon, DotsThreeIcon, PanelLeftIcon, XIcon } from './icons'
import './SideNavigation.css'

export type SideNavigationChild = {
  id: string
  label: string
  badge?: ReactNode
}

export type SideNavigationItem = {
  id: string
  label: string
  icon: ReactNode
  badge?: ReactNode
  children?: SideNavigationChild[]
}

export type SideNavigationUser = {
  name: string
  role?: string
  initials: string
}

export type SideNavigationProps = {
  items: SideNavigationItem[]
  activeId: string
  onSelect?: (id: string) => void
  product?: string
  user?: SideNavigationUser
  onUserAction?: () => void
  trailing?: ReactNode
  collapsed?: boolean
  onToggleCollapsed?: (next: boolean) => void
  defaultCollapsed?: boolean
  defaultExpandedIds?: string[]
  /** 'desktop' renders the persistent rail. 'mobile' renders a burger
   * trigger that opens the sidebar as an overlay drawer. */
  layout?: 'desktop' | 'mobile'
  /** Optional content shown next to the burger trigger in mobile (e.g. avatar / actions). */
  mobileTrigger?: ReactNode
  className?: string
}

type NavBodyProps = {
  items: SideNavigationItem[]
  activeId: string
  collapsed: boolean
  expanded: Set<string>
  onSelect: (id: string) => void
  toggleExpanded: (id: string) => void
}

function NavBody({
  items,
  activeId,
  collapsed,
  expanded,
  onSelect,
  toggleExpanded,
}: NavBodyProps) {
  return (
    <nav className="ogcr-sidebar__nav" aria-label="Sections">
      <ul className="ogcr-sidebar__list">
        {items.map((item) => {
          const hasChildren = !!item.children?.length
          const isExpanded = expanded.has(item.id)
          const isActive = item.id === activeId
          const childActive =
            hasChildren && item.children!.some((c) => c.id === activeId)

          return (
            <li key={item.id} className="ogcr-sidebar__item">
              <button
                type="button"
                className={[
                  'ogcr-sidebar__button',
                  (isActive ||
                    (childActive && (!isExpanded || collapsed))) &&
                    'ogcr-sidebar__button--active',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => {
                  if (hasChildren && !collapsed) {
                    toggleExpanded(item.id)
                  } else {
                    onSelect(item.id)
                  }
                }}
                aria-current={isActive ? 'page' : undefined}
                aria-expanded={hasChildren ? isExpanded : undefined}
                data-tooltip={collapsed ? item.label : undefined}
              >
                <span className="ogcr-sidebar__icon">{item.icon}</span>
                <span className="ogcr-sidebar__label">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="ogcr-sidebar__badge">{item.badge}</span>
                )}
                {hasChildren && (
                  <span className="ogcr-sidebar__caret" aria-hidden="true">
                    <CaretDownIcon />
                  </span>
                )}
              </button>

              {hasChildren && isExpanded && !collapsed && (
                <ul className="ogcr-sidebar__sublist">
                  {item.children!.map((child) => {
                    const childIsActive = child.id === activeId
                    return (
                      <li key={child.id} className="ogcr-sidebar__subitem">
                        <button
                          type="button"
                          className={[
                            'ogcr-sidebar__subbutton',
                            childIsActive &&
                              'ogcr-sidebar__subbutton--active',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={() => onSelect(child.id)}
                          aria-current={childIsActive ? 'page' : undefined}
                        >
                          <span className="ogcr-sidebar__sublabel">
                            {child.label}
                          </span>
                          {child.badge !== undefined && (
                            <span className="ogcr-sidebar__badge">
                              {child.badge}
                            </span>
                          )}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

type UserChipProps = {
  user: SideNavigationUser
  onUserAction?: () => void
  collapsed: boolean
}

function UserChip({ user, onUserAction, collapsed }: UserChipProps) {
  return (
    <button
      type="button"
      className="ogcr-sidebar__user"
      onClick={onUserAction}
      aria-label={`Account · ${user.name}`}
      data-tooltip={collapsed ? user.name : undefined}
    >
      <span className="ogcr-sidebar__avatar" aria-hidden="true">
        {user.initials}
      </span>
      <span className="ogcr-sidebar__user-meta">
        <span className="ogcr-sidebar__user-name">{user.name}</span>
        {user.role && (
          <span className="ogcr-sidebar__user-role">{user.role}</span>
        )}
      </span>
      <span className="ogcr-sidebar__user-action" aria-hidden="true">
        <DotsThreeIcon />
      </span>
    </button>
  )
}

export function SideNavigation({
  items,
  activeId,
  onSelect,
  product,
  user,
  onUserAction,
  trailing,
  collapsed: collapsedProp,
  onToggleCollapsed,
  defaultCollapsed = false,
  defaultExpandedIds,
  layout = 'desktop',
  mobileTrigger,
  className,
}: SideNavigationProps) {
  const isMobile = layout === 'mobile'
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed)
  const collapsed = isMobile ? false : (collapsedProp ?? internalCollapsed)
  const setCollapsed = (next: boolean) => {
    if (collapsedProp === undefined) setInternalCollapsed(next)
    onToggleCollapsed?.(next)
  }
  const [mobileOpen, setMobileOpen] = useState(false)

  const initialExpanded =
    defaultExpandedIds ??
    items
      .filter((i) => i.children?.some((c) => c.id === activeId))
      .map((i) => i.id)
  const [expanded, setExpanded] = useState<Set<string>>(new Set(initialExpanded))

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSelect = (id: string) => {
    onSelect?.(id)
    if (isMobile) setMobileOpen(false)
  }

  if (isMobile) {
    const drawerClasses = [
      'ogcr-sidebar',
      'ogcr-sidebar--mobile',
      mobileOpen && 'ogcr-sidebar--mobile-open',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className="ogcr-sidebar-mobile">
        <div className="ogcr-sidebar-mobile__bar">
          <div className="ogcr-sidebar-mobile__brand">
            <LogoMark width={32} />
            {product && (
              <>
                <span className="ogcr-sidebar__divider" aria-hidden="true" />
                <span className="ogcr-sidebar__product">{product}</span>
              </>
            )}
          </div>
          {mobileTrigger && (
            <div className="ogcr-sidebar-mobile__trailing">{mobileTrigger}</div>
          )}
          <button
            type="button"
            className={[
              'ogcr-sidebar-mobile__burger',
              mobileOpen && 'ogcr-sidebar-mobile__burger--open',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
            aria-controls="ogcr-sidebar-drawer"
          >
            <span className="ogcr-sidebar-mobile__burger-bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>

        {mobileOpen && (
          <div
            className="ogcr-sidebar-mobile__scrim"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside
          id="ogcr-sidebar-drawer"
          className={drawerClasses}
          aria-label="Primary"
          aria-hidden={!mobileOpen}
        >
          <div className="ogcr-sidebar__head">
            <div className="ogcr-sidebar__brand">
              <LogoMark width={32} className="ogcr-sidebar__logo" />
              {product && (
                <>
                  <span className="ogcr-sidebar__divider" aria-hidden="true" />
                  <span className="ogcr-sidebar__product">{product}</span>
                </>
              )}
            </div>
            <button
              type="button"
              className="ogcr-sidebar__toggle ogcr-sidebar__toggle--mobile"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            >
              <XIcon />
            </button>
          </div>

          <NavBody
            items={items}
            activeId={activeId}
            collapsed={false}
            expanded={expanded}
            onSelect={handleSelect}
            toggleExpanded={toggleExpanded}
          />

          {(trailing || user) && (
            <div className="ogcr-sidebar__foot">
              {trailing && (
                <div className="ogcr-sidebar__foot-row">{trailing}</div>
              )}
              {user && (
                <UserChip
                  user={user}
                  onUserAction={onUserAction}
                  collapsed={false}
                />
              )}
            </div>
          )}
        </aside>
      </div>
    )
  }

  const classes = [
    'ogcr-sidebar',
    collapsed && 'ogcr-sidebar--collapsed',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <aside className={classes} aria-label="Primary">
      <div className="ogcr-sidebar__head">
        <div className="ogcr-sidebar__brand">
          <LogoMark width={collapsed ? 28 : 36} className="ogcr-sidebar__logo" />
          {!collapsed && product && (
            <>
              <span className="ogcr-sidebar__divider" aria-hidden="true" />
              <span className="ogcr-sidebar__product">{product}</span>
            </>
          )}
        </div>
        <button
          type="button"
          className="ogcr-sidebar__toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          aria-expanded={!collapsed}
        >
          <PanelLeftIcon />
        </button>
      </div>

      <NavBody
        items={items}
        activeId={activeId}
        collapsed={collapsed}
        expanded={expanded}
        onSelect={handleSelect}
        toggleExpanded={toggleExpanded}
      />

      {(trailing || user) && (
        <div className="ogcr-sidebar__foot">
          {trailing && (
            <div className="ogcr-sidebar__foot-row">{trailing}</div>
          )}
          {user && (
            <UserChip
              user={user}
              onUserAction={onUserAction}
              collapsed={collapsed}
            />
          )}
        </div>
      )}
    </aside>
  )
}
