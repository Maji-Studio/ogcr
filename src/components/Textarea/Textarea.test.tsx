import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from '.'

describe('Textarea', () => {
  it('renders label associated with the control', () => {
    render(<Textarea label="Notes" />)
    expect(screen.getByLabelText('Notes')).toBeInTheDocument()
  })

  it('fires onChange when the user types', async () => {
    const onChange = vi.fn()
    render(<Textarea label="Notes" onChange={onChange} />)
    await userEvent.type(screen.getByLabelText('Notes'), 'hi')
    expect(onChange).toHaveBeenCalled()
  })

  it('exposes the error state via aria-invalid and shows the message', () => {
    render(<Textarea label="Notes" errorText="Required" />)
    const control = screen.getByLabelText('Notes')
    expect(control).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  it('links helperText to the control via aria-describedby', () => {
    render(<Textarea label="Notes" helperText="Markdown supported" />)
    const control = screen.getByLabelText('Notes')
    const helperId = control.getAttribute('aria-describedby')
    expect(helperId).toBeTruthy()
    expect(document.getElementById(helperId!)).toHaveTextContent('Markdown supported')
  })
})
