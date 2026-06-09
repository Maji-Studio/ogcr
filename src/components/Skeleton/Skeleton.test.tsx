import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Skeleton } from '.'

describe('Skeleton', () => {
  it('renders a decorative placeholder', () => {
    const { container } = render(<Skeleton width={100} height={20} />)
    const node = container.querySelector('[data-slot="skeleton"]')
    expect(node).toBeInTheDocument()
    expect(node).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies numeric width/height as pixels', () => {
    const { container } = render(<Skeleton width={120} height={32} />)
    const node = container.querySelector('[data-slot="skeleton"]') as HTMLElement
    expect(node.style.width).toBe('120px')
    expect(node.style.height).toBe('32px')
  })

  it('renders the requested number of text lines', () => {
    render(<Skeleton variant="text" lines={3} />)
    const lines = document.querySelectorAll('[data-slot="skeleton"]')
    expect(lines).toHaveLength(3)
  })

  it('passes string dimensions through verbatim', () => {
    const { container } = render(<Skeleton width="60%" />)
    const node = container.querySelector('[data-slot="skeleton"]') as HTMLElement
    expect(node.style.width).toBe('60%')
  })
})
