// The one pointer arrow shared by every floating surface (Popover, Tooltip, Menu). Kept in
// its own file so ./chrome stays component-free (Fast Refresh / react-refresh wants a file to
// export only components OR only non-components). See docs/adr/0001-no-generic-overlay-module.md.

import type { ComponentPropsWithoutRef } from 'react'

export type OverlayArrowSvgProps = ComponentPropsWithoutRef<'svg'> & {
  /** Foreground (surface) fill utility, e.g. `fill-surface-light`. */
  fillClassName?: string
  /** Border-halo fill utility. Rendered only when `border` is true. */
  borderClassName?: string
  /**
   * Render the bordered two-path arrow (light surfaces). Dark surfaces such as Tooltip pass
   * `border={false}` to render only the single foreground path.
   */
  border?: boolean
}

/**
 * Light popups get the bordered two-path shape (foreground + 1px halo); the dark Tooltip arrow
 * is the single foreground path. Decorative — `aria-hidden` by default; the popup carries the
 * accessible name.
 */
export function OverlayArrowSvg({
  fillClassName = 'fill-surface-light',
  borderClassName = 'fill-border-light',
  border = true,
  ...props
}: OverlayArrowSvgProps) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" aria-hidden="true" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        className={fillClassName}
      />
      {border && (
        <path
          d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L20 7L20 8L18.5349 8.00001C17.5468 8.00001 16.5936 7.63424 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8L0 8L0 7L2.13172 7C2.87284 7 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
          className={borderClassName}
        />
      )}
    </svg>
  )
}
