import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox, type CheckboxValue } from '.'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: { layout: 'padded' },
  args: { label: 'I agree to the terms' },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Unchecked: Story = { args: { checked: false } }
export const Checked: Story = { args: { checked: true } }
export const Indeterminate: Story = { args: { checked: 'indeterminate' } }
export const Error: Story = { args: { error: true, label: 'Required field' } }
export const Disabled: Story = { args: { disabled: true, checked: true, label: 'Disabled option' } }

export const BorderLeft: Story = {
  args: {
    layout: 'border-left',
    label: 'Verified registry',
    secondaryText: 'Manual review by an OGCR analyst',
    checked: true,
  },
}

export const Interactive: Story = {
  render: () => {
    const [v, setV] = useState<CheckboxValue>(false)
    return <Checkbox label="Click me" checked={v} onChange={setV} />
  },
}
