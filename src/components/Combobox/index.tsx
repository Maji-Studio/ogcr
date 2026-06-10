import type { ComponentProps, ReactNode } from 'react'
import { Autocomplete } from '@base-ui/react/autocomplete'
import { OVERLAY_SIDE_OFFSET, overlayPopupClassName } from '../../lib/overlay'
import { useField, type FieldAriaInvalid } from '../../lib/field'
import { dsStrings } from '../../lib/strings'
import { cn } from '../../lib/cn'

export type ComboboxSide = 'top' | 'right' | 'bottom' | 'left'
export type ComboboxAlign = 'start' | 'center' | 'end'

// `...rest`/`ref` forward to the input (the styleable surface that carries
// `data-slot`/`className`); the search/value props drive `Autocomplete.Root`.
export type ComboboxProps = Omit<
  ComponentProps<typeof Autocomplete.Input>,
  'value' | 'defaultValue' | 'onValueChange' | 'children' | 'className' | 'disabled'
> & {
  /** Options to search through. The chosen string becomes the value. */
  items: string[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  /** Shown inside the popup when no option matches the query. */
  emptyMessage?: string
  disabled?: boolean
  required?: boolean
  name?: string
  id?: string
  error?: boolean
  /** Optional label rendered above the input (associated via `htmlFor`). */
  label?: ReactNode
  /** Helper text below the input; replaced by `errorText` when that is set. */
  helperText?: ReactNode
  /** Validation message. When set, renders in negative tone and forces `error`. */
  errorText?: ReactNode
  /** Applies to the input element. */
  className?: string
  side?: ComboboxSide
  align?: ComboboxAlign
  sideOffset?: number
  'aria-describedby'?: string
  'aria-invalid'?: boolean | 'true' | 'false'
}

export function Combobox({
  items,
  value,
  defaultValue,
  onValueChange,
  placeholder = dsStrings.combobox.placeholder,
  emptyMessage = dsStrings.combobox.emptyMessage,
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
  'aria-describedby': ariaDescribedby,
  'aria-invalid': ariaInvalid,
  ...rest
}: ComboboxProps) {
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
    <Autocomplete.Root
      items={items}
      value={value}
      defaultValue={value === undefined ? defaultValue : undefined}
      onValueChange={onValueChange}
    >
      <Autocomplete.Input
        {...rest}
        id={field.controlProps.id}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={field.controlProps['aria-invalid']}
        aria-describedby={field.controlProps['aria-describedby']}
        data-slot="combobox-input"
        className={cn(
          'w-full h-48 px-16 bg-surface-light border border-border-medium rounded-12',
          'font-standard font-medium text-m leading-[1.4] text-text-primary',
          'placeholder:text-text-secondary placeholder:font-medium',
          'transition-[border-color,box-shadow] duration-150 ease-out outline-none',
          'hover:border-border-strong',
          'focus:border-interaction-primary-default focus:shadow-focus-primary',
          'disabled:cursor-not-allowed disabled:opacity-60',
          field.isError && 'border-border-negative-strong focus:shadow-focus-error',
          className,
        )}
      />
      <Autocomplete.Portal>
        <Autocomplete.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          className="z-[var(--ds-z-overlay)] outline-none"
        >
          <Autocomplete.Popup
            data-slot="combobox"
            className={cn(
              'min-w-[var(--anchor-width)] max-h-[min(var(--available-height),320px)] overflow-y-auto p-4',
              overlayPopupClassName,
            )}
          >
            <Autocomplete.Empty
              data-slot="combobox-empty"
              className="py-8 px-12 font-standard font-normal text-s leading-[1.4] text-text-secondary empty:m-0 empty:p-0"
            >
              {emptyMessage}
            </Autocomplete.Empty>
            <Autocomplete.List>
              {(item: string) => (
                <Autocomplete.Item
                  key={item}
                  value={item}
                  data-slot="combobox-item"
                  className={cn(
                    'flex items-center w-full py-8 px-12 rounded-8 cursor-pointer select-none outline-none',
                    'font-standard font-medium text-s leading-[1.4] text-text-primary',
                    'transition-[background-color] duration-150',
                    'data-[highlighted]:bg-surface-neutral',
                    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
                  )}
                >
                  {item}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  )

  // Standalone with no label/helper (or inside a FormField that owns the chrome): render the
  // control bare, preserving the original structure. Otherwise wrap it with its label + helper.
  if (!field.renderChrome || (!label && !field.descriptionText)) {
    return control
  }

  return (
    <div data-slot="combobox-field" className="flex flex-col gap-4 w-full">
      {label && (
        <label
          htmlFor={field.fieldId}
          data-slot="combobox-label"
          className="font-standard font-normal text-s leading-[1.4] text-text-secondary"
        >
          {label}
        </label>
      )}
      {control}
      {field.descriptionText && (
        <p
          id={field.descriptionId}
          data-slot="combobox-helper"
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
