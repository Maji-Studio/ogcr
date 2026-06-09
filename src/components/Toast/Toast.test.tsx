import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastProvider, useToast } from '.'

function Trigger() {
  const toast = useToast()
  return (
    <button
      onClick={() => toast.add({ title: 'Saved', description: 'Changes stored', type: 'success' })}
    >
      Notify
    </button>
  )
}

describe('Toast', () => {
  it('adds a toast with title and description on demand', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Notify' }))
    expect(await screen.findByText('Saved')).toBeInTheDocument()
    expect(screen.getByText('Changes stored')).toBeInTheDocument()
  })

  it('dismisses the toast when the close button is clicked', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Notify' }))
    await screen.findByText('Saved')
    // Base UI keeps toast controls out of the a11y tree until the viewport is
    // focused/hovered (its announcement pattern), so target the close button by
    // its data-slot rather than its role/name.
    const closeButton = document.querySelector('[data-slot="toast-close"]') as HTMLElement
    await userEvent.click(closeButton)
    await waitFor(() => expect(screen.queryByText('Saved')).not.toBeInTheDocument())
  })
})
