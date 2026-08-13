import type { Meta, StoryObj } from '@storybook/react-vite'
import { Kpi } from '.'
import { CurrencyEurIcon, LeafIcon, MapIcon } from '../icons'

const meta = {
  title: 'Components/Kpi',
  component: Kpi,
  parameters: { layout: 'padded' },
  args: { label: 'Total credits issued', value: '0' },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['positive', 'warning', 'negative', 'neutral', 'progress'],
    },
    accentBar: { control: 'boolean' },
  },
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

export const Progress: Story = {
  args: {
    label: 'Parcels in proposal',
    value: '7',
    secondaryText: 'Terms sent, awaiting reply',
    status: { label: 'In flight', tone: 'progress' },
    tone: 'progress',
  },
}

/** The icon slot sits in the identity row alongside the default accent bar; pair it with `accentBar={false}` (next story) when the icon should carry the tile alone. */
export const WithIcon: Story = {
  args: {
    label: 'Expected payment',
    value: '€1,200 to €1,800',
    secondaryText: 'Across 4 parcels',
    icon: <CurrencyEurIcon />,
    tone: 'neutral',
  },
}

/** `accentBar={false}` gives a quiet, icon-led stat tile. */
export const WithoutAccentBar: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-16 max-w-[840px]">
      <Kpi accentBar={false} icon={<MapIcon />} label="Your parcels" value="12" secondaryText="3 awaiting terms" />
      <Kpi accentBar={false} icon={<LeafIcon />} label="Carbon removed" value="1.4 to 2.2 t" secondaryText="Estimated range" />
      <Kpi accentBar={false} icon={<CurrencyEurIcon />} label="Expected payment" value="€1,200 to €1,800" secondaryText="Across 4 parcels" />
    </div>
  ),
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
