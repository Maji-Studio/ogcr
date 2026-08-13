import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SideNavigation, type SideNavigationItem } from '.'

const ITEMS: SideNavigationItem[] = [
  { id: 'home', label: 'Home', icon: <span /> },
  {
    id: 'farm',
    label: 'Farm',
    icon: <span />,
    children: [
      { id: 'farm-a', label: 'Parcels' },
      { id: 'farm-b', label: 'Plots' },
    ],
  },
]

describe('SideNavigation', () => {
  it('renders top-level items', () => {
    render(<SideNavigation items={ITEMS} activeId="home" />)
    expect(screen.getByRole('button', { name: /Home/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Farm/ })).toBeInTheDocument()
  })

  it('expands nested items when an active child is set', () => {
    render(<SideNavigation items={ITEMS} activeId="farm-a" />)
    expect(screen.getByRole('button', { name: /Parcels/ })).toBeInTheDocument()
  })

  it('fires onSelect when a leaf item is clicked', async () => {
    const onSelect = vi.fn()
    render(<SideNavigation items={ITEMS} activeId="home" onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button', { name: /Home/ }))
    expect(onSelect).toHaveBeenCalledWith('home')
  })

  it('renders a leaf item with an href as an anchor', () => {
    render(
      <SideNavigation items={[{ ...ITEMS[0], href: '/home' }, ITEMS[1]]} activeId="home" />,
    )
    const link = screen.getByRole('link', { name: /Home/ })
    expect(link).toHaveAttribute('href', '/home')
    expect(link).toHaveAttribute('aria-current', 'page')
  })

  it('renders nested children as anchors', () => {
    render(
      <SideNavigation
        items={[
          ITEMS[0],
          { ...ITEMS[1], children: [{ id: 'farm-a', label: 'Parcels', href: '/farm/parcels' }] },
        ]}
        activeId="farm-a"
      />,
    )
    expect(screen.getByRole('link', { name: /Parcels/ })).toHaveAttribute('href', '/farm/parcels')
  })

  it('keeps a parent with an expanded sub-list as a disclosure button, not a link', () => {
    render(<SideNavigation items={[ITEMS[0], { ...ITEMS[1], href: '/farm' }]} activeId="farm-a" />)
    const parent = screen.getByRole('button', { name: /Farm/ })
    expect(parent).toHaveAttribute('aria-expanded', 'true')
    expect(screen.queryByRole('link', { name: /^Farm/ })).toBeNull()
  })

  it('projects a custom element through the render escape hatch', () => {
    render(
      <SideNavigation
        items={[{ ...ITEMS[0], render: <a href="/home" data-testid="router-link" /> }]}
        activeId="home"
      />,
    )
    const link = screen.getByTestId('router-link')
    expect(link.tagName).toBe('A')
    expect(link).toHaveTextContent('Home')
    expect(link).toHaveAttribute('aria-current', 'page')
  })

  // Base UI's mergeProps concatenates className instead of resolving Tailwind conflicts, so
  // without the cn() pre-merge in lib/nav-element both text-* classes survive and the override
  // silently loses to stylesheet order.
  it('lets a projected element override a conflicting class outright', () => {
    render(
      <SideNavigation
        items={[
          { ...ITEMS[0], render: <a href="/home" data-testid="router-link" className="text-text-negative" /> },
        ]}
        activeId="farm"
      />,
    )
    const classes = screen.getByTestId('router-link').className.split(/\s+/)
    expect(classes).toContain('text-text-negative')
    expect(classes).not.toContain('text-text-secondary')
    expect(classes).toContain('text-s')
    expect(classes).toContain('hover:text-text-primary')
  })

  it('applies the same className resolution to nested children', () => {
    render(
      <SideNavigation
        items={[
          ITEMS[0],
          {
            ...ITEMS[1],
            children: [
              {
                id: 'farm-a',
                label: 'Parcels',
                render: <a href="/parcels" data-testid="child-link" className="text-text-negative" />,
              },
            ],
          },
        ]}
        activeId="home"
        defaultExpandedIds={['farm']}
      />,
    )
    // The child is INACTIVE, so the base classes would carry text-text-secondary —
    // the projected className must still win the cn() pre-merge.
    const classes = screen.getByTestId('child-link').className.split(/\s+/)
    expect(classes).toContain('text-text-negative')
    expect(classes).not.toContain('text-text-secondary')
  })

  it('keeps Base UI prop merging for a projected element (handlers, attributes)', async () => {
    const onSelect = vi.fn()
    const ownClick = vi.fn()
    render(
      <SideNavigation
        items={[
          {
            ...ITEMS[0],
            render: <a href="#home" data-testid="router-link" onClick={ownClick} data-router="" />,
          },
        ]}
        activeId="home"
        onSelect={onSelect}
      />,
    )
    const link = screen.getByTestId('router-link')
    expect(link).toHaveAttribute('data-router')
    await userEvent.click(link)
    expect(ownClick).toHaveBeenCalled()
    expect(onSelect).toHaveBeenCalledWith('home')
  })
})
