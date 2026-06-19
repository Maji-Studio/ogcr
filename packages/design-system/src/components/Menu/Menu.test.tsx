import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Menu } from '.'

const open = () => userEvent.click(screen.getByRole('button', { name: 'Open' }))

describe('Menu', () => {
  it('renders action items and fires onSelect', async () => {
    const onSelect = vi.fn()
    render(
      <Menu trigger={<button>Open</button>} items={[{ id: '1', label: 'Edit', onSelect }]} />,
    )
    await open()
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Edit' }))
    expect(onSelect).toHaveBeenCalled()
  })

  it('renders a checkbox item and toggles it', async () => {
    const onCheckedChange = vi.fn()
    render(
      <Menu
        trigger={<button>Open</button>}
        items={[{ id: 'g', type: 'checkbox', label: 'Grid', onCheckedChange }]}
      />,
    )
    await open()
    const item = await screen.findByRole('menuitemcheckbox', { name: 'Grid' })
    await userEvent.click(item)
    // Base UI callbacks fire (value, eventDetails) — assert on the value arg.
    expect(onCheckedChange).toHaveBeenCalled()
    expect(onCheckedChange.mock.calls[0][0]).toBe(true)
  })

  it('renders a radio group with selectable items', async () => {
    render(
      <Menu
        trigger={<button>Open</button>}
        items={[
          {
            id: 'd',
            type: 'radio-group',
            defaultValue: 'a',
            options: [
              { value: 'a', label: 'Alpha' },
              { value: 'b', label: 'Beta' },
            ],
          },
        ]}
      />,
    )
    await open()
    expect(await screen.findByRole('menuitemradio', { name: 'Alpha' })).toBeChecked()
  })

  it('constrains the popup height when maxHeight is set', async () => {
    render(
      <Menu
        trigger={<button>Open</button>}
        maxHeight={200}
        items={[{ id: '1', label: 'Edit' }]}
      />,
    )
    await open()
    const popup = await screen.findByRole('menu')
    expect(popup.style.maxHeight).toBe('200px')
  })

  it('marks a disabled submenu trigger as disabled', async () => {
    render(
      <Menu
        trigger={<button>Open</button>}
        items={[
          { id: 's', type: 'submenu', label: 'More', disabled: true, items: [{ id: 'x', label: 'Nested' }] },
        ]}
      />,
    )
    await open()
    const trigger = await screen.findByRole('menuitem', { name: /More/ })
    expect(trigger).toHaveAttribute('data-disabled')
  })

  it('opens a submenu', async () => {
    render(
      <Menu
        trigger={<button>Open</button>}
        items={[
          {
            id: 's',
            type: 'submenu',
            label: 'More',
            items: [{ id: 'x', label: 'Nested action' }],
          },
        ]}
      />,
    )
    await open()
    await userEvent.click(await screen.findByRole('menuitem', { name: /More/ }))
    expect(await screen.findByRole('menuitem', { name: 'Nested action' })).toBeInTheDocument()
  })
})
