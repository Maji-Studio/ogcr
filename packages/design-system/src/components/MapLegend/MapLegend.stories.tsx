import type { Meta, StoryObj } from '@storybook/react-vite'
import { MapLegend } from '.'

const meta = {
  title: 'Components/MapLegend',
  component: MapLegend,
  parameters: { layout: 'padded' },
  // The legend pins itself to the bottom-left of its positioned parent (the map).
  decorators: [
    (Story) => (
      <div className="relative h-160 w-320 rounded-16 bg-surface-neutral">
        <Story />
      </div>
    ),
  ],
  args: {
    title: 'Carbon potential',
    items: [
      { label: 'High potential', token: '--ds-orange-500' },
      { label: 'Medium potential', token: '--ds-amber-300' },
      { label: 'Not eligible', token: '--ds-border-strong' },
    ],
  },
} satisfies Meta<typeof MapLegend>

export default meta
type Story = StoryObj<typeof meta>

export const CarbonPotential: Story = {}

export const Campaign: Story = {
  args: {
    title: 'Your fields',
    items: [
      { label: 'Enrolled', token: '--ds-interaction-primary-default' },
      { label: 'Included', token: '--ds-orange-500' },
      { label: 'Withdrawn', token: '--ds-border-strong' },
    ],
  },
}
