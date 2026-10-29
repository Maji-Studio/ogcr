import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('keeps both a custom font-size and a text colour', () => {
    expect(cn('text-ms text-text-primary')).toBe('text-ms text-text-primary')
    expect(cn('text-text-primary text-ms')).toBe('text-text-primary text-ms')
  })

  it('lets the later font-size win over the earlier one', () => {
    expect(cn('text-m', 'text-ms')).toBe('text-ms')
  })

  it('treats font-semibold as a font-weight that overrides font-medium', () => {
    expect(cn('font-medium', 'font-semibold')).toBe('font-semibold')
  })
})
