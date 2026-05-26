import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Radio, RadioGroup } from '.'

const renderGroup = (props: Partial<Parameters<typeof RadioGroup>[0]> = {}) =>
  render(
    <RadioGroup aria-label="Plan" {...props}>
      <Radio value="monthly" label="Monthly" />
      <Radio value="annual" label="Annual" />
      <Radio value="custom" label="Custom" disabled />
      <Radio value="error" label="Bad" error />
    </RadioGroup>,
  )

describe('Radio', () => {
  it('exposes each label as an accessible name', () => {
    renderGroup()
    expect(screen.getByRole('radio', { name: 'Monthly' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Annual' })).toBeInTheDocument()
  })

  it('fires onValueChange with the selected value when clicked', async () => {
    const onValueChange = vi.fn()
    renderGroup({ onValueChange })
    await userEvent.click(screen.getByRole('radio', { name: 'Annual' }))
    expect(onValueChange).toHaveBeenCalledWith('annual')
  })

  it('reflects the controlled value as checked', () => {
    renderGroup({ value: 'monthly' })
    expect(screen.getByRole('radio', { name: 'Monthly' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Annual' })).not.toBeChecked()
  })

  it('marks individual radios as aria-invalid when error', () => {
    renderGroup()
    expect(screen.getByRole('radio', { name: 'Bad' })).toHaveAttribute(
      'aria-invalid',
      'true',
    )
  })

  it('does not fire onValueChange for disabled radios', async () => {
    const onValueChange = vi.fn()
    renderGroup({ onValueChange })
    await userEvent.click(screen.getByRole('radio', { name: 'Custom' }))
    expect(onValueChange).not.toHaveBeenCalled()
  })
})
