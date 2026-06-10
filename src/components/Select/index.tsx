import type { ComponentProps, ReactNode } from 'react'
import { Select as BaseSelect } from '@base-ui/react/select'
import { OVERLAY_SIDE_OFFSET, overlayPopupClassName } from '../../lib/overlay'
import { useField, type FieldAriaInvalid } from '../../lib/field'
import { dsStrings } from '../../lib/strings'
import { cn } from '../../lib/cn'
import { CaretDownIcon } from '../icons'

export type SelectSide = 'top' | 'right' | 'bottom' | 'left'
export type SelectAlign = 'start' | 'center' | 'end'

export type SelectOption = {
  value: string
  label: ReactNode
  disabled?: boolean
}

// `...rest`/`ref` forward to the trigger (the styleable surface that carries
// `data-slot`/`className`); the flat value/selection props drive `Select.Root`.
export type SelectProps = Omit<
  ComponentProps<typeof BaseSelect.Trigger>,
  'value' | 'defaultValue' | 'onValueChange' | 'children' | 'className' | 'disabled'
> & {
  options: SelectOption[]
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
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

export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
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
}: SelectProps) {
  const field = useField({
    id,
    label,
    helperText,
    errorText,
    error,
    'aria-describedby': ariaDescribedby,
    'aria-invalid': ariaInvalid as FieldAriaInvalid | undefined,
  })

  const control = (
    <BaseSelect.Root
      items={options.map((option) => ({ label: option.label, value: option.value }))}
      value={value}
      defaultValue={value === undefined ? defaultValue : undefined}
      onValueChange={onValueChange}
      name={name}
      disabled={disabled}
      required={required}
    >
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
        />
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
                  'flex items-center gap-8 w-full py-8 pl-12 pr-8 rounded-8 cursor-pointer select-none outline-none',
                  'font-standard font-medium text-s leading-[1.4] text-text-primary',
                  'transition-[background-color] duration-150',
                  'data-[highlighted]:bg-surface-neutral',
                  'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
                )}
              >
                <BaseSelect.ItemText className="flex-1 min-w-0 truncate">
                  {option.label}
                </BaseSelect.ItemText>
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
              </BaseSelect.Item>
            ))}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
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
