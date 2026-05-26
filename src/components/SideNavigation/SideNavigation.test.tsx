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
})
