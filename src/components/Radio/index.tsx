import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { Radio as BaseRadio } from '@base-ui/react/radio'
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
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

export type RadioLayout = NonNullable<VariantProps<typeof wrapper>['layout']>

export type RadioGroupProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'defaultValue' | 'onChange'
> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  disabled?: boolean
  required?: boolean
  readOnly?: boolean
  children: ReactNode
}

export function RadioGroup({
  value,
  defaultValue,
  onValueChange,
  name,
  disabled,
  required,
  readOnly,
  className,
  children,
  ...rest
}: RadioGroupProps) {
  return (
    <BaseRadioGroup
      {...rest}
      value={value}
      defaultValue={value === undefined ? defaultValue : undefined}
      onValueChange={(next) => onValueChange?.(String(next))}
      name={name}
      disabled={disabled}
      required={required}
      readOnly={readOnly}
      data-slot="radio-group"
      className={cn('flex flex-col gap-12', className)}
    >
      {children}
    </BaseRadioGroup>
  )
}

export type RadioProps = {
  value: string
  label: string
  secondaryText?: string
  layout?: RadioLayout
  error?: boolean
  disabled?: boolean
  id?: string
  className?: string
}

export function Radio({
  value,
  label,
  secondaryText,
  layout = 'inline',
  error = false,
  disabled = false,
  id,
  className,
}: RadioProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  const indicator = (
    <BaseRadio.Root
      id={inputId}
      value={value}
      disabled={disabled}
      aria-invalid={error || undefined}
      data-slot="radio-box"
      className={cn(
        'inline-flex items-center justify-center w-16 h-16 shrink-0 rounded-full border bg-surface-light transition-[background-color,border-color,box-shadow] duration-150 outline-none cursor-pointer',
        'focus-visible:shadow-focus-primary',
        'data-[checked]:bg-icon-primary data-[checked]:border-icon-primary',
        error && 'data-[checked]:bg-icon-negative data-[checked]:border-icon-negative',
        error && 'border-icon-negative focus-visible:shadow-focus-error',
        !error && 'border-border-medium',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      <BaseRadio.Indicator
        keepMounted
        data-slot="radio-dot"
        className={cn(
          'w-8 h-8 rounded-full bg-surface-light transition-transform duration-150',
          'scale-0 data-[checked]:scale-100',
        )}
      />
    </BaseRadio.Root>
  )

  const text = (
    <span data-slot="radio-text" className="inline-flex flex-col gap-4 flex-1 min-w-0">
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
      data-slot="radio"
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
