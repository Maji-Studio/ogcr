'use client'

import { createContext, useContext, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { Radio as BaseRadio } from '@base-ui/react/radio'
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/cn'
import { CheckIcon } from '../icons'

export type OptionCardColumns = 1 | 2 | 3
export type OptionCardLayout = 'horizontal' | 'vertical'
export type OptionCardLeadingTone = 'neutral' | 'positive' | 'progress'
export type OptionCardIndicatorPosition = 'start' | 'end'

type GroupBase = Omit<ComponentPropsWithoutRef<'div'>, 'defaultValue' | 'onChange' | 'children'> & {
  /** Grid columns from the `sm` breakpoint up. Always one column below it. */
  columns?: OptionCardColumns
  disabled?: boolean
  name?: string
  children: ReactNode
}

export type OptionCardGroupProps =
  | (GroupBase & {
      multiple?: false
      value?: string
      defaultValue?: string
      onValueChange?: (value: string) => void
    })
  | (GroupBase & {
      /** Checkbox semantics: any number of cards can be on. */
      multiple: true
      value?: string[]
      defaultValue?: string[]
      onValueChange?: (value: string[]) => void
    })

const OptionCardContext = createContext<{ multiple: boolean }>({ multiple: false })

const columnClass: Record<OptionCardColumns, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-3',
}

export function OptionCardGroup(props: OptionCardGroupProps) {
  const {
    multiple,
    value,
    defaultValue,
    onValueChange,
    columns = 1,
    disabled,
    name,
    className,
    children,
    ...rest
  } = props
  const classes = cn('grid gap-16', columnClass[columns], className)

  if (multiple) {
    return (
      <OptionCardContext.Provider value={{ multiple: true }}>
        <BaseCheckboxGroup
          {...rest}
          value={value as string[] | undefined}
          defaultValue={value === undefined ? (defaultValue as string[] | undefined) : undefined}
          onValueChange={(next) => (onValueChange as ((v: string[]) => void) | undefined)?.(next)}
          disabled={disabled}
          data-slot="option-card-group"
          className={classes}
        >
          {children}
        </BaseCheckboxGroup>
      </OptionCardContext.Provider>
    )
  }

  return (
    <OptionCardContext.Provider value={{ multiple: false }}>
      <BaseRadioGroup
        {...rest}
        value={value as string | undefined}
        defaultValue={value === undefined ? (defaultValue as string | undefined) : undefined}
        onValueChange={(next) => (onValueChange as ((v: string) => void) | undefined)?.(String(next))}
        name={name}
        disabled={disabled}
        data-slot="option-card-group"
        className={classes}
      >
        {children}
      </BaseRadioGroup>
    </OptionCardContext.Provider>
  )
}

const card = cva(
  [
    'group relative flex w-full min-w-0 cursor-pointer gap-16 p-16 text-left',
    'bg-surface-light border-w-m border border-border-light rounded-12 outline-none',
    'font-standard text-text-primary',
    'transition-[border-color,box-shadow] duration-150 motion-reduce:transition-none',
    'hover:border-border-strong',
    'data-[checked]:border-interaction-primary-default data-[checked]:ring-3 data-[checked]:ring-interaction-primary-focus',
    // The solid focus ring replaces the pale selected halo while the card has keyboard focus.
    'focus-visible:shadow-focus-primary focus-visible:ring-0',
    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:hover:border-border-light',
  ],
  {
    variants: {
      layout: {
        horizontal: 'flex-row items-start',
        vertical: 'flex-col items-center text-center p-24 gap-12',
      },
    },
    defaultVariants: { layout: 'horizontal' },
  },
)

const tile = cva(
  'inline-flex shrink-0 items-center justify-center rounded-12 [&>svg]:w-24 [&>svg]:h-24',
  {
    variants: {
      tone: {
        neutral: 'bg-surface-neutral text-icon-primary',
        positive: 'bg-surface-positive text-icon-positive',
        progress: 'bg-surface-progress text-icon-progress',
      },
      layout: {
        horizontal: 'w-48 h-48',
        vertical: 'w-64 h-64 [&>svg]:w-28 [&>svg]:h-28',
      },
    },
    defaultVariants: { tone: 'neutral', layout: 'horizontal' },
  },
)

