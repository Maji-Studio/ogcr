import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StepList, StepListItem } from '.'

describe('StepList', () => {
  it('renders an ordered list of items', () => {
    render(
      <StepList aria-label="Set up your farm">
        <StepListItem state="done" title="Add your farm details" />
        <StepListItem state="todo" title="Draw your parcels" />
      </StepList>,
    )
    const list = screen.getByRole('list', { name: 'Set up your farm' })
    expect(list.tagName).toBe('OL')
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('marks only the current item with aria-current="step"', () => {
    render(
      <StepList>
        <StepListItem state="done" title="Add your farm details" />
        <StepListItem state="current" title="Draw your parcels" />
        <StepListItem state="todo" title="Upload soil samples" />
      </StepList>,
    )
    const items = screen.getAllByRole('listitem')
    expect(items[0]).not.toHaveAttribute('aria-current')
    expect(items[1]).toHaveAttribute('aria-current', 'step')
    expect(items[2]).not.toHaveAttribute('aria-current')
  })

  it('announces every state in text, not by colour alone', () => {
    render(
      <StepList>
        <StepListItem state="todo" title="A" />
        <StepListItem state="current" title="B" />
        <StepListItem state="done" title="C" />
        <StepListItem state="attention" title="D" />
        <StepListItem state="locked" title="E" />
      </StepList>,
    )
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('To do')
    expect(items[1]).toHaveTextContent('Current step')
    expect(items[2]).toHaveTextContent('Done')
    expect(items[3]).toHaveTextContent('Needs attention')
    expect(items[4]).toHaveTextContent('Locked')
  })

  it('lets the state text be overridden', () => {
    render(
      <StepList>
        <StepListItem state="done" title="Hofdaten" stateLabel="Erledigt" />
      </StepList>,
    )
    expect(screen.getByRole('listitem')).toHaveTextContent('Erledigt')
  })

  it('renders description, tags and trailing content', () => {
    render(
      <StepList>
        <StepListItem
          state="attention"
          title="Confirm land use"
          description="Two parcels do not match."
          tags={<span>Needs review</span>}
          trailing="2 min"
        />
      </StepList>,
    )
    expect(screen.getByText('Two parcels do not match.')).toBeInTheDocument()
    expect(screen.getByText('Needs review')).toBeInTheDocument()
    expect(screen.getByText('2 min')).toBeInTheDocument()
  })

  it('is not interactive without onClick or href', () => {
    render(
      <StepList>
        <StepListItem state="todo" title="Upload soil samples" />
      </StepList>,
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('becomes a button when given onClick, reachable by keyboard', async () => {
    const onClick = vi.fn()
    render(
      <StepList>
        <StepListItem state="todo" title="Upload soil samples" onClick={onClick} />
      </StepList>,
    )
    await userEvent.tab()
    const button = screen.getByRole('button', { name: /Upload soil samples/ })
    expect(button).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('becomes a link when given href', () => {
    render(
      <StepList>
        <StepListItem state="current" title="Draw your parcels" href="/parcels" />
      </StepList>,
    )
    expect(screen.getByRole('link', { name: /Draw your parcels/ })).toHaveAttribute('href', '/parcels')
  })

  it('keeps a locked row non-interactive even with onClick', async () => {
    const onClick = vi.fn()
    render(
      <StepList>
        <StepListItem state="locked" title="Invite your advisor" onClick={onClick} />
      </StepList>,
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    await userEvent.click(screen.getByText('Invite your advisor'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('hides the decorative marker from assistive tech', () => {
    render(
      <StepList>
        <StepListItem state="done" title="Add your farm details" />
      </StepList>,
    )
    expect(document.querySelector('[data-slot="step-list-marker"]')).toHaveAttribute('aria-hidden', 'true')
  })
})
