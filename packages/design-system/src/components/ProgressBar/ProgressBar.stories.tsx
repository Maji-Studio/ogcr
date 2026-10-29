import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProgressBar } from '.'

const meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  parameters: { layout: 'padded' },
  args: { label: 'Methodology validation', value: 32 },
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Blue: Story = { args: { tone: 'blue', value: 64, label: 'Sampling complete' } }
export const Orange: Story = { args: { tone: 'orange', value: 88, label: 'Reviewer escalations' } }
export const Neutral: Story = { args: { tone: 'neutral', value: 100, label: 'Archive sweep' } }

export const AllTones: Story = {
  render: () => (
    <div className="flex flex-col gap-16 max-w-[480px]">
      <ProgressBar label="Methodology validation" value={32} />
      <ProgressBar label="Sampling complete" value={64} tone="blue" />
      <ProgressBar label="Reviewer escalations" value={88} tone="orange" />
      <ProgressBar label="Archive sweep" value={100} tone="neutral" />
    </div>
  ),
}

const answers = [
  { value: 12, tone: 'positive', label: 'Accepted' },
  { value: 5, tone: 'neutral', label: 'Pending' },
  { value: 2, tone: 'warning', label: 'Declined' },
] as const

/** Supplier answers on a data request. Composite meter: `role="img"` named by all segments. */
export const Segments: Story = {
  render: () => (
    <div className="max-w-[480px]">
      <ProgressBar label="Supplier answers" segments={[...answers]} />
    </div>
  ),
}

export const SegmentsNoLegend: Story = {
  render: () => (
    <div className="max-w-[480px]">
      <ProgressBar label="Supplier answers" segments={[...answers]} legend={false} />
    </div>
  ),
}

/** `max` sets the scale top, so the unfilled share of the track stays visible. */
export const SegmentsWithMax: Story = {
  render: () => (
    <div className="max-w-[480px]">
      <ProgressBar
        label="Soil samples, 2026 season"
        max={40}
        segments={[
          { value: 18, tone: 'positive', label: 'Measured' },
          { value: 9, tone: 'progress', label: 'Planned' },
        ]}
      />
    </div>
  ),
}
