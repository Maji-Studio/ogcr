import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navigation, type NavItem } from '.'
import {
  ChartBarIcon,
  FlaskIcon,
  FolderIcon,
  SquaresFourIcon,
  UserIcon,
  BellIcon,
} from '../icons'

const ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: <SquaresFourIcon /> },
  { id: 'sampling', label: 'Sampling', icon: <FlaskIcon /> },
  { id: 'insights', label: 'Insights', icon: <ChartBarIcon /> },
  { id: 'projects', label: 'Projects', icon: <FolderIcon /> },
  { id: 'profile', label: 'Profile', icon: <UserIcon /> },
]

const meta = {
  title: 'Modules/Navigation',
  component: Navigation,
  parameters: { layout: 'padded' },
  args: { items: ITEMS, activeId: 'overview' },
} satisfies Meta<typeof Navigation>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  render: (args) => {
    const [active, setActive] = useState(args.activeId)
    return (
      <Navigation
        {...args}
        activeId={active}
        onSelect={setActive}
        product="Operator platform"
        trailing={
          <button type="button" aria-label="Notifications" className="inline-flex w-40 h-40 items-center justify-center bg-transparent border border-border-medium rounded-8 cursor-pointer text-icon-primary hover:bg-surface-neutral [&>svg]:w-20 [&>svg]:h-20">
            <BellIcon />
          </button>
        }
      />
    )
  },
}

export const Mobile: Story = {
  render: (args) => {
    const [active, setActive] = useState('sampling')
    return (
      <div className="max-w-[420px]">
        <Navigation {...args} layout="mobile" activeId={active} onSelect={setActive} />
      </div>
    )
  },
}

/**
 * Items with an `href` render as real `<a>` elements — ⌘-click, middle-click and
 * "copy link address" all work. `render` projects a framework link component
 * (`render={<Link href="/overview" />}`) into the same markup.
 */
export const Links: Story = {
  args: {
    items: [
      { id: 'overview', label: 'Overview', icon: <SquaresFourIcon />, href: '#overview' },
      { id: 'sampling', label: 'Sampling', icon: <FlaskIcon />, href: '#sampling' },
      { id: 'insights', label: 'Insights', icon: <ChartBarIcon />, href: '#insights' },
      // Stands in for next/link, react-router NavLink, TanStack Link, …
      {
        id: 'projects',
        label: 'Projects',
        icon: <FolderIcon />,
        render: <a href="#projects" data-router-link="" />,
      },
      { id: 'profile', label: 'Profile', icon: <UserIcon /> },
    ],
    activeId: 'insights',
    product: 'Operator platform',
  },
}
