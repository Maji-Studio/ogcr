import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select } from '.'

const options = [
  { value: 'verified', label: 'Verified' },
  { value: 'pending', label: 'Pending review' },
  { value: 'issued', label: 'Issued' },
  { value: 'retired', label: 'Retired' },
  { value: 'rejected', label: 'Rejected', disabled: true },
]

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: { layout: 'padded' },
  args: { options, placeholder: 'Select a status', 'aria-label': 'Status' },
  decorators: [(Story) => <div className="w-[280px]"><Story /></div>],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithValue: Story = { args: { defaultValue: 'issued' } }
export const Error: Story = { args: { error: true } }
export const Disabled: Story = { args: { disabled: true, defaultValue: 'verified' } }
