import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '.'
import { ArrowRightIcon, SearchIcon } from '../icons'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  args: { children: 'Primary action' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['filled', 'outlined', 'text'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Filled: Story = { args: { variant: 'filled' } }
export const Outlined: Story = { args: { variant: 'outlined', children: 'Secondary' } }
export const Text: Story = { args: { variant: 'text', children: 'Tertiary' } }
export const WithLeadingIcon: Story = {
  args: { variant: 'outlined', children: 'Search', iconLeft: <SearchIcon /> },
}
export const WithTrailingIcon: Story = {
  args: { variant: 'filled', children: 'Continue', iconRight: <ArrowRightIcon /> },
}
export const Disabled: Story = { args: { disabled: true, children: 'Disabled' } }

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-12">
      <Button variant="filled">Primary action</Button>
      <Button variant="filled" iconRight={<ArrowRightIcon />}>Continue</Button>
      <Button variant="outlined">Secondary</Button>
      <Button variant="outlined" iconLeft={<SearchIcon />}>Search</Button>
      <Button variant="text">Tertiary</Button>
      <Button variant="filled" disabled>Disabled</Button>
    </div>
  ),
}
