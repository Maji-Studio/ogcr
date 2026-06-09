import type { Meta, StoryObj } from '@storybook/react-vite'
import { Combobox } from '.'

const items = [
  'Afforestation',
  'Biochar',
  'Direct air capture',
  'Enhanced weathering',
  'Ocean alkalinity',
  'Reforestation',
  'Soil carbon',
]

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  parameters: { layout: 'padded' },
  args: { items, placeholder: 'Search pathways…' },
  decorators: [(Story) => <div className="w-[280px]"><Story /></div>],
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithValue: Story = { args: { defaultValue: 'Biochar' } }
export const Error: Story = { args: { error: true } }
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Direct air capture' } }
