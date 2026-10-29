import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { List, ListItem } from '.'

describe('List', () => {
  it('renders a list of list items', () => {
    render(
      <List aria-label="Parcels">
        <ListItem title="Hinterfeld" description="Arable" trailing="12.4 ha" />
        <ListItem title="Bachwiese" />
      </List>,
    )
    expect(screen.getByRole('list', { name: 'Parcels' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('12.4 ha')).toBeInTheDocument()
  })

  it('renders a plain row without any button or link', () => {
    render(
      <List>
        <ListItem title="Hinterfeld" />
      </List>,
    )
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('makes an onClick row a button that fires the handler', async () => {
    const onClick = vi.fn()
    render(
      <List>
        <ListItem title="Hinterfeld" description="12.4 ha" onClick={onClick} />
      </List>,
    )
    await userEvent.click(screen.getByRole('button', { name: /Hinterfeld/ }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('makes an href row a link with a chevron, and opts out with chevron={false}', () => {
    const { container, rerender } = render(
      <List>
        <ListItem title="Hof Sonnenberg" href="/farms/1" />
      </List>,
    )
    expect(screen.getByRole('link', { name: 'Hof Sonnenberg' })).toHaveAttribute('href', '/farms/1')
    expect(container.querySelector('[data-slot="list-item-chevron"]')).not.toBeNull()
    rerender(
      <List>
        <ListItem title="Hof Sonnenberg" href="/farms/1" chevron={false} />
      </List>,
    )
    expect(container.querySelector('[data-slot="list-item-chevron"]')).toBeNull()
  })

  it('keeps the action a separate control, not nested in the row button', async () => {
    const onClick = vi.fn()
    const onRemove = vi.fn()
    render(
      <List>
        <ListItem
          title="Hinterfeld"
          onClick={onClick}
          action={<button type="button" onClick={onRemove}>Remove</button>}
        />
      </List>,
    )
    const row = screen.getByRole('button', { name: 'Hinterfeld' })
    const remove = screen.getByRole('button', { name: 'Remove' })
    expect(row.contains(remove)).toBe(false)
    await userEvent.tab()
    expect(row).toHaveFocus()
    await userEvent.tab()
    expect(remove).toHaveFocus()
    await userEvent.click(remove)
    expect(onRemove).toHaveBeenCalledTimes(1)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('marks a selected row with aria-current', () => {
    render(
      <List>
        <ListItem title="Hinterfeld" selected onClick={() => {}} />
      </List>,
    )
    expect(screen.getByRole('button', { name: 'Hinterfeld' })).toHaveAttribute('aria-current', 'true')
  })

  it('strikethrough leaves the action reachable and outside the dimmed content', () => {
    render(
      <List>
        <ListItem title="Waldrand" strikethrough action={<button type="button">Restore</button>} />
      </List>,
    )
    expect(screen.getByRole('button', { name: 'Restore' })).toBeInTheDocument()
    expect(screen.getByText('Waldrand').closest('[data-slot="list-item-main"]')).not.toContainElement(
      screen.getByRole('button', { name: 'Restore' }),
    )
  })
})
