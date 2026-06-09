import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '.'
import { Pill } from '../Pill'

type Issuance = {
  project: string
  methodology: string
  plots: number
  credits: number
  status: 'verified' | 'review' | 'flagged'
  updated: string
}

const DATA: Issuance[] = [
  { project: 'Iberian rewilding', methodology: 'v3.2', plots: 12, credits: 42180, status: 'review', updated: '2026-04-22' },
  { project: 'Atlantic kelp restoration', methodology: 'v2.8', plots: 8, credits: 18420, status: 'verified', updated: '2026-04-19' },
  { project: 'Selva del Mar peatland', methodology: 'v3.1', plots: 24, credits: 96300, status: 'verified', updated: '2026-04-15' },
  { project: 'Mara grasslands soil', methodology: 'v3.0', plots: 16, credits: 31870, status: 'flagged', updated: '2026-04-12' },
]

const STATUS_TONE = { verified: 'positive', review: 'warning', flagged: 'negative' } as const
const STATUS_LABEL = { verified: 'Verified', review: 'In review', flagged: 'Flagged' } as const

const columns: ColumnDef<Issuance>[] = [
  { accessorKey: 'project', header: 'Project' },
  { accessorKey: 'methodology', header: 'Methodology' },
  { accessorKey: 'plots', header: 'Plots', meta: { numeric: true } },
  {
    accessorKey: 'credits',
    header: 'Credits (t CO₂e)',
    meta: { numeric: true },
    cell: (info) => info.getValue<number>().toLocaleString('en-US'),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: false,
    cell: (info) => {
      const v = info.getValue<Issuance['status']>()
      return <Pill tone={STATUS_TONE[v]}>{STATUS_LABEL[v]}</Pill>
    },
  },
  { accessorKey: 'updated', header: 'Updated' },
]

const meta = {
  title: 'Modules/Table',
  component: DataTable<Issuance>,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DataTable<Issuance>>

export default meta
type Story = StoryObj<typeof meta>

export const Issuances: Story = {
  args: {
    caption: 'Issuance ledger · last 30 days',
    columns,
    data: DATA,
    initialSorting: [{ id: 'updated', desc: true }],
  },
}

export const Empty: Story = {
  args: {
    caption: 'Empty ledger',
    columns,
    data: [],
  },
}
