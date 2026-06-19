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
    'inline-flex items-center justify-center gap-8 shrink-0 rounded-8 border-0 bg-transparent cursor-pointer select-none outline-none',
    'font-standard font-medium leading-none text-s text-text-secondary',
    'transition-[color,background-color,box-shadow] duration-150',
    'hover:text-text-primary',
    'data-[pressed]:bg-surface-light data-[pressed]:text-text-primary data-[pressed]:shadow-[0_1px_2px_rgba(68,51,33,0.12)]',
    'focus-visible:shadow-focus-primary',
    'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:hover:text-text-secondary',
    '[&>svg]:w-20 [&>svg]:h-20',
  ],
  {
    variants: {
      size: {
        s: 'h-28 min-w-28 px-8',
        m: 'h-36 min-w-36 px-12',
      },
    },
    defaultVariants: { size: 'm' },
  },
)

export type ToggleGroupItem = {
  value: string
  label?: ReactNode
  icon?: ReactNode
  disabled?: boolean
  'aria-label'?: string
}

export type ToggleGroupProps = {
  items: ToggleGroupItem[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  /** Allow more than one segment pressed at once. Defaults to `false`. */
  multiple?: boolean
  disabled?: boolean
  size?: ToggleSize
  'aria-label'?: string
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
  'aria-label': ariaLabel,
  className,
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
      aria-label={ariaLabel}
      data-slot="toggle-group"
      className={cn(
        'inline-flex items-center gap-2 p-2 rounded-12 bg-surface-neutral border border-border-light',
        className,
      )}
    >
      {items.map((item) => (
        <BaseToggle
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          aria-label={item['aria-label']}
          data-slot="toggle-group-item"
          className={segment({ size })}
        >
          {item.icon && (
            <span aria-hidden="true" className="inline-flex w-20 h-20 [&>svg]:w-full [&>svg]:h-full">
              {item.icon}
            </span>
          )}
          {item.label}
        </BaseToggle>
      ))}
    </BaseToggleGroup>
  )
}
