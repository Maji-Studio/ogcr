import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Combobox } from '.'

const items = ['Biochar', 'Direct air capture', 'Reforestation', 'Soil carbon']

describe('Combobox', () => {
  it('renders an input with the placeholder', () => {
    render(<Combobox items={items} placeholder="Search pathways" />)
    expect(screen.getByPlaceholderText('Search pathways')).toBeInTheDocument()
  })

  it('filters options as the user types and selects one', async () => {
    const onValueChange = vi.fn()
    render(<Combobox items={items} placeholder="Search" onValueChange={onValueChange} />)
    const input = screen.getByPlaceholderText('Search')
    await userEvent.type(input, 'Bio')
    await userEvent.click(await screen.findByRole('option', { name: 'Biochar' }))
    expect(onValueChange).toHaveBeenCalled()
    expect(input).toHaveValue('Biochar')
  })

  it('shows the empty message when nothing matches', async () => {
    render(<Combobox items={items} placeholder="Search" emptyMessage="Nothing here" />)
    await userEvent.type(screen.getByPlaceholderText('Search'), 'zzzzz')
    expect(await screen.findByText('Nothing here')).toBeInTheDocument()
  })

  it('sets aria-invalid when error is true', () => {
    render(<Combobox items={items} error placeholder="Search" />)
    expect(screen.getByPlaceholderText('Search')).toHaveAttribute('aria-invalid', 'true')
  })
})
