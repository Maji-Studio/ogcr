import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Logo, LogoMark } from '.'

describe('Logo', () => {
  it('exposes an image role labelled "OGCR" by default', () => {
    render(<Logo />)
    expect(screen.getByRole('img', { name: 'OGCR' })).toBeInTheDocument()
  })

  it('uses the title prop for both the accessible name and the <title> element', () => {
    const { container } = render(<Logo title="OGCR registry" />)
    expect(screen.getByRole('img', { name: 'OGCR registry' })).toBeInTheDocument()
    expect(container.querySelector('title')).toHaveTextContent('OGCR registry')
  })

  it('defaults to its native 129×46 box', () => {
    render(<Logo />)
    const svg = screen.getByRole('img', { name: 'OGCR' })
    expect(svg).toHaveAttribute('width', '129')
    expect(svg).toHaveAttribute('height', '46')
    expect(svg).toHaveAttribute('viewBox', '0 0 129 46')
  })

  it('derives the height from width so the aspect ratio is preserved', () => {
    render(<Logo width={258} />)
    const svg = screen.getByRole('img', { name: 'OGCR' })
    expect(svg).toHaveAttribute('width', '258')
    expect(svg).toHaveAttribute('height', '92')
  })

  // palette.css is the only place a brand hex may appear, so the mark paints itself
  // through the brand color utilities instead of baking hex into the markup.
  it('fills its paths from brand color tokens, never a hard-coded hex', () => {
    const { container } = render(<Logo />)
    const paths = [...container.querySelectorAll('path')]
    expect(paths.length).toBeGreaterThan(0)
    for (const path of paths) {
      expect(path).not.toHaveAttribute('fill')
      expect(path.getAttribute('class')).toMatch(/^fill-brand-(blue-800|green-500)$/)
    }
  })

  it('passes className and other SVG props through to the root svg', () => {
    render(<Logo className="page__hero-logo" data-testid="brand" focusable="false" />)
    const svg = screen.getByTestId('brand')
    expect(svg).toHaveClass('page__hero-logo')
    expect(svg).toHaveAttribute('focusable', 'false')
  })
})

describe('LogoMark', () => {
  it('renders the 50×45 mark with the same labelling contract', () => {
    render(<LogoMark />)
    const svg = screen.getByRole('img', { name: 'OGCR' })
    expect(svg).toHaveAttribute('width', '50')
    expect(svg).toHaveAttribute('height', '45')
    expect(svg).toHaveAttribute('viewBox', '0 0 50 45')
  })

  it('scales the height with the width', () => {
    render(<LogoMark width={100} title="Mark" />)
    const svg = screen.getByRole('img', { name: 'Mark' })
    expect(svg).toHaveAttribute('width', '100')
    expect(svg).toHaveAttribute('height', '90')
  })
})
