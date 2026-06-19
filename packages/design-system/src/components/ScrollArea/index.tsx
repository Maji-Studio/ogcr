import type { CSSProperties, ReactNode } from 'react'
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area'
import { cn } from '../../lib/cn'

/* OGCR ScrollArea — a styled, cross-browser custom scrollbar on Base UI
 * `scroll-area`. Wraps overflowing content so long lists, menus, and panels get
 * a consistent thin scrollbar instead of the native OS one.
 *
 * The thumb auto-hides when idle and appears on hover/scroll. Pass `maxHeight`
 * (or a className with a height constraint) so the viewport actually clips.
 * Set `scrollbars="always"` to keep the thumb permanently visible (e.g. a code
 * block or data panel where the scroll affordance should never disappear).
 */

export type ScrollAreaProps = {
  children: ReactNode
  /** Constrains the viewport so content clips and scrolls. */
  maxHeight?: number | string
  /** Which scrollbars to render. */
  orientation?: 'vertical' | 'horizontal' | 'both'
  /**
   * Thumb visibility. `'hover'` (default) fades the thumb in on hover/scroll;
   * `'always'` keeps it visible whenever the content overflows.
   */
  scrollbars?: 'hover' | 'always'
  className?: string
  /** Class applied to the inner viewport (e.g. padding). */
  viewportClassName?: string
}

function Scrollbar({
  orientation,
  scrollbars,
}: {
  orientation: 'vertical' | 'horizontal'
  scrollbars: 'hover' | 'always'
}) {
  return (
    <BaseScrollArea.Scrollbar
      orientation={orientation}
      data-slot="scroll-area-scrollbar"
      // 'always' relies on Base UI hiding the scrollbar entirely (no
      // data-[visible]) when the content doesn't overflow, so we never show a
      // stray track on non-scrolling content.
      className={cn(
        'flex touch-none select-none p-2 transition-opacity duration-150',
        'data-[orientation=vertical]:w-10',
        'data-[orientation=horizontal]:h-10 data-[orientation=horizontal]:flex-col',
        scrollbars === 'always'
          ? 'opacity-100'
          : 'opacity-0 data-[hovering]:opacity-100 data-[scrolling]:opacity-100',
      )}
    >
      <BaseScrollArea.Thumb
        data-slot="scroll-area-thumb"
        className="flex-1 rounded-12 bg-border-medium hover:bg-border-strong transition-colors duration-150"
      />
    </BaseScrollArea.Scrollbar>
  )
}

export function ScrollArea({
  children,
  maxHeight,
  orientation = 'vertical',
  scrollbars = 'hover',
  className,
  viewportClassName,
}: ScrollAreaProps) {
  const viewportStyle: CSSProperties | undefined =
    maxHeight === undefined ? undefined : { maxHeight }

  return (
    <BaseScrollArea.Root data-slot="scroll-area" className={cn('relative overflow-hidden', className)}>
      <BaseScrollArea.Viewport
        data-slot="scroll-area-viewport"
        style={viewportStyle}
        className={cn('h-full w-full overscroll-contain outline-none', viewportClassName)}
      >
        {children}
      </BaseScrollArea.Viewport>
      {(orientation === 'vertical' || orientation === 'both') && (
        <Scrollbar orientation="vertical" scrollbars={scrollbars} />
      )}
      {(orientation === 'horizontal' || orientation === 'both') && (
        <Scrollbar orientation="horizontal" scrollbars={scrollbars} />
      )}
      <BaseScrollArea.Corner />
    </BaseScrollArea.Root>
  )
}
