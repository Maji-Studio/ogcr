import type { Meta, StoryObj } from '@storybook/react-vite'
import { Message } from '.'

const meta = {
  title: 'Components/Message',
  component: Message,
  parameters: { layout: 'padded' },
  args: { title: 'Message title', description: 'A short description.' },
} satisfies Meta<typeof Message>

export default meta
type Story = StoryObj<typeof meta>

export const Neutral: Story = {
  args: { state: 'neutral', title: 'Methodology v3.2 published' },
}
export const Success: Story = {
  args: { state: 'success', title: 'Project verified', description: '42,180 t CO₂e is now eligible for issuance.' },
}
export const Warning: Story = {
  args: { state: 'warning', title: 'Sampling variance is high', description: 'Plot 7 deviates from baseline by 18%.' },
}
export const Error: Story = {
  args: { state: 'error', title: 'Audit failed', description: 'Two findings require remediation.' },
}
export const Floating: Story = {
  args: { state: 'success', type: 'floating', title: 'Saved as draft', onDismiss: () => {} },
}
export const WithAction: Story = {
  args: { state: 'neutral', title: 'New release available', actionLabel: 'Read changelog' },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-16">
      <Message state="neutral" title="Methodology v3.2 published" actionLabel="Read changelog" />
      <Message state="success" title="Project verified" actionLabel="View certificate" />
      <Message state="warning" title="Sampling variance is high" actionLabel="Inspect" />
      <Message state="error" title="Audit failed" actionLabel="Open findings" />
    </div>
  ),
}
