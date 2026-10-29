import { useRef } from 'react'
import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import { OVERLAY_SIDE_OFFSET, overlayPopupClassName } from '../../lib/overlay'
import { useField, type FieldAriaInvalid } from '../../lib/field'
import { dsStrings } from '../../lib/strings'
import { cn } from '../../lib/cn'
import { CheckIcon, XIcon } from '../icons'
import type { ComboboxCommonProps, ComboboxMultipleProps } from '.'

// Multiple mode: Base UI `Combobox` (the single mode uses `Autocomplete`, whose value is the
// input text). Selected items render as removable chips inside the field, the typed query
// filters the list, and the popup stays open while items are toggled.
export function ComboboxMultiple({
  items,
  multiple,
  value,
  defaultValue,
  onValueChange,
  removeLabel = dsStrings.combobox.removeLabel,
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
  readOnly,
  ...rest
}: ComboboxCommonProps & ComboboxMultipleProps) {
  const field = useField({
    id,
    label,
    helperText,
    errorText,
    error,
    'aria-describedby': ariaDescribedby,
    'aria-invalid': ariaInvalid as FieldAriaInvalid | undefined,
  })
  const labelId = `${field.fieldId}-label`
  // The chips field is the popup anchor so the menu spans the whole control, not the input.
  const anchorRef = useRef<HTMLDivElement | null>(null)

  const control = (
    <BaseCombobox.Root
      multiple={multiple}
      items={items}
      value={value}
      defaultValue={value === undefined ? defaultValue : undefined}
      onValueChange={onValueChange}
      // Base UI renders one hidden input per value and doesn't disable them, so a disabled
      // field would still submit; dropping the name matches native disabled-control semantics.
      name={disabled ? undefined : name}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
    >
      <BaseCombobox.Chips
        ref={anchorRef}
        data-slot="combobox-chips"
        className={cn(
          'flex flex-wrap items-center gap-4 w-full min-h-48 px-8 py-4 bg-surface-light border border-border-medium rounded-12',
          'transition-[border-color,box-shadow] duration-150 ease-out cursor-text',
          'hover:border-border-strong',
          'focus-within:border-interaction-primary-default focus-within:shadow-focus-primary',
          disabled && 'cursor-not-allowed opacity-60',
          field.isError &&
            'border-border-negative-strong focus-within:border-border-negative-strong focus-within:shadow-focus-error',
        )}
      >
        <BaseCombobox.Value>
          {(selected: string[]) =>
            selected.map((item) => (
              <BaseCombobox.Chip
                key={item}
                data-slot="combobox-chip"
                className={cn(
                  'inline-flex items-center h-40 pl-12 rounded-8 bg-surface-neutral',
                  'font-standard font-medium text-s leading-[1.4] text-text-primary',
                )}
              >
                {item}
                {!readOnly && !disabled && (
                <BaseCombobox.ChipRemove
                  aria-label={removeLabel(item)}
                  data-slot="combobox-chip-remove"
                  className={cn(
                    // 40x40 hit target (spec §8); the chip grows to 40px tall to hold it.
                  'inline-flex items-center justify-center w-40 h-40 rounded-8 border-0 bg-transparent p-0',
                    'cursor-pointer text-icon-secondary outline-none transition-[background-color,box-shadow] duration-150',
                    'hover:bg-surface-light hover:text-icon-primary focus-visible:shadow-focus-primary',
                    '[&>svg]:w-16 [&>svg]:h-16',
                  )}
                >
                  <XIcon />
                </BaseCombobox.ChipRemove>
                )}
              </BaseCombobox.Chip>
            ))
          }
        </BaseCombobox.Value>
        <BaseCombobox.Input
          // Base UI marks everything outside the open popup aria-hidden, label included; a
          // hidden label still names the input through aria-labelledby.
          aria-labelledby={label && field.renderChrome ? labelId : undefined}
          {...rest}
          id={field.controlProps.id}
          placeholder={placeholder}
          aria-invalid={field.controlProps['aria-invalid']}
          aria-describedby={field.controlProps['aria-describedby']}
          data-slot="combobox-input"
          className={cn(
            'flex-1 min-w-[var(--spacing-80)] h-32 px-8 bg-transparent border-0 outline-none',
            'font-standard font-medium text-m leading-[1.4] text-text-primary',
            'placeholder:text-text-secondary placeholder:font-medium',
            'disabled:cursor-not-allowed',
            className,
          )}
        />
      </BaseCombobox.Chips>
      <BaseCombobox.Portal>
        <BaseCombobox.Positioner
          anchor={anchorRef}
          side={side}
          align={align}
          sideOffset={sideOffset}
          className="z-[var(--ds-z-overlay)] outline-none"
        >
          <BaseCombobox.Popup
            data-slot="combobox"
            className={cn(
              'min-w-[var(--anchor-width)] max-h-[min(var(--available-height),320px)] overflow-y-auto p-4',
              overlayPopupClassName,
            )}
          >
            <BaseCombobox.Empty
              data-slot="combobox-empty"
              className="py-8 px-12 font-standard font-normal text-s leading-[1.4] text-text-secondary empty:m-0 empty:p-0"
            >
              {emptyMessage}
            </BaseCombobox.Empty>
            <BaseCombobox.List>
              {(item: string) => (
                <BaseCombobox.Item
                  key={item}
                  value={item}
                  data-slot="combobox-item"
                  className={cn(
                    'group flex items-center gap-8 w-full py-8 px-12 rounded-8 cursor-pointer select-none outline-none',
                    'font-standard font-medium text-s leading-[1.4] text-text-primary',
                    'transition-[background-color] duration-150',
                    'data-[highlighted]:bg-surface-neutral',
                    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
                  )}
                >
                  <span
                    data-slot="combobox-item-checkbox"
                    aria-hidden="true"
                    className={cn(
                      'inline-flex items-center justify-center w-20 h-20 shrink-0 rounded-4 border border-border-strong',
                      'bg-surface-light text-surface-light transition-[background-color,border-color] duration-150',
                      'group-data-[selected]:bg-interaction-primary-default group-data-[selected]:border-interaction-primary-default',
                    )}
                  >
                    <BaseCombobox.ItemIndicator keepMounted className="inline-flex w-12 h-12 [&>svg]:w-full [&>svg]:h-full">
                      <CheckIcon />
                    </BaseCombobox.ItemIndicator>
                  </span>
                  <span className="flex-1 min-w-0 truncate">{item}</span>
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  )

  if (!field.renderChrome || (!label && !field.descriptionText)) {
    return control
  }

  return (
    <div data-slot="combobox-field" className="flex flex-col gap-4 w-full">
      {label && (
        <label
          id={labelId}
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
