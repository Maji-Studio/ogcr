import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContextMenu } from '.'

const openMenu = async () =>
  userEvent.click(screen.getByRole('button', { name: 'Open' }))

describe('ContextMenu', () => {
  it('renders items as menu items when opened', async () => {
    render(<ContextMenu trigger={<button>Open</button>} items={[{ id: '1', label: 'Open file' }]} />)
    await openMenu()
    expect(await screen.findByRole('menuitem', { name: 'Open file' })).toBeInTheDocument()
  })

  it('fires onSelect when a menu item is clicked', async () => {
    const onSelect = vi.fn()
    render(
      <ContextMenu
        trigger={<button>Open</button>}
        items={[{ id: '1', label: 'Open file', onSelect }]}
      />,
    )
    await openMenu()
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Open file' }))
    expect(onSelect).toHaveBeenCalled()
  })

  it('disables items when disabled', async () => {
    render(
      <ContextMenu
        trigger={<button>Open</button>}
        items={[{ id: '1', label: 'Off', disabled: true }]}
      />,
    )
    await openMenu()
    const item = await screen.findByRole('menuitem', { name: 'Off' })
    expect(item).toHaveAttribute('data-disabled')
  })

  it('keeps its 320px width by default and honours the width scale', async () => {
    const { unmount } = render(
      <ContextMenu trigger={<button>Open</button>} items={[{ id: '1', label: 'Open file' }]} />,
    )
    await openMenu()
    const popup = await screen.findByRole('menu')
    expect(popup).toHaveAttribute('data-width', 'l')
    expect(popup.className).toContain('w-320')
    unmount()

    render(
      <ContextMenu
        trigger={<button>Open</button>}
        width="s"
        items={[{ id: '1', label: 'Open file' }]}
      />,
    )
    await openMenu()
    const narrow = await screen.findByRole('menu')
    expect(narrow.className).toContain('w-256')
    expect(narrow.className).not.toContain('w-320')
  })

  it('renders header and status pill when provided', async () => {
    render(
      <ContextMenu trigger={<button>Open</button>} header="Actions" status="3 selected" items={[]} />,
    )
    await openMenu()
    expect(await screen.findByText('Actions')).toBeInTheDocument()
    expect(screen.getByText('3 selected')).toBeInTheDocument()
  })
})
