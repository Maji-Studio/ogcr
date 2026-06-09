/* OGCR icon set — thin re-exports of the real Phosphor library
 * (`@phosphor-icons/react`), the icon family the Figma source references.
 *
 * Two things every icon here guarantees, so the rest of the system can stay
 * simple:
 *   1. Decorative by default — each icon ships `aria-hidden`, because icons in
 *      this system sit inside a labelled control (a button/link with its own
 *      `aria-label`) or beside visible text. Pass Phosphor's `alt` prop (renders
 *      a <title>) or `aria-hidden={false}` for a meaningful standalone icon.
 *   2. Stable public names — the `*Icon` suffix and the OGCR-specific aliases
 *      (`SearchIcon`, `MailIcon`, `PanelLeftIcon`) are the contract consumers
 *      import; the underlying Phosphor glyph can change without breaking them.
 *
 * Colour follows `currentColor` (Phosphor renders with `fill`), size defaults
 * to `1em` and is overridable via the `size`/`width`/`height` props or a CSS
 * rule on the svg (e.g. `[&>svg]:w-20`). Weight defaults to Phosphor `regular`.
 */
import type { Icon as PhosphorIcon, IconProps } from '@phosphor-icons/react'
import {
  ArrowRight,
  ArrowLeft,
  MagnifyingGlass,
  Envelope,
  X,
  CheckCircle,
  Info,
  Warning,
  WarningOctagon,
  SquaresFour,
  Flask,
  ChartBar,
  Folder,
  User,
  Bell,
  DotsThree,
  CaretDown,
  CaretLeft,
  CaretRight,
  SidebarSimple,
  Gear,
  Leaf,
  Check,
  Circle,
  CalendarBlank,
} from '@phosphor-icons/react'

/** Wrap a Phosphor glyph so it is decorative (`aria-hidden`) unless overridden. */
function decorative(Glyph: PhosphorIcon, displayName: string) {
  function Icon({ 'aria-hidden': ariaHidden, ...props }: IconProps) {
    return <Glyph aria-hidden={ariaHidden ?? true} {...props} />
  }
  Icon.displayName = displayName
  return Icon
}

export const ArrowRightIcon = decorative(ArrowRight, 'ArrowRightIcon')
export const ArrowLeftIcon = decorative(ArrowLeft, 'ArrowLeftIcon')
export const SearchIcon = decorative(MagnifyingGlass, 'SearchIcon')
export const MailIcon = decorative(Envelope, 'MailIcon')
export const XIcon = decorative(X, 'XIcon')
export const CheckCircleIcon = decorative(CheckCircle, 'CheckCircleIcon')
export const InfoIcon = decorative(Info, 'InfoIcon')
export const WarningIcon = decorative(Warning, 'WarningIcon')
export const WarningOctagonIcon = decorative(WarningOctagon, 'WarningOctagonIcon')
export const SquaresFourIcon = decorative(SquaresFour, 'SquaresFourIcon')
export const FlaskIcon = decorative(Flask, 'FlaskIcon')
export const ChartBarIcon = decorative(ChartBar, 'ChartBarIcon')
export const FolderIcon = decorative(Folder, 'FolderIcon')
export const UserIcon = decorative(User, 'UserIcon')
export const BellIcon = decorative(Bell, 'BellIcon')
export const DotsThreeIcon = decorative(DotsThree, 'DotsThreeIcon')
export const CaretDownIcon = decorative(CaretDown, 'CaretDownIcon')
export const CaretLeftIcon = decorative(CaretLeft, 'CaretLeftIcon')
export const CaretRightIcon = decorative(CaretRight, 'CaretRightIcon')
export const PanelLeftIcon = decorative(SidebarSimple, 'PanelLeftIcon')
export const GearIcon = decorative(Gear, 'GearIcon')
export const LeafIcon = decorative(Leaf, 'LeafIcon')
export const CheckIcon = decorative(Check, 'CheckIcon')
export const CircleIcon = decorative(Circle, 'CircleIcon')
export const CalendarIcon = decorative(CalendarBlank, 'CalendarIcon')
