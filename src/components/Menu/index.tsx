import type { CSSProperties, ReactElement, ReactNode } from 'react'
import { Menu as BaseMenu } from '@base-ui/react/menu'
import { CaretRightIcon, CheckIcon, CircleIcon } from '../icons'
import { PopoverArrowSvg } from '../Popover'
import { cn } from '../../lib/cn'

/* OGCR Menu — a click-triggered dropdown menu on Base UI `menu`.
 *
 * Richer sibling of `ContextMenu` (which is a flat action list): Menu supports
 * groups with labels, separators, checkbox items, single-select radio groups,
 * link items, and nested submenus via a recursive `items` model. The simple
 * `ContextMenu` preset stays for plain action lists; reach for `Menu` when you
 * need state-bearing items or nesting.
 *
 * NOTE Base UI's `menu` part has no `Separator` — menu separators are rendered
 * as a styled `role="separator"` element below.
 *
 * NOTE on long menus: Base UI's `Menu.Viewport` is a *transition* container, not
 * a scroll host. The keyboard-correct way to make a menu scroll is a max-height
 * + `overflow-y-auto` on the popup itself — Base UI scrolls the highlighted item
 * into the nearest scrollable ancestor, so the native overflow keeps arrow-key
 * navigation working. Wrapping the items in the custom `ScrollArea` would fight
 * that scroll-into-view, so `maxHeight` styles the popup directly instead.
 */

export type MenuActionItem = {
  type?: 'action'
  id: string
  label: string
  icon?: ReactNode
  /** Right-aligned hint, e.g. "⌘K". Rendered muted; not a live keybinding. */
  shortcut?: string
  onSelect?: () => void
  disabled?: boolean
  destructive?: boolean
}

export type MenuCheckboxItem = {
  type: 'checkbox'
  id: string
  label: string
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}

export type MenuRadioGroupItem = {
  type: 'radio-group'
  id: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  options: { value: string; label: string; disabled?: boolean }[]
}

export type MenuLinkItem = {
  type: 'link'
  id: string
  label: string
  href: string
  icon?: ReactNode
  disabled?: boolean
}

export type MenuSeparatorItem = { type: 'separator'; id: string }

export type MenuGroupItem = {
  type: 'group'
  id: string
  label?: string
  items: MenuItem[]
}

export type MenuSubItem = {
  type: 'submenu'
  id: string
  label: string
  icon?: ReactNode
  disabled?: boolean
  items: MenuItem[]
}

export type MenuItem =
  | MenuActionItem
  | MenuCheckboxItem
  | MenuRadioGroupItem
  | MenuLinkItem
  | MenuSeparatorItem
  | MenuGroupItem
  | MenuSubItem

export type MenuProps = {
  /** The element that opens the menu. Cloned via Base UI's `render`. */
  trigger: ReactElement
  items: MenuItem[]
  className?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  /** Render a pointer arrow anchored to the trigger. */
  showArrow?: boolean
  /** Constrain the popup height; overflowing items scroll (keyboard-aware). */
  maxHeight?: number | string
}

const popupClassName = cn(
  'min-w-[220px] max-w-[320px] flex flex-col gap-2 p-8 bg-surface-light border border-border-light rounded-12 shadow-elevation-l',
  'outline-none origin-[var(--transform-origin)] transition-[transform,opacity] duration-150',
  'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
  'data-[starting-style]:scale-95 data-[ending-style]:scale-95',
)

/** Thin, tokenised scrollbar applied when `maxHeight` makes the popup scroll. */
const scrollableClassName = cn(
  'overflow-y-auto overscroll-contain',
  '[scrollbar-width:thin] [scrollbar-color:var(--color-border-medium)_transparent]',
  '[&::-webkit-scrollbar]:w-8 [&::-webkit-scrollbar-thumb]:rounded-full',
  '[&::-webkit-scrollbar-thumb]:bg-border-medium [&::-webkit-scrollbar-track]:bg-transparent',
)

const arrowClassName = cn(
  'data-[side=bottom]:top-[-8px] data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180',
  'data-[side=left]:right-[-13px] data-[side=left]:rotate-90',
  'data-[side=right]:left-[-13px] data-[side=right]:-rotate-90',
)

const itemBase = cn(
  'flex items-center gap-12 w-full py-8 px-12 bg-transparent rounded-8 cursor-pointer text-left',
  'font-standard font-medium text-s leading-[1.4] outline-none select-none',
  'transition-[background-color,color] duration-150',
  'data-[highlighted]:bg-surface-neutral',
  'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
)

function ItemIcon({ children, tone }: { children: ReactNode; tone?: 'negative' }) {
  return (
    <span
      data-slot="menu-item-icon"
      className={cn(
        'inline-flex w-20 h-20 shrink-0 [&>svg]:w-full [&>svg]:h-full',
        tone === 'negative' ? 'text-icon-negative' : 'text-icon-secondary',
      )}
    >
      {children}
    </span>
  )
}

