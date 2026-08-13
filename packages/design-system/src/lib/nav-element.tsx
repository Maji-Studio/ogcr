// Shared element renderer for navigation items (Navigation, SideNavigation).
//
// A nav item is a button when it only changes in-page state, a link when it goes somewhere,
// and neither when the app owns routing (Next.js `Link`, TanStack `Link`, `react-router`
// `NavLink`, …). Rather than fork three code paths in every nav component, items declare
// `href` and/or `render` and this component picks the element:
//
//   render → the caller's element/function, with our props merged in (Base UI `render` contract)
//   href   → <a href> — real link semantics: middle-click, ⌘-click, "copy link address"
//   neither → <button type="button">
//
// Internal only: not a published `exports` subpath. Reached through component entries that
// already carry the `'use client'` boundary, so it needs no directive of its own.

import { cloneElement, isValidElement, type ReactElement } from 'react'
import { useRender } from '@base-ui/react/use-render'
import { cn } from './cn'

/**
 * Base UI's `render` contract — a `ReactElement` to clone, or a function
 * `(props, state) => ReactElement`. Our props (className, aria-current, onClick, children)
 * are merged into whatever you return, so a router link keeps the nav item's styling and
 * event handling.
 *
 * `className` on a projected **element** is resolved through `cn()` (tailwind-merge), so
 * `render={<Link className="text-text-negative" />}` genuinely replaces the item's own
 * `text-*` class rather than sitting beside it. A projected **function** receives the
 * merged `props` and owns the composition itself — merge `props.className` with `cn()`
 * there if you add classes.
 */
export type NavRender = useRender.RenderProp

export type NavElementProps = {
  /** Renders the item as an `<a href>` instead of a `<button>`. */
  href?: string
  /** Escape hatch for framework link components. Wins over `href` for the element type. */
  render?: NavRender
  /** Props merged onto the rendered element (className, children, handlers, ARIA). */
  props: Record<string, unknown>
}

export function NavElement({ href, render, props }: NavElementProps) {
  // Base UI's mergeProps *concatenates* className (projected first, ours second) instead of
  // resolving Tailwind conflicts, so a projected `text-text-negative` would sit beside our
  // `text-text-secondary` and lose to whichever rule lands later in the stylesheet. Pre-merge
  // the two through cn()/tailwind-merge and hand useRender an element with no className of its
  // own — everything else (ref, event handlers, style, data-*) still goes through Base UI's
  // merging untouched.
  let element = render
  let className = props.className as string | undefined

  if (isValidElement(render)) {
    const projected = (render.props as { className?: string }).className
    if (projected) {
      className = cn(className, projected)
      element = cloneElement(render as ReactElement<{ className?: string }>, {
        className: undefined,
      })
    }
  }

  // `type="button"` only makes sense on a real <button>; an <a> gets href instead. Both go
  // first so a caller-supplied value in `props` still wins.
  const merged = { ...props, className }
  return useRender({
    render: element,
    defaultTagName: href ? 'a' : 'button',
    props: href ? { href, ...merged } : { type: 'button', ...merged },
  })
}
