import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pill } from '.'

const meta = {
  title: 'Components/Pill',
  component: Pill,
  parameters: { layout: 'centered' },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['neutral', 'positive', 'warning', 'negative'],
    },
  },
  args: { children: 'Verified' },
} satisfies Meta<typeof Pill>

export default meta
type Story = StoryObj<typeof meta>

export const Neutral: Story = { args: { tone: 'neutral', children: 'Neutral' } }
export const Positive: Story = { args: { tone: 'positive', children: 'Verified' } }
export const Warning: Story = { args: { tone: 'warning', children: 'In review' } }
export const Negative: Story = { args: { tone: 'negative', children: 'Flagged' } }

export const AllTones: Story = {
  render: () => (
    <div className="flex items-center gap-12">
      <Pill tone="neutral">Neutral</Pill>
      <Pill tone="positive">Verified</Pill>
      <Pill tone="warning">In review</Pill>
      <Pill tone="negative">Flagged</Pill>
    </div>
  ),
}
