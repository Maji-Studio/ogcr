import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Calendar } from '.'

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

const surface = 'rounded-12 border border-border-light shadow-elevation-l'

export const Single: Story = {
  render: () => {
    const [selected, setSelected] = useState<Date>()
    return (
      <Calendar mode="single" selected={selected} onSelect={setSelected} className={surface} />
    )
  },
}

export const Range: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>()
    return <Calendar mode="range" selected={range} onSelect={setRange} className={surface} />
  },
}

export const MultiMonth: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>()
    return (
      <Calendar
        mode="range"
        numberOfMonths={2}
        selected={range}
        onSelect={setRange}
        className={surface}
      />
    )
  },
}

export const DropdownCaption: Story = {
  render: () => {
    const [selected, setSelected] = useState<Date>()
    return (
      <Calendar
        mode="single"
        captionLayout="dropdown"
        startMonth={new Date(2020, 0)}
        endMonth={new Date(2030, 11)}
        selected={selected}
        onSelect={setSelected}
        className={surface}
      />
    )
  },
}
