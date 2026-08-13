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
 *
 * Need a glyph that isn't here? Add it below rather than importing from
 * `@phosphor-icons/react` in an app — a raw import loses the `aria-hidden`
 * default and re-opens the naming contract. For a one-off, wrap it yourself
 * with the exported `createDecorativeIcon()`.
 */
import type { Icon as PhosphorGlyph, IconProps } from '@phosphor-icons/react'
import {
  ArrowClockwise,
  ArrowRight,
  ArrowLeft,
  Bell,
  CalendarBlank,
  CaretDown,
  CaretLeft,
  CaretRight,
  ChartBar,
  Check,
  CheckCircle,
  Circle,
  CornersOut,
  CurrencyEur,
  Database,
  DotsThree,
  Envelope,
  Factory,
  FileText,
  Flask,
  Folder,
  Gauge,
  Gear,
  GlobeHemisphereWest,
  Handshake,
  House,
  Info,
  Leaf,
  List,
  Lock,
  LockKey,
  MagnifyingGlass,
  MapTrifold,
  Minus,
  Package,
  Pencil,
  Plant,
  Plus,
  Printer,
  ShieldCheck,
  ShoppingCart,
  SidebarSimple,
  SquaresFour,
  Trash,
  User,
  Warning,
  WarningOctagon,
  X,
} from '@phosphor-icons/react'

/** The Phosphor glyph component type and its props, re-exported so consumers can
 * type an icon slot (`icon: PhosphorIcon`) without depending on Phosphor directly. */
export type { PhosphorGlyph as PhosphorIcon, IconProps as PhosphorIconProps }

/**
 * Wrap a Phosphor glyph so it is decorative (`aria-hidden`) unless overridden.
 * Exported so apps can add a project-specific glyph on the same contract:
 * `const TractorIcon = createDecorativeIcon(Tractor, 'TractorIcon')`.
 */
export function createDecorativeIcon(Glyph: PhosphorGlyph, displayName: string) {
  function Icon({ 'aria-hidden': ariaHidden, ...props }: IconProps) {
    return <Glyph aria-hidden={ariaHidden ?? true} {...props} />
  }
  Icon.displayName = displayName
  return Icon
}

const decorative = createDecorativeIcon

/* --- Navigation & chrome ------------------------------------------------- */
export const ArrowRightIcon = decorative(ArrowRight, 'ArrowRightIcon')
export const ArrowLeftIcon = decorative(ArrowLeft, 'ArrowLeftIcon')
export const ArrowClockwiseIcon = decorative(ArrowClockwise, 'ArrowClockwiseIcon')
export const CaretDownIcon = decorative(CaretDown, 'CaretDownIcon')
export const CaretLeftIcon = decorative(CaretLeft, 'CaretLeftIcon')
export const CaretRightIcon = decorative(CaretRight, 'CaretRightIcon')
export const DotsThreeIcon = decorative(DotsThree, 'DotsThreeIcon')
export const ListIcon = decorative(List, 'ListIcon')
export const PanelLeftIcon = decorative(SidebarSimple, 'PanelLeftIcon')
export const HouseIcon = decorative(House, 'HouseIcon')
export const SquaresFourIcon = decorative(SquaresFour, 'SquaresFourIcon')

/* --- Actions -------------------------------------------------------------- */
export const CheckIcon = decorative(Check, 'CheckIcon')
export const CornersOutIcon = decorative(CornersOut, 'CornersOutIcon')
export const MinusIcon = decorative(Minus, 'MinusIcon')
export const PencilIcon = decorative(Pencil, 'PencilIcon')
export const PlusIcon = decorative(Plus, 'PlusIcon')
export const PrinterIcon = decorative(Printer, 'PrinterIcon')
export const SearchIcon = decorative(MagnifyingGlass, 'SearchIcon')
export const TrashIcon = decorative(Trash, 'TrashIcon')
export const XIcon = decorative(X, 'XIcon')

/* --- Status & feedback ---------------------------------------------------- */
export const BellIcon = decorative(Bell, 'BellIcon')
export const CheckCircleIcon = decorative(CheckCircle, 'CheckCircleIcon')
export const CircleIcon = decorative(Circle, 'CircleIcon')
export const InfoIcon = decorative(Info, 'InfoIcon')
export const LockIcon = decorative(Lock, 'LockIcon')
export const LockKeyIcon = decorative(LockKey, 'LockKeyIcon')
export const ShieldCheckIcon = decorative(ShieldCheck, 'ShieldCheckIcon')
export const WarningIcon = decorative(Warning, 'WarningIcon')
export const WarningOctagonIcon = decorative(WarningOctagon, 'WarningOctagonIcon')

/* --- Objects & domain ----------------------------------------------------- */
export const CalendarIcon = decorative(CalendarBlank, 'CalendarIcon')
export const ChartBarIcon = decorative(ChartBar, 'ChartBarIcon')
export const CurrencyEurIcon = decorative(CurrencyEur, 'CurrencyEurIcon')
export const DatabaseIcon = decorative(Database, 'DatabaseIcon')
export const FactoryIcon = decorative(Factory, 'FactoryIcon')
export const FileTextIcon = decorative(FileText, 'FileTextIcon')
export const FlaskIcon = decorative(Flask, 'FlaskIcon')
export const FolderIcon = decorative(Folder, 'FolderIcon')
export const GaugeIcon = decorative(Gauge, 'GaugeIcon')
export const GearIcon = decorative(Gear, 'GearIcon')
export const GlobeIcon = decorative(GlobeHemisphereWest, 'GlobeIcon')
export const HandshakeIcon = decorative(Handshake, 'HandshakeIcon')
export const LeafIcon = decorative(Leaf, 'LeafIcon')
export const MailIcon = decorative(Envelope, 'MailIcon')
export const MapIcon = decorative(MapTrifold, 'MapIcon')
export const PackageIcon = decorative(Package, 'PackageIcon')
export const PlantIcon = decorative(Plant, 'PlantIcon')
export const ShoppingCartIcon = decorative(ShoppingCart, 'ShoppingCartIcon')
export const UserIcon = decorative(User, 'UserIcon')
