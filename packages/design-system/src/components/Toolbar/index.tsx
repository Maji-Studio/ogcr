import { createContext, useContext, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar'
import { cn } from '../../lib/cn'

/* OGCR Toolbar — a roving-focus container for grouped controls, on Base UI
 * `toolbar`. Arrow keys move between items; only one item is in the tab order.
 *
 * Exposed as flat sub-components (matching the Toggle/ToggleGroup convention):
 * `Toolbar`, `ToolbarButton`, `ToolbarGroup`, `ToolbarSeparator`, `ToolbarLink`,
 * `ToolbarInput`. Use `render` on ToolbarButton to project an existing control
 * (e.g. a Toggle / ToggleGroup) into the toolbar's roving-focus model.
 *
 * Density is set once on `Toolbar` via `density` ('comfortable' | 'compact')
 * and flows to the interactive parts through context, so a whole toolbar
 * tightens consistently without threading a size prop onto every child.
 *
 * TODO(plan): overflow / "more" menu affordance for narrow widths — deferred:
 * needs a ResizeObserver measure-and-collapse pass plus a product decision on
 * which items collapse first, so it's tracked separately rather than stubbed.
 */

export type ToolbarOrientation = 'horizontal' | 'vertical'
export type ToolbarDensity = 'comfortable' | 'compact'

const ToolbarDensityContext = createContext<ToolbarDensity>('comfortable')
const useToolbarDensity = () => useContext(ToolbarDensityContext)

/** Control height + horizontal padding per density. */
const controlSize: Record<ToolbarDensity, string> = {
  comfortable: 'h-36 px-12',
  compact: 'h-32 px-8',
}

export type ToolbarProps = {
  children: ReactNode
  orientation?: ToolbarOrientation
  density?: ToolbarDensity
  /** Accessible name for the toolbar landmark (role="toolbar"). */
  'aria-label'?: string
  className?: string
}

export function Toolbar({
  children,
  orientation = 'horizontal',
  density = 'comfortable',
  className,
  ...rest
}: ToolbarProps) {
  return (
    <ToolbarDensityContext.Provider value={density}>
      <BaseToolbar.Root
        orientation={orientation}
        aria-label={rest['aria-label']}
        data-slot="toolbar"
        data-density={density}
        className={cn(
          'flex items-center bg-surface-light border border-border-light rounded-12',
          density === 'compact' ? 'gap-2 p-2' : 'gap-4 p-4',
          orientation === 'vertical' && 'flex-col items-stretch',
          className,
        )}
      >
        {children}
      </BaseToolbar.Root>
    </ToolbarDensityContext.Provider>
  )
}

export type ToolbarButtonProps = ComponentPropsWithoutRef<typeof BaseToolbar.Button>

export function ToolbarButton({ className, ...props }: ToolbarButtonProps) {
  const density = useToolbarDensity()
  return (
    <BaseToolbar.Button
      data-slot="toolbar-button"
      className={cn(
        'inline-flex items-center justify-center gap-8 rounded-8 bg-transparent cursor-pointer',
        controlSize[density],
        'font-standard font-medium text-s leading-[1.4] text-text-primary',
        'outline-none select-none transition-[background-color,color] duration-150',
        'hover:not-disabled:bg-surface-neutral',
        'focus-visible:shadow-focus-primary',
        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        '[&>svg]:w-20 [&>svg]:h-20',
        className,
      )}
      {...props}
    />
  )
}

export type ToolbarGroupProps = ComponentPropsWithoutRef<typeof BaseToolbar.Group>

export function ToolbarGroup({ className, ...props }: ToolbarGroupProps) {
  return (
    <BaseToolbar.Group
      data-slot="toolbar-group"
      className={cn('flex items-center gap-2', className)}
      {...props}
    />
  )
}

export type ToolbarSeparatorProps = ComponentPropsWithoutRef<typeof BaseToolbar.Separator>

export function ToolbarSeparator({ className, ...props }: ToolbarSeparatorProps) {
  return (
    <BaseToolbar.Separator
      data-slot="toolbar-separator"
      className={cn(
        'bg-border-light shrink-0',
        // Base UI sets data-orientation to the separator line's own direction:
        // a horizontal toolbar yields a *vertical* divider, and vice versa.
        'data-[orientation=vertical]:w-px data-[orientation=vertical]:h-20 data-[orientation=vertical]:mx-4',
        'data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=horizontal]:my-4',
        className,
      )}
      {...props}
    />
  )
}

export type ToolbarLinkProps = ComponentPropsWithoutRef<typeof BaseToolbar.Link>

export function ToolbarLink({ className, ...props }: ToolbarLinkProps) {
  const density = useToolbarDensity()
  return (
    <BaseToolbar.Link
      data-slot="toolbar-link"
      className={cn(
        'inline-flex items-center rounded-8 no-underline cursor-pointer',
        controlSize[density],
        'font-standard font-medium text-s leading-[1.4] text-text-primary',
        'outline-none transition-[background-color] duration-150 hover:bg-surface-neutral',
        'focus-visible:shadow-focus-primary',
        className,
      )}
      {...props}
    />
  )
}

export type ToolbarInputProps = ComponentPropsWithoutRef<typeof BaseToolbar.Input>

/** A search/filter input that stays in the toolbar's roving-focus order. */
export function ToolbarInput({ className, ...props }: ToolbarInputProps) {
  const density = useToolbarDensity()
  return (
    <BaseToolbar.Input
      data-slot="toolbar-input"
      className={cn(
        'min-w-0 rounded-8 bg-surface-light border border-border-medium',
        controlSize[density],
        'font-standard font-normal text-s leading-[1.4] text-text-primary',
        'placeholder:text-text-secondary outline-none transition-[border-color,box-shadow] duration-150',
        'hover:not-disabled:border-border-strong',
        'focus-visible:border-interaction-primary-default focus-visible:shadow-focus-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  )
}
