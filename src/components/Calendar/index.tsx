import type { ComponentProps } from 'react'
import { DayPicker } from 'react-day-picker'
import { CaretLeftIcon, CaretRightIcon } from '../icons'
import { cn } from '../../lib/cn'

/* OGCR Calendar — a tokenised wrapper around react-day-picker v9 `DayPicker`.
 *
 * Passes through the full DayPicker API (so `mode="single" | "multiple" |
 * "range"` and the matching `selected`/`onSelect` types are preserved) while
 * replacing the default classNames with OGCR utilities and swapping the nav
 * chevrons for the Phosphor caret icons. Consumers do NOT import
 * `react-day-picker/style.css` — styling is fully class-driven here.
 *
 * Selection layering: DayPicker stacks modifiers on the *cell* (range_start /
 * range_middle / range_end all also carry `selected`), so the round endpoint
 * fill lives on the day_button (via `selected`) while the connecting range band
 * is the *cell* background. range_middle then resets its own button (important,
 * to win over the `selected` it co-carries) so only the band shows through.
 * `today` is a ring rather than a text colour so it never fights the white
 * selected-text. RTL nav direction is handled by DayPicker when `dir="rtl"` is
 * passed through.
 */

export type CalendarProps = ComponentProps<typeof DayPicker>

const navButton = cn(
  'inline-flex items-center justify-center w-36 h-36 rounded-8 bg-transparent cursor-pointer',
  'text-icon-secondary outline-none transition-[background-color] duration-150',
  'hover:not-disabled:bg-surface-neutral focus-visible:shadow-focus-primary',
  'disabled:opacity-40 disabled:cursor-not-allowed [&>svg]:w-16 [&>svg]:h-16',
)

const dayButton = cn(
  'inline-flex items-center justify-center w-36 h-36 rounded-8 bg-transparent cursor-pointer',
  'font-standard font-normal text-s leading-[1.4] text-text-primary',
  'outline-none transition-[background-color,color] duration-150',
  'hover:bg-surface-neutral focus-visible:shadow-focus-primary',
)

const dropdownTrigger = cn(
  'relative inline-flex items-center h-32 px-8 rounded-8 bg-transparent cursor-pointer',
  'font-standard font-medium text-s leading-[1.2] text-text-primary',
  'hover:bg-surface-neutral focus-within:shadow-focus-primary transition-[background-color] duration-150',
  // The native <select> is overlaid transparently across the trigger.
  '[&>select]:absolute [&>select]:inset-0 [&>select]:opacity-0 [&>select]:cursor-pointer',
)

export function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('inline-block p-16 bg-surface-light font-standard', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-16',
        month: 'flex flex-col gap-12',
        month_caption: 'relative flex items-center justify-center h-36',
        caption_label: 'font-standard font-medium text-m leading-[1.2] text-text-primary',
        dropdowns: 'flex items-center gap-4',
        dropdown_root: 'relative',
        dropdown: dropdownTrigger,
        nav: 'absolute inset-x-0 top-0 flex items-center justify-between',
        button_previous: navButton,
        button_next: navButton,
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday:
          'w-36 h-36 flex items-center justify-center font-standard font-medium text-xs leading-[1.2] text-text-secondary',
        week: 'flex w-full mt-2',
        // Cell carries the range band; the button (below) carries the round fill.
        day: 'relative w-36 h-36 p-0 text-center',
        day_button: dayButton,
        today: '[&>button]:font-medium [&>button]:ring-1 [&>button]:ring-inset [&>button]:ring-interaction-primary-default',
        selected:
          '[&>button]:bg-interaction-primary-default [&>button]:text-surface-page [&>button]:rounded-8 [&>button]:ring-0 [&>button]:hover:bg-interaction-primary-hover',
        outside: '[&>button]:text-text-secondary [&>button]:opacity-50',
        disabled: '[&>button]:opacity-40 [&>button]:cursor-not-allowed',
        range_start: 'bg-interaction-primary-focus rounded-l-8',
        range_end: 'bg-interaction-primary-focus rounded-r-8',
        // Co-carries `selected`; reset its button so only the cell band shows.
        range_middle:
          'bg-interaction-primary-focus [&>button]:bg-transparent! [&>button]:text-text-primary! [&>button]:rounded-none! [&>button]:ring-0!',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName }) =>
          orientation === 'left' ? (
            <CaretLeftIcon className={chevronClassName} />
          ) : (
            <CaretRightIcon className={chevronClassName} />
          ),
      }}
      {...props}
    />
  )
}
