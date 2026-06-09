import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from '.'

describe('Switch', () => {
  it('renders the label as an accessible name', () => {
    render(<Switch label="Notifications" />)
    expect(screen.getByRole('switch', { name: 'Notifications' })).toBeInTheDocument()
  })

  it('calls onCheckedChange with true when toggled on', async () => {
    const onCheckedChange = vi.fn()
    render(<Switch label="Toggle" checked={false} onCheckedChange={onCheckedChange} />)
    await userEvent.click(screen.getByRole('switch', { name: 'Toggle' }))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('sets aria-invalid when error is true', () => {
    render(<Switch label="Required" error />)
    expect(screen.getByRole('switch', { name: 'Required' })).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not fire when disabled', async () => {
    const onCheckedChange = vi.fn()
    render(<Switch label="Off" disabled onCheckedChange={onCheckedChange} />)
    await userEvent.click(screen.getByRole('switch', { name: 'Off' }))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it('forwards aria-describedby (FormField interop)', () => {
    render(<Switch label="Synced" aria-describedby="hint-1" />)
    expect(screen.getByRole('switch', { name: 'Synced' })).toHaveAttribute(
      'aria-describedby',
      'hint-1',
    )
  })
})
