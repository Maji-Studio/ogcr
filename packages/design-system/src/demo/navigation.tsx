// Navigation & command surfaces — nav bars, sidebar, crumbs, pagination, tabs, menus, toolbar.
// One component per specimen section; App.tsx renders them in document order.

import { useState } from 'react'
import { Breadcrumb } from '../components/Breadcrumb'
import { Button } from '../components/Button'
import { ContextMenu } from '../components/ContextMenu'
import { Menu } from '../components/Menu'
import { Navigation } from '../components/Navigation'
import { Pagination } from '../components/Pagination'
import { SideNavigation } from '../components/SideNavigation'
import { Tabs } from '../components/Tabs'
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarSeparator,
} from '../components/Toolbar'
import {
  BellIcon,
  ChartBarIcon,
  DotsThreeIcon,
  FlaskIcon,
  FolderIcon,
  GearIcon,
  SquaresFourIcon,
  UserIcon,
} from '../components/icons'
import { NAV_ITEMS, SIDEBAR_ITEMS } from './data'
import { SectionHead } from './section-head'
import { sec } from './section-meta'

export function NavigationSpecimen() {
  const [activeNav, setActiveNav] = useState('overview')
  const [activeMobileNav, setActiveMobileNav] = useState('sampling')

  return (
      <section id="navigation" className="section reveal">
        <SectionHead meta={sec('navigation')} />
        <div className="section__body">
          <div className="nav-stack">
            <div className="nav-chrome">
              <Navigation
                items={NAV_ITEMS}
                activeId={activeNav}
                onSelect={setActiveNav}
                product="Operator platform"
                trailing={
                  <button type="button" className="nav-bell" aria-label="Notifications">
                    <BellIcon />
                  </button>
                }
              />
              <div className="nav-chrome__viewport">
                <div className="nav-chrome__viewport-content">
                  the {activeNav} workspace lives here.
                </div>
              </div>
            </div>
            <div className="nav-mobile-frame">
              <div className="nav-mobile-frame__viewport">
                the {activeMobileNav} workspace lives here.
              </div>
              <Navigation
                layout="mobile"
                items={NAV_ITEMS}
                activeId={activeMobileNav}
                onSelect={setActiveMobileNav}
              />
            </div>
          </div>
        </div>
      </section>
  )
}

