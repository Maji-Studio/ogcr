import { Fragment, type ComponentProps, type ReactNode } from 'react'
import { Select as BaseSelect } from '@base-ui/react/select'
import { OVERLAY_SIDE_OFFSET, overlayPopupClassName } from '../../lib/overlay'
import { useField, type FieldAriaInvalid } from '../../lib/field'
import { dsStrings } from '../../lib/strings'
import { cn } from '../../lib/cn'
import { CaretDownIcon, CheckIcon } from '../icons'

export type SelectSide = 'top' | 'right' | 'bottom' | 'left'
export type SelectAlign = 'start' | 'center' | 'end'

export type SelectOption = {
  value: string
  label: ReactNode
  disabled?: boolean
  /** Small trailing text, e.g. a count (`12 parcels`). */
  meta?: ReactNode
}

type SelectCommonProps = Omit<
  ComponentProps<typeof BaseSelect.Trigger>,
  'value' | 'defaultValue' | 'onValueChange' | 'children' | 'className' | 'disabled'
> & {
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  name?: string
  id?: string
  error?: boolean
  /** Optional label rendered above the trigger (associated via `htmlFor`). */
  label?: ReactNode
  /** Helper text below the trigger; replaced by `errorText` when that is set. */
  helperText?: ReactNode
  /** Validation message. When set, renders in negative tone and forces `error`. */
  errorText?: ReactNode
  /** Applies to the trigger element. */
  className?: string
  side?: SelectSide
  align?: SelectAlign
  sideOffset?: number
  /** Accessible name for the trigger. Required unless an associated <label>/
   *  `aria-labelledby` names it — `role="combobox"` takes its name from a label,
   *  not from the selected value/placeholder text. */
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean | 'true' | 'false'
}

export type SelectSingleProps = {
  multiple?: false
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  maxVisibleLabels?: never
  selectedCountLabel?: never
}

export type SelectMultipleProps = {
  /** Several options can be selected; rows get a checkbox and the menu stays open. */
  multiple: true
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  /** Up to this many selected labels are joined in the trigger; more shows the count. */
  maxVisibleLabels?: number
  /** Trigger text once the selection passes `maxVisibleLabels`. */
  selectedCountLabel?: (count: number) => string
}

// `...rest`/`ref` forward to the trigger (the styleable surface that carries
// `data-slot`/`className`); the flat value/selection props drive `Select.Root`.
// `multiple` discriminates the value shape: string | null, or string[].
export type SelectProps = SelectCommonProps & (SelectSingleProps | SelectMultipleProps)

const DEFAULT_MAX_VISIBLE_LABELS = 2

