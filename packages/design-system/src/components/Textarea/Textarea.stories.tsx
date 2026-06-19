import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from '.'

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: { layout: 'padded' },
  args: { label: 'Reviewer notes', placeholder: 'Add context for the verification team…' },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithHelper: Story = {
  args: { helperText: 'Visible to reviewers only. Markdown supported.' },
}
export const Error: Story = {
  args: { defaultValue: 'Too short', errorText: 'Please provide at least 50 characters.' },
}
export const Disabled: Story = {
  args: { defaultValue: 'Locked after issuance.', disabled: true },
}
export const NoResize: Story = { args: { resize: 'none', rows: 6 } }
