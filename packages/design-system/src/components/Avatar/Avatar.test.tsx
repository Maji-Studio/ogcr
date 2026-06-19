import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar, deriveInitials } from '.'

describe('deriveInitials', () => {
  it('takes the first and last word initials', () => {
    expect(deriveInitials('Jane Cooper')).toBe('JC')
    expect(deriveInitials('Maji Design Studio')).toBe('MS')
  })
  it('takes the first two letters of a single word', () => {
    expect(deriveInitials('Maji')).toBe('MA')
  })
  it('returns an empty string for empty/undefined input', () => {
    expect(deriveInitials('')).toBe('')
    expect(deriveInitials(undefined)).toBe('')
    expect(deriveInitials('   ')).toBe('')
  })
})

describe('Avatar', () => {
  it('renders initials derived from the name', () => {
    render(<Avatar name="Jane Cooper" />)
    expect(screen.getByText('JC')).toBeInTheDocument()
  })

  it('prefers an explicit initials override', () => {
    render(<Avatar name="Jane Cooper" initials="OG" />)
    expect(screen.getByText('OG')).toBeInTheDocument()
  })

  it('forwards arbitrary span props to the root', () => {
    render(<Avatar name="Jane Cooper" data-testid="av" aria-hidden />)
    expect(screen.getByTestId('av')).toHaveAttribute('aria-hidden', 'true')
  })
})
