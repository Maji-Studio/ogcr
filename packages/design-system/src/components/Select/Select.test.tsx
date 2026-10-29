import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Select } from '.'

const options = [
  { value: 'verified', label: 'Verified' },
  { value: 'pending', label: 'Pending review' },
  { value: 'issued', label: 'Issued' },
]

const getTrigger = () =>
  document.querySelector('[data-slot="select-trigger"]') as HTMLElement

describe('Select', () => {
  it('shows the placeholder until a value is chosen', () => {
    render(<Select options={options} placeholder="Pick one" />)
    expect(screen.getByText('Pick one')).toBeInTheDocument()
  })

  it('opens the listbox and selects an option', async () => {
    const onValueChange = vi.fn()
    render(<Select options={options} placeholder="Pick one" onValueChange={onValueChange} />)
    await userEvent.click(getTrigger())
    await userEvent.click(await screen.findByRole('option', { name: 'Issued' }))
    expect(onValueChange).toHaveBeenCalledWith('issued', expect.anything())
    expect(getTrigger()).toHaveTextContent('Issued')
  })

  it('reflects the default value on the trigger', () => {
    render(<Select options={options} defaultValue="verified" />)
    expect(getTrigger()).toHaveTextContent('Verified')
  })

  it('sets aria-invalid when error is true', () => {
    render(<Select options={options} error />)
    expect(getTrigger()).toHaveAttribute('aria-invalid', 'true')
  })

  it('forwards aria-describedby (FormField interop)', () => {
    render(<Select options={options} aria-describedby="hint-1" />)
    expect(getTrigger()).toHaveAttribute('aria-describedby', 'hint-1')
  })

  it('associates a label and links errorText via aria-describedby', () => {
    render(<Select options={options} label="Status" errorText="Pick a status" />)
    const trigger = getTrigger()
    // Label is associated with the trigger button.
    expect(screen.getByText('Status').closest('label')).toHaveAttribute('for', trigger.id)
    expect(trigger).toHaveAttribute('aria-invalid', 'true')
    const describedBy = trigger.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(document.getElementById(describedBy!)).toHaveTextContent('Pick a status')
  })

  describe('multiple', () => {
    const crops = [
      { value: 'wheat', label: 'Wheat' },
      { value: 'barley', label: 'Barley' },
      { value: 'maize', label: 'Maize' },
    ]

    it('shows the placeholder while nothing is selected', () => {
      render(<Select multiple options={crops} placeholder="Select crops" aria-label="Crops" />)
      expect(getTrigger()).toHaveTextContent('Select crops')
    })

    it('toggles several options, keeps the menu open and reports an array', async () => {
      const onValueChange = vi.fn()
      render(<Select multiple options={crops} aria-label="Crops" onValueChange={onValueChange} />)
      await userEvent.click(getTrigger())
      await userEvent.click(await screen.findByRole('option', { name: 'Wheat' }))
      await userEvent.click(await screen.findByRole('option', { name: 'Maize' }))
      expect(onValueChange).toHaveBeenLastCalledWith(['wheat', 'maize'], expect.anything())
      expect(screen.getByRole('listbox')).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Wheat' })).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByRole('option', { name: 'Barley' })).toHaveAttribute('aria-selected', 'false')
      expect(getTrigger()).toHaveTextContent('Wheat, Maize')
    })

    it('deselects an option on a second click', async () => {
      const onValueChange = vi.fn()
      render(
        <Select multiple options={crops} defaultValue={['wheat']} aria-label="Crops" onValueChange={onValueChange} />,
      )
      await userEvent.click(getTrigger())
      await userEvent.click(await screen.findByRole('option', { name: 'Wheat' }))
      expect(onValueChange).toHaveBeenLastCalledWith([], expect.anything())
    })

    it('collapses to a count past the label threshold', () => {
      render(<Select multiple options={crops} defaultValue={['wheat', 'barley', 'maize']} aria-label="Crops" />)
      expect(getTrigger()).toHaveTextContent('3 selected')
    })

    it('honours maxVisibleLabels and selectedCountLabel', () => {
      render(
        <Select
          multiple
          options={crops}
          defaultValue={['wheat', 'barley']}
          maxVisibleLabels={1}
          selectedCountLabel={(n) => `${n} Kulturen`}
          aria-label="Crops"
        />,
      )
      expect(getTrigger()).toHaveTextContent('2 Kulturen')
    })

    it('renders an item meta', async () => {
      render(
        <Select multiple options={[{ value: 'wheat', label: 'Wheat', meta: '4 parcels' }]} aria-label="Crops" />,
      )
      await userEvent.click(getTrigger())
      expect(await screen.findByText('4 parcels')).toBeInTheDocument()
    })

    it('submits no values while disabled', () => {
      const { container } = render(
        <form>
          <Select multiple disabled name="crops" options={crops} defaultValue={['wheat']} aria-label="Crops" />
        </form>,
      )
      expect(new FormData(container.querySelector('form')!).getAll('crops')).toEqual([])
    })
  })
})
