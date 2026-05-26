import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '.'
import { MailIcon, SearchIcon } from '../icons'

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: { layout: 'padded' },
  args: { label: 'Email address', placeholder: 'you@example.com' },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithLeadingIcon: Story = {
  args: { iconLeft: <MailIcon />, helperText: "We'll never share your email." },
}
export const Search: Story = {
  args: { label: 'Search', placeholder: 'Search projects', iconLeft: <SearchIcon /> },
}
export const Error: Story = {
  args: { defaultValue: 'not-an-email', error: true, helperText: 'Enter a valid email address.' },
}
export const Disabled: Story = {
  args: { defaultValue: 'admin@example.com', disabled: true },
}
