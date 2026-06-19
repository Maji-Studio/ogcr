import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Calendar } from '.'

// A fixed month keeps the grid deterministic across runs.
const june2026 = new Date(2026, 5, 15)

describe('Calendar', () => {
  it('renders a month grid', () => {
    render(<Calendar mode="single" defaultMonth={june2026} />)
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it('fires onSelect when a day is chosen', async () => {
    const onSelect = vi.fn()
    render(<Calendar mode="single" defaultMonth={june2026} onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button', { name: /15/ }))
    expect(onSelect).toHaveBeenCalled()
  })

  it('bands the middle of a selected range on the cell, not a solid fill', () => {
    render(
      <Calendar
        mode="range"
        defaultMonth={june2026}
        selected={{ from: new Date(2026, 5, 10), to: new Date(2026, 5, 14) }}
      />,
    )
    // The 12th is a middle day: its cell (data-day=ISO) gets the band tint and
    // its button is reset, so the range reads as a band, not five solid fills.
    const midCell = document.querySelector('[data-day="2026-06-12"]')
    expect(midCell).toHaveClass('bg-interaction-primary-focus')
  })
})
