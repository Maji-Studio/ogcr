import { useState } from 'react'
import type { Matcher } from 'react-day-picker'
import { Popover } from '../Popover'
import { Calendar } from '../Calendar'
import { CalendarIcon, XIcon } from '../icons'
import { dsStrings } from '../../lib/strings'
import { cn } from '../../lib/cn'

/* OGCR DatePicker — a single-date field that opens a Calendar in a Popover.
 *
 * Controlled (`value` + `onChange`) or uncontrolled (`defaultValue`). The
 * trigger renders the selected date via `Intl.DateTimeFormat`; selecting a day
 * closes the popover. Built on the existing Popover + Calendar so overlay,
 * focus, and token styling stay consistent with the rest of the system.
 *
 * Form integration: forwards `id`, `aria-describedby`, `aria-invalid`, and
 * `required` to the trigger so `FormField` (which clones its child and wires
 * label + helper/error ids) lights it up exactly like `Input`. `error` is the
 * standalone equivalent of `aria-invalid`.
 *
 * Bounds: `minDate` / `maxDate` disable out-of-range days *and* limit Calendar
 * navigation; `disabledDates` passes extra react-day-picker matchers through.
 *
 * TODO(plan): free-text keyboard entry + parse (deferred — needs a locale-aware
 * parse strategy decision), DateRangePicker variant, locale prop.
 */

export type DatePickerProps = {
  value?: Date
  defaultValue?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  /** Disables the whole field. */
  disabled?: boolean
  /** Earliest selectable day (inclusive). Also limits Calendar navigation. */
  minDate?: Date
  /** Latest selectable day (inclusive). Also limits Calendar navigation. */
  maxDate?: Date
  /** Extra react-day-picker matchers for individual disabled days. */
  disabledDates?: Matcher | Matcher[]
  /** Show a clear (✕) affordance when a date is selected. */
  clearable?: boolean
  /** Accessible label for the clear (✕) button. */
  clearLabel?: string
  /** Intl options for the trigger label. */
  formatOptions?: Intl.DateTimeFormatOptions
  /** Validation state — renders the field in negative tone (standalone form). */
  error?: boolean
  required?: boolean
  /** Wired by FormField; also settable directly. */
  id?: string
  'aria-label'?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean | 'true' | 'false'
  className?: string
}

const defaultFormat: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }

export function DatePicker({
  value,
  defaultValue,
  onChange,
  placeholder = dsStrings.datePicker.placeholder,
  disabled,
  minDate,
  maxDate,
  disabledDates,
  clearable = false,
  clearLabel = dsStrings.datePicker.clearLabel,
  formatOptions = defaultFormat,
  error = false,
  required,
  id,
  className,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [internal, setInternal] = useState<Date | undefined>(defaultValue)

  const isControlled = value !== undefined
  const selected = isControlled ? value : internal
  const invalid = error || ariaInvalid === true || ariaInvalid === 'true'

  const commit = (date: Date | undefined) => {
    if (!isControlled) setInternal(date)
    onChange?.(date)
  }

  const handleSelect = (date: Date | undefined) => {
    commit(date)
    if (date) setOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    // Sits over the trigger; stop the click from also opening the popover.
    e.stopPropagation()
    commit(undefined)
  }

  // Combine min/max bounds with any explicit disabled-day matchers.
  const disabledMatchers: Matcher[] = []
  if (minDate) disabledMatchers.push({ before: minDate })
  if (maxDate) disabledMatchers.push({ after: maxDate })
  if (disabledDates) {
    disabledMatchers.push(...(Array.isArray(disabledDates) ? disabledDates : [disabledDates]))
  }

  const label = selected
    ? new Intl.DateTimeFormat(undefined, formatOptions).format(selected)
    : placeholder
  const showClear = clearable && selected !== undefined && !disabled

  return (
    <div data-slot="date-picker" className={cn('relative inline-flex', className)}>
      <Popover
        open={open}
        onOpenChange={setOpen}
        side="bottom"
        align="start"
        className="w-auto p-8"
        trigger={
          <button
            type="button"
            id={id}
            disabled={disabled}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            aria-invalid={invalid || undefined}
            aria-required={required || undefined}
            data-slot="date-picker-trigger"
            data-placeholder={selected ? undefined : ''}
            className={cn(
              'inline-flex items-center justify-between gap-12 h-48 px-16 w-[240px] rounded-12 text-left',
              'bg-surface-light border cursor-pointer',
              'font-standard font-normal text-s leading-[1.4]',
              'outline-none transition-[border-color,box-shadow] duration-150',
              'hover:not-disabled:border-border-strong focus-visible:shadow-focus-primary',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              invalid
                ? 'border-border-negative-strong focus-visible:shadow-focus-error'
                : 'border-border-medium',
              selected ? 'text-text-primary' : 'text-text-secondary',
            )}
          >
            <span data-slot="date-picker-value">{label}</span>
            {showClear ? (
              // Spacer reserves the icon slot; the real clear button overlays it
              // (a <button> can't legally nest inside the trigger button).
              <span aria-hidden="true" className="w-20 h-20 shrink-0" />
            ) : (
              <CalendarIcon className="w-20 h-20 text-icon-secondary shrink-0" />
            )}
          </button>
        }
      >
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          onSelect={handleSelect}
          startMonth={minDate}
          endMonth={maxDate}
          disabled={disabledMatchers.length ? disabledMatchers : undefined}
        />
      </Popover>
      {showClear && (
        <button
          type="button"
          onClick={handleClear}
          aria-label={clearLabel}
          data-slot="date-picker-clear"
          className={cn(
            'absolute right-16 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center',
            'w-20 h-20 rounded-full text-icon-secondary cursor-pointer outline-none',
            'hover:text-icon-primary hover:bg-surface-neutral focus-visible:shadow-focus-primary',
            'transition-colors duration-150 [&>svg]:w-16 [&>svg]:h-16',
          )}
        >
          <XIcon />
        </button>
      )}
    </div>
  )
}
