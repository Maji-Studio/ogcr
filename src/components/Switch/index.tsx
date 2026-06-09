import { useId, type ComponentProps } from 'react'
import { Switch as BaseSwitch } from '@base-ui/react/switch'
import { cn } from '../../lib/cn'

export type SwitchProps = Omit<
  ComponentProps<typeof BaseSwitch.Root>,
  'onCheckedChange' | 'onChange'
> & {
  /** Fires with the next checked state. */
  onCheckedChange?: (next: boolean) => void
  /** @deprecated use `onCheckedChange` for parity with Base UI naming. */
  onChange?: (next: boolean) => void
  /** Inline label. Omit when the control is named by a `FormField` label. */
  label?: string
  secondaryText?: string
  error?: boolean
}

export function Switch({
  checked,
  defaultChecked,
  onCheckedChange,
  onChange,
  label,
  secondaryText,
  error = false,
  disabled = false,
  id,
  className,
  'aria-describedby': ariaDescribedby,
  'aria-invalid': ariaInvalid,
  ...rest
}: SwitchProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const emitChange = (next: boolean) => {
    onCheckedChange?.(next)
    onChange?.(next)
  }

  const control = (
    <BaseSwitch.Root
      {...rest}
      id={inputId}
      checked={checked}
      defaultChecked={checked === undefined ? defaultChecked : undefined}
      onCheckedChange={emitChange}
      disabled={disabled}
      aria-invalid={ariaInvalid ?? (error || undefined)}
      aria-describedby={ariaDescribedby}
      data-slot="switch"
      className={cn(
        'relative inline-flex items-center w-40 h-24 shrink-0 rounded-full p-2 cursor-pointer outline-none',
        'transition-[background-color,box-shadow] duration-150',
        error
          ? 'bg-surface-negative data-[checked]:bg-icon-negative focus-visible:shadow-focus-error'
          : 'bg-border-strong data-[checked]:bg-interaction-primary-default focus-visible:shadow-focus-primary',
        disabled && 'opacity-50 cursor-not-allowed',
        !label && className,
      )}
    >
      <BaseSwitch.Thumb
        data-slot="switch-thumb"
        className={cn(
          'block w-20 h-20 rounded-full bg-surface-light shadow-[0_1px_2px_rgba(68,51,33,0.16)]',
          'transition-transform duration-150 data-[checked]:translate-x-[16px]',
        )}
      />
    </BaseSwitch.Root>
  )

  if (!label) return control

  return (
    <label
      htmlFor={inputId}
      data-slot="switch-field"
      className={cn(
        'inline-flex items-center gap-12 min-h-24',
        'font-standard font-medium text-s leading-[1.4] text-text-primary',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
    >
      {control}
      <span data-slot="switch-text" className="inline-flex flex-col gap-2 min-w-0">
        <span className={cn('text-text-primary', disabled && 'opacity-60')}>{label}</span>
        {secondaryText && (
          <span className={cn('font-normal text-text-secondary', disabled && 'opacity-60')}>
            {secondaryText}
          </span>
        )}
      </span>
    </label>
  )
}
