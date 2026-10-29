import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OptionCard, OptionCardGroup } from '.'

describe('OptionCardGroup (single)', () => {
  const setup = (props: Partial<Parameters<typeof OptionCardGroup>[0]> = {}) =>
    render(
      <OptionCardGroup aria-label="Role" {...(props as object)}>
        <OptionCard value="farmer" title="Farmer" description="Own land" />
        <OptionCard value="intermediary" title="Intermediary" />
        <OptionCard value="locked" title="Locked" disabled />
      </OptionCardGroup>,
    )

  it('is a radiogroup of radios named by their title', () => {
    setup()
    expect(screen.getByRole('radiogroup', { name: 'Role' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Farmer' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Farmer' })).toHaveAccessibleDescription('Own land')
  })

  it('selects on click anywhere on the card and reports the value', async () => {
    const onValueChange = vi.fn()
    setup({ onValueChange })
    await userEvent.click(screen.getByText('Intermediary'))
    expect(onValueChange).toHaveBeenCalledWith('intermediary')
    expect(screen.getByRole('radio', { name: 'Intermediary' })).toBeChecked()
  })

  it('reflects a controlled value', () => {
    setup({ value: 'farmer' })
    expect(screen.getByRole('radio', { name: 'Farmer' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Intermediary' })).not.toBeChecked()
  })

  it('moves selection with the arrow keys', async () => {
    setup({ defaultValue: 'farmer' })
    screen.getByRole('radio', { name: 'Farmer' }).focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('radio', { name: 'Intermediary' })).toBeChecked()
  })

  it('does not select a disabled card', async () => {
    const onValueChange = vi.fn()
    setup({ onValueChange })
    await userEvent.click(screen.getByText('Locked'))
    expect(onValueChange).not.toHaveBeenCalled()
  })
})

describe('OptionCardGroup (multiple)', () => {
  it('is a group of checkboxes that toggle independently', async () => {
    const onValueChange = vi.fn()
    render(
      <OptionCardGroup multiple aria-label="Practices" defaultValue={['cover']} onValueChange={onValueChange}>
        <OptionCard value="cover" title="Cover crops" />
        <OptionCard value="notill" title="No-till" />
      </OptionCardGroup>,
    )
    expect(screen.getByRole('group', { name: 'Practices' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Cover crops' })).toBeChecked()
    await userEvent.click(screen.getByText('No-till'))
    expect(onValueChange).toHaveBeenLastCalledWith(['cover', 'notill'])
    await userEvent.click(screen.getByText('Cover crops'))
    expect(onValueChange).toHaveBeenLastCalledWith(['notill'])
  })
})
