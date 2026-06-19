import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from '.'
import { UserIcon } from '../icons'

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  args: { name: 'Jane Cooper' },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Initials: Story = {}

export const Image: Story = {
  args: {
    src: 'https://i.pravatar.cc/96?img=5',
    name: 'Jane Cooper',
    size: 'l',
  },
}

export const IconFallback: Story = {
  args: { name: undefined, initials: <UserIcon />, size: 'l' },
}

export const Square: Story = {
  args: { shape: 'square', name: 'Maji Studio', size: 'l' },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-12">
      <Avatar name="Jane Cooper" size="xs" />
      <Avatar name="Jane Cooper" size="s" />
      <Avatar name="Jane Cooper" size="m" />
      <Avatar name="Jane Cooper" size="l" />
      <Avatar name="Jane Cooper" size="xl" />
    </div>
  ),
}
