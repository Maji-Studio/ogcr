import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowData,
  type SortingState,
} from '@tanstack/react-table'
import { useState, type ComponentProps, type ReactNode } from 'react'
import { dsStrings } from '../../lib/strings'
import { cn } from '../../lib/cn'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: 'left' | 'right' | 'center'
    numeric?: boolean
  }
}

export type DataTableProps<T> = Omit<ComponentProps<'table'>, 'children'> & {
  columns: ColumnDef<T>[]
  data: T[]
  caption?: ReactNode
  /** Accessible name for the scroll region. Used when `caption` is non-string. */
  regionLabel?: string
  emptyState?: ReactNode
  initialSorting?: SortingState
}

const alignClass = (align?: 'left' | 'right' | 'center') =>
  align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'

export function DataTable<T>({
  columns,
  data,
  caption,
  regionLabel,
  emptyState,
  initialSorting,
  className,
  ...rest
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting ?? [])
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const rows = table.getRowModel().rows
  // role="region" requires an accessible name; omit it rather than ship an
  // unlabeled landmark (worse for AT users than no region).
  const regionName = regionLabel ?? (typeof caption === 'string' ? caption : undefined)

  return (
    <div
      data-slot="table"
      className={cn('w-full bg-surface-light border border-border-light rounded-12 overflow-hidden', className)}
    >
      <div
        data-slot="table-scroll"
        role={regionName ? 'region' : undefined}
        aria-label={regionName}
        className="w-full overflow-x-auto"
      >
        <table {...rest} className="w-full border-collapse font-standard">
          {caption && (
            <caption className="caption-top text-left py-12 px-16 font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary bg-surface-neutral border-b border-border-light">
              {caption}
            </caption>
          )}
          <thead className="bg-gradient-to-b from-surface-neutral to-surface-light">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => {
                  const meta = header.column.columnDef.meta
                  const align = meta?.align ?? (meta?.numeric ? 'right' : 'left')
                  const sortable = header.column.getCanSort()
                  const sortDir = header.column.getIsSorted()
                  const ariaSort =
                    sortDir === 'asc' ? 'ascending' : sortDir === 'desc' ? 'descending' : 'none'
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      aria-sort={sortable ? ariaSort : undefined}
                      className={cn(
                        'py-12 px-16 border-b border-border-medium font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-text-secondary whitespace-nowrap align-middle',
                        alignClass(align),
                      )}
                    >
                      {header.isPlaceholder ? null : sortable ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            'inline-flex items-center gap-[6px] p-0 m-0 border-0 bg-transparent font-inherit tracking-inherit text-inherit cursor-pointer',
                            'transition-colors duration-150 hover:text-text-primary',
                            'focus-visible:outline-2 focus-visible:outline-interaction-primary-default focus-visible:outline-offset-[3px] focus-visible:rounded-[2px]',
                            align === 'right' && 'flex-row-reverse',
                          )}
                        >
                          <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                          <span
                            aria-hidden="true"
                            className={cn(
                              'inline-block min-w-[10px] font-mono text-[12px] leading-none transition-opacity duration-150',
                              sortDir
                                ? 'opacity-100 text-interaction-primary-default'
                                : 'opacity-40',
                            )}
                          >
                            {sortDir === 'asc' ? '↑' : sortDir === 'desc' ? '↓' : '↕'}
                          </span>
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-32 px-16 text-center text-text-secondary text-s font-mono uppercase tracking-[0.12em]"
                >
                  {emptyState ?? dsStrings.table.emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="transition-colors duration-150 hover:bg-surface-neutral">
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta
                    const align = meta?.align ?? (meta?.numeric ? 'right' : 'left')
                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          'py-12 px-16 border-b border-dashed border-border-light text-m font-normal text-text-primary align-middle whitespace-nowrap',
                          'group-last:border-b-0',
                          alignClass(align),
                          meta?.numeric && 'tabular-nums [font-feature-settings:"tnum"_1] tracking-[-0.005em] font-medium',
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/** Alias kept so the public export name matches the folder. Prefer `DataTable`. */
export { DataTable as Table }