export function SidebarSpecimen() {
  const [activeSidebar, setActiveSidebar] = useState('farm-parcels')
  const [activeMobileSidebar, setActiveMobileSidebar] = useState('overview')

  return (
      <section id="sidebar" className="section reveal">
        <SectionHead meta={sec('sidebar')} />
        <div className="section__body">
          <div className="nav-stack">
            <div className="sidebar-chrome">
              <SideNavigation
                items={SIDEBAR_ITEMS}
                activeId={activeSidebar}
                onSelect={setActiveSidebar}
                product="Operator platform"
                user={{ name: 'Camila Rojas', role: 'Reviewer · OGCR', initials: 'CR' }}
              />
              <div className="sidebar-chrome__viewport">
                <div className="sidebar-chrome__viewport-content">
                  the {activeSidebar} workspace lives here.
                </div>
              </div>
            </div>
            <div className="nav-mobile-frame">
              <SideNavigation
                layout="mobile"
                items={SIDEBAR_ITEMS}
                activeId={activeMobileSidebar}
                onSelect={setActiveMobileSidebar}
                product="Operator platform"
                user={{ name: 'Camila Rojas', role: 'Reviewer · OGCR', initials: 'CR' }}
              />
              <div className="nav-mobile-frame__viewport">
                the {activeMobileSidebar} workspace lives here.
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export function BreadcrumbSpecimen() {
  return (
      <section id="breadcrumb" className="section reveal">
        <SectionHead meta={sec('breadcrumb')} />
        <div className="section__body">
          <Breadcrumb
            items={[
              { label: 'Projects', href: '#' },
              { label: 'Iberian rewilding', href: '#' },
              { label: 'Sampling', href: '#' },
              { label: 'Plot 7' },
            ]}
          />
        </div>
      </section>
  )
}

export function PaginationSpecimen() {
  const [ledgerPage, setLedgerPage] = useState(3)

  return (
      <section id="pagination" className="section reveal">
        <SectionHead meta={sec('pagination')} />
        <div className="section__body">
          <Pagination page={ledgerPage} pageCount={12} onPageChange={setLedgerPage} />
        </div>
      </section>
  )
}

export function TabsSpecimen() {
  return (
      <section id="tabs" className="section reveal">
        <SectionHead meta={sec('tabs')} />
        <div className="section__body">
          <Tabs
            defaultValue="overview"
            items={[
              {
                value: 'overview',
                label: 'Overview',
                icon: <SquaresFourIcon />,
                content: (
                  <p className="text-body-s card__paragraph">
                    Project summary, current status, and key decision dates.
                  </p>
                ),
              },
              {
                value: 'sampling',
                label: 'Sampling',
                icon: <FlaskIcon />,
                content: (
                  <p className="text-body-s card__paragraph">
                    Field measurements collected across 12 plots.
                  </p>
                ),
              },
              {
                value: 'audit',
                label: 'Audit',
                icon: <ChartBarIcon />,
                content: (
                  <p className="text-body-s card__paragraph">
                    Reviewer findings and the remediation log.
                  </p>
                ),
              },
              {
                value: 'archive',
                label: 'Archive',
                disabled: true,
                content: (
                  <p className="text-body-s card__paragraph">Read-only historical records.</p>
                ),
              },
            ]}
          />
        </div>
      </section>
  )
}

export function MenuSpecimen() {
  return (
      <section id="menu" className="section reveal">
        <SectionHead meta={sec('menu')} />
        <div className="section__body">
          <div className="button-row">
            <Menu
              trigger={
                <Button variant="outlined" iconLeft={<DotsThreeIcon />}>
                  Project menu
                </Button>
              }
              items={[
                {
                  type: 'group',
                  id: 'view',
                  label: 'View',
                  items: [
                    { id: 'overview', label: 'Overview', icon: <SquaresFourIcon />, shortcut: '⌘1' },
                    { id: 'sampling', label: 'Sampling', icon: <FlaskIcon />, shortcut: '⌘2' },
                  ],
                },
                { type: 'separator', id: 'sep-1' },
                { type: 'checkbox', id: 'flagged', label: 'Show flagged only', defaultChecked: true },
                {
                  type: 'radio-group',
                  id: 'sort',
                  defaultValue: 'updated',
                  options: [
                    { value: 'updated', label: 'Sort by updated' },
                    { value: 'credits', label: 'Sort by credits' },
                  ],
                },
                { type: 'separator', id: 'sep-2' },
                {
                  type: 'submenu',
                  id: 'export',
                  label: 'Export as',
                  icon: <ChartBarIcon />,
                  items: [
                    { id: 'csv', label: 'CSV' },
                    { id: 'json', label: 'JSON' },
                  ],
                },
                { id: 'archive', label: 'Archive project', destructive: true },
              ]}
            />
            <Menu
              showArrow
              trigger={<Button variant="text">More</Button>}
              items={[
                { id: 'rename', label: 'Rename', icon: <FolderIcon /> },
                { id: 'invite', label: 'Invite reviewer', icon: <UserIcon /> },
                { type: 'separator', id: 'sep' },
                { id: 'remove', label: 'Remove from list', destructive: true },
              ]}
            />
          </div>
        </div>
      </section>
  )
}

export function ToolbarSpecimen() {
  return (
      <section id="toolbar" className="section reveal">
        <SectionHead meta={sec('toolbar')} />
        <div className="section__body">
          <div className="specimen-stack" style={{ gap: 16 }}>
            <Toolbar aria-label="Project toolbar">
              <ToolbarGroup>
                <ToolbarButton aria-label="Grid view">
                  <SquaresFourIcon />
                </ToolbarButton>
                <ToolbarButton aria-label="Chart view">
                  <ChartBarIcon />
                </ToolbarButton>
                <ToolbarButton aria-label="Files view">
                  <FolderIcon />
                </ToolbarButton>
              </ToolbarGroup>
              <ToolbarSeparator />
              <ToolbarInput
                aria-label="Filter projects"
                placeholder="Filter projects…"
                className="flex-1"
              />
              <ToolbarSeparator />
              <ToolbarButton>Export</ToolbarButton>
            </Toolbar>
            <Toolbar aria-label="Compact toolbar" density="compact">
              <ToolbarButton aria-label="Overview">
                <SquaresFourIcon />
              </ToolbarButton>
              <ToolbarButton aria-label="Sampling">
                <FlaskIcon />
              </ToolbarButton>
              <ToolbarSeparator />
              <ToolbarButton aria-label="Settings">
                <GearIcon />
              </ToolbarButton>
            </Toolbar>
          </div>
        </div>
      </section>
  )
}

export function ContextMenuSpecimen() {
  return (
      <section id="context-menu" className="section reveal">
        <SectionHead meta={sec('context-menu')} />
        <div className="section__body">
          <div className="specimen-stack" style={{ gap: 16 }}>
            <ContextMenu
              trigger={
                <Button variant="outlined" iconLeft={<DotsThreeIcon />}>
                  Project actions
                </Button>
              }
              header="Project actions"
              status="3 selected"
              items={[
                { id: 'open', label: 'Open project', icon: <FolderIcon /> },
                { id: 'export', label: 'Export sampling data', icon: <ChartBarIcon /> },
                { id: 'invite', label: 'Invite reviewer', icon: <UserIcon /> },
                { id: 'archive', label: 'Archive', icon: <DotsThreeIcon />, destructive: true },
              ]}
            />
            <ContextMenu
              trigger={<Button variant="text">More</Button>}
              items={[
                { id: 'rename', label: 'Rename' },
                { id: 'duplicate', label: 'Duplicate' },
                { id: 'share', label: 'Share' },
                { id: 'remove', label: 'Remove from list', destructive: true },
              ]}
            />
          </div>
        </div>
      </section>
  )
}
