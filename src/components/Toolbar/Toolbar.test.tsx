import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarInput } from '.'

describe('Toolbar', () => {
  it('exposes a named toolbar landmark', () => {
    render(
      <Toolbar aria-label="Formatting">
        <ToolbarButton>Bold</ToolbarButton>
      </Toolbar>,
    )
    expect(screen.getByRole('toolbar', { name: 'Formatting' })).toBeInTheDocument()
  })

  it('fires button click handlers', async () => {
    const onClick = vi.fn()
    render(
      <Toolbar aria-label="Tools">
        <ToolbarButton onClick={onClick}>Run</ToolbarButton>
      </Toolbar>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Run' }))
    expect(onClick).toHaveBeenCalled()
  })

  it('moves focus between items with arrow keys (roving focus)', async () => {
    render(
      <Toolbar aria-label="Tools">
        <ToolbarButton>One</ToolbarButton>
        <ToolbarSeparator />
        <ToolbarButton>Two</ToolbarButton>
      </Toolbar>,
    )
    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'One' })).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', { name: 'Two' })).toHaveFocus()
  })

  it('keeps an input in the roving-focus order and accepts typing', async () => {
    render(
      <Toolbar aria-label="Records">
        <ToolbarInput aria-label="Filter" placeholder="Filter" />
        <ToolbarButton>Files</ToolbarButton>
      </Toolbar>,
    )
    const input = screen.getByRole('textbox', { name: 'Filter' })
    await userEvent.type(input, 'abc')
    expect(input).toHaveValue('abc')
  })

  it('applies compact density heights to its controls', () => {
    render(
      <Toolbar aria-label="Tools" density="compact">
        <ToolbarButton>One</ToolbarButton>
      </Toolbar>,
    )
    expect(screen.getByRole('toolbar')).toHaveAttribute('data-density', 'compact')
    expect(screen.getByRole('button', { name: 'One' })).toHaveClass('h-32')
  })
})
