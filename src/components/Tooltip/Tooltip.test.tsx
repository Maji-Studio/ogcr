import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip } from '.'

describe('Tooltip', () => {
  it('renders the trigger', () => {
    render(<Tooltip trigger={<button>Hover</button>}>Tip text</Tooltip>)
    expect(screen.getByRole('button', { name: 'Hover' })).toBeInTheDocument()
  })

  it('shows the tooltip content when defaultOpen', () => {
    render(
      <Tooltip trigger={<button>Hover</button>} defaultOpen>
        Tip text
      </Tooltip>,
    )
    expect(screen.getByText('Tip text')).toBeInTheDocument()
  })

  it('reveals content on pointer hover', async () => {
    render(
      <Tooltip trigger={<button>Hover</button>} delay={0}>
        Tip text
      </Tooltip>,
    )
    expect(screen.queryByText('Tip text')).not.toBeInTheDocument()
    await userEvent.hover(screen.getByRole('button', { name: 'Hover' }))
    expect(await screen.findByText('Tip text')).toBeInTheDocument()
  })
})
