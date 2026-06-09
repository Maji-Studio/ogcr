import type { ComponentProps } from 'react'
import { ArrowLeftIcon, ArrowRightIcon } from '../icons'
import { cn } from '../../lib/cn'

export type PaginationProps = Omit<ComponentProps<'nav'>, 'children' | 'onChange'> & {
  /** Current page (1-based). */
  page: number
  /** Total number of pages. */
  pageCount: number
  onPageChange?: (page: number) => void
  /** Pages shown either side of the current page. Defaults to 1. */
  siblingCount?: number
}

function range(start: number, end: number): number[] {
  return Array.from({ length: Math.max(end - start + 1, 0) }, (_, i) => start + i)
}

/** Build the visible page list with `'ellipsis'` gap markers. */
// eslint-disable-next-line react-refresh/only-export-components -- helper ships from the component barrel
export function getPaginationRange(
  page: number,
  pageCount: number,
  siblingCount = 1,
): Array<number | 'ellipsis'> {
  // first + last + current + 2*siblings + 2 ellipses
  const totalSlots = siblingCount * 2 + 5
  if (pageCount <= totalSlots) return range(1, pageCount)

  const leftSibling = Math.max(page - siblingCount, 1)
  const rightSibling = Math.min(page + siblingCount, pageCount)
  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < pageCount - 1
  const edgeCount = 3 + 2 * siblingCount

  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, edgeCount), 'ellipsis', pageCount]
  }
  if (showLeftEllipsis && !showRightEllipsis) {
    return [1, 'ellipsis', ...range(pageCount - edgeCount + 1, pageCount)]
  }
  return [1, 'ellipsis', ...range(leftSibling, rightSibling), 'ellipsis', pageCount]
}

const cell =
  'inline-flex items-center justify-center min-w-40 h-40 px-12 rounded-8 bg-transparent border-0 cursor-pointer ' +
  'font-standard font-medium text-s leading-none text-text-secondary transition-colors duration-150 ' +
  'hover:bg-surface-neutral hover:text-text-primary ' +
  'focus-visible:outline-none focus-visible:shadow-focus-primary ' +
  'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-secondary'
const activeCell = 'bg-interaction-primary-default text-surface-page hover:bg-interaction-primary-hover hover:text-surface-page'
const iconCell = 'w-40 px-0 [&>svg]:w-20 [&>svg]:h-20 text-icon-secondary hover:text-icon-primary'

export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  className,
  ...rest
}: PaginationProps) {
  const pages = getPaginationRange(page, pageCount, siblingCount)
  const go = (next: number) => {
    if (next >= 1 && next <= pageCount && next !== page) onPageChange?.(next)
  }

  return (
    <nav aria-label="Pagination" {...rest} data-slot="pagination" className={className}>
      <ul className="flex items-center gap-4 list-none m-0 p-0">
        <li>
          <button
            type="button"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => go(page - 1)}
            className={cn(cell, iconCell)}
          >
            <ArrowLeftIcon />
          </button>
        </li>
        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            // Keep the <li> in the list structure; hide only the decorative gap glyph.
            <li key={`ellipsis-${i}`} className="inline-flex items-center justify-center min-w-40 h-40 text-text-secondary">
              <span aria-hidden="true">…</span>
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                aria-label={`Page ${p}`}
                aria-current={p === page ? 'page' : undefined}
                onClick={() => go(p)}
                className={cn(cell, p === page && activeCell)}
              >
                {p}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            aria-label="Next page"
            disabled={page >= pageCount}
            onClick={() => go(page + 1)}
            className={cn(cell, iconCell)}
          >
            <ArrowRightIcon />
          </button>
        </li>
      </ul>
    </nav>
  )
}
