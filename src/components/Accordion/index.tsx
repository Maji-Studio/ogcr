import type { ComponentProps, ReactNode } from 'react'
import { Accordion as BaseAccordion } from '@base-ui/react/accordion'
import { CaretDownIcon } from '../icons'
import { cn } from '../../lib/cn'

export type AccordionItemData = {
  value: string
  title: ReactNode
  content: ReactNode
  disabled?: boolean
}

export type AccordionProps = Omit<
  ComponentProps<typeof BaseAccordion.Root>,
  'value' | 'defaultValue' | 'onValueChange' | 'multiple' | 'disabled' | 'children' | 'className'
> & {
  items: AccordionItemData[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  /** Allow more than one panel open at once. Defaults to `false` (single-open). */
  multiple?: boolean
  disabled?: boolean
  className?: string
}

export function Accordion({
  items,
  value,
  defaultValue,
  onValueChange,
  multiple = false,
  disabled,
  className,
  ...rest
}: AccordionProps) {
  return (
    <BaseAccordion.Root
      {...rest}
      value={value}
      defaultValue={value === undefined ? defaultValue : undefined}
      onValueChange={onValueChange}
      multiple={multiple}
      disabled={disabled}
      data-slot="accordion"
      className={cn('flex flex-col w-full border-t border-border-light', className)}
    >
      {items.map((item) => (
        <BaseAccordion.Item
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          data-slot="accordion-item"
          className="border-b border-border-light"
        >
          <BaseAccordion.Header className="m-0">
            <BaseAccordion.Trigger
              data-slot="accordion-trigger"
              className={cn(
                'group flex items-center justify-between gap-12 w-full py-16 text-left bg-transparent border-0 cursor-pointer outline-none rounded-8',
                'font-standard font-medium text-m leading-[1.3] text-text-primary',
                'transition-colors duration-150 hover:text-interaction-primary-default',
                'focus-visible:shadow-focus-primary',
                'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:hover:text-text-primary',
              )}
            >
              {item.title}
              <span
                aria-hidden="true"
                className="inline-flex w-20 h-20 shrink-0 text-icon-secondary transition-transform duration-200 group-data-[panel-open]:rotate-180 [&>svg]:w-full [&>svg]:h-full"
              >
                <CaretDownIcon />
              </span>
            </BaseAccordion.Trigger>
          </BaseAccordion.Header>
          <BaseAccordion.Panel
            data-slot="accordion-panel"
            className={cn(
              'overflow-hidden h-[var(--accordion-panel-height)]',
              'transition-[height] duration-200 ease-[cubic-bezier(0.2,0,0,1)]',
              'data-[starting-style]:h-0 data-[ending-style]:h-0',
            )}
          >
            <div className="pb-16 font-standard font-normal text-m leading-[1.5] text-text-secondary">
              {item.content}
            </div>
          </BaseAccordion.Panel>
        </BaseAccordion.Item>
      ))}
    </BaseAccordion.Root>
  )
}
