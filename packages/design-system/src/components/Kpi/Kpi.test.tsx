import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Kpi } from '.'

function root() {
  return document.querySelector('[data-slot="kpi"]')!
}

describe('Kpi', () => {
  it('renders label, value and secondary text', () => {
    render(<Kpi label="Removals YTD" value="1,234 t" secondaryText="vs 1,500 t target" />)
    expect(screen.getByText('Removals YTD')).toBeInTheDocument()
    expect(screen.getByText('1,234 t')).toBeInTheDocument()
    expect(screen.getByText('vs 1,500 t target')).toBeInTheDocument()
  })

  it('accepts a ReactNode value, not just a string', () => {
    render(
      <Kpi
        label="Carbon"
        value={
          <>
            1.4 to 2.2 <span data-testid="unit">t</span>
          </>
        }
      />,
    )
    expect(screen.getByTestId('unit')).toBeInTheDocument()
  })

  it('shows the tone-coloured accent bar by default', () => {
    render(<Kpi label="A" value="1" tone="warning" />)
    const bar = root().querySelector('[data-slot="kpi-accent"]')
    expect(bar).not.toBeNull()
    expect(bar).toHaveAttribute('aria-hidden', 'true')
    expect(bar?.className).toContain('bg-icon-warning')
  })

  it('drops the accent bar (and its header offset) when accentBar is false', () => {
    render(<Kpi label="A" value="1" accentBar={false} />)
    expect(root().querySelector('[data-slot="kpi-accent"]')).toBeNull()
    expect(root().querySelector('[data-slot="kpi-header"]')?.className).not.toContain('pt-4')
  })

  it('renders a decorative icon before the label', () => {
    render(<Kpi label="Parcels" value="12" icon={<svg data-testid="glyph" />} />)
    const iconSlot = root().querySelector('[data-slot="kpi-icon"]')
    expect(iconSlot).not.toBeNull()
    expect(iconSlot).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByTestId('glyph')).toBeInTheDocument()
  })

  it('omits the icon slot when no icon is given', () => {
    render(<Kpi label="Parcels" value="12" />)
    expect(root().querySelector('[data-slot="kpi-icon"]')).toBeNull()
  })

  it('renders the optional status pill', () => {
    render(<Kpi label="A" value="1" status={{ label: 'At risk', tone: 'warning' }} />)
    expect(screen.getByText('At risk')).toBeInTheDocument()
  })
})
