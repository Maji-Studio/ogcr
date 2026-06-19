import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { DatePicker } from '.'
import { FormField } from '../Form'

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: { 'aria-label': 'Start date' },
}

export const Controlled: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date(2026, 5, 9))
    return <DatePicker aria-label="Date" value={date} onChange={setDate} />
  },
}

export const Clearable: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date(2026, 5, 9))
    return <DatePicker aria-label="Date" clearable value={date} onChange={setDate} />
  },
}

export const Disabled: Story = {
  args: { 'aria-label': 'Date', disabled: true },
}

export const Bounded: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>()
    return (
      <DatePicker
        aria-label="Booking date"
        value={date}
        onChange={setDate}
        minDate={new Date(2026, 5, 1)}
        maxDate={new Date(2026, 5, 30)}
      />
    )
  },
}

export const WithinForm: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>()
    return (
      <FormField
        label="Effective date"
        required
        helperText="When the credit issuance takes effect."
        className="w-[280px]"
      >
        <DatePicker value={date} onChange={setDate} clearable />
      </FormField>
    )
  },
}

export const Invalid: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>()
    return (
      <FormField label="Effective date" required errorText="A date is required." className="w-[280px]">
        <DatePicker value={date} onChange={setDate} />
      </FormField>
    )
  },
}
