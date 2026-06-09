import { useState, type ComponentProps, type ReactNode } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { Avatar } from '../Avatar'
import { LogoMark } from '../Logo'
import { CaretDownIcon, DotsThreeIcon, PanelLeftIcon, XIcon } from '../icons'
import { cn } from '../../lib/cn'

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

export type SideNavigationProps = Omit<ComponentProps<'aside'>, 'children' | 'onSelect'> & {
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
  layout?: 'desktop' | 'mobile'
  mobileTrigger?: ReactNode
  className?: string
}

const navButton = (active: boolean, collapsed: boolean) =>
  cn(
    'group relative flex items-center gap-12 w-full h-40 px-12 bg-transparent border-0 rounded-8 cursor-pointer text-left',
    'font-standard font-medium text-s tracking-[0.28px]',
    'transition-[background-color,color] duration-150',
    'hover:bg-surface-neutral hover:text-text-primary',
    'focus-visible:outline-2 focus-visible:outline-interaction-primary-default focus-visible:outline-offset-2',
    active ? 'bg-interaction-primary-focus text-text-primary' : 'text-text-secondary',
    active && !collapsed && 'before:content-[""] before:absolute before:-left-0.5 before:top-2 before:bottom-2 before:w-[3px] before:rounded-r-2 before:bg-interaction-primary-default',
    collapsed && 'justify-center p-0 w-40 h-40 mx-auto',
  )

const subButton = (active: boolean) =>
  cn(
    'relative flex items-center gap-12 w-full min-h-[32px] py-4 px-12 bg-transparent border-0 rounded-4 cursor-pointer text-left',
    'font-standard font-medium text-s tracking-[0.28px]',
    'transition-[background-color,color] duration-150',
    'hover:bg-surface-neutral hover:text-text-primary',
    'focus-visible:outline-2 focus-visible:outline-interaction-primary-default focus-visible:outline-offset-2',
    active ? 'bg-interaction-primary-focus text-text-primary' : 'text-text-secondary',
  )

type NavBodyProps = {
  items: SideNavigationItem[]
  activeId: string
  collapsed: boolean
  expanded: Set<string>
  onSelect: (id: string) => void
  toggleExpanded: (id: string) => void
}

