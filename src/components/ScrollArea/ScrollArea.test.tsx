import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScrollArea } from '.'

describe('ScrollArea', () => {
  it('renders its children inside a viewport', () => {
    render(
      <ScrollArea maxHeight={100}>
        <p>Scrollable content</p>
      </ScrollArea>,
    )
    expect(screen.getByText('Scrollable content')).toBeInTheDocument()
  })

  it('applies the maxHeight constraint to the viewport', () => {
    render(
      <ScrollArea maxHeight={120}>
        <p>Body</p>
      </ScrollArea>,
    )
    const viewport = document.querySelector('[data-slot="scroll-area-viewport"]')
    expect(viewport).toHaveStyle({ maxHeight: '120px' })
  })

  // Base UI only mounts the scrollbar once it measures real overflow, which
  // jsdom can't do — scrollbar visibility/count is covered by the browser
  // (Playwright) story project. Here we only smoke-test that the new props are
  // accepted and content still renders.
  it('accepts the always + both variants without error', () => {
    render(
      <ScrollArea maxHeight={120} orientation="both" scrollbars="always">
        <p>Body</p>
      </ScrollArea>,
    )
    expect(screen.getByText('Body')).toBeInTheDocument()
  })
})
