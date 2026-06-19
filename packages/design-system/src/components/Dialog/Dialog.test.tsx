import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dialog } from '.'

describe('Dialog', () => {
  it('uses the title as the dialog label and the description for aria-describedby', () => {
    render(
      <Dialog open title="Retire credits" description="Moves credits to retired.">
        body
      </Dialog>,
    )
    const dialog = screen.getByRole('dialog', { name: 'Retire credits' })
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAccessibleDescription('Moves credits to retired.')
  })

  it('opens via the trigger', async () => {
    render(
      <Dialog trigger={<button>Open</button>} title="Settings">
        body
      </Dialog>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(await screen.findByRole('dialog', { name: 'Settings' })).toBeInTheDocument()
  })

  it('closes via the corner close button', async () => {
    const onOpenChange = vi.fn()
    render(
      <Dialog open onOpenChange={onOpenChange} title="X">
        body
      </Dialog>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything())
  })

  it('runs the primary action handler and closes the dialog', async () => {
    const onClick = vi.fn()
    render(
      <Dialog defaultOpen title="Confirm" primaryAction={{ label: 'Save', onClick }}>
        body
      </Dialog>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(onClick).toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps the dialog open when an action sets closeOnClick=false', async () => {
    const onClick = vi.fn()
    render(
      <Dialog
        defaultOpen
        title="Confirm"
        primaryAction={{ label: 'Apply', onClick, closeOnClick: false }}
      >
        body
      </Dialog>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(onClick).toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('omits the corner close button when showClose is false', () => {
    render(
      <Dialog open title="X" showClose={false}>
        body
      </Dialog>,
    )
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
  })
})
