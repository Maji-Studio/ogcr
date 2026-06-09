import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination, getPaginationRange } from '.'

describe('getPaginationRange', () => {
  it('lists every page when the count is small', () => {
    expect(getPaginationRange(1, 5)).toEqual([1, 2, 3, 4, 5])
  })
  it('shows a trailing ellipsis near the start', () => {
    expect(getPaginationRange(2, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 20])
  })
  it('shows a leading ellipsis near the end', () => {
    expect(getPaginationRange(19, 20)).toEqual([1, 'ellipsis', 16, 17, 18, 19, 20])
  })
  it('shows two ellipses in the middle', () => {
    expect(getPaginationRange(10, 20)).toEqual([1, 'ellipsis', 9, 10, 11, 'ellipsis', 20])
  })
})

describe('Pagination', () => {
  it('marks the current page with aria-current', () => {
    render(<Pagination page={3} pageCount={10} />)
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page')
  })

  it('disables previous on the first page and next on the last', () => {
    const { rerender } = render(<Pagination page={1} pageCount={5} />)
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled()
    rerender(<Pagination page={5} pageCount={5} />)
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
  })

  it('fires onPageChange when a page is clicked', async () => {
    const onPageChange = vi.fn()
    render(<Pagination page={1} pageCount={5} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Page 3' }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('does not fire when clicking the already-active page', async () => {
    const onPageChange = vi.fn()
    render(<Pagination page={3} pageCount={5} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Page 3' }))
    expect(onPageChange).not.toHaveBeenCalled()
  })
})
