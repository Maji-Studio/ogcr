import type { ComponentProps } from 'react'
import { Autocomplete } from '@base-ui/react/autocomplete'
import { cn } from '../../lib/cn'

export type ComboboxSide = 'top' | 'right' | 'bottom' | 'left'
export type ComboboxAlign = 'start' | 'center' | 'end'

// `...rest`/`ref` forward to the input (the styleable surface that carries
// `data-slot`/`className`); the search/value props drive `Autocomplete.Root`.
export type ComboboxProps = Omit<
  ComponentProps<typeof Autocomplete.Input>,
  'value' | 'defaultValue' | 'onValueChange' | 'children' | 'className' | 'disabled'
> & {
  /** Options to search through. The chosen string becomes the value. */
  items: string[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  /** Shown inside the popup when no option matches the query. */
  emptyMessage?: string
  disabled?: boolean
  required?: boolean
  name?: string
  id?: string
  error?: boolean
  /** Applies to the input element. */
  className?: string
  side?: ComboboxSide
  align?: ComboboxAlign
  sideOffset?: number
  'aria-describedby'?: string
  'aria-invalid'?: boolean | 'true' | 'false'
}

export function Combobox({
  items,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Search…',
  emptyMessage = 'No matches found.',
  disabled = false,
  required,
  name,
  id,
  error = false,
  className,
  side = 'bottom',
  align = 'start',
  sideOffset = 8,
  'aria-describedby': ariaDescribedby,
  'aria-invalid': ariaInvalid,
  ...rest
}: ComboboxProps) {
  return (
    <Autocomplete.Root
      items={items}
      value={value}
      defaultValue={value === undefined ? defaultValue : undefined}
      onValueChange={onValueChange}
    >
      <Autocomplete.Input
        {...rest}
        id={id}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={ariaInvalid ?? (error || undefined)}
        aria-describedby={ariaDescribedby}
        data-slot="combobox-input"
        className={cn(
          'w-full h-48 px-16 bg-surface-light border border-border-medium rounded-12',
          'font-standard font-medium text-m leading-[1.4] text-text-primary',
          'placeholder:text-text-secondary placeholder:font-medium',
          'transition-[border-color,box-shadow] duration-150 ease-out outline-none',
          'hover:border-border-strong',
          'focus:border-interaction-primary-default focus:shadow-focus-primary',
          'disabled:cursor-not-allowed disabled:opacity-60',
          error && 'border-border-negative-strong focus:shadow-focus-error',
          className,
        )}
      />
      <Autocomplete.Portal>
        <Autocomplete.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          className="z-50 outline-none"
        >
          <Autocomplete.Popup
            data-slot="combobox"
            className={cn(
              'min-w-[var(--anchor-width)] max-h-[min(var(--available-height),320px)] overflow-y-auto p-4',
              'bg-surface-light border border-border-light rounded-12 shadow-elevation-l',
              'outline-none origin-[var(--transform-origin)] transition-[transform,opacity] duration-150',
              'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
              'data-[starting-style]:scale-95 data-[ending-style]:scale-95',
            )}
          >
            <Autocomplete.Empty
              data-slot="combobox-empty"
              className="py-8 px-12 font-standard font-normal text-s leading-[1.4] text-text-secondary empty:m-0 empty:p-0"
            >
              {emptyMessage}
            </Autocomplete.Empty>
            <Autocomplete.List>
              {(item: string) => (
                <Autocomplete.Item
                  key={item}
                  value={item}
                  data-slot="combobox-item"
                  className={cn(
                    'flex items-center w-full py-8 px-12 rounded-8 cursor-pointer select-none outline-none',
                    'font-standard font-medium text-s leading-[1.4] text-text-primary',
                    'transition-[background-color] duration-150',
                    'data-[highlighted]:bg-surface-neutral',
                    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
                  )}
                >
                  {item}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  )
}
