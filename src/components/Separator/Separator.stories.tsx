import type { Meta, StoryObj } from '@storybook/react-vite'
import { Separator } from '.'

const meta = {
  title: 'Components/Separator',
  component: Separator,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="w-[320px]"><Story /></div>],
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {}

export const WithLabel: Story = { args: { label: 'or' } }

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-12 h-24 text-s text-text-secondary">
      <span>Drafts</span>
      <Separator orientation="vertical" />
      <span>Published</span>
      <Separator orientation="vertical" />
      <span>Archived</span>
    </div>
  ),
}
