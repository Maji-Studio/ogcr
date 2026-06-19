import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs } from '.'
import { ChartBarIcon, FolderIcon, GearIcon } from '../icons'

const items = [
  { value: 'overview', label: 'Overview', icon: <FolderIcon />, content: 'Project overview and current verification stage.' },
  { value: 'data', label: 'Sampling data', icon: <ChartBarIcon />, content: 'Time-series of measured removals for this batch.' },
  { value: 'settings', label: 'Settings', icon: <GearIcon />, content: 'Configure issuance and retirement rules.' },
]

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: { layout: 'padded' },
  args: { items },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Vertical: Story = { args: { orientation: 'vertical' } }

export const WithDisabledTab: Story = {
  args: {
    items: [
      ...items.slice(0, 2),
      { value: 'audit', label: 'Audit log', content: 'Locked until issuance.', disabled: true },
    ],
  },
}

export const TextOnly: Story = {
  args: {
    items: items.map((item) => ({ value: item.value, label: item.label, content: item.content })),
  },
}
