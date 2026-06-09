import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs } from '.'

const items = [
  { value: 'a', label: 'First', content: 'Panel A' },
  { value: 'b', label: 'Second', content: 'Panel B' },
  { value: 'c', label: 'Third', content: 'Panel C', disabled: true },
]

describe('Tabs', () => {
  it('renders a tablist with a tab per item', () => {
    render(<Tabs items={items} />)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(3)
  })

  it('shows the first panel by default', () => {
    render(<Tabs items={items} />)
    expect(screen.getByText('Panel A')).toBeVisible()
  })

  it('switches panels and fires onValueChange on tab click', async () => {
    const onValueChange = vi.fn()
    render(<Tabs items={items} onValueChange={onValueChange} />)
    await userEvent.click(screen.getByRole('tab', { name: 'Second' }))
    expect(onValueChange).toHaveBeenCalledWith('b', expect.anything())
    expect(await screen.findByText('Panel B')).toBeVisible()
  })

  it('marks disabled tabs as disabled', () => {
    render(<Tabs items={items} />)
    // Base UI keeps disabled tabs focusable for roving navigation, so it
    // signals the state via aria-disabled rather than the native attribute.
    expect(screen.getByRole('tab', { name: 'Third' })).toHaveAttribute('aria-disabled', 'true')
  })
})
