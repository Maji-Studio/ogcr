import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Popover } from '.'

describe('Popover', () => {
  it('is closed until the trigger is clicked', async () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <span>Popover body</span>
      </Popover>,
    )
    expect(screen.queryByText('Popover body')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(await screen.findByText('Popover body')).toBeInTheDocument()
  })

  it('exposes title and description for assistive tech when open', () => {
    render(
      <Popover trigger={<button>Open</button>} defaultOpen title="Status" description="All clear">
        body
      </Popover>,
    )
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('All clear')).toBeInTheDocument()
  })

  it('fires onOpenChange when toggled', async () => {
    const onOpenChange = vi.fn()
    render(
      <Popover trigger={<button>Open</button>} onOpenChange={onOpenChange}>
        body
      </Popover>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything())
  })
})
