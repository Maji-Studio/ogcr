import type { Meta, StoryObj } from '@storybook/react-vite'
import { Breadcrumb } from '.'

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  parameters: { layout: 'padded' },
  args: {
    items: [
      { label: 'Projects', href: '#' },
      { label: 'Mangrove Restoration', href: '#' },
      { label: 'Credits' },
    ],
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const SlashSeparator: Story = { args: { separator: '/' } }
export const TwoLevels: Story = {
  args: { items: [{ label: 'Registry', href: '#' }, { label: 'Overview' }] },
}