function renderItem(item: MenuItem): ReactNode {
  switch (item.type) {
    case 'separator':
      return (
        <div
          key={item.id}
          role="separator"
          data-slot="menu-separator"
          className="my-4 h-px bg-border-light"
        />
      )

    case 'checkbox':
      return (
        <BaseMenu.CheckboxItem
          key={item.id}
          checked={item.checked}
          defaultChecked={item.checked === undefined ? item.defaultChecked : undefined}
          onCheckedChange={item.onCheckedChange}
          disabled={item.disabled}
          closeOnClick={false}
          className={cn(itemBase, 'text-text-primary')}
        >
          <span className="inline-flex w-20 h-20 shrink-0 items-center justify-center text-icon-secondary">
            <BaseMenu.CheckboxItemIndicator className="[&>svg]:w-16 [&>svg]:h-16">
              <CheckIcon />
            </BaseMenu.CheckboxItemIndicator>
          </span>
          <span data-slot="menu-item-label">{item.label}</span>
        </BaseMenu.CheckboxItem>
      )

    case 'radio-group':
      return (
        <BaseMenu.RadioGroup
          key={item.id}
          value={item.value}
          defaultValue={item.value === undefined ? item.defaultValue : undefined}
          onValueChange={item.onValueChange}
        >
          {item.options.map((opt) => (
            <BaseMenu.RadioItem
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              closeOnClick={false}
              className={cn(itemBase, 'text-text-primary')}
            >
              <span className="inline-flex w-20 h-20 shrink-0 items-center justify-center text-icon-primary">
                <BaseMenu.RadioItemIndicator className="[&>svg]:w-8 [&>svg]:h-8">
                  {/* Filled dot reads as a radio (single-select); checkbox items use the check glyph. */}
                  <CircleIcon weight="fill" />
                </BaseMenu.RadioItemIndicator>
              </span>
              <span data-slot="menu-item-label">{opt.label}</span>
            </BaseMenu.RadioItem>
          ))}
        </BaseMenu.RadioGroup>
      )

    case 'link':
      return (
        <BaseMenu.LinkItem
          key={item.id}
          href={item.href}
          // Base UI LinkItem renders an <a> and has no `disabled` prop; mark it
          // disabled via ARIA + non-interactive styling instead.
          aria-disabled={item.disabled || undefined}
          className={cn(
            itemBase,
            'text-text-primary no-underline',
            item.disabled && 'pointer-events-none opacity-50',
          )}
        >
          {item.icon && <ItemIcon>{item.icon}</ItemIcon>}
          <span data-slot="menu-item-label">{item.label}</span>
        </BaseMenu.LinkItem>
      )

    case 'group':
      return (
        <BaseMenu.Group key={item.id} className="flex flex-col gap-2">
          {item.label && (
            <BaseMenu.GroupLabel className="px-12 pt-8 pb-4 font-standard font-medium text-xs leading-[1.2] uppercase tracking-wide text-text-secondary">
              {item.label}
            </BaseMenu.GroupLabel>
          )}
          {item.items.map(renderItem)}
        </BaseMenu.Group>
      )

    case 'submenu':
      return (
        // A disabled submenu trigger can't be opened (Base UI blocks it); the
        // itemBase `data-[disabled]` opacity + not-allowed cursor are the
        // affordance, and the caret dims with the rest of the row.
        <BaseMenu.SubmenuRoot key={item.id}>
          <BaseMenu.SubmenuTrigger
            disabled={item.disabled}
            className={cn(itemBase, 'text-text-primary data-[popup-open]:bg-surface-neutral')}
          >
            {item.icon && <ItemIcon>{item.icon}</ItemIcon>}
            <span data-slot="menu-item-label" className="flex-1">
              {item.label}
            </span>
            {/* rtl: caret points toward the inline-start edge the submenu opens from. */}
            <CaretRightIcon className="w-16 h-16 text-icon-secondary rtl:-scale-x-100" />
          </BaseMenu.SubmenuTrigger>
          <BaseMenu.Portal>
            <BaseMenu.Positioner side="right" align="start" sideOffset={4}>
              <BaseMenu.Popup data-slot="menu-submenu" className={popupClassName}>
                {item.items.map(renderItem)}
              </BaseMenu.Popup>
            </BaseMenu.Positioner>
          </BaseMenu.Portal>
        </BaseMenu.SubmenuRoot>
      )

    default: {
      // action item (type undefined or 'action')
      return (
        <BaseMenu.Item
          key={item.id}
          disabled={item.disabled}
          onClick={item.onSelect}
          className={cn(
            itemBase,
            item.destructive
              ? 'text-text-negative data-[highlighted]:bg-surface-negative'
              : 'text-text-primary',
          )}
        >
          {item.icon && (
            <ItemIcon tone={item.destructive ? 'negative' : undefined}>{item.icon}</ItemIcon>
          )}
          <span data-slot="menu-item-label" className="flex-1">
            {item.label}
          </span>
          {item.shortcut && (
            <span
              data-slot="menu-item-shortcut"
              className="font-standard text-xs leading-[1.2] text-text-secondary"
            >
              {item.shortcut}
            </span>
          )}
        </BaseMenu.Item>
      )
    }
  }
}

export function Menu({
  trigger,
  items,
  className,
  open,
  defaultOpen,
  onOpenChange,
  side = 'bottom',
  align = 'start',
  sideOffset = 8,
  showArrow = false,
  maxHeight,
}: MenuProps) {
  const popupStyle: CSSProperties | undefined =
    maxHeight === undefined ? undefined : { maxHeight }

  return (
    <BaseMenu.Root
      open={open}
      defaultOpen={open === undefined ? defaultOpen : undefined}
      onOpenChange={onOpenChange}
    >
      <BaseMenu.Trigger render={trigger} />
      <BaseMenu.Portal>
        <BaseMenu.Positioner side={side} align={align} sideOffset={sideOffset} className="z-50">
          <BaseMenu.Popup
            data-slot="menu"
            style={popupStyle}
            className={cn(popupClassName, maxHeight !== undefined && scrollableClassName, className)}
          >
            {showArrow && (
              <BaseMenu.Arrow data-slot="menu-arrow" className={arrowClassName}>
                <PopoverArrowSvg />
              </BaseMenu.Arrow>
            )}
            {items.map(renderItem)}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  )
}
