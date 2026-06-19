import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toggle, ToggleGroup } from '.'

describe('Toggle', () => {
  it('starts unpressed and toggles on click', async () => {
    const onPressedChange = vi.fn()
    render(<Toggle aria-label="Bold" onPressedChange={onPressedChange}>Bold</Toggle>)
    const button = screen.getByRole('button', { name: 'Bold' })
    expect(button).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(button)
    expect(onPressedChange).toHaveBeenCalledWith(true, expect.anything())
  })

  it('reflects the controlled pressed state', () => {
    render(<Toggle aria-label="Bold" pressed>Bold</Toggle>)
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('does not fire when disabled', async () => {
    const onPressedChange = vi.fn()
    render(<Toggle aria-label="Bold" disabled onPressedChange={onPressedChange}>Bold</Toggle>)
    await userEvent.click(screen.getByRole('button', { name: 'Bold' }))
    expect(onPressedChange).not.toHaveBeenCalled()
  })
})

const items = [
  { value: 'grid', label: 'Grid' },
  { value: 'chart', label: 'Chart' },
  { value: 'files', label: 'Files' },
]

describe('ToggleGroup', () => {
  it('marks the default value as pressed', () => {
    render(<ToggleGroup aria-label="View" items={items} defaultValue={['grid']} />)
    expect(screen.getByRole('button', { name: 'Grid' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Chart' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('emits the new selection when a segment is clicked', async () => {
    const onValueChange = vi.fn()
    render(
      <ToggleGroup
        aria-label="View"
        items={items}
        defaultValue={['grid']}
        onValueChange={onValueChange}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Chart' }))
    expect(onValueChange).toHaveBeenCalledWith(['chart'], expect.anything())
  })

  it('swaps the pressed segment in single-select mode', async () => {
    render(<ToggleGroup aria-label="View" items={items} defaultValue={['grid']} />)
    await userEvent.click(screen.getByRole('button', { name: 'Chart' }))
    expect(screen.getByRole('button', { name: 'Chart' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Grid' })).toHaveAttribute('aria-pressed', 'false')
  })
})
