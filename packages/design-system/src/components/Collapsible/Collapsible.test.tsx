import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Collapsible } from '.'

describe('Collapsible', () => {
  it('hides the panel content until opened', async () => {
    render(<Collapsible trigger="More">Hidden detail</Collapsible>)
    expect(screen.queryByText('Hidden detail')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /More/ }))
    expect(await screen.findByText('Hidden detail')).toBeInTheDocument()
  })

  it('shows content when defaultOpen is set', () => {
    render(<Collapsible trigger="More" defaultOpen>Visible detail</Collapsible>)
    expect(screen.getByText('Visible detail')).toBeInTheDocument()
  })

  it('fires onOpenChange when toggled', async () => {
    const onOpenChange = vi.fn()
    render(<Collapsible trigger="More" onOpenChange={onOpenChange}>x</Collapsible>)
    await userEvent.click(screen.getByRole('button', { name: /More/ }))
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything())
  })

  it('does not toggle when disabled', async () => {
    const onOpenChange = vi.fn()
    render(<Collapsible trigger="More" disabled onOpenChange={onOpenChange}>x</Collapsible>)
    await userEvent.click(screen.getByRole('button', { name: /More/ }))
    expect(onOpenChange).not.toHaveBeenCalled()
  })
})
