import type { ComponentProps, ReactNode } from 'react'
import { Toggle as BaseToggle } from '@base-ui/react/toggle'
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const toggle = cva(
  [
    'inline-flex items-center justify-center gap-8 shrink-0 rounded-8 border border-transparent bg-transparent cursor-pointer select-none outline-none',
    'font-standard font-medium leading-none text-s text-text-secondary',
    'transition-colors duration-150',
    'hover:bg-surface-neutral hover:text-text-primary',
    'data-[pressed]:bg-interaction-primary-focus data-[pressed]:text-text-primary',
    'focus-visible:shadow-focus-primary',
    'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:hover:bg-transparent',
    '[&>svg]:w-20 [&>svg]:h-20',
  ],
  {
    variants: {
      size: {
        s: 'h-32 min-w-32 px-8',
        m: 'h-40 min-w-40 px-12',
      },
    },
    defaultVariants: { size: 'm' },
  },
)

export type ToggleSize = NonNullable<VariantProps<typeof toggle>['size']>

export type ToggleProps = Omit<
  ComponentProps<typeof BaseToggle>,
  'onPressedChange'
> & {
  onPressedChange?: (pressed: boolean) => void
  size?: ToggleSize
  children?: ReactNode
}

export function Toggle({
  pressed,
  defaultPressed,
  onPressedChange,
  size,
  children,
  className,
  ...rest
}: ToggleProps) {
  return (
    <BaseToggle
      {...rest}
      pressed={pressed}
      defaultPressed={pressed === undefined ? defaultPressed : undefined}
      onPressedChange={onPressedChange}
      data-slot="toggle"
      className={cn(toggle({ size }), className)}
    >
      {children}
    </BaseToggle>
  )
}

const segment = cva(
  [
    'inline-flex items-center justify-center gap-8 shrink-0 bg-transparent cursor-pointer select-none outline-none',
    'font-standard leading-none text-text-secondary',
    'transition-[color,background-color,box-shadow,border-color] duration-150',
    'hover:text-text-primary',
    'focus-visible:shadow-focus-primary',
    'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:hover:text-text-secondary',
    '[&>svg]:w-20 [&>svg]:h-20',
  ],
  {
    variants: {
      appearance: {
        default: [
          'rounded-8 border-0 font-medium',
          /* allow-literal-color: TODO replace with the `shadow-control-pressed` token (theme.css). */
          'data-[pressed]:bg-surface-light data-[pressed]:text-text-primary data-[pressed]:shadow-[0_1px_2px_rgba(68,51,33,0.12)]',
        ],
        /* Prototype `.seg2`: radius 6 snaps to rounded-4 (concentric with the rounded-8 shell + 4px padding). */
        segmented: [
          'relative rounded-4 border-0 font-normal',
          'data-[pressed]:bg-surface-positive data-[pressed]:text-text-primary data-[pressed]:font-medium',
        ],
        /* Prototype `.fchip` / `.timewin button` / `.schips button`. */
        chip: [
          'relative rounded-full border border-solid border-border-medium font-normal',
          'data-[pressed]:bg-surface-positive data-[pressed]:border-border-positive-light data-[pressed]:text-text-primary data-[pressed]:font-medium',
        ],
      },
      size: {
        s: '',
        m: '',
      },
    },
    compoundVariants: [
      { appearance: 'default', size: 's', class: 'h-28 min-w-28 px-8 text-s' },
      { appearance: 'default', size: 'm', class: 'h-36 min-w-36 px-12 text-s' },
      /* Visual height keeps the prototype's dense look; a ::before stretches the hit area to 40px (§8). */
      { appearance: ['segmented', 'chip'], size: 's', class: 'h-24 px-8 text-xxs before:absolute before:inset-x-0' },
      { appearance: ['segmented', 'chip'], size: 'm', class: 'h-32 px-12 text-s before:absolute before:inset-x-0' },
      /* ::before is positioned against the padding box, so the chip's 1px border needs 1px more reach. */
      { appearance: 'segmented', size: 's', class: 'before:-inset-y-8' },
      { appearance: 'segmented', size: 'm', class: 'before:-inset-y-4' },
      { appearance: 'chip', size: 's', class: 'before:-inset-y-10' },
      { appearance: 'chip', size: 'm', class: 'before:-inset-y-6' },
    ],
    defaultVariants: { appearance: 'default', size: 'm' },
  },
)

const group = cva('', {
  variants: {
    appearance: {
      default: 'inline-flex items-center gap-2 p-2 rounded-12 bg-surface-neutral border border-border-light',
      segmented: 'inline-flex items-center gap-2 p-4 rounded-8 bg-surface-light border border-border-light',
      chip: 'flex flex-wrap items-center gap-8',
    },
  },
  defaultVariants: { appearance: 'default' },
})

export type ToggleGroupAppearance = NonNullable<VariantProps<typeof group>['appearance']>

export type ToggleGroupItem = {
  value: string
  label?: ReactNode
  icon?: ReactNode
  /**
   * Generic leading node (icon, glyph) before the label. Takes precedence over `icon`.
   * Categories use icons, never colour swatches.
   */
  leading?: ReactNode
  disabled?: boolean
  'aria-label'?: string
}

/**
 * Open-ended on purpose: the group is projected into a `Toolbar` via
 * `<ToolbarButton render={<ToggleGroup … />} />` (spec §4.39), and Base UI's `render`
 * hands the projected element its roving-focus wiring (`tabIndex`, key handlers,
 * `data-*`, `ref`) as ordinary props. Anything the wrapper doesn't own itself is
 * forwarded to `BaseToggleGroup` *after* our defaults, so injected props win.
 */
export type ToggleGroupProps = Omit<
  ComponentProps<typeof BaseToggleGroup>,
  'value' | 'defaultValue' | 'onValueChange' | 'className' | 'children'
> & {
  items: ToggleGroupItem[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  /** Allow more than one segment pressed at once. Defaults to `false`. */
  multiple?: boolean
  disabled?: boolean
  size?: ToggleSize
  /**
   * `default` is the neutral tray. `segmented` is the light inline segmented control (OGCR: at
   * most 3 options, use a dropdown above that). `chip` is a wrapping row of round filter chips.
   */
  appearance?: ToggleGroupAppearance
  className?: string
}

export function ToggleGroup({
  items,
  value,
  defaultValue,
  onValueChange,
  multiple = false,
  disabled,
  size,
  appearance,
  className,
  ...rest
}: ToggleGroupProps) {
  return (
    <BaseToggleGroup
      value={value}
      defaultValue={value === undefined ? defaultValue : undefined}
      onValueChange={onValueChange}
      multiple={multiple}
      disabled={disabled}
      // Base UI defaults role="group", but it also emits aria-orientation,
      // which ARIA only permits on a few roles (group isn't one). "toolbar"
      // is the correct role for a set of related controls and makes the
      // orientation valid; the roving-focus keyboard model already matches.
      role="toolbar"
      data-slot="toggle-group"
      {...rest}
      data-appearance={appearance ?? 'default'}
      className={cn(group({ appearance }), className)}
    >
      {items.map((item) => (
        <BaseToggle
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          aria-label={item['aria-label']}
          data-slot="toggle-group-item"
          className={segment({ size, appearance })}
        >
          {(item.leading ?? item.icon) && (
            <span aria-hidden="true" className="inline-flex w-20 h-20 [&>svg]:w-full [&>svg]:h-full">
              {item.leading ?? item.icon}
            </span>
          )}
          {item.label}
        </BaseToggle>
      ))}
    </BaseToggleGroup>
  )
}
