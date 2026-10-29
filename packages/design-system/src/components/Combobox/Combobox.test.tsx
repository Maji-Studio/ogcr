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

  it('associates a label and links helperText via aria-describedby', () => {
    render(<Combobox items={items} label="Pathway" helperText="Start typing to search" />)
    const input = screen.getByLabelText('Pathway')
    const describedBy = input.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(document.getElementById(describedBy!)).toHaveTextContent('Start typing to search')
  })

  describe('multiple', () => {
    const farms = ['Aldermoor Farm', 'Brookside Barton', 'Dunmere Estate']

    it('renders defaults as chips with accessible remove buttons', () => {
      render(
        <Combobox multiple items={farms} defaultValue={['Aldermoor Farm', 'Dunmere Estate']} aria-label="Farms" />,
      )
      expect(screen.getByRole('button', { name: 'Remove Aldermoor Farm' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Remove Dunmere Estate' })).toBeInTheDocument()
    })

    it('selects several items, keeps the list open and reports an array', async () => {
      const onValueChange = vi.fn()
      render(<Combobox multiple items={farms} placeholder="Search farms" onValueChange={onValueChange} />)
      await userEvent.click(screen.getByPlaceholderText('Search farms'))
      await userEvent.click(await screen.findByRole('option', { name: 'Aldermoor Farm' }))
      await userEvent.click(await screen.findByRole('option', { name: 'Dunmere Estate' }))
      expect(onValueChange).toHaveBeenLastCalledWith(['Aldermoor Farm', 'Dunmere Estate'], expect.anything())
      expect(screen.getByRole('listbox')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Remove Aldermoor Farm' })).toBeInTheDocument()
    })

    it('removes a chip with its remove button', async () => {
      const onValueChange = vi.fn()
      render(
        <Combobox
          multiple
          items={farms}
          defaultValue={['Aldermoor Farm', 'Dunmere Estate']}
          aria-label="Farms"
          onValueChange={onValueChange}
        />,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Remove Aldermoor Farm' }))
      expect(onValueChange).toHaveBeenLastCalledWith(['Dunmere Estate'], expect.anything())
      expect(screen.queryByRole('button', { name: 'Remove Aldermoor Farm' })).not.toBeInTheDocument()
    })

    it('removes the last chip with Backspace in the empty input', async () => {
      render(
        <Combobox multiple items={farms} defaultValue={['Aldermoor Farm', 'Dunmere Estate']} placeholder="Search farms" />,
      )
      await userEvent.click(screen.getByPlaceholderText('Search farms'))
      await userEvent.keyboard('{Backspace}')
      const chips = Array.from(document.querySelectorAll('[data-slot="combobox-chip"]'))
      expect(chips.map((chip) => chip.textContent)).toEqual(['Aldermoor Farm'])
    })

    it('filters while typing', async () => {
      render(<Combobox multiple items={farms} placeholder="Search farms" />)
      await userEvent.type(screen.getByPlaceholderText('Search farms'), 'Dun')
      expect(await screen.findByRole('option', { name: 'Dunmere Estate' })).toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'Brookside Barton' })).not.toBeInTheDocument()
    })

    it('overrides the remove label', () => {
      render(
        <Combobox
          multiple
          items={farms}
          defaultValue={['Aldermoor Farm']}
          removeLabel={(l) => `${l} entfernen`}
          aria-label="Farms"
        />,
      )
      expect(screen.getByRole('button', { name: 'Aldermoor Farm entfernen' })).toBeInTheDocument()
    })

    it('associates a label with the input', () => {
      render(<Combobox multiple items={farms} label="Farms" />)
      expect(screen.getByLabelText('Farms')).toBeInTheDocument()
    })
  })
})
