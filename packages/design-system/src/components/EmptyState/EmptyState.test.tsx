import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from '.'

describe('EmptyState', () => {
  it('renders the title as a level 3 heading by default, with description and action', () => {
    render(
      <EmptyState
        title="No parcels yet"
        description="Draw a boundary."
        action={<button type="button">Draw a parcel</button>}
      />,
    )
    expect(screen.getByRole('heading', { level: 3, name: 'No parcels yet' })).toBeInTheDocument()
    expect(screen.getByText('Draw a boundary.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Draw a parcel' })).toBeInTheDocument()
  })

  it('honours headingLevel', () => {
    render(<EmptyState title="Nothing here" headingLevel={2} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Nothing here' })).toBeInTheDocument()
  })

  it('hides the decorative icon from assistive tech', () => {
    const { container } = render(<EmptyState title="Empty" icon={<svg data-testid="i" />} />)
    expect(container.querySelector('[data-slot="empty-state-icon"]')).toHaveAttribute('aria-hidden', 'true')
  })

  it('inline variant is compact text with an optional action and no heading', () => {
    render(
      <EmptyState
        variant="inline"
        title="No parcels."
        description="Import a file."
        action={<button type="button">Import</button>}
      />,
    )
    expect(screen.queryByRole('heading')).toBeNull()
    expect(screen.getByText('No parcels.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Import' })).toBeInTheDocument()
  })

  it('merges className and passes rest props to the root', () => {
    render(<EmptyState title="Empty" className="custom" data-testid="root" />)
    expect(screen.getByTestId('root')).toHaveClass('custom')
  })
})
