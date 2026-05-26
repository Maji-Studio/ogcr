import type { ReactElement, ReactNode } from 'react'
import { Menu } from '@base-ui/react/menu'
import { Pill } from '../Pill'
import { cn } from '../../lib/cn'

export type ContextMenuItem = {
  id: string
  label: string
  icon?: ReactNode
  onSelect?: () => void
  disabled?: boolean
  destructive?: boolean
}

export type ContextMenuProps = {
  trigger: ReactElement
  header?: string
  status?: string
  items: ContextMenuItem[]
  className?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

export function ContextMenu({
  trigger,
  header,
  status,
  items,
  className,
  open,
  defaultOpen,
  onOpenChange,
  side = 'bottom',
  align = 'start',
  sideOffset = 8,
}: ContextMenuProps) {
  return (
    <Menu.Root
      open={open}
      defaultOpen={open === undefined ? defaultOpen : undefined}
      onOpenChange={onOpenChange}
    >
      <Menu.Trigger render={trigger} />
      <Menu.Portal>
        <Menu.Positioner side={side} align={align} sideOffset={sideOffset}>
          <Menu.Popup
            data-slot="context-menu"
            className={cn(
              'w-[320px] flex flex-col gap-16 p-16 bg-surface-light border border-border-light rounded-12 shadow-elevation-l',
              'outline-none origin-[var(--transform-origin)] transition-[transform,opacity] duration-150',
              'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
              'data-[starting-style]:scale-95 data-[ending-style]:scale-95',
              className,
            )}
          >
            {(header || status) && (
              <header
                data-slot="context-menu-header"
                className="flex items-center justify-between gap-12"
              >
                {header && (
                  <span className="font-standard font-medium text-m leading-[1.2] text-text-primary">
                    {header}
                  </span>
                )}
                {status && <Pill tone="neutral">{status}</Pill>}
              </header>
            )}
            <div role="presentation" className="flex flex-col gap-4">
              {items.map((item) => (
                <Menu.Item
                  key={item.id}
                  disabled={item.disabled}
                  onClick={item.onSelect}
                  className={cn(
                    'flex items-center gap-12 w-full py-8 px-12 bg-transparent rounded-8 cursor-pointer text-left',
                    'font-standard font-medium text-s leading-[1.4]',
                    'outline-none select-none',
                    'transition-[background-color,color] duration-150',
                    'data-[highlighted]:bg-surface-neutral',
                    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
                    item.destructive
                      ? 'text-text-negative data-[highlighted]:bg-surface-negative'
                      : 'text-text-primary',
                  )}
                >
                  {item.icon && (
                    <span
                      data-slot="context-menu-item-icon"
                      className={cn(
                        'inline-flex w-20 h-20 [&>svg]:w-full [&>svg]:h-full',
                        item.destructive ? 'text-icon-negative' : 'text-icon-secondary',
                      )}
                    >
                      {item.icon}
                    </span>
                  )}
                  <span data-slot="context-menu-item-label">{item.label}</span>
                </Menu.Item>
              ))}
            </div>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}
