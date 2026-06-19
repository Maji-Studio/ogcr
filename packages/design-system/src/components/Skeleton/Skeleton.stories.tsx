import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from '.'

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Rectangular: Story = { args: { width: 280, height: 120 } }
export const Circular: Story = { args: { variant: 'circular', width: 48, height: 48 } }
export const TextLine: Story = { args: { variant: 'text', width: 240 } }
export const Paragraph: Story = { args: { variant: 'text', lines: 4 } }

export const Card: Story = {
  render: () => (
    <div className="flex flex-col gap-12 w-[320px] p-16 bg-surface-light border border-border-light rounded-12">
      <div className="flex items-center gap-12">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex flex-col gap-8 flex-1">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton height={140} />
      <Skeleton variant="text" lines={3} />
    </div>
  ),
}
