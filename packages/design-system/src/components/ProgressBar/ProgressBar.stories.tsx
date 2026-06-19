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
