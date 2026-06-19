import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AlertDialog } from '.'

describe('AlertDialog', () => {
  it('renders as an alertdialog labelled by its title', () => {
    render(<AlertDialog open title="Discard changes?" description="Edits will be lost." />)
    const dialog = screen.getByRole('alertdialog', { name: 'Discard changes?' })
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAccessibleDescription('Edits will be lost.')
  })

  it('fires onConfirm and closes when the confirm button is clicked', async () => {
    const onConfirm = vi.fn()
    render(
      <AlertDialog defaultOpen title="Delete?" confirmLabel="Delete" onConfirm={onConfirm} />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onConfirm).toHaveBeenCalled()
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('fires onCancel and closes when the cancel button is clicked', async () => {
    const onCancel = vi.fn()
    render(
      <AlertDialog defaultOpen title="Delete?" cancelLabel="Keep" onCancel={onCancel} />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Keep' }))
    expect(onCancel).toHaveBeenCalled()
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('opens via the trigger', async () => {
    render(<AlertDialog trigger={<button>Open</button>} title="Confirm" />)
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(await screen.findByRole('alertdialog', { name: 'Confirm' })).toBeInTheDocument()
  })
})