function NavBody({ items, activeId, collapsed, expanded, onSelect, toggleExpanded }: NavBodyProps) {
  return (
    <nav data-slot="sidebar-nav" aria-label="Sections" className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden w-full">
      <ul className="list-none m-0 p-0 flex flex-col gap-4">
        {items.map((item) => {
          const hasChildren = !!item.children?.length
          const isExpanded = expanded.has(item.id)
          const isActive = item.id === activeId
          const childActive = hasChildren && item.children!.some((c) => c.id === activeId)
          const showActive = isActive || (childActive && (!isExpanded || collapsed))

          return (
            <li key={item.id} className="relative">
              <button
                type="button"
                className={navButton(showActive, collapsed)}
                onClick={() => {
                  if (hasChildren && !collapsed) toggleExpanded(item.id)
                  else onSelect(item.id)
                }}
                aria-current={isActive ? 'page' : undefined}
                aria-expanded={hasChildren && !collapsed ? isExpanded : undefined}
                aria-controls={hasChildren && !collapsed ? `sidenav-${item.id}-children` : undefined}
                title={collapsed ? item.label : undefined}
              >
                <span
                  className={cn(
                    'inline-flex w-20 h-20 shrink-0 transition-colors duration-150 [&>svg]:w-full [&>svg]:h-full',
                    showActive ? 'text-icon-primary' : 'text-icon-secondary group-hover:text-icon-primary',
                  )}
                >
                  {item.icon}
                </span>
                {!collapsed && (
                  <>
                    <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.label}
                    </span>
                    {item.badge !== undefined && (
                      <span className={cn(
                        'inline-flex items-center justify-center min-w-80 h-20 px-[6px] font-standard text-[11px] font-semibold tracking-[0.4px] text-text-primary rounded-full',
                        showActive ? 'bg-surface-light' : 'bg-surface-neutral',
                      )}>
                        {item.badge}
                      </span>
                    )}
                    {hasChildren && (
                      <span aria-hidden="true" className={cn(
                        'inline-flex w-16 h-16 text-icon-secondary transition-transform duration-200 [&>svg]:w-full [&>svg]:h-full',
                        isExpanded && 'rotate-180',
                      )}>
                        <CaretDownIcon />
                      </span>
                    )}
                  </>
                )}
              </button>

              {hasChildren && isExpanded && !collapsed && (
                <ul
                  id={`sidenav-${item.id}-children`}
                  className="list-none m-0 mt-4 mb-8 ml-[18px] pl-12 flex flex-col gap-4 border-l border-border-light"
                >
                  {item.children!.map((child) => {
                    const childIsActive = child.id === activeId
                    return (
                      <li key={child.id} className="relative">
                        {childIsActive && (
                          <span
                            aria-hidden="true"
                            className="absolute -left-[13px] top-1.5 bottom-1.5 w-2 bg-interaction-primary-default rounded-full"
                          />
                        )}
                        <button
                          type="button"
                          className={subButton(childIsActive)}
                          onClick={() => onSelect(child.id)}
                          aria-current={childIsActive ? 'page' : undefined}
                        >
                          <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                            {child.label}
                          </span>
                          {child.badge !== undefined && (
                            <span className="inline-flex items-center justify-center min-w-80 h-20 px-[6px] font-standard text-[11px] font-semibold tracking-[0.4px] text-text-primary bg-surface-neutral rounded-full">
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
      onClick={onUserAction}
      aria-label={`Account · ${user.name}`}
      title={collapsed ? user.name : undefined}
      className={cn(
        'relative flex items-center gap-12 w-full p-8 bg-transparent border-0 rounded-8 cursor-pointer text-left',
        'transition-colors duration-150 hover:bg-surface-neutral',
        'focus-visible:outline-2 focus-visible:outline-interaction-primary-default focus-visible:outline-offset-2',
        collapsed && 'w-40 h-40 p-0 justify-center',
      )}
    >
      <Avatar aria-hidden name={user.name} initials={user.initials} size="m" />
      {!collapsed && (
        <>
          <span className="flex flex-col min-w-0 flex-1 gap-px">
            <span className="font-standard font-medium text-s text-text-primary whitespace-nowrap overflow-hidden text-ellipsis">
              {user.name}
            </span>
            {user.role && (
              <span className="font-standard font-normal text-[12px] text-text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
                {user.role}
              </span>
            )}
          </span>
          <span aria-hidden="true" className="inline-flex w-24 h-24 items-center justify-center text-icon-secondary [&>svg]:w-full [&>svg]:h-full">
            <DotsThreeIcon />
          </span>
        </>
      )}
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
  ...rest
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
    items.filter((i) => i.children?.some((c) => c.id === activeId)).map((i) => i.id)
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
    return (
      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen} modal>
        <div data-slot="sidebar-mobile" className="relative w-full">
          <div className="flex items-center gap-12 h-56 px-12 bg-surface-light border-b border-border-light rounded-t-12">
            <div className="inline-flex items-center gap-12 flex-1 min-w-0">
              <LogoMark width={32} />
              {product && (
                <>
                  <span aria-hidden="true" className="inline-block w-px h-[18px] bg-border-medium shrink-0" />
                  <span className="font-standard font-medium text-s text-text-primary tracking-[0.28px] whitespace-nowrap overflow-hidden text-ellipsis">
                    {product}
                  </span>
                </>
              )}
            </div>
            {mobileTrigger && <div className="inline-flex items-center gap-4 shrink-0">{mobileTrigger}</div>}
            <Dialog.Trigger
              render={
                <button
                  type="button"
                  aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
                  className="inline-flex items-center justify-center w-40 h-40 bg-transparent border-0 rounded-8 cursor-pointer text-icon-primary shrink-0 transition-colors duration-150 hover:bg-surface-neutral focus-visible:outline-none focus-visible:shadow-focus-primary"
                >
                  <span aria-hidden="true" className="relative inline-block w-20 h-[14px]">
                    <span className={cn('absolute left-0 w-full h-[1.6px] bg-current rounded-[2px] transition-[transform,opacity,top] duration-200', mobileOpen ? 'top-[6.2px] rotate-45' : 'top-0')} />
                    <span className={cn('absolute left-0 w-full h-[1.6px] bg-current rounded-[2px] top-[6.2px] transition-opacity duration-150', mobileOpen && 'opacity-0')} />
                    <span className={cn('absolute left-0 w-full h-[1.6px] bg-current rounded-[2px] transition-[transform,top] duration-200', mobileOpen ? 'top-[6.2px] -rotate-45' : 'top-[12.4px]')} />
                  </span>
                </button>
              }
            />
          </div>

          <Dialog.Portal>
            <Dialog.Backdrop
              className={cn(
                'fixed inset-0 z-40 bg-[rgba(15,54,85,0.36)] backdrop-blur-[2px]',
                'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
                'transition-opacity duration-200',
              )}
            />
            <Dialog.Popup
              data-slot="sidebar-mobile-drawer"
              className={cn(
                'fixed top-0 left-0 z-50 flex flex-col w-[88vw] max-w-[360px] h-svh bg-surface-light shadow-elevation-l outline-none',
                'data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full',
                'transition-transform duration-200 ease-out',
                className,
              )}
            >
              <div className="flex items-center justify-between gap-12 h-56 px-12 border-b border-border-light">
                <div className="inline-flex items-center gap-12 flex-1 min-w-0">
                  <LogoMark width={32} className="inline-flex shrink-0 h-auto" />
                  {product && (
                    <>
                      <span aria-hidden="true" className="inline-block w-px h-[18px] bg-border-medium shrink-0" />
                      <Dialog.Title className="m-0 font-standard font-medium text-s text-text-primary tracking-[0.28px] whitespace-nowrap overflow-hidden text-ellipsis">
                        {product}
                      </Dialog.Title>
                    </>
                  )}
                </div>
                <Dialog.Close
                  aria-label="Close navigation"
                  className="inline-flex items-center justify-center w-40 h-40 bg-transparent border-0 rounded-8 cursor-pointer text-icon-primary transition-colors duration-150 hover:bg-surface-neutral focus-visible:outline-none focus-visible:shadow-focus-primary [&>svg]:w-20 [&>svg]:h-20"
                >
                  <XIcon />
                </Dialog.Close>
              </div>

              <div className="flex flex-col gap-24 p-16 flex-1 min-h-0">
                <NavBody
                  items={items}
                  activeId={activeId}
                  collapsed={false}
                  expanded={expanded}
                  onSelect={handleSelect}
                  toggleExpanded={toggleExpanded}
                />

                {(trailing || user) && (
                  <div className="flex flex-col gap-8 pt-16 border-t border-border-light w-full">
                    {trailing && <div className="flex items-center gap-4 w-full">{trailing}</div>}
                    {user && <UserChip user={user} onUserAction={onUserAction} collapsed={false} />}
                  </div>
                )}
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        </div>
      </Dialog.Root>
    )
  }

  return (
    <aside
      {...rest}
      data-slot="sidebar"
      aria-label="Primary"
      className={cn(
        'flex flex-col gap-24 min-h-full p-16 bg-surface-light border-r border-border-light rounded-l-12',
        'transition-[width,padding] duration-200',
        collapsed ? 'w-[72px] py-16 px-8 items-center' : 'w-[264px]',
        className,
      )}
    >
      <div className={cn('flex items-center justify-between gap-8 min-h-128 w-full', collapsed && 'flex-col gap-16')}>
        <div className={cn('inline-flex items-center gap-12 min-w-0 flex-1', collapsed && 'justify-center')}>
          <LogoMark width={collapsed ? 28 : 36} className="inline-flex shrink-0 h-auto transition-[width] duration-200" />
          {!collapsed && product && (
            <>
              <span aria-hidden="true" className="inline-block w-px h-[18px] bg-border-medium shrink-0" />
              <span className="font-standard font-medium text-s text-text-primary tracking-[0.28px] whitespace-nowrap overflow-hidden text-ellipsis">
                {product}
              </span>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          aria-expanded={!collapsed}
          className="inline-flex items-center justify-center w-32 h-32 bg-transparent border-0 rounded-8 cursor-pointer text-icon-secondary shrink-0 transition-colors duration-150 hover:bg-surface-neutral hover:text-icon-primary focus-visible:outline-none focus-visible:shadow-focus-primary"
        >
          <PanelLeftIcon className={cn('w-20 h-20 transition-transform duration-200', collapsed && '-scale-x-100')} />
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
        <div className={cn('flex flex-col gap-8 pt-16 border-t border-border-light w-full', collapsed && 'items-center')}>
          {trailing && (
            <div className={cn('flex items-center gap-4 w-full', collapsed && 'flex-col')}>
              {trailing}
            </div>
          )}
          {user && <UserChip user={user} onUserAction={onUserAction} collapsed={collapsed} />}
        </div>
      )}
    </aside>
  )
}
