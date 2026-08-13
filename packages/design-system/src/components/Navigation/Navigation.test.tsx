import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navigation, type NavItem } from '.'

const ITEMS: NavItem[] = [
  { id: 'a', label: 'Alpha', icon: <span /> },
  { id: 'b', label: 'Bravo', icon: <span /> },
]

describe('Navigation', () => {
  it('marks the active item with aria-current=page', () => {
    render(<Navigation items={ITEMS} activeId="b" />)
    expect(screen.getByRole('button', { name: /Bravo/ })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: /Alpha/ })).not.toHaveAttribute('aria-current')
  })

  it('fires onSelect with the item id', async () => {
    const onSelect = vi.fn()
    render(<Navigation items={ITEMS} activeId="a" onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button', { name: /Bravo/ }))
    expect(onSelect).toHaveBeenCalledWith('b')
  })

  it('renders an anchor when the item carries an href', () => {
    render(
      <Navigation items={[{ ...ITEMS[0], href: '/alpha' }, ITEMS[1]]} activeId="a" />,
    )
    const link = screen.getByRole('link', { name: /Alpha/ })
    expect(link).toHaveAttribute('href', '/alpha')
    expect(link).toHaveAttribute('aria-current', 'page')
    expect(link).not.toHaveAttribute('type')
    // Non-link siblings stay buttons.
    expect(screen.getByRole('button', { name: /Bravo/ })).toBeInTheDocument()
  })

  it('still fires onSelect for link items', async () => {
    const onSelect = vi.fn()
    render(
      <Navigation
        items={[{ ...ITEMS[0], href: '#alpha' }, ITEMS[1]]}
        activeId="b"
        onSelect={onSelect}
      />,
    )
    await userEvent.click(screen.getByRole('link', { name: /Alpha/ }))
    expect(onSelect).toHaveBeenCalledWith('a')
  })

  it('projects a custom element through the render escape hatch', () => {
    render(
      <Navigation
        items={[
          // Stands in for a framework link (next/link, react-router NavLink, …).
          { ...ITEMS[0], render: <a href="/alpha" data-testid="router-link" /> },
          ITEMS[1],
        ]}
        activeId="a"
      />,
    )
    const link = screen.getByTestId('router-link')
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('aria-current', 'page')
    expect(link).toHaveTextContent('Alpha')
  })

  // Base UI's mergeProps concatenates className instead of resolving Tailwind conflicts, so
  // without the cn() pre-merge in lib/nav-element both text-* classes survive and the override
  // silently loses to stylesheet order.
  it('lets a projected element override a conflicting class outright', () => {
    render(
      <Navigation
        items={[
          { ...ITEMS[0], render: <a href="/alpha" data-testid="router-link" className="text-text-negative" /> },
        ]}
        activeId="b"
      />,
    )
    const classes = screen.getByTestId('router-link').className.split(/\s+/)
    expect(classes).toContain('text-text-negative')
    expect(classes).not.toContain('text-text-secondary')
    // The unrelated font-size utility and the hover variant are not conflicts — they survive.
    expect(classes).toContain('text-s')
    expect(classes).toContain('hover:text-text-primary')
  })

  it('keeps Base UI prop merging for a projected element (handlers, attributes)', async () => {
    const onSelect = vi.fn()
    const ownClick = vi.fn()
    render(
      <Navigation
        items={[
          {
            ...ITEMS[0],
            render: <a href="#alpha" data-testid="router-link" onClick={ownClick} data-router="" />,
          },
        ]}
        activeId="a"
        onSelect={onSelect}
      />,
    )
    const link = screen.getByTestId('router-link')
    expect(link).toHaveAttribute('data-router')
    expect(link).toHaveAttribute('aria-current', 'page')
    await userEvent.click(link)
    expect(ownClick).toHaveBeenCalled()
    expect(onSelect).toHaveBeenCalledWith('a')
  })

  it('renders link items in the mobile layout too', () => {
    render(<Navigation layout="mobile" items={[{ ...ITEMS[0], href: '/alpha' }]} activeId="a" />)
    expect(screen.getByRole('link', { name: /Alpha/ })).toHaveAttribute('href', '/alpha')
  })
})
