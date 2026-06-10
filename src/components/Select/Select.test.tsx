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
})
