import { useId, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  helperText?: string
  /** Validation message. When set, renders in negative tone and forces `error`. */
  errorText?: string
  error?: boolean
  resize?: TextareaResize
}

const resizeClass: Record<TextareaResize, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
}

export function Textarea({
  label,
  helperText,
  errorText,
  error: errorProp = false,
  resize = 'vertical',
  rows = 4,
  id,
  className,
  ...rest
}: TextareaProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const error = errorProp || Boolean(errorText)
  const description = errorText ?? helperText
  const helperId = description ? `${inputId}-helper` : undefined

  return (
    <div data-slot="textarea" className={cn('flex flex-col gap-4 w-full', className)}>
      {label && (
        <label
          htmlFor={inputId}
          data-slot="textarea-label"
          className="font-standard font-normal text-s leading-[1.4] text-text-secondary"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        data-slot="textarea-control"
        rows={rows}
        className={cn(
          'w-full min-h-[96px] px-16 py-12 bg-surface-light border border-border-medium rounded-12',
          'font-standard font-medium text-m leading-[1.5] text-text-primary',
          'placeholder:text-text-secondary placeholder:font-medium',
          'transition-[border-color,box-shadow] duration-150 ease-out outline-none',
          'hover:border-border-strong',
          'focus:border-interaction-primary-default focus:shadow-focus-primary',
          'disabled:cursor-not-allowed disabled:text-text-secondary disabled:opacity-60',
          resizeClass[resize],
          error && 'border-border-negative-strong focus:shadow-focus-error',
        )}
        aria-invalid={error || undefined}
        aria-describedby={helperId}
        {...rest}
      />
      {description && (
        <p
          id={helperId}
          data-slot="textarea-helper"
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
