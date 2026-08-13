import type { Meta, StoryObj } from '@storybook/react-vite'
import { ContextMenu } from '.'
import { Button } from '../Button'
import { ChartBarIcon, DotsThreeIcon, FolderIcon, UserIcon } from '../icons'

const meta = {
  title: 'Modules/ContextMenu',
  component: ContextMenu,
  parameters: { layout: 'centered' },
  args: {
    trigger: <Button variant="outlined">Open menu</Button>,
    defaultOpen: true,
    items: [
      { id: 'rename', label: 'Rename' },
      { id: 'duplicate', label: 'Duplicate' },
      { id: 'share', label: 'Share' },
      { id: 'remove', label: 'Remove from list', destructive: true },
    ],
  },
  argTypes: {
    width: { control: 'inline-radio', options: ['s', 'm', 'l', 'auto'] },
  },
} satisfies Meta<typeof ContextMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {}

/** Shares Popover's width scale: `s` 256 · `m` 280 · `l` 320 (default) · `auto`. */
export const Narrow: Story = { args: { width: 's' } }

export const WithHeaderAndIcons: Story = {
  args: {
    header: 'Project actions',
    status: '3 selected',
    items: [
      { id: 'open', label: 'Open project', icon: <FolderIcon /> },
      { id: 'export', label: 'Export sampling data', icon: <ChartBarIcon /> },
      { id: 'invite', label: 'Invite reviewer', icon: <UserIcon /> },
      { id: 'archive', label: 'Archive', icon: <DotsThreeIcon />, destructive: true },
    ],
  },
}
