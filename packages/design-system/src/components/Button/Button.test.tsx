import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '.'

describe('Button', () => {
  it('defaults to type=button and the filled variant height', () => {
    render(<Button>Save</Button>)
    const el = screen.getByRole('button', { name: 'Save' })
    expect(el).toHaveAttribute('type', 'button')
    expect(el.className).toContain('h-48')
  })

  it('gives the text variant a 40px height so it clears the minimum hit target', () => {
    render(<Button variant="text">Cancel</Button>)
    expect(screen.getByRole('button', { name: 'Cancel' }).className).toContain('h-40')
  })

  it.each([
    ['s', 'h-32'],
    ['m', 'h-40'],
    ['l', 'h-48'],
  ] as const)('honours size=%s', (size, height) => {
    render(<Button size={size}>Sized</Button>)
    expect(screen.getByRole('button', { name: 'Sized' }).className).toContain(height)
  })

  it('stretches with fullWidth', () => {
    render(<Button fullWidth>Wide</Button>)
    expect(screen.getByRole('button', { name: 'Wide' }).className).toContain('w-full')
  })

  it('renders an icon-only button as a square target named by aria-label', () => {
    render(<Button iconOnly aria-label="Settings" iconLeft={<svg />} />)
    const el = screen.getByRole('button', { name: 'Settings' })
    expect(el).toHaveAttribute('data-icon-only', 'true')
    expect(el.className).toContain('w-48')
    expect(el.className).toContain('px-0')
    expect(el.querySelector('[data-slot="button-label"]')).toBeNull()
  })

  it('rounds an icon-only button fully with shape=circle', () => {
    render(<Button iconOnly shape="circle" aria-label="Add" iconLeft={<svg />} />)
    expect(screen.getByRole('button', { name: 'Add' }).className).toContain('rounded-full')
  })

  it('marks both icon slots decorative', () => {
    render(
      <Button iconLeft={<svg data-testid="left" />} iconRight={<svg data-testid="right" />}>
        Continue
      </Button>,
    )
    const slots = screen
      .getByRole('button', { name: 'Continue' })
      .querySelectorAll('[data-slot="button-icon"]')
    expect(slots).toHaveLength(2)
    slots.forEach((slot) => expect(slot).toHaveAttribute('aria-hidden', 'true'))
  })

  it('merges consumer classNames over the variant classes', () => {
    render(<Button className="rounded-full">Pill</Button>)
    const el = screen.getByRole('button', { name: 'Pill' })
    expect(el.className).toContain('rounded-full')
    expect(el.className).not.toContain('rounded-12')
  })

  it('fires onClick and stays inert when disabled', async () => {
    const onClick = vi.fn()
    const { rerender } = render(<Button onClick={onClick}>Go</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(onClick).toHaveBeenCalledTimes(1)

    rerender(
      <Button onClick={onClick} disabled>
        Go
      </Button>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
