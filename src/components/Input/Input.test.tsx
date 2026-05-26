import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '.'

describe('Input', () => {
  it('renders label associated with the control', () => {
    render(<Input label="Email" />)
    const input = screen.getByLabelText('Email')
    expect(input).toBeInTheDocument()
  })

  it('fires onChange when the user types', async () => {
    const onChange = vi.fn()
    render(<Input label="Name" onChange={onChange} />)
    await userEvent.type(screen.getByLabelText('Name'), 'ana')
    expect(onChange).toHaveBeenCalled()
  })

  it('exposes the error state via aria-invalid and shows the message', () => {
    render(<Input label="Email" error helperText="Required" />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  it('links helperText to the input via aria-describedby', () => {
    render(<Input label="Email" helperText="We will never share it" />)
    const input = screen.getByLabelText('Email')
    const helperId = input.getAttribute('aria-describedby')
    expect(helperId).toBeTruthy()
    expect(document.getElementById(helperId!)).toHaveTextContent('We will never share it')
  })
})
