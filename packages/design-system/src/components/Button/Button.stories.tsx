import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '.'
import { ArrowRightIcon, GearIcon, PlusIcon, SearchIcon } from '../icons'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  args: { children: 'Primary action' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['filled', 'outlined', 'text'] },
    size: { control: 'inline-radio', options: [undefined, 's', 'm', 'l'] },
    shape: { control: 'inline-radio', options: ['rounded', 'circle'] },
    fullWidth: { control: 'boolean' },
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

/** `s` (32px) is below the 40×40 minimum target — only use it inside a padded row. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-12">
      <Button size="s">Small · 32</Button>
      <Button size="m">Medium · 40</Button>
      <Button size="l">Large · 48</Button>
    </div>
  ),
}

export const FullWidth: Story = {
  render: () => (
    <div className="flex w-[320px] flex-col gap-12">
      <Button fullWidth>Save changes</Button>
      <Button variant="outlined" fullWidth>
        Cancel
      </Button>
      <Button variant="text" fullWidth iconLeft={<PlusIcon />}>
        Add another
      </Button>
    </div>
  ),
}

/** Icon-only buttons carry no visible text, so `aria-label` is required by the type. */
export const IconOnly: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-12">
      <Button iconOnly size="s" variant="outlined" aria-label="Add row" iconLeft={<PlusIcon />} />
      <Button iconOnly size="m" variant="outlined" aria-label="Settings" iconLeft={<GearIcon />} />
      <Button iconOnly size="l" aria-label="Search" iconLeft={<SearchIcon />} />
    </div>
  ),
}

/** The floating action button: icon-only + `shape="circle"` + elevation. */
export const FloatingAction: Story = {
  render: () => (
    <Button
      iconOnly
      shape="circle"
      aria-label="Open walkthrough controls"
      className="shadow-elevation-l"
      iconLeft={<GearIcon />}
    />
  ),
}
