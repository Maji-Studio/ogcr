import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Combobox, type ComboboxProps } from '.'

// Meta types the single (free text) shape; the `multiple` stories pass explicit props.
type SingleComboboxProps = Extract<ComboboxProps, { multiple?: false }>

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
} satisfies Meta<SingleComboboxProps>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithValue: Story = { args: { defaultValue: 'Biochar' } }
export const Error: Story = { args: { error: true } }
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Direct air capture' } }

const farms = [
  'Aldermoor Farm',
  'Brookside Barton',
  'Cold Harbour Fields',
  'Dunmere Estate',
  'Eastfield Grange',
  'Fernhill Acres',
  'Greywell Holdings',
  'Hollin Bank',
]

/** Search, then pick several farms. Chosen farms become removable chips. */
export const Multiple: Story = {
  args: { items: farms },
  render: () => (
    <div className="w-full">
      <Combobox multiple items={farms} label="Farms" placeholder="Search farms" />
    </div>
  ),
}

export const MultipleWithValue: Story = {
  render: () => (
    <div className="w-full">
      <Combobox
        multiple
        items={farms}
        label="Farms"
        helperText="Showing results for these farms."
        defaultValue={['Aldermoor Farm', 'Dunmere Estate', 'Hollin Bank']}
        placeholder="Search farms"
      />
    </div>
  ),
}

export const MultipleControlled: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['Brookside Barton'])
    return (
      <div className="flex flex-col gap-12 w-full">
        <Combobox
          multiple
          items={farms}
          label="Farms"
          value={value}
          onValueChange={setValue}
          placeholder="Search farms"
        />
        <p className="m-0 font-standard text-s text-text-secondary">Selected: {value.length}</p>
      </div>
    )
  },
}

export const MultipleError: Story = {
  render: () => (
    <div className="w-full">
      <Combobox
        multiple
        items={farms}
        label="Farms"
        errorText="Choose at least one farm."
        placeholder="Search farms"
      />
    </div>
  ),
}

export const MultipleDisabled: Story = {
  render: () => (
    <div className="w-full">
      <Combobox multiple disabled items={farms} defaultValue={['Fernhill Acres']} aria-label="Farms" />
    </div>
  ),
}
