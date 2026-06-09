import type { Meta, StoryObj } from '@storybook/react-vite'
import { NumberField } from '.'

const meta = {
  title: 'Components/NumberField',
  component: NumberField,
  parameters: { layout: 'padded' },
  args: { label: 'Credits to retire', defaultValue: 100, min: 0 },
  decorators: [(Story) => <div className="w-[280px]"><Story /></div>],
} satisfies Meta<typeof NumberField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHelper: Story = {
  args: { helperText: 'Whole credits only.', step: 1 },
}

export const Error: Story = {
  args: { errorText: 'Exceeds available balance.', defaultValue: 9999 },
}

export const Currency: Story = {
  args: {
    label: 'Price per tonne',
    defaultValue: 18.5,
    step: 0.5,
    format: { style: 'currency', currency: 'USD' },
  },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 100 },
}
