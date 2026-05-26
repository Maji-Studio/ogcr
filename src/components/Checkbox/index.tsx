import { useId } from 'react'
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const wrapper = cva(
  'group relative cursor-pointer font-standard font-medium text-s leading-[1.4] text-text-primary',
  {
    variants: {
      layout: {
        inline: 'inline-flex items-center gap-12 min-h-24',
        'border-left': 'inline-flex items-start gap-12 w-[240px] p-12 bg-surface-light border border-border-medium rounded-12 transition-[border-color,box-shadow] duration-150 hover:border-border-strong',
        'border-right': 'inline-flex items-start gap-12 w-[240px] p-12 bg-surface-light border border-border-medium rounded-12 transition-[border-color,box-shadow] duration-150 hover:border-border-strong',
      },
      disabled: { true: 'cursor-not-allowed', false: '' },
    },
    defaultVariants: { layout: 'inline', disabled: false },
  },
)

export type CheckboxLayout = NonNullable<VariantProps<typeof wrapper>['layout']>
export type CheckboxValue = boolean | 'indeterminate'

export type CheckboxProps = {
  checked?: CheckboxValue
  defaultChecked?: boolean
  /** Fires with the next checked state. Alias for `onChange` (kept for compat). */
  onCheckedChange?: (next: boolean) => void
  /** @deprecated use `onCheckedChange` for parity with Base UI naming. */
  onChange?: (next: boolean) => void
  label: string
  secondaryText?: string
  layout?: CheckboxLayout
  error?: boolean
  disabled?: boolean
  required?: boolean
  name?: string
  value?: string
  id?: string
  className?: string
}

export function Checkbox({
  checked,
  defaultChecked,
  onCheckedChange,
  onChange,
  label,
  secondaryText,
  layout = 'inline',
  error = false,
  disabled = false,
  required,
  name,
  value,
  id,
  className,
}: CheckboxProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const indeterminate = checked === 'indeterminate'
  const isChecked = checked === true ? true : checked === false ? false : undefined
  const filled = checked === true || indeterminate
  const emitChange = (next: boolean) => {
    onCheckedChange?.(next)
    onChange?.(next)
  }

  const indicator = (
    <BaseCheckbox.Root
      id={inputId}
      checked={isChecked}
      defaultChecked={checked === undefined ? defaultChecked : undefined}
      indeterminate={indeterminate}
      disabled={disabled}
      required={required}
      name={name}
      value={value}
      aria-invalid={error || undefined}
      onCheckedChange={emitChange}
      data-slot="checkbox-box"
      className={cn(
        'inline-flex items-center justify-center w-16 h-16 shrink-0 rounded-4 border bg-surface-light text-surface-light transition-[background-color,border-color,box-shadow] duration-150 outline-none cursor-pointer',
        'focus-visible:shadow-focus-primary',
        filled
          ? error
            ? 'bg-icon-negative border-icon-negative'
            : 'bg-icon-primary border-icon-primary'
          : error
            ? 'border-icon-negative'
            : 'border-border-medium',
        error && 'focus-visible:shadow-focus-error',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      <BaseCheckbox.Indicator className="inline-flex items-center justify-center w-full h-full" keepMounted>
        {indeterminate ? (
          <svg viewBox="0 0 16 16" className="w-full h-full">
            <line x1="3" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" className={cn('w-full h-full', !filled && 'invisible')}>
            <polyline points="3.5 8.5 6.5 11.5 12.5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  )

  const text = (
    <span data-slot="checkbox-text" className="inline-flex flex-col gap-4 flex-1 min-w-0">
      <span className={cn('text-text-primary', disabled && 'opacity-60')}>{label}</span>
      {secondaryText && (
        <span className={cn('text-text-secondary font-medium', disabled && 'opacity-60')}>
          {secondaryText}
        </span>
      )}
    </span>
  )

  return (
    <label
      htmlFor={inputId}
      data-slot="checkbox"
      className={cn(wrapper({ layout, disabled }), className)}
    >
      {layout === 'border-right' ? (
        <>
          {text}
          {indicator}
        </>
      ) : (
        <>
          {indicator}
          {text}
        </>
      )}
    </label>
  )
}
