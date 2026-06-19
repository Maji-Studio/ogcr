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
})
