import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Separator } from '.'

describe('Separator', () => {
  it('renders a horizontal separator by default', () => {
    render(<Separator />)
    const sep = screen.getByRole('separator')
    expect(sep).toBeInTheDocument()
    expect(sep).not.toHaveAttribute('aria-orientation', 'vertical')
  })

  it('marks a vertical separator with aria-orientation', () => {
    render(<Separator orientation="vertical" />)
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('renders a label inside a horizontal separator', () => {
    render(<Separator label="or" />)
    const sep = screen.getByRole('separator')
    expect(sep).toHaveAttribute('aria-orientation', 'horizontal')
    expect(screen.getByText('or')).toBeInTheDocument()
  })
})
