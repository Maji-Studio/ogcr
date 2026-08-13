import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressBar } from '.'

describe('ProgressBar', () => {
  it('exposes a progressbar with its value and bounds', () => {
    render(<ProgressBar value={64} label="Verification" />)
    const bar = screen.getByRole('progressbar', { name: 'Verification' })
    expect(bar).toHaveAttribute('aria-valuenow', '64')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
  })

  it('names the bar from aria-label when there is no visible label', () => {
    render(<ProgressBar value={10} aria-label="Verification progress" />)
    expect(screen.getByRole('progressbar', { name: 'Verification progress' })).toBeInTheDocument()
  })

  it('lets the visible label name the bar (Base UI wires aria-labelledby, which wins)', () => {
    render(<ProgressBar value={10} label="Verification" aria-label="Ignored" />)
    const bar = screen.getByRole('progressbar', { name: 'Verification' })
    expect(bar).toHaveAttribute('aria-labelledby')
  })

  it('drops aria-valuenow when the value is indeterminate', () => {
    render(<ProgressBar value={null} aria-label="Loading" />)
    expect(screen.getByRole('progressbar', { name: 'Loading' })).not.toHaveAttribute('aria-valuenow')
  })

  it('sizes the fill as a percentage of the min–max range', () => {
    const { container } = render(<ProgressBar value={25} min={0} max={50} aria-label="Half" />)
    expect(container.querySelector('[data-slot="progress-fill"]')).toHaveStyle({ width: '50%' })
  })

  it('clamps the fill to the 0–100% range', () => {
    const { container, rerender } = render(<ProgressBar value={180} aria-label="Over" />)
    expect(container.querySelector('[data-slot="progress-fill"]')).toHaveStyle({ width: '100%' })

    rerender(<ProgressBar value={-40} aria-label="Under" />)
    expect(container.querySelector('[data-slot="progress-fill"]')).toHaveStyle({ width: '0%' })
  })

  it('tints the fill per tone', () => {
    const { container, rerender } = render(<ProgressBar value={40} aria-label="Tone" />)
    const fill = () => container.querySelector('[data-slot="progress-fill"]')
    expect(fill()).toHaveClass('bg-interaction-primary-default')

    rerender(<ProgressBar value={40} tone="orange" aria-label="Tone" />)
    expect(fill()).toHaveClass('bg-icon-warning')

    rerender(<ProgressBar value={40} tone="neutral" aria-label="Tone" />)
    expect(fill()).toHaveClass('bg-text-neutral')
  })

  it('renders the label and its icon, hiding the icon from assistive tech', () => {
    const { container } = render(
      <ProgressBar value={40} label="Sampling" labelIcon={<svg data-testid="glyph" />} />,
    )
    expect(screen.getByText('Sampling')).toBeInTheDocument()
    expect(screen.getByTestId('glyph').parentElement).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('[data-slot="progress-text"]')).toBeInTheDocument()
  })

  it('omits the text row when there is no label and showValue is off', () => {
    const { container } = render(<ProgressBar value={40} showValue={false} aria-label="Bare" />)
    expect(container.querySelector('[data-slot="progress-text"]')).toBeNull()
  })

  it('merges a consumer className onto the root', () => {
    const { container } = render(<ProgressBar value={40} className="w-256" aria-label="Wide" />)
    const root = container.querySelector('[data-slot="progress"]')
    expect(root).toHaveClass('w-256')
    expect(root).toHaveClass('flex')
  })
})
