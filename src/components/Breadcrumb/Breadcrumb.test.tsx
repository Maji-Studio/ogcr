import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Breadcrumb } from '.'

const items = [
  { label: 'Projects', href: '/projects' },
  { label: 'Mangrove', onClick: vi.fn() },
  { label: 'Credits' },
]

describe('Breadcrumb', () => {
  it('exposes a labelled navigation landmark', () => {
    render(<Breadcrumb items={items} />)
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
  })

  it('renders intermediate href crumbs as links', () => {
    render(<Breadcrumb items={items} />)
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects')
  })

  it('marks the last crumb as the current page and not a link', () => {
    render(<Breadcrumb items={items} />)
    const current = screen.getByText('Credits')
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('link', { name: 'Credits' })).not.toBeInTheDocument()
  })

  it('fires onClick for a button crumb', async () => {
    const onClick = vi.fn()
    render(<Breadcrumb items={[{ label: 'Back', onClick }, { label: 'Here' }]} />)
    await userEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(onClick).toHaveBeenCalled()
  })
})
