import type { Meta, StoryObj } from '@storybook/react-vite'
import { Slider } from '.'

const meta = {
  title: 'Components/Slider',
  component: Slider,
  parameters: { layout: 'padded' },
  args: { 'aria-label': 'Buffer pool contribution', defaultValue: 40 },
  decorators: [(Story) => <div className="w-[320px]"><Story /></div>],
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLabelAndValue: Story = {
  args: { label: 'Buffer pool', showValue: true, defaultValue: 25 },
}

export const Percent: Story = {
  args: {
    label: 'Reversal buffer',
    showValue: true,
    defaultValue: 0.2,
    min: 0,
    max: 1,
    step: 0.05,
    format: { style: 'percent' },
  },
}

export const Error: Story = {
  args: { label: 'Allocation', showValue: true, defaultValue: 90, error: true },
}

export const Disabled: Story = {
  args: { label: 'Locked', showValue: true, defaultValue: 50, disabled: true },
}
