import { type TextareaHTMLAttributes } from 'react'
import { useField, type FieldAriaInvalid } from '../../lib/field'
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
  error = false,
  resize = 'vertical',
  rows = 4,
  id,
  className,
  'aria-describedby': ariaDescribedby,
  'aria-invalid': ariaInvalid,
  ...rest
}: TextareaProps) {
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
    <div data-slot="textarea" className={cn('flex flex-col gap-4 w-full', className)}>
      {field.renderChrome && label && (
        <label
          htmlFor={field.fieldId}
          data-slot="textarea-label"
          className="font-standard font-normal text-s leading-[1.4] text-text-secondary"
        >
          {label}
        </label>
      )}
      <textarea
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
          field.isError && 'border-border-negative-strong focus:shadow-focus-error',
        )}
        {...rest}
        {...field.controlProps}
      />
      {field.renderChrome && field.descriptionText && (
        <p
          id={field.descriptionId}
          data-slot="textarea-helper"
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
