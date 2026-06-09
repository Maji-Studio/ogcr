import type { ComponentProps, ReactNode } from 'react'
import { Slider as BaseSlider } from '@base-ui/react/slider'
import { cn } from '../../lib/cn'

export type SliderProps = Omit<
  ComponentProps<typeof BaseSlider.Root<number>>,
  'value' | 'defaultValue' | 'onValueChange' | 'onValueCommitted'
> & {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  /** Fires once interaction ends (pointer up / keyboard commit). */
  onValueCommitted?: (value: number) => void
  /** Visible label, associated with the control. */
  label?: ReactNode
  /** Render the current value beside the label. */
  showValue?: boolean
  error?: boolean
}

export function Slider({
  value,
  defaultValue,
  onValueChange,
  onValueCommitted,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = false,
  disabled = false,
  error = false,
  'aria-label': ariaLabel,
  className,
  ...rest
}: SliderProps) {
  return (
    <BaseSlider.Root
      {...rest}
      value={value}
      defaultValue={value === undefined ? defaultValue : undefined}
      onValueChange={onValueChange}
      onValueCommitted={onValueCommitted}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      data-slot="slider"
      className={cn('flex flex-col gap-8 w-full', disabled && 'opacity-50', className)}
    >
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-12">
          {label ? (
            <BaseSlider.Label className="font-standard font-normal text-s leading-[1.4] text-text-secondary">
              {label}
            </BaseSlider.Label>
          ) : (
            <span />
          )}
          {showValue && (
            <BaseSlider.Value className="font-standard font-medium text-s leading-[1.4] text-text-primary tabular-nums" />
          )}
        </div>
      )}
      <BaseSlider.Control
        data-slot="slider-control"
        className={cn(
          'flex items-center w-full py-12 touch-none select-none',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        )}
      >
        <BaseSlider.Track
          data-slot="slider-track"
          className="relative w-full h-6 rounded-full bg-border-medium"
        >
          <BaseSlider.Indicator
            data-slot="slider-indicator"
            className={cn('h-full rounded-full', error ? 'bg-icon-negative' : 'bg-interaction-primary-default')}
          />
          <BaseSlider.Thumb
            getAriaLabel={ariaLabel ? () => ariaLabel : undefined}
            data-slot="slider-thumb"
            className={cn(
              'w-20 h-20 rounded-full bg-surface-light border-2 shadow-[0_1px_2px_rgba(68,51,33,0.16)] outline-none',
              'transition-shadow duration-150',
              error
                ? 'border-icon-negative focus-visible:shadow-focus-error data-[dragging]:shadow-focus-error'
                : 'border-interaction-primary-default focus-visible:shadow-focus-primary data-[dragging]:shadow-focus-primary',
            )}
          />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  )
}
