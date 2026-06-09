import type { Meta, StoryObj } from '@storybook/react-vite'
import { Menu } from '.'
import { Button } from '../Button'
import { GearIcon, UserIcon, FolderIcon } from '../icons'

const meta = {
  title: 'Components/Menu',
  component: Menu,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Menu>

export default meta
type Story = StoryObj<typeof meta>

export const Actions: Story = {
  args: {
    trigger: <Button variant="outlined">Open menu</Button>,
    items: [
      { id: 'profile', label: 'Profile', icon: <UserIcon />, shortcut: '⌘P' },
      { id: 'settings', label: 'Settings', icon: <GearIcon /> },
      { id: 'sep', type: 'separator' },
      { id: 'delete', label: 'Delete', destructive: true },
    ],
  },
}

export const Grouped: Story = {
  args: {
    trigger: <Button variant="outlined">Account</Button>,
    items: [
      {
        id: 'g1',
        type: 'group',
        label: 'Workspace',
        items: [
          { id: 'files', label: 'Files', icon: <FolderIcon /> },
          { id: 'members', label: 'Members', icon: <UserIcon /> },
        ],
      },
      { id: 'sep', type: 'separator' },
      { id: 'g2', type: 'group', label: 'Preferences', items: [{ id: 'settings', label: 'Settings' }] },
    ],
  },
}

export const CheckboxAndRadio: Story = {
  args: {
    trigger: <Button variant="outlined">View</Button>,
    items: [
      { id: 'grid', type: 'checkbox', label: 'Show grid', defaultChecked: true },
      { id: 'labels', type: 'checkbox', label: 'Show labels' },
      { id: 'sep', type: 'separator' },
      {
        id: 'density',
        type: 'radio-group',
        defaultValue: 'comfortable',
        options: [
          { value: 'comfortable', label: 'Comfortable' },
          { value: 'compact', label: 'Compact' },
        ],
      },
    ],
  },
}

export const WithSubmenu: Story = {
  args: {
    trigger: <Button variant="outlined">Share</Button>,
    items: [
      { id: 'copy', label: 'Copy link' },
      {
        id: 'invite',
        type: 'submenu',
        label: 'Invite people',
        items: [
          { id: 'email', label: 'By email' },
          { id: 'link', label: 'Anyone with the link' },
        ],
        disabled: false,
      },
      {
        id: 'export',
        type: 'submenu',
        label: 'Export (disabled)',
        disabled: true,
        items: [{ id: 'pdf', label: 'PDF' }],
      },
    ],
  },
}

export const WithArrow: Story = {
  args: {
    trigger: <Button variant="outlined">Open menu</Button>,
    showArrow: true,
    side: 'bottom',
    align: 'center',
    items: [
      { id: 'profile', label: 'Profile', icon: <UserIcon /> },
      { id: 'settings', label: 'Settings', icon: <GearIcon /> },
    ],
  },
}

export const LongScrollable: Story = {
  args: {
    trigger: <Button variant="outlined">Pick a timezone</Button>,
    maxHeight: 280,
    items: Array.from({ length: 24 }, (_, i) => ({
      id: `tz-${i}`,
      label: `GMT${i < 12 ? '-' : '+'}${String(Math.abs(i - 12)).padStart(2, '0')}:00`,
    })),
  },
}
