import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Slider } from '.'

describe('Slider', () => {
  it('exposes a slider role named by aria-label', () => {
    render(<Slider aria-label="Volume" defaultValue={40} />)
    expect(screen.getByRole('slider', { name: 'Volume' })).toBeInTheDocument()
  })

  it('reflects the default value', () => {
    render(<Slider aria-label="Volume" defaultValue={40} />)
    expect(screen.getByRole('slider')).toHaveValue('40')
  })

  it('increments with the arrow keys and fires onValueChange', async () => {
    const onValueChange = vi.fn()
    render(<Slider aria-label="Volume" defaultValue={40} onValueChange={onValueChange} />)
    const slider = screen.getByRole('slider')
    slider.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onValueChange).toHaveBeenCalledWith(41, expect.anything())
  })

  it('does not change when disabled', async () => {
    const onValueChange = vi.fn()
    render(<Slider aria-label="Volume" defaultValue={40} disabled onValueChange={onValueChange} />)
    const slider = screen.getByRole('slider')
    slider.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onValueChange).not.toHaveBeenCalled()
  })
})
