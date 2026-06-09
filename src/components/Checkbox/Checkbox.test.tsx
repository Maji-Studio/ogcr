import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from '.'

describe('Checkbox', () => {
  it('renders the label as an accessible name', () => {
    render(<Checkbox label="Accept terms" />)
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeInTheDocument()
  })

  it('calls onChange with true when toggled from unchecked', async () => {
    const onChange = vi.fn()
    render(<Checkbox label="Toggle" checked={false} onChange={onChange} />)
    await userEvent.click(screen.getByRole('checkbox', { name: 'Toggle' }))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('reflects the indeterminate state on the checkbox', () => {
    render(<Checkbox label="Maybe" checked="indeterminate" />)
    expect(screen.getByRole('checkbox', { name: 'Maybe' })).toHaveAttribute(
      'data-indeterminate',
    )
  })

  it('sets aria-invalid when error is true', () => {
    render(<Checkbox label="Required" error />)
    expect(screen.getByRole('checkbox', { name: 'Required' })).toHaveAttribute(
      'aria-invalid',
      'true',
    )
  })

  it('does not call onChange when disabled', async () => {
    const onChange = vi.fn()
    render(<Checkbox label="Off" disabled onChange={onChange} />)
    await userEvent.click(screen.getByRole('checkbox', { name: 'Off' }))
    expect(onChange).not.toHaveBeenCalled()
  })
})