export type OptionCardProps = Omit<
  ComponentPropsWithoutRef<'span'>,
  'title' | 'children' | 'defaultValue' | 'onChange'
> & {
  /** The value this card contributes to the group. */
  value: string
  title: ReactNode
  description?: ReactNode
  /** Icon or glyph shown in a tinted tile. Categories use icons, never colour swatches. */
  leading?: ReactNode
  /** Tile tint. Colour carries level only: `positive` for good, `progress` for in-flight. */
  leadingTone?: OptionCardLeadingTone
  /** A small label under the description, usually a `Pill`. */
  tag?: ReactNode
  /** Shows the radio dot or checkbox. Defaults to on for `horizontal`, off for `vertical`. */
  indicator?: boolean
  /** Where the indicator sits in a horizontal card. `start` puts it before the title. */
  indicatorPosition?: OptionCardIndicatorPosition
  layout?: OptionCardLayout
  disabled?: boolean
}

export function OptionCard({
  value,
  title,
  description,
  leading,
  leadingTone = 'neutral',
  tag,
  indicator,
  indicatorPosition = 'end',
  layout = 'horizontal',
  disabled,
  className,
  ...rest
}: OptionCardProps) {
  const { multiple } = useContext(OptionCardContext)
  const titleId = useId()
  const descriptionId = useId()
  const showIndicator = indicator ?? layout === 'horizontal'

  const indicatorNode = showIndicator ? (
    <span
      aria-hidden="true"
      data-slot="option-card-indicator"
      className={cn(
        'mt-2 inline-flex h-20 w-20 shrink-0 items-center justify-center border-w-m border bg-surface-light',
        'border-border-strong transition-[background-color,border-color] duration-150 motion-reduce:transition-none',
        multiple ? 'rounded-4' : 'rounded-full',
        'group-data-[checked]:border-interaction-primary-default',
        multiple && 'group-data-[checked]:bg-interaction-primary-default text-surface-light',
      )}
    >
      {multiple ? (
        <CheckIcon className="h-12 w-12 opacity-0 group-data-[checked]:opacity-100" />
      ) : (
        <span className="h-10 w-10 scale-0 rounded-full bg-interaction-primary-default transition-transform duration-150 group-data-[checked]:scale-100 motion-reduce:transition-none" />
      )}
    </span>
  ) : null

  const leadingTile = leading ? (
    <span aria-hidden="true" data-slot="option-card-leading" className={tile({ tone: leadingTone, layout })}>
      {leading}
    </span>
  ) : null

  const body = (
    <span
      data-slot="option-card-body"
      className={cn('flex min-w-0 flex-1 flex-col gap-4', layout === 'vertical' && 'items-center')}
    >
      <span id={titleId} className="text-ms font-semibold leading-[1.3] text-text-primary">
        {title}
      </span>
      {description && (
        <span id={descriptionId} className="text-s leading-[1.45] text-text-secondary">
          {description}
        </span>
      )}
      {tag && <span className="mt-4 inline-flex">{tag}</span>}
    </span>
  )

  const content = (
    <>
      {indicatorPosition === 'start' && layout === 'horizontal' && indicatorNode}
      {leadingTile}
      {body}
      {(indicatorPosition === 'end' || layout === 'vertical') && indicatorNode}
    </>
  )

  const common = {
    ...rest,
    value,
    disabled,
    render: <div />,
    'aria-labelledby': rest['aria-labelledby'] ?? titleId,
    'aria-describedby': rest['aria-describedby'] ?? (description ? descriptionId : undefined),
    'data-slot': 'option-card',
    'data-layout': layout,
    className: cn(card({ layout }), className),
  }

  return multiple ? (
    <BaseCheckbox.Root {...common}>{content}</BaseCheckbox.Root>
  ) : (
    <BaseRadio.Root {...common}>{content}</BaseRadio.Root>
  )
}
