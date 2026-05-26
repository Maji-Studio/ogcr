import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Radio, RadioGroup } from '.'

const meta = {
  title: 'Components/Radio',
  component: Radio,
  parameters: { layout: 'padded' },
  args: { label: 'Option A', value: 'a' },
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

const decorate = (radio: React.ReactNode, value?: string) => (
  <RadioGroup aria-label="Demo" value={value}>
    {radio}
  </RadioGroup>
)

export const Unchecked: Story = { render: (args) => decorate(<Radio {...args} />) }
export const Checked: Story = { render: (args) => decorate(<Radio {...args} />, args.value) }
export const Error: Story = {
  args: { error: true, label: 'Required' },
  render: (args) => decorate(<Radio {...args} />),
}
export const Disabled: Story = {
  args: { disabled: true, label: 'Disabled option' },
  render: (args) => decorate(<Radio {...args} />),
}

export const BorderLeft: Story = {
  args: {
    layout: 'border-left',
    label: 'Full audit',
    secondaryText: 'Field visit + sampling',
    value: 'full',
  },
  render: (args) => decorate(<Radio {...args} />, args.value),
}

export const Group: Story = {
  render: () => {
    const [plan, setPlan] = useState('annual')
    return (
      <RadioGroup aria-label="Plan" value={plan} onValueChange={setPlan}>
        <Radio value="monthly" label="Monthly" />
        <Radio value="annual" label="Annual" />
        <Radio value="custom" label="Custom" disabled />
      </RadioGroup>
    )
  },
}
