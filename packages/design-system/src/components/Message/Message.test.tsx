import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Message, type MessageState } from '.'

describe('Message', () => {
  it('renders the title and description', () => {
    render(<Message title="Audit scheduled" description="A verifier visits on 12 May." />)
    expect(screen.getByText('Audit scheduled')).toBeInTheDocument()
    expect(screen.getByText('A verifier visits on 12 May.')).toBeInTheDocument()
  })

  // Spec §4.9: role="alert" is reserved for the error state; every other state
  // (warning included) announces politely through role="status".
  it.each<[MessageState, string]>([
    ['neutral', 'status'],
    ['success', 'status'],
    ['warning', 'status'],
    ['error', 'alert'],
  ])('gives the %s state role="%s"', (state, role) => {
    const { container } = render(<Message state={state} title="Heads up" />)
    expect(container.querySelector('[data-slot="message"]')).toHaveAttribute('role', role)
  })

  it('records the state on the root for styling hooks', () => {
    const { container } = render(<Message state="warning" title="Variance is high" />)
    expect(container.querySelector('[data-slot="message"]')).toHaveAttribute('data-state', 'warning')
  })

  it('hides the decorative state icon from assistive tech', () => {
    const { container } = render(<Message state="success" title="Verified" />)
    expect(container.querySelector('[data-slot="message-icon"]')).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders an action button that calls onAction', async () => {
    const onAction = vi.fn()
    render(<Message title="Findings open" actionLabel="Review" onAction={onAction} />)
    await userEvent.click(screen.getByRole('button', { name: 'Review' }))
    expect(onAction).toHaveBeenCalledTimes(1)
  })

  it('only shows the dismiss button for the floating type', async () => {
    const onDismiss = vi.fn()
    const { rerender } = render(<Message title="Inline" onDismiss={onDismiss} />)
    expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument()

    rerender(<Message type="floating" title="Floating" onDismiss={onDismiss} />)
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('accepts an overridden dismiss label', () => {
    render(<Message type="floating" title="Floating" dismissLabel="Close message" />)
    expect(screen.getByRole('button', { name: 'Close message' })).toBeInTheDocument()
  })

  it('merges a consumer className with the variant classes', () => {
    const { container } = render(<Message state="error" title="Failed" className="mt-16" />)
    const root = container.querySelector('[data-slot="message"]')
    expect(root).toHaveClass('mt-16')
    expect(root).toHaveClass('bg-surface-negative')
  })
})
