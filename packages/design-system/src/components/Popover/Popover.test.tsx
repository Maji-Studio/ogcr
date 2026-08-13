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

  it('defaults to the 280px spec width', () => {
    render(
      <Popover trigger={<button>Open</button>} defaultOpen>
        body
      </Popover>,
    )
    const popup = document.querySelector('[data-slot="popover"]')!
    expect(popup).toHaveAttribute('data-width', 'm')
    expect(popup.className).toContain('w-[280px]')
  })

  it.each([
    ['s', 'w-256'],
    ['l', 'w-320'],
  ] as const)('honours width=%s', (width, cls) => {
    render(
      <Popover trigger={<button>Open</button>} defaultOpen width={width}>
        body
      </Popover>,
    )
    const popup = document.querySelector('[data-slot="popover"]')!
    expect(popup.className).toContain(cls)
    expect(popup.className).not.toContain('w-[280px]')
  })

  it('drops the fixed width entirely with width="auto"', () => {
    render(
      <Popover trigger={<button>Open</button>} defaultOpen width="auto">
        body
      </Popover>,
    )
    const popup = document.querySelector('[data-slot="popover"]')!
    expect(popup.className).not.toMatch(/(^|\s)w-(256|320|\[280px\])(\s|$)/)
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
