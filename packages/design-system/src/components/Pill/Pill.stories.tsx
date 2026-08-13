import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pill } from '.'
import { CheckCircleIcon } from '../icons'

const meta = {
  title: 'Components/Pill',
  component: Pill,
  parameters: { layout: 'centered' },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['neutral', 'positive', 'warning', 'negative', 'progress'],
    },
    dot: { control: 'boolean' },
  },
  args: { children: 'Verified' },
} satisfies Meta<typeof Pill>

export default meta
type Story = StoryObj<typeof meta>

export const Neutral: Story = { args: { tone: 'neutral', children: 'Neutral' } }
export const Positive: Story = { args: { tone: 'positive', children: 'Verified' } }
export const Warning: Story = { args: { tone: 'warning', children: 'In review' } }
export const Negative: Story = { args: { tone: 'negative', children: 'Flagged' } }
export const Progress: Story = { args: { tone: 'progress', children: 'In proposal' } }

export const AllTones: Story = {
  render: () => (
    <div className="flex items-center gap-12">
      <Pill tone="neutral">Neutral</Pill>
      <Pill tone="positive">Verified</Pill>
      <Pill tone="warning">In review</Pill>
      <Pill tone="negative">Flagged</Pill>
      <Pill tone="progress">In proposal</Pill>
    </div>
  ),
}

/** `dot` tints itself from the tone's text colour, so state pills stay on-token. */
export const WithDot: Story = {
  render: () => (
    <div className="flex items-center gap-12">
      <Pill dot tone="neutral">
        Not offered
      </Pill>
      <Pill dot tone="progress">
        Open
      </Pill>
      <Pill dot tone="warning">
        Awaiting approval
      </Pill>
      <Pill dot tone="positive">
        Enrolled
      </Pill>
    </div>
  ),
}

/** `leading` takes any node — an icon, or a dot in a colour the tone scale doesn't cover. */
export const WithLeadingIcon: Story = {
  render: () => (
    <div className="flex items-center gap-12">
      <Pill tone="positive" leading={<CheckCircleIcon />}>
        Verified
      </Pill>
      <Pill tone="neutral" leading={<span className="inline-block w-8 h-8 rounded-full bg-brand-blue-300" />}>
        Custom dot
      </Pill>
    </div>
  ),
}
