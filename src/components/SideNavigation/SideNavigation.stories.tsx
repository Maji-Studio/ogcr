import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SideNavigation, type SideNavigationItem } from '.'
import {
  ChartBarIcon,
  FlaskIcon,
  FolderIcon,
  GearIcon,
  LeafIcon,
  SquaresFourIcon,
} from '../icons'

const ITEMS: SideNavigationItem[] = [
  { id: 'overview', label: 'Overview', icon: <SquaresFourIcon /> },
  {
    id: 'farm',
    label: 'Farm & parcel',
    icon: <LeafIcon />,
    children: [
      { id: 'farm-all', label: 'All farms', badge: 38 },
      { id: 'farm-parcels', label: 'Parcels' },
      { id: 'farm-plots', label: 'Plots' },
    ],
  },
  { id: 'sample', label: 'Sample', icon: <FlaskIcon />, badge: 4 },
  { id: 'analytics', label: 'Analytics', icon: <ChartBarIcon /> },
  { id: 'projects', label: 'Projects', icon: <FolderIcon /> },
  { id: 'settings', label: 'Settings', icon: <GearIcon /> },
]

const USER = { name: 'Camila Rojas', role: 'Reviewer · OGCR', initials: 'CR' }

const meta = {
  title: 'Modules/SideNavigation',
  component: SideNavigation,
  parameters: { layout: 'fullscreen' },
  args: { items: ITEMS, activeId: 'farm-parcels' },
} satisfies Meta<typeof SideNavigation>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  render: (args) => {
    const [active, setActive] = useState(args.activeId)
    return (
      <div className="flex min-h-[640px] bg-surface-page">
        <SideNavigation {...args} activeId={active} onSelect={setActive} product="Operator platform" user={USER} />
      </div>
    )
  },
}

export const Collapsed: Story = {
  render: (args) => {
    const [active, setActive] = useState(args.activeId)
    return (
      <div className="flex min-h-[640px] bg-surface-page">
        <SideNavigation {...args} activeId={active} onSelect={setActive} product="Operator platform" user={USER} defaultCollapsed />
      </div>
    )
  },
}

export const Mobile: Story = {
  render: (args) => {
    const [active, setActive] = useState('overview')
    return (
      <div className="relative w-[360px] h-[600px] bg-surface-page overflow-hidden mx-auto">
        <SideNavigation {...args} layout="mobile" activeId={active} onSelect={setActive} product="Operator platform" user={USER} />
      </div>
    )
  },
}
