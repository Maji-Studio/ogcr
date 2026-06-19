import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '.'

type Row = { name: string; count: number }
const columns: ColumnDef<Row>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'count', header: 'Count', meta: { numeric: true } },
]

describe('DataTable', () => {
  it('renders all rows', () => {
    render(<DataTable columns={columns} data={[{ name: 'a', count: 1 }, { name: 'b', count: 2 }]} />)
    expect(screen.getByText('a')).toBeInTheDocument()
    expect(screen.getByText('b')).toBeInTheDocument()
  })

  it('shows the empty state when data is empty', () => {
    render(<DataTable columns={columns} data={[]} emptyState="Nothing here" />)
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })

  it('sorts when a header is clicked', async () => {
    render(<DataTable columns={columns} data={[{ name: 'b', count: 2 }, { name: 'a', count: 1 }]} />)
    await userEvent.click(screen.getByRole('button', { name: /Name/ }))
    const rows = screen.getAllByRole('row')
    expect(rows[1]).toHaveTextContent('a')
  })
})
