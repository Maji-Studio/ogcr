import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidesheet } from '.'

describe('Sidesheet', () => {
  it('renders the title and uses it as the dialog label when open', () => {
    render(
      <Sidesheet open title="Edit project">
        body
      </Sidesheet>,
    )
    expect(screen.getByRole('dialog', { name: 'Edit project' })).toBeInTheDocument()
  })

  it('opens via the trigger', async () => {
    render(
      <Sidesheet trigger={<button>Open</button>} title="Settings">
        body
      </Sidesheet>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(await screen.findByRole('dialog', { name: 'Settings' })).toBeInTheDocument()
  })

  it('fires onOpenChange(false) when the close button is clicked', async () => {
    const onOpenChange = vi.fn()
    render(
      <Sidesheet open onOpenChange={onOpenChange} title="X">
        body
      </Sidesheet>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything())
  })

  it('fires onBack when the nav button is clicked', async () => {
    const onBack = vi.fn()
    render(
      <Sidesheet open title="X" navLabel="Back" onBack={onBack}>
        body
      </Sidesheet>,
    )
    await userEvent.click(screen.getByRole('button', { name: /Back/ }))
    expect(onBack).toHaveBeenCalled()
  })

  it('renders primary and secondary actions', async () => {
    const onPrimary = vi.fn()
    render(
      <Sidesheet
        open
        title="X"
        primaryAction={{ label: 'Save', onClick: onPrimary }}
        secondaryAction={{ label: 'Cancel' }}
      >
        body
      </Sidesheet>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(onPrimary).toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })
})
