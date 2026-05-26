import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
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
  error: errorProp = false,
  id,
  className,
  ...rest
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const error = errorProp || Boolean(errorText)
  const description = errorText ?? helperText
  const helperId = description ? `${inputId}-helper` : undefined

  return (
    <div data-slot="input" className={cn('flex flex-col gap-4 w-full', className)}>
      {label && (
        <label
          htmlFor={inputId}
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
          error && 'border-border-negative-strong focus-within:shadow-focus-error',
        )}
      >
        {iconLeft && (
          <span data-slot="input-icon" aria-hidden="true" className="inline-flex items-center justify-center w-20 h-20 shrink-0 text-icon-secondary [&>svg]:w-full [&>svg]:h-full">
            {iconLeft}
          </span>
        )}
        <input
          id={inputId}
          data-slot="input-control"
          className={cn(
            'flex-1 min-w-0 h-full bg-transparent border-0 outline-none',
            'font-standard font-medium text-m leading-[1.4] text-text-primary',
            'placeholder:text-text-secondary placeholder:font-medium',
            'disabled:cursor-not-allowed disabled:text-text-secondary',
          )}
          aria-invalid={error || undefined}
          aria-describedby={helperId}
          {...rest}
        />
        {iconRight && (
          <span data-slot="input-icon" aria-hidden="true" className="inline-flex items-center justify-center w-20 h-20 shrink-0 text-icon-secondary [&>svg]:w-full [&>svg]:h-full">
            {iconRight}
          </span>
        )}
      </div>
      {description && (
        <p
          id={helperId}
          data-slot="input-helper"
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