export function Select(props: SelectProps) {
  const {
    options,
    multiple,
    value,
    defaultValue,
    onValueChange,
    maxVisibleLabels = DEFAULT_MAX_VISIBLE_LABELS,
    selectedCountLabel = dsStrings.select.selectedCount,
    placeholder = dsStrings.select.placeholder,
    disabled = false,
    required,
    name,
    id,
    error = false,
    label,
    helperText,
    errorText,
    className,
    side = 'bottom',
    align = 'start',
    sideOffset = OVERLAY_SIDE_OFFSET,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
    'aria-invalid': ariaInvalid,
    ...rest
  } = props
  const field = useField({
    id,
    label,
    helperText,
    errorText,
    error,
    'aria-describedby': ariaDescribedby,
    'aria-invalid': ariaInvalid as FieldAriaInvalid | undefined,
  })

  const items = options.map((option) => ({ label: option.label, value: option.value }))

  const labelFor = (optionValue: string) =>
    options.find((option) => option.value === optionValue)?.label ?? optionValue

  // Multiple: join the labels while they fit, then collapse to a count. The placeholder
  // is ours to render because `Select.Value` skips it when given a render function.
  const renderMultipleValue = (selected: string[]) => {
    if (selected.length === 0) return placeholder
    if (selected.length > maxVisibleLabels) return selectedCountLabel(selected.length)
    return selected.map((optionValue, index) => (
      <Fragment key={optionValue}>
        {index > 0 && ', '}
        {labelFor(optionValue)}
      </Fragment>
    ))
  }

  const popupBody = (
    <>
      <BaseSelect.Trigger
        {...rest}
        id={field.controlProps.id}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-invalid={field.controlProps['aria-invalid']}
        aria-describedby={field.controlProps['aria-describedby']}
        data-slot="select-trigger"
        className={cn(
          'group flex items-center justify-between gap-12 w-full h-48 px-16 text-left',
          'bg-surface-light border border-border-medium rounded-12 cursor-pointer outline-none',
          'font-standard font-medium text-m leading-[1.4] text-text-primary',
          'transition-[border-color,box-shadow] duration-150 ease-out',
          'hover:border-border-strong',
          'focus-visible:border-interaction-primary-default focus-visible:shadow-focus-primary',
          'data-[popup-open]:border-interaction-primary-default',
          'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60 data-[disabled]:hover:border-border-medium',
          field.isError && 'border-border-negative-strong focus-visible:shadow-focus-error',
          className,
        )}
      >
        <BaseSelect.Value
          data-slot="select-value"
          placeholder={placeholder}
          className="block truncate data-[placeholder]:text-text-secondary"
        >
          {multiple ? (selected: string[]) => renderMultipleValue(selected) : undefined}
        </BaseSelect.Value>
        <BaseSelect.Icon
          data-slot="select-icon"
          className="inline-flex w-20 h-20 shrink-0 text-icon-secondary transition-transform duration-150 group-data-[popup-open]:rotate-180 [&>svg]:w-full [&>svg]:h-full"
        >
          <CaretDownIcon />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignItemWithTrigger={false}
          className="z-[var(--ds-z-overlay)] outline-none"
        >
          <BaseSelect.Popup
            data-slot="select"
            className={cn(
              'min-w-[var(--anchor-width)] max-h-[min(var(--available-height),320px)] overflow-y-auto p-4',
              overlayPopupClassName,
            )}
          >
            {options.map((option) => (
              <BaseSelect.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                data-slot="select-item"
                className={cn(
                  'group flex items-center gap-8 w-full py-8 pl-12 pr-8 rounded-8 cursor-pointer select-none outline-none',
                  'font-standard font-medium text-s leading-[1.4] text-text-primary',
                  'transition-[background-color] duration-150',
                  'data-[highlighted]:bg-surface-neutral',
                  'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
                )}
              >
                {multiple && (
                  <span
                    data-slot="select-item-checkbox"
                    aria-hidden="true"
                    className={cn(
                      'inline-flex items-center justify-center w-20 h-20 shrink-0 rounded-4 border border-border-strong',
                      'bg-surface-light text-surface-light transition-[background-color,border-color] duration-150',
                      'group-data-[selected]:bg-interaction-primary-default group-data-[selected]:border-interaction-primary-default',
                    )}
                  >
                    <BaseSelect.ItemIndicator keepMounted className="inline-flex w-12 h-12 [&>svg]:w-full [&>svg]:h-full">
                      <CheckIcon />
                    </BaseSelect.ItemIndicator>
                  </span>
                )}
                <BaseSelect.ItemText className="flex-1 min-w-0 truncate">
                  {option.label}
                </BaseSelect.ItemText>
                {option.meta != null && (
                  <span
                    data-slot="select-item-meta"
                    className="shrink-0 font-normal text-xxs text-text-secondary"
                  >
                    {option.meta}
                  </span>
                )}
                {!multiple && (
                  <BaseSelect.ItemIndicator
                    data-slot="select-item-indicator"
                    className="inline-flex w-16 h-16 shrink-0 text-icon-primary"
                  >
                    <svg viewBox="0 0 16 16" className="w-full h-full" aria-hidden="true">
                      <polyline
                        points="3.5 8.5 6.5 11.5 12.5 5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </BaseSelect.ItemIndicator>
                )}
              </BaseSelect.Item>
            ))}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </>
  )

  const control = multiple ? (
    <BaseSelect.Root
      multiple
      items={items}
      value={value}
      defaultValue={value === undefined ? defaultValue : undefined}
      onValueChange={onValueChange}
      name={name}
      disabled={disabled}
      required={required}
    >
      {popupBody}
    </BaseSelect.Root>
  ) : (
    <BaseSelect.Root
      items={items}
      value={value}
      defaultValue={value === undefined ? defaultValue : undefined}
      onValueChange={onValueChange}
      name={name}
      disabled={disabled}
      required={required}
    >
      {popupBody}
    </BaseSelect.Root>
  )

  // Standalone with no label/helper (or inside a FormField that owns the chrome): render the
  // control bare, preserving the original structure. Otherwise wrap it with its label + helper.
  if (!field.renderChrome || (!label && !field.descriptionText)) {
    return control
  }

  return (
    <div data-slot="select-field" className="flex flex-col gap-4 w-full">
      {label && (
        <label
          htmlFor={field.fieldId}
          data-slot="select-label"
          className="font-standard font-normal text-s leading-[1.4] text-text-secondary"
        >
          {label}
        </label>
      )}
      {control}
      {field.descriptionText && (
        <p
          id={field.descriptionId}
          data-slot="select-helper"
          className={cn(
            'm-0 font-standard font-normal text-s leading-[1.4]',
            field.isError ? 'text-text-negative' : 'text-text-secondary',
          )}
        >
          {field.descriptionText}
        </p>
      )}
    </div>
  )
}
