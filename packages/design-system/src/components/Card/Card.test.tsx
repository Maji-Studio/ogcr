import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from '.'

function root() {
  return document.querySelector('[data-slot="card"]')!
}

describe('Card', () => {
  it('omits the header when there is no title, subtitle or trailing', () => {
    render(<Card>Body</Card>)
    expect(root().querySelector('[data-slot="card-header"]')).toBeNull()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('omits the body when there are no children', () => {
    render(<Card title="Only a title" />)
    expect(root().querySelector('[data-slot="card-body"]')).toBeNull()
  })

  it('renders the title at the requested heading level', () => {
    render(<Card title="Section" headingLevel={2} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Section' })).toBeInTheDocument()
  })

  // `gap-16` contains the substring `p-16`, so padding assertions match whole classes.
  const classes = () => root().className.split(/\s+/)

  it('defaults to 16px padding', () => {
    render(<Card title="Default" />)
    expect(classes()).toContain('p-16')
  })

  it.each([
    ['none', 'p-0'],
    ['s', 'p-12'],
    ['m', 'p-16'],
    ['l', 'p-24'],
  ] as const)('honours padding=%s', (padding, cls) => {
    render(<Card padding={padding} title="Padded" />)
    expect(classes()).toContain(cls)
  })

  it('lets a consumer className win over the padding token', () => {
    render(<Card className="p-32" title="Override" />)
    expect(classes()).toContain('p-32')
    expect(classes()).not.toContain('p-16')
  })

  it('adds elevation only when floating', () => {
    const { rerender } = render(<Card title="Flat" />)
    expect(root().className).not.toContain('shadow-elevation-l')
    rerender(<Card title="Raised" floating />)
    expect(root().className).toContain('shadow-elevation-l')
  })
})
