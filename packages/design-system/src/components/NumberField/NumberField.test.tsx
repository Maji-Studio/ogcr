import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NumberField } from '.'

describe('NumberField', () => {
  it('associates the label with the input', () => {
    render(<NumberField label="Credits" defaultValue={100} />)
    expect(screen.getByLabelText('Credits')).toBeInTheDocument()
  })

  it('increments via the increase button', async () => {
    const onValueChange = vi.fn()
    render(<NumberField label="Credits" defaultValue={100} onValueChange={onValueChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }))
    expect(onValueChange).toHaveBeenCalledWith(101, expect.anything())
  })

  it('decrements via the decrease button', async () => {
    const onValueChange = vi.fn()
    render(<NumberField label="Credits" defaultValue={100} onValueChange={onValueChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Decrease' }))
    expect(onValueChange).toHaveBeenCalledWith(99, expect.anything())
  })

  it('shows the error message and sets aria-invalid', () => {
    render(<NumberField label="Credits" errorText="Too many" />)
    expect(screen.getByLabelText('Credits')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Too many')).toBeInTheDocument()
  })

  it('forwards aria-describedby (FormField interop)', () => {
    render(<NumberField label="Credits" aria-describedby="hint-1" />)
    expect(screen.getByLabelText('Credits')).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('hint-1'),
    )
  })

  it('disables the steppers when disabled', () => {
    render(<NumberField label="Credits" defaultValue={100} disabled />)
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled()
  })
})
