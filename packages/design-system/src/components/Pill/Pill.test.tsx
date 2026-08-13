import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Pill } from '.'

describe('Pill', () => {
  it('defaults to the neutral tone', () => {
    render(<Pill>Neutral</Pill>)
    const el = screen.getByText('Neutral')
    expect(el).toHaveAttribute('data-tone', 'neutral')
    expect(el.className).toContain('bg-surface-neutral')
  })

  it('renders the progress tone from the semantic progress tokens', () => {
    render(<Pill tone="progress">In proposal</Pill>)
    const el = screen.getByText('In proposal')
    expect(el.className).toContain('bg-surface-progress')
    expect(el.className).toContain('text-text-progress')
  })

  it('renders a decorative dot that inherits the tone colour', () => {
    render(<Pill dot>Open</Pill>)
    const dotEl = screen.getByText('Open').querySelector('[data-slot="pill-dot"]')
    expect(dotEl).not.toBeNull()
    expect(dotEl).toHaveAttribute('aria-hidden', 'true')
    expect(dotEl?.className).toContain('bg-current')
  })

  it('omits the dot by default', () => {
    render(<Pill>Quiet</Pill>)
    expect(screen.getByText('Quiet').querySelector('[data-slot="pill-dot"]')).toBeNull()
  })

  it('prefers leading content over the built-in dot', () => {
    render(
      <Pill dot leading={<span data-testid="glyph" />}>
        Custom
      </Pill>,
    )
    const el = screen.getByText('Custom')
    expect(el.querySelector('[data-slot="pill-leading"]')).not.toBeNull()
    expect(el.querySelector('[data-slot="pill-dot"]')).toBeNull()
    expect(screen.getByTestId('glyph')).toBeInTheDocument()
  })

  it('merges consumer classNames', () => {
    render(<Pill className="uppercase">Loud</Pill>)
    expect(screen.getByText('Loud').className).toContain('uppercase')
  })
})
