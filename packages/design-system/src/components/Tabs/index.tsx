import type { ComponentProps, ReactNode } from 'react'
import { Tabs as BaseTabs } from '@base-ui/react/tabs'
import { cn } from '../../lib/cn'

export type TabsOrientation = 'horizontal' | 'vertical'

export type TabItem = {
  value: string
  label: ReactNode
  icon?: ReactNode
  content: ReactNode
  disabled?: boolean
}

export type TabsProps = Omit<
  ComponentProps<typeof BaseTabs.Root>,
  'value' | 'defaultValue' | 'onValueChange' | 'orientation' | 'children' | 'className'
> & {
  items: TabItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: TabsOrientation
  className?: string
}

export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  className,
  ...rest
}: TabsProps) {
  const vertical = orientation === 'vertical'

  return (
    <BaseTabs.Root
      {...rest}
      value={value}
      defaultValue={value === undefined ? (defaultValue ?? items[0]?.value) : undefined}
      onValueChange={onValueChange}
      orientation={orientation}
      data-slot="tabs"
      className={cn('flex min-w-0 gap-16', vertical ? 'flex-row' : 'flex-col', className)}
    >
      <BaseTabs.List
        data-slot="tabs-list"
        className={cn(
          'relative flex shrink-0',
          vertical ? 'flex-col border-r border-border-light' : 'gap-4 border-b border-border-light',
        )}
      >
        {items.map((item) => (
          <BaseTabs.Tab
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            data-slot="tabs-tab"
            className={cn(
              'relative inline-flex items-center gap-8 px-12 py-12 bg-transparent border-0 cursor-pointer select-none outline-none rounded-8',
              'font-standard font-medium text-s leading-[1.4] text-text-secondary',
              'transition-colors duration-150',
              'hover:text-text-primary data-[selected]:text-text-primary',
              'focus-visible:shadow-focus-primary',
              'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:hover:text-text-secondary',
            )}
          >
            {item.icon && (
              <span
                aria-hidden="true"
                className="inline-flex w-20 h-20 [&>svg]:w-full [&>svg]:h-full"
              >
                {item.icon}
              </span>
            )}
            {item.label}
          </BaseTabs.Tab>
        ))}
        <BaseTabs.Indicator
          data-slot="tabs-indicator"
          className={cn(
            'absolute bg-interaction-primary-default transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]',
            vertical
              ? 'right-[-1px] top-0 w-[2px] h-[var(--active-tab-height)] translate-y-[var(--active-tab-top)]'
              : 'bottom-[-1px] left-0 h-[2px] w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)] rounded-full',
          )}
        />
      </BaseTabs.List>
      {items.map((item) => (
        <BaseTabs.Panel
          key={item.value}
          value={item.value}
          data-slot="tabs-panel"
          className={cn(
            'min-w-0 flex-1 outline-none rounded-8 focus-visible:shadow-focus-primary',
            'font-standard font-normal text-m leading-[1.5] text-text-primary',
            vertical ? '' : 'pt-4',
          )}
        >
          {item.content}
        </BaseTabs.Panel>
      ))}
    </BaseTabs.Root>
  )
}
