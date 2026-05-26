import type { Meta, StoryObj } from '@storybook/react-vite'
import { Logo, LogoMark } from '.'

const meta = {
  title: 'Brand/Logo',
  component: Logo,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { width: 129 } }
export const Large: Story = { args: { width: 240 } }
export const Small: Story = { args: { width: 64 } }

export const Mark: StoryObj = {
  render: () => <LogoMark width={64} />,
}

export const SizeStack: StoryObj = {
  render: () => (
    <div className="flex items-center gap-24">
      <Logo width={64} />
      <Logo width={129} />
      <Logo width={240} />
    </div>
  ),
}
