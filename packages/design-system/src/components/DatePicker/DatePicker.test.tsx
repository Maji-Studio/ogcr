import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DatePicker } from '.'
import { FormField } from '../Form'

describe('DatePicker', () => {
  it('shows the placeholder when no date is selected', () => {
    render(<DatePicker aria-label="Date" placeholder="Pick a day" />)
    expect(screen.getByRole('button', { name: 'Date' })).toHaveTextContent('Pick a day')
  })

  it('opens the calendar and emits the chosen date', async () => {
    const onChange = vi.fn()
    render(<DatePicker aria-label="Date" defaultValue={new Date(2026, 5, 1)} onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Date' }))
    await userEvent.click(await screen.findByRole('button', { name: /15/ }))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toBeInstanceOf(Date)
  })

  it('renders the formatted selected date', () => {
    render(<DatePicker aria-label="Date" defaultValue={new Date(2026, 5, 9)} />)
    expect(screen.getByRole('button', { name: 'Date' })).toHaveTextContent(/Jun/)
  })

  it('clears the selected date via the clear affordance', async () => {
    const onChange = vi.fn()
    render(
      <DatePicker aria-label="Date" clearable defaultValue={new Date(2026, 5, 9)} onChange={onChange} />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Clear date' }))
    expect(onChange).toHaveBeenCalledWith(undefined)
    expect(screen.getByRole('button', { name: 'Date' })).toHaveTextContent('Select date')
  })

  it('wires into FormField (label association + error state)', () => {
    render(
      <FormField label="Effective date" errorText="A date is required.">
        <DatePicker />
      </FormField>,
    )
    // The label is associated to the trigger via FormField's cloned id, so the
    // trigger's accessible name comes from the label and aria-invalid is set.
    const trigger = screen.getByRole('button', { name: 'Effective date' })
    expect(trigger).toHaveAttribute('aria-invalid', 'true')
    expect(trigger).toHaveAttribute('aria-describedby')
  })
})
