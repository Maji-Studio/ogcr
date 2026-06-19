import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Accordion } from '.'

const items = [
  { value: 'a', title: 'First', content: 'First panel body' },
  { value: 'b', title: 'Second', content: 'Second panel body' },
]

describe('Accordion', () => {
  it('renders a trigger per item', () => {
    render(<Accordion items={items} />)
    expect(screen.getByRole('button', { name: 'First' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Second' })).toBeInTheDocument()
  })

  it('reveals a panel when its trigger is clicked', async () => {
    render(<Accordion items={items} />)
    expect(screen.queryByText('First panel body')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'First' }))
    expect(await screen.findByText('First panel body')).toBeInTheDocument()
  })

  it('closes the open panel when a second opens in single mode', async () => {
    render(<Accordion items={items} defaultValue={['a']} />)
    expect(screen.getByText('First panel body')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Second' }))
    expect(await screen.findByText('Second panel body')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText('First panel body')).not.toBeInTheDocument())
  })

  it('keeps both panels open in multiple mode', async () => {
    render(<Accordion items={items} multiple defaultValue={['a']} />)
    await userEvent.click(screen.getByRole('button', { name: 'Second' }))
    expect(await screen.findByText('Second panel body')).toBeInTheDocument()
    expect(screen.getByText('First panel body')).toBeInTheDocument()
  })
})
