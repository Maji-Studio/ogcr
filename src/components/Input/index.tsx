import { type InputHTMLAttributes, type ReactNode } from 'react'
import { useField, type FieldAriaInvalid } from '../../lib/field'
import { cn } from '../../lib/cn'

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string
  helperText?: string
  /** Validation message. When set, renders in negative tone and forces `error`. */
  errorText?: string
  iconLeft?: ReactNode
  iconRight?: ReactNode
  error?: boolean
}

export function Input({
  label,
  helperText,
  errorText,
  iconLeft,
  iconRight,
  error = false,
  id,
  className,
  'aria-describedby': ariaDescribedby,
  'aria-invalid': ariaInvalid,
  ...rest
}: InputProps) {
  const field = useField({
    id,
    label,
    helperText,
    errorText,
    error,
    'aria-describedby': ariaDescribedby,
    'aria-invalid': ariaInvalid as FieldAriaInvalid | undefined,
  })

  return (
    <div data-slot="input" className={cn('flex flex-col gap-4 w-full', className)}>
      {field.renderChrome && label && (
        <label
          htmlFor={field.fieldId}
          data-slot="input-label"
          className="font-standard font-normal text-s leading-[1.4] text-text-secondary"
        >
          {label}
        </label>
      )}
      <div
        data-slot="input-field"
        className={cn(
          'flex items-center gap-12 h-48 px-16 bg-surface-light border border-border-medium rounded-12',
          'transition-[border-color,box-shadow] duration-150 ease-out',
          'hover:border-border-strong',
          'focus-within:border-interaction-primary-default focus-within:shadow-focus-primary',
          field.isError && 'border-border-negative-strong focus-within:shadow-focus-error',
        )}
      >
        {iconLeft && (
          <span data-slot="input-icon" aria-hidden="true" className="inline-flex items-center justify-center w-20 h-20 shrink-0 text-icon-secondary [&>svg]:w-full [&>svg]:h-full">
            {iconLeft}
          </span>
        )}
        <input
          data-slot="input-control"
          className={cn(
            'flex-1 min-w-0 h-full bg-transparent border-0 outline-none',
            'font-standard font-medium text-m leading-[1.4] text-text-primary',
            'placeholder:text-text-secondary placeholder:font-medium',
            'disabled:cursor-not-allowed disabled:text-text-secondary',
          )}
          {...rest}
          {...field.controlProps}
        />
        {iconRight && (
          <span data-slot="input-icon" aria-hidden="true" className="inline-flex items-center justify-center w-20 h-20 shrink-0 text-icon-secondary [&>svg]:w-full [&>svg]:h-full">
            {iconRight}
          </span>
        )}
      </div>
      {field.renderChrome && field.descriptionText && (
        <p
          id={field.descriptionId}
          data-slot="input-helper"
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
