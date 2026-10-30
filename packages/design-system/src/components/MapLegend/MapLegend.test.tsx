import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MapLegend } from '.'

describe('MapLegend', () => {
  it('renders the title and one swatch per item, painted from the token', () => {
    render(
      <MapLegend
        title="Your fields"
        items={[
          { label: 'Enrolled', token: '--ds-interaction-primary-default' },
          { label: 'Withdrawn', token: '--ds-border-strong' },
        ]}
      />,
    )
    expect(screen.getByText('Your fields')).toBeInTheDocument()
    const item = screen.getByText('Enrolled').closest('li')!
    const swatch = item.querySelector('span[aria-hidden="true"]') as HTMLElement
    expect(swatch.style.background).toBe('var(--ds-interaction-primary-default)')
  })

  it('merges className and spreads native props', () => {
    render(<MapLegend title="Key" items={[]} className="top-24" data-testid="legend" />)
    expect(screen.getByTestId('legend')).toHaveClass('top-24', 'bottom-24')
  })
})
