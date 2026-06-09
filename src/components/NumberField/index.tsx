import { useId, type ComponentProps } from 'react'
import { NumberField as BaseNumberField } from '@base-ui/react/number-field'
import { cn } from '../../lib/cn'

export type NumberFieldProps = Omit<
  ComponentProps<typeof BaseNumberField.Root>,
  'onValueChange' | 'value' | 'defaultValue'
> & {
  value?: number | null
  defaultValue?: number
  /** Reshaped from Base UI: emits just the next value (no event details). */
  onValueChange?: (value: number | null) => void
  label?: string
  helperText?: string
  /** Validation message. When set, renders in negative tone and forces `error`. */
  errorText?: string
  error?: boolean
  placeholder?: string
}

function MinusGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="w-20 h-20">
      <line x1="3.5" y1="8" x2="12.5" y2="8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function PlusGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="w-20 h-20">
      <line x1="3.5" y1="8" x2="12.5" y2="8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="8" y1="3.5" x2="8" y2="12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

const stepper =
  'inline-flex items-center justify-center w-44 h-full shrink-0 bg-transparent border-0 cursor-pointer text-icon-secondary ' +
  'transition-colors duration-150 hover:bg-surface-neutral hover:text-icon-primary ' +
  'focus-visible:outline-none focus-visible:relative focus-visible:shadow-focus-primary ' +
  'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-icon-secondary'

export function NumberField({
  value,
  defaultValue,
  onValueChange,
  min,
  max,
  step,
  smallStep,
  largeStep,
  label,
  helperText,
  errorText,
  error: errorProp = false,
  disabled = false,
  required,
  readOnly,
  placeholder,
  name,
  id,
  format,
  className,
  'aria-describedby': ariaDescribedby,
  'aria-invalid': ariaInvalid,
  ...rest
}: NumberFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const error = errorProp || Boolean(errorText)
  const description = errorText ?? helperText
  const helperId = description ? `${inputId}-helper` : undefined
  const describedBy = [ariaDescribedby, helperId].filter(Boolean).join(' ') || undefined

  return (
    <div data-slot="number-field" className={cn('flex flex-col gap-4 w-full', className)}>
      {label && (
        <label
          htmlFor={inputId}
          data-slot="number-field-label"
          className="font-standard font-normal text-s leading-[1.4] text-text-secondary"
        >
          {label}
        </label>
      )}
      <BaseNumberField.Root
        {...rest}
        id={inputId}
        value={value}
        defaultValue={value === undefined ? defaultValue : undefined}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
        smallStep={smallStep}
        largeStep={largeStep}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        name={name}
        format={format}
      >
        <BaseNumberField.Group
          data-slot="number-field-group"
          className={cn(
            'flex items-center h-48 bg-surface-light border border-border-medium rounded-12 overflow-hidden',
            'transition-[border-color,box-shadow] duration-150 ease-out',
            'hover:border-border-strong',
            'focus-within:border-interaction-primary-default focus-within:shadow-focus-primary',
            error && 'border-border-negative-strong focus-within:shadow-focus-error',
            disabled && 'opacity-60',
          )}
        >
          <BaseNumberField.Decrement
            aria-label="Decrease"
            data-slot="number-field-decrement"
            className={cn(stepper, 'border-r border-border-light')}
          >
            <MinusGlyph />
          </BaseNumberField.Decrement>
          <BaseNumberField.Input
            data-slot="number-field-input"
            placeholder={placeholder}
            aria-invalid={ariaInvalid ?? (error || undefined)}
            aria-describedby={describedBy}
            className={cn(
              'flex-1 min-w-0 h-full px-12 bg-transparent border-0 outline-none text-center tabular-nums',
              'font-standard font-medium text-m leading-[1.4] text-text-primary',
              'placeholder:text-text-secondary placeholder:font-medium',
              'disabled:cursor-not-allowed disabled:text-text-secondary',
            )}
          />
          <BaseNumberField.Increment
            aria-label="Increase"
            data-slot="number-field-increment"
            className={cn(stepper, 'border-l border-border-light')}
          >
            <PlusGlyph />
          </BaseNumberField.Increment>
        </BaseNumberField.Group>
      </BaseNumberField.Root>
      {description && (
        <p
          id={helperId}
          data-slot="number-field-helper"
          className={cn(
            'm-0 font-standard font-normal text-s leading-[1.4]',
            error ? 'text-text-negative' : 'text-text-secondary',
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
