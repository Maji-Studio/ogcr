import type { Meta, StoryObj } from '@storybook/react-vite'
import { Kpi } from '.'

const meta = {
  title: 'Components/Kpi',
  component: Kpi,
  parameters: { layout: 'padded' },
  args: { label: 'Total credits issued', value: '0' },
} satisfies Meta<typeof Kpi>

export default meta
type Story = StoryObj<typeof meta>

export const Positive: Story = {
  args: {
    label: 'Total credits issued',
    value: '694,820 t',
    secondaryText: 'Year to date',
    status: { label: 'On track', tone: 'positive' },
    tone: 'positive',
  },
}

export const Warning: Story = {
  args: {
    label: 'Pending validations',
    value: '14',
    secondaryText: '3 due this week',
    status: { label: 'Attention', tone: 'warning' },
    tone: 'warning',
  },
}

export const Negative: Story = {
  args: {
    label: 'Failed audits',
    value: '2',
    secondaryText: 'Reopened by reviewer',
    status: { label: 'Action needed', tone: 'negative' },
    tone: 'negative',
  },
}

export const Neutral: Story = {
  args: {
    label: 'Active projects',
    value: '38',
    secondaryText: 'Across 12 jurisdictions',
    tone: 'neutral',
  },
}

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-16 max-w-[640px]">
      <Kpi label="Total credits issued" value="694,820 t" secondaryText="YTD" status={{ label: 'On track', tone: 'positive' }} tone="positive" />
      <Kpi label="Pending validations" value="14" secondaryText="3 due" status={{ label: 'Attention', tone: 'warning' }} tone="warning" />
      <Kpi label="Failed audits" value="2" secondaryText="Reopened" status={{ label: 'Action needed', tone: 'negative' }} tone="negative" />
      <Kpi label="Active projects" value="38" secondaryText="12 jurisdictions" tone="neutral" />
    </div>
  ),
}
