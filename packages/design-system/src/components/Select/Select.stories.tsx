import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Select, type SelectProps } from '.'

// Meta types the single-select shape; the `multiple` stories pass explicit props.
type SingleSelectProps = Extract<SelectProps, { multiple?: false }>

const options = [
  { value: 'verified', label: 'Verified' },
  { value: 'pending', label: 'Pending review' },
  { value: 'issued', label: 'Issued' },
  { value: 'retired', label: 'Retired' },
  { value: 'rejected', label: 'Rejected', disabled: true },
]

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: { layout: 'padded' },
  args: { options, placeholder: 'Select a status', 'aria-label': 'Status' },
  decorators: [(Story) => <div className="w-[280px]"><Story /></div>],
} satisfies Meta<SingleSelectProps>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithValue: Story = { args: { defaultValue: 'issued' } }
export const Error: Story = { args: { error: true } }
export const Disabled: Story = { args: { disabled: true, defaultValue: 'verified' } }

const crops = [
  { value: 'wheat', label: 'Wheat' },
  { value: 'barley', label: 'Barley' },
  { value: 'maize', label: 'Maize' },
  { value: 'rapeseed', label: 'Rapeseed' },
  { value: 'grassland', label: 'Grassland' },
]

const cropsWithParcels = [
  { value: 'wheat', label: 'Wheat', meta: '4 parcels' },
  { value: 'barley', label: 'Barley', meta: '2 parcels' },
  { value: 'maize', label: 'Maize', meta: '3 parcels' },
  { value: 'rapeseed', label: 'Rapeseed', meta: '1 parcel' },
  { value: 'grassland', label: 'Grassland', meta: '6 parcels' },
]

/** Rows get a checkbox and the menu stays open while you toggle crops. */
export const Multiple: Story = {
  render: () => (
    <Select multiple options={crops} placeholder="Select crops" aria-label="Crops" />
  ),
}

/** Up to two labels are joined; a third switches the trigger to a count. */
export const MultipleWithValue: Story = {
  render: () => (
    <Select
      multiple
      options={crops}
      defaultValue={['wheat', 'barley']}
      placeholder="Select crops"
      aria-label="Crops"
    />
  ),
}

export const MultipleCount: Story = {
  render: () => (
    <Select
      multiple
      options={crops}
      defaultValue={['wheat', 'maize', 'grassland']}
      aria-label="Crops"
    />
  ),
}

export const MultipleWithMeta: Story = {
  render: () => (
    <Select
      multiple
      options={cropsWithParcels}
      defaultValue={['wheat']}
      placeholder="Select crops"
      aria-label="Crops"
    />
  ),
}

export const MultipleControlled: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['rapeseed'])
    return (
      <div className="flex flex-col gap-12">
        <Select
          multiple
          label="Crops"
          helperText="Pick every crop grown on this farm."
          options={crops}
          value={value}
          onValueChange={setValue}
        />
        <p className="m-0 font-standard text-s text-text-secondary">Selected: {value.join(', ') || 'none'}</p>
      </div>
    )
  },
}

export const MultipleError: Story = {
  render: () => (
    <Select
      multiple
      options={crops}
      label="Crops"
      errorText="Choose at least one crop."
      placeholder="Select crops"
    />
  ),
}

export const MultipleDisabled: Story = {
  render: () => (
    <Select multiple disabled options={crops} defaultValue={['barley']} aria-label="Crops" />
  ),
}
