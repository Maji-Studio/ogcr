import { useState } from 'react'
import { Button } from './components/Button'
import { Input } from './components/Input'
import { Card } from './components/Card'
import { Pill } from './components/Pill'
import { ProgressBar } from './components/ProgressBar'
import { Checkbox, type CheckboxValue } from './components/Checkbox'
import { Radio, RadioGroup } from './components/Radio'
import { Navigation, type NavItem } from './components/Navigation'
import { SideNavigation, type SideNavigationItem } from './components/SideNavigation'
import { Kpi } from './components/Kpi'
import { ContextMenu } from './components/ContextMenu'
import { Sidesheet } from './components/Sidesheet'
import { Message } from './components/Message'
import { Logo } from './components/Logo'
import {
  Form,
  FormFieldset,
  FormFooter,
  FormRow,
  FormSection,
} from './components/Form'
import { DataTable } from './components/Table'
import type { ColumnDef } from '@tanstack/react-table'
import { Avatar } from './components/Avatar'
import { Select } from './components/Select'
import { Combobox } from './components/Combobox'
import { NumberField } from './components/NumberField'
import { Slider } from './components/Slider'
import { Toggle, ToggleGroup } from './components/Toggle'
import { Switch } from './components/Switch'
import { Tabs } from './components/Tabs'
import { Accordion } from './components/Accordion'
import { Collapsible } from './components/Collapsible'
import { Breadcrumb } from './components/Breadcrumb'
import { Pagination } from './components/Pagination'
import { Separator } from './components/Separator'
import { Popover } from './components/Popover'
import { Dialog } from './components/Dialog'
import { AlertDialog } from './components/AlertDialog'
import { Skeleton } from './components/Skeleton'
import { Textarea } from './components/Textarea'
import { Tooltip } from './components/Tooltip'
import { Menu } from './components/Menu'
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarInput,
} from './components/Toolbar'
import { ScrollArea } from './components/ScrollArea'
import { Calendar } from './components/Calendar'
import { DatePicker } from './components/DatePicker'
import { ToastProvider, useToast } from './components/Toast'
import {
  ArrowRightIcon,
  BellIcon,
  ChartBarIcon,
  DotsThreeIcon,
  FlaskIcon,
  FolderIcon,
  GearIcon,
  InfoIcon,
  LeafIcon,
  MailIcon,
  SearchIcon,
  SquaresFourIcon,
  UserIcon,
} from './components/icons'
import './App.css'

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: <SquaresFourIcon /> },
  { id: 'sampling', label: 'Sampling', icon: <FlaskIcon /> },
  { id: 'insights', label: 'Insights', icon: <ChartBarIcon /> },
  { id: 'projects', label: 'Projects', icon: <FolderIcon /> },
  { id: 'profile', label: 'Profile', icon: <UserIcon /> },
]

const SIDEBAR_ITEMS: SideNavigationItem[] = [
  { id: 'overview', label: 'Overview', icon: <SquaresFourIcon /> },
  {
    id: 'farm',
    label: 'Farm & parcel',
    icon: <LeafIcon />,
    children: [
      { id: 'farm-all', label: 'All farms', badge: 38 },
      { id: 'farm-parcels', label: 'Parcels' },
      { id: 'farm-plots', label: 'Plots' },
    ],
  },
  { id: 'sample', label: 'Sample', icon: <FlaskIcon />, badge: 4 },
  { id: 'analytics', label: 'Analytics', icon: <ChartBarIcon /> },
  { id: 'projects', label: 'Projects', icon: <FolderIcon /> },
  { id: 'settings', label: 'Settings', icon: <GearIcon /> },
]

type Issuance = {
  project: string
  methodology: string
  plots: number
  credits: number
  status: 'verified' | 'review' | 'flagged'
  updated: string
}

const ISSUANCES: Issuance[] = [
  { project: 'Iberian rewilding', methodology: 'v3.2', plots: 12, credits: 42180, status: 'review', updated: '2026-04-22' },
  { project: 'Atlantic kelp restoration', methodology: 'v2.8', plots: 8, credits: 18420, status: 'verified', updated: '2026-04-19' },
  { project: 'Selva del Mar peatland', methodology: 'v3.1', plots: 24, credits: 96300, status: 'verified', updated: '2026-04-15' },
  { project: 'Mara grasslands soil', methodology: 'v3.0', plots: 16, credits: 31870, status: 'flagged', updated: '2026-04-12' },
  { project: 'Hokkaido seagrass', methodology: 'v2.8', plots: 6, credits: 7240, status: 'review', updated: '2026-04-09' },
  { project: 'Patagonia native forest', methodology: 'v3.2', plots: 18, credits: 58210, status: 'verified', updated: '2026-04-04' },
]

const STATUS_TONE: Record<Issuance['status'], 'positive' | 'warning' | 'negative'> = {
  verified: 'positive',
  review: 'warning',
  flagged: 'negative',
}

const STATUS_LABEL: Record<Issuance['status'], string> = {
  verified: 'Verified',
  review: 'In review',
  flagged: 'Flagged',
}

const issuanceColumns: ColumnDef<Issuance>[] = [
  { accessorKey: 'project', header: 'Project' },
  { accessorKey: 'methodology', header: 'Methodology' },
  {
    accessorKey: 'plots',
    header: 'Plots',
    meta: { numeric: true },
  },
  {
    accessorKey: 'credits',
    header: 'Credits (t CO₂e)',
    meta: { numeric: true },
    cell: (info) => info.getValue<number>().toLocaleString('en-US'),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: false,
    cell: (info) => {
      const v = info.getValue<Issuance['status']>()
      return <Pill tone={STATUS_TONE[v]}>{STATUS_LABEL[v]}</Pill>
    },
  },
  {
    accessorKey: 'updated',
    header: 'Updated',
    cell: (info) =>
      new Date(info.getValue<string>()).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
  },
]

type SectionMeta = {
  id: string
  num: string
  kicker: string
  title: string
  lede: string
  figmaNode: string
  spec?: { dt: string; dd: string }[]
  tag?: string
}

const SECTIONS: SectionMeta[] = [
  {
    id: 'tokens',
    num: '01',
    kicker: 'Foundation',
    title: 'Base tokens',
    lede: 'The variables every component is built from. Colors, typography, spacing, radii, elevation, and motion — sourced from the Figma library and exposed as CSS custom properties on `:root`.',
    figmaNode: '8:420',
    spec: [
      { dt: 'Source', dd: 'src/index.css' },
      { dt: 'Strategy', dd: 'CSS custom properties' },
      { dt: 'Scope', dd: 'global' },
    ],
  },
  {
    id: 'navigation',
    num: '02',
    kicker: 'Module',
    title: 'Navigation',
    lede: 'Primary surface for moving between Operator-platform sections. Desktop is a top-bar with brand + product label; mobile is a bottom-bar with stacked icon-on-pill labels.',
    figmaNode: '6140:3865 · 6072:2172',
    spec: [
      { dt: 'Active fill', dd: 'interaction-primary-focus' },
      { dt: 'Label style', dd: 'label-button (Inter 500)' },
      { dt: 'Breakpoints', dd: 'desktop · mobile' },
    ],
  },
  {
    id: 'sidebar',
    num: '03',
    kicker: 'Module',
    title: 'Side navigation',
    lede: 'Vertical primary navigation for shells with deeper navigation trees. Persistent rail with optional collapse to icons-only, one level of nested groups, and a user chip in the footer. Mobile collapses to a burger trigger that opens it as an overlay drawer.',
    figmaNode: '—',
    spec: [
      { dt: 'Width', dd: '264px · 72px collapsed' },
      { dt: 'Active state', dd: 'interaction-primary-focus + 3px rail' },
      { dt: 'Layouts', dd: 'desktop · mobile (drawer)' },
    ],
  },
  {
    id: 'kpi',
    num: '04',
    kicker: 'Module',
    title: 'KPI',
    lede: 'A single metric with optional secondary context. The 6-pixel top accent communicates state at a glance.',
    figmaNode: '6063:1279',
    spec: [
      { dt: 'Surface', dd: 'surface-light, border-medium' },
      { dt: 'Accent', dd: 'icon-* token per status' },
      { dt: 'Value type', dd: 'heading-3 / 20–24px' },
    ],
  },
  {
    id: 'buttons',
    num: '05',
    kicker: 'Component',
    title: 'Buttons',
    lede: 'Three styles, one motion vocabulary. Filled is the brand-default; outlined and text descend in emphasis.',
    figmaNode: '1:37',
    spec: [
      { dt: 'Variants', dd: 'filled · outlined · text' },
      { dt: 'Default size', dd: '48px / radius-l' },
      { dt: 'Focus ring', dd: 'interaction-primary-focus' },
    ],
  },
  {
    id: 'inputs',
    num: '06',
    kicker: 'Component',
    title: 'Input fields',
    lede: 'Label, optional leading/trailing icon, helper text, and an error state with a red focus halo.',
    figmaNode: '4011:1499',
    spec: [
      { dt: 'States', dd: 'default · hover · focus · error' },
      { dt: 'Padding', dd: 'm · 16px' },
      { dt: 'Helper', dd: 'body-s / 14–16px' },
    ],
  },
  {
    id: 'cards',
    num: '07',
    kicker: 'Module',
    title: 'Cards',
    lede: 'Title + subtitle, optional trailing slot, and a body that accepts arbitrary children. Floating adds elevation-l.',
    figmaNode: '6064:722 · 6145:11695',
    spec: [
      { dt: 'Padding', dd: 'm · 16px' },
      { dt: 'Radius', dd: 'xl · 16px' },
      { dt: 'Variants', dd: 'floating yes · no' },
    ],
  },
  {
    id: 'context-menu',
    num: '08',
    kicker: 'Module',
    title: 'Context menu',
    lede: 'A 320-px floating panel for object-scoped actions. Items support icon, disabled, and destructive emphasis.',
    figmaNode: '6063:1658',
    spec: [
      { dt: 'Surface', dd: 'surface-page · elevation-l' },
      { dt: 'Width', dd: '320px' },
      { dt: 'Item radius', dd: 'm · 8px' },
    ],
  },
  {
    id: 'sidesheet',
    num: '09',
    kicker: 'Module',
    title: 'Sidesheet',
    lede: 'A 480-px panel that slides in from a viewport edge. Navigation row, header with status pill, scrolling body, and a sticky action footer.',
    figmaNode: '6103:2880',
    spec: [
      { dt: 'Width', dd: '480px' },
      { dt: 'Surface', dd: 'surface-light · elevation-l' },
      { dt: 'Footer', dd: 'primary + secondary action' },
    ],
  },
  {
    id: 'messages',
    num: '10',
    kicker: 'Module',
    title: 'Messages',
    lede: 'Inline or floating, in four semantic states. Each state shifts background, border, icon, and text together to keep the read fluid.',
    figmaNode: '6052:1186',
    spec: [
      { dt: 'States', dd: 'neutral · success · warning · error' },
      { dt: 'Types', dd: 'inline · floating' },
      { dt: 'Roles', dd: 'status · alert' },
    ],
  },
  {
    id: 'progress',
    num: '11',
    kicker: 'Component',
    title: 'Progress bars',
    lede: 'A thin 8-pixel rail with optional label and percentage. Tone tracks the underlying KPI status.',
    figmaNode: '6025:562',
    spec: [
      { dt: 'Height', dd: '8px' },
      { dt: 'Tones', dd: 'default · blue · orange · neutral' },
      { dt: 'Motion', dd: 'width transitions on update' },
    ],
  },
  {
    id: 'checkbox',
    num: '12',
    kicker: 'Component',
    title: 'Checkbox',
    lede: 'Inline option, plus border-left and border-right card layouts for selection grids.',
    figmaNode: '6029:687',
    spec: [
      { dt: 'States', dd: 'default · focus · error · disabled' },
      { dt: 'Checked', dd: 'true · false · indeterminate' },
      { dt: 'Layouts', dd: 'inline · border-left · border-right' },
    ],
    tag: 'wip',
  },
  {
    id: 'radio',
    num: '13',
    kicker: 'Component',
    title: 'Radio button',
    lede: 'Mirrors the Checkbox layouts and states with a circular indicator that scales in on selection.',
    figmaNode: '6059:1143',
    spec: [
      { dt: 'States', dd: 'default · focus · error · disabled' },
      { dt: 'Layouts', dd: 'inline · border-left · border-right' },
      { dt: 'Group via', dd: 'native name attribute' },
    ],
  },
  {
    id: 'form',
    num: '14',
    kicker: 'Module',
    title: 'Form',
    lede: 'A composition layer over Inputs, Checkbox, Radio, and Button. Sections carry a Roman-numeral step, a title, and a description; the body holds fields and an action footer.',
    figmaNode: '—',
    spec: [
      { dt: 'Layout', dd: '132px head · 1fr body' },
      { dt: 'Validation', dd: 'errorText prop per field' },
      { dt: 'Library', dd: 'agnostic · works with RHF Controller' },
    ],
  },
  {
    id: 'table',
    num: '15',
    kicker: 'Module',
    title: 'Data table',
    lede: 'Sortable ledger built on @tanstack/react-table. Mono-caps headers, dashed row rules, tabular numerics, and Pill-rendered status cells.',
    figmaNode: '—',
    spec: [
      { dt: 'Engine', dd: '@tanstack/react-table v8' },
      { dt: 'Sorting', dd: 'click header · aria-sort' },
      { dt: 'Cell meta', dd: 'numeric · align' },
    ],
  },
  {
    id: 'avatar',
    num: '16',
    kicker: 'Component',
    title: 'Avatar',
    lede: 'A person or entity marker. Renders an image when available and falls back to initials derived from the name — across five sizes and two shapes.',
    figmaNode: '—',
    spec: [
      { dt: 'Sizes', dd: 'xs · s · m · l · xl' },
      { dt: 'Shapes', dd: 'circle · square' },
      { dt: 'Fallback', dd: 'initials from name' },
    ],
  },
  {
    id: 'select',
    num: '17',
    kicker: 'Component',
    title: 'Select',
    lede: 'A single-choice dropdown built on Base UI. The trigger mirrors the input field; the popup matches its width and checks the active option.',
    figmaNode: '—',
    spec: [
      { dt: 'Trigger', dd: '48px · matches Input' },
      { dt: 'States', dd: 'default · open · error · disabled' },
      { dt: 'Naming', dd: 'aria-label / labelledby' },
    ],
  },
  {
    id: 'combobox',
    num: '18',
    kicker: 'Component',
    title: 'Combobox',
    lede: 'Type-ahead autocomplete over a list of options. Filters as you type and surfaces an empty-state message when nothing matches.',
    figmaNode: '—',
    spec: [
      { dt: 'Engine', dd: 'Base UI Autocomplete' },
      { dt: 'Empty state', dd: 'configurable message' },
      { dt: 'Popup', dd: 'anchor-width · 320px max' },
    ],
  },
  {
    id: 'number-field',
    num: '19',
    kicker: 'Component',
    title: 'Number field',
    lede: 'A numeric input with decrement / increment steppers, min–max clamping, and Intl number formatting. Keyboard supports small and large steps.',
    figmaNode: '—',
    spec: [
      { dt: 'Steppers', dd: '44px · ±step' },
      { dt: 'Formatting', dd: 'Intl.NumberFormat' },
      { dt: 'States', dd: 'default · error · disabled' },
    ],
  },
  {
    id: 'slider',
    num: '20',
    kicker: 'Component',
    title: 'Slider',
    lede: 'A single-value range control with a 6-pixel track, draggable thumb, and optional inline value read-out. Commits on pointer-up or keyboard.',
    figmaNode: '—',
    spec: [
      { dt: 'Track', dd: '6px · border-medium' },
      { dt: 'Thumb', dd: '20px · primary ring' },
      { dt: 'Tones', dd: 'default · error' },
    ],
  },
  {
    id: 'toggle',
    num: '21',
    kicker: 'Component',
    title: 'Toggle',
    lede: 'A two-state pressable button, standalone or grouped into a segmented control. The group behaves as a single- or multi-select toolbar.',
    figmaNode: '—',
    spec: [
      { dt: 'Sizes', dd: 's · m' },
      { dt: 'Group', dd: 'single · multi-select' },
      { dt: 'Role', dd: 'button · toolbar' },
    ],
  },
  {
    id: 'switch',
    num: '22',
    kicker: 'Component',
    title: 'Switch',
    lede: 'A binary on / off control with an optional inline label and secondary text. The thumb slides on a track that shifts to the primary tone when on.',
    figmaNode: '—',
    spec: [
      { dt: 'Track', dd: '40 × 24px' },
      { dt: 'States', dd: 'on · off · error · disabled' },
      { dt: 'Label', dd: 'optional · inline' },
    ],
  },
  {
    id: 'tabs',
    num: '23',
    kicker: 'Module',
    title: 'Tabs',
    lede: 'Switch between sibling panels with a sliding active indicator. Horizontal or vertical, with optional per-tab icons.',
    figmaNode: '—',
    spec: [
      { dt: 'Orientations', dd: 'horizontal · vertical' },
      { dt: 'Indicator', dd: 'animated · 2px' },
      { dt: 'Per tab', dd: 'icon · disabled' },
    ],
  },
  {
    id: 'accordion',
    num: '24',
    kicker: 'Module',
    title: 'Accordion',
    lede: 'A stack of headers that expand to reveal content. Single-open by default; opt into multiple. Panel height animates on toggle.',
    figmaNode: '—',
    spec: [
      { dt: 'Mode', dd: 'single · multiple' },
      { dt: 'Motion', dd: 'height · 200ms' },
      { dt: 'Per item', dd: 'disabled' },
    ],
  },
  {
    id: 'collapsible',
    num: '25',
    kicker: 'Component',
    title: 'Collapsible',
    lede: 'A single trigger that shows or hides a region of content, with an animated height transition and an optional chevron affordance.',
    figmaNode: '—',
    spec: [
      { dt: 'Motion', dd: 'height · 200ms' },
      { dt: 'Chevron', dd: 'optional' },
      { dt: 'State', dd: 'open · closed · disabled' },
    ],
  },
  {
    id: 'breadcrumb',
    num: '26',
    kicker: 'Component',
    title: 'Breadcrumb',
    lede: 'A hierarchical trail to the current page. Links and buttons are interactive; the final crumb is marked as the current location.',
    figmaNode: '—',
    spec: [
      { dt: 'Separator', dd: 'chevron · custom' },
      { dt: 'Current', dd: 'aria-current=page' },
      { dt: 'Items', dd: 'link · button · text' },
    ],
  },
  {
    id: 'pagination',
    num: '27',
    kicker: 'Component',
    title: 'Pagination',
    lede: 'Page navigation with previous / next controls and a truncated page range that keeps the first, last, and current pages in view.',
    figmaNode: '—',
    spec: [
      { dt: 'Range', dd: 'sibling-aware ellipses' },
      { dt: 'Cell', dd: '40px · active fill' },
      { dt: 'Controls', dd: 'prev · next' },
    ],
  },
  {
    id: 'separator',
    num: '28',
    kicker: 'Component',
    title: 'Separator',
    lede: 'A one-pixel divider for splitting content. Horizontal or vertical, with an optional centered label on the horizontal variant.',
    figmaNode: '—',
    spec: [
      { dt: 'Orientations', dd: 'horizontal · vertical' },
      { dt: 'Weight', dd: '1px · border-light' },
      { dt: 'Label', dd: 'optional · centered' },
    ],
  },
  {
    id: 'popover',
    num: '29',
    kicker: 'Module',
    title: 'Popover',
    lede: 'A floating surface anchored to a trigger, with optional title, description, and pointer arrow. Non-modal by default.',
    figmaNode: '—',
    spec: [
      { dt: 'Surface', dd: 'surface-light · elevation-l' },
      { dt: 'Placement', dd: 'side · align · offset' },
      { dt: 'Arrow', dd: 'optional' },
    ],
  },
  {
    id: 'dialog',
    num: '30',
    kicker: 'Module',
    title: 'Dialog',
    lede: 'A centered modal for focused tasks. Title, optional description, arbitrary body, and a footer of primary / secondary actions that close on click.',
    figmaNode: '—',
    spec: [
      { dt: 'Sizes', dd: 's · m · l' },
      { dt: 'Surface', dd: 'surface-light · elevation-l' },
      { dt: 'Actions', dd: 'primary · secondary' },
    ],
  },
  {
    id: 'alert-dialog',
    num: '31',
    kicker: 'Module',
    title: 'Alert dialog',
    lede: 'A compact confirmation modal for consequential actions. Cancel and confirm are required; the danger tone renders a destructive confirm.',
    figmaNode: '—',
    spec: [
      { dt: 'Width', dd: '400px' },
      { dt: 'Tones', dd: 'default · danger' },
      { dt: 'Dismiss', dd: 'requires a choice' },
    ],
  },
  {
    id: 'skeleton',
    num: '32',
    kicker: 'Component',
    title: 'Skeleton',
    lede: 'A pulsing placeholder for content that is still loading. Text, rectangular, and circular variants; text can render multiple lines.',
    figmaNode: '—',
    spec: [
      { dt: 'Variants', dd: 'text · rectangular · circular' },
      { dt: 'Motion', dd: 'animate-pulse' },
      { dt: 'Text', dd: 'multi-line · shortened last' },
    ],
  },
  {
    id: 'textarea',
    num: '33',
    kicker: 'Component',
    title: 'Textarea',
    lede: 'A multi-line text control that mirrors the Input field. Label, helper text, and an error state that swaps the border and focus halo to negative. The resize affordance is configurable.',
    figmaNode: '—',
    spec: [
      { dt: 'Resize', dd: 'none · vertical · horizontal · both' },
      { dt: 'Min height', dd: '96px · rows 4' },
      { dt: 'States', dd: 'default · error · disabled' },
    ],
  },
  {
    id: 'toast',
    num: '34',
    kicker: 'Module',
    title: 'Toast',
    lede: 'Transient notifications stacked at the viewport corner, fired imperatively. Five tones, an optional action, and auto-dismiss. Wrap the app once in `ToastProvider`, then call `useToast()` from anywhere below.',
    figmaNode: '—',
    spec: [
      { dt: 'Tones', dd: 'neutral · success · error · warning · info' },
      { dt: 'Viewport', dd: 'fixed bottom-right · 400px' },
      { dt: 'API', dd: 'ToastProvider + useToast()' },
    ],
  },
  {
    id: 'tooltip',
    num: '35',
    kicker: 'Component',
    title: 'Tooltip',
    lede: 'A small label revealed on hover or focus, anchored to its trigger with an optional pointer arrow. Inverted surface, configurable open / close delays, and four placements. Supplemental only — never the sole label for a control.',
    figmaNode: '3abda8 (set)',
    spec: [
      { dt: 'Surface', dd: 'surface-strong · inverted text' },
      { dt: 'Placement', dd: 'side · align · offset' },
      { dt: 'Delay', dd: 'open 200ms · close 0ms' },
    ],
  },
  {
    id: 'menu',
    num: '36',
    kicker: 'Module',
    title: 'Menu',
    lede: 'A click-triggered dropdown built on Base UI. The richer sibling of Context menu — groups with labels, checkbox and single-select radio items, nested submenus, and an optional pointer arrow, driven by a recursive items model.',
    figmaNode: '—',
    spec: [
      { dt: 'Items', dd: 'action · checkbox · radio · submenu' },
      { dt: 'Groups', dd: 'label · separator' },
      { dt: 'Scroll', dd: 'maxHeight · keyboard-aware' },
    ],
  },
  {
    id: 'toolbar',
    num: '37',
    kicker: 'Module',
    title: 'Toolbar',
    lede: 'A roving-focus container for grouped controls. Arrow keys move between items while only one stays in the tab order. Buttons, groups, separators, links, and a search input, at two densities.',
    figmaNode: '—',
    spec: [
      { dt: 'Parts', dd: 'button · group · separator · input' },
      { dt: 'Density', dd: 'comfortable · compact' },
      { dt: 'Focus', dd: 'roving · arrow keys' },
    ],
  },
  {
    id: 'scroll-area',
    num: '38',
    kicker: 'Component',
    title: 'Scroll area',
    lede: 'A styled, cross-browser scrollbar for long lists and panels. The thin tokenised thumb auto-hides when idle and appears on hover or scroll, with an always-visible variant.',
    figmaNode: '—',
    spec: [
      { dt: 'Orientation', dd: 'vertical · horizontal · both' },
      { dt: 'Thumb', dd: 'hover · always' },
      { dt: 'Clip', dd: 'maxHeight' },
    ],
  },
  {
    id: 'calendar',
    num: '39',
    kicker: 'Module',
    title: 'Calendar',
    lede: 'A tokenised month grid on react-day-picker. Single, multiple, or range selection with a banded middle and round endpoints, a today ring, multi-month layout, and dropdown captions.',
    figmaNode: '—',
    spec: [
      { dt: 'Modes', dd: 'single · multiple · range' },
      { dt: 'Today', dd: 'ring · never fights selected' },
      { dt: 'Layout', dd: 'numberOfMonths · dropdown caption' },
    ],
  },
  {
    id: 'date-picker',
    num: '40',
    kicker: 'Module',
    title: 'Date picker',
    lede: 'A single-date field that opens a Calendar in a Popover. Controlled or uncontrolled, with min–max bounds, a clear affordance, and full Form/Field binding so it lights up like an Input.',
    figmaNode: '—',
    spec: [
      { dt: 'Trigger', dd: '48px · matches Input' },
      { dt: 'Bounds', dd: 'minDate · maxDate · disabledDates' },
      { dt: 'States', dd: 'default · error · disabled · clearable' },
    ],
  },
]

const SECTION_BY_ID = Object.fromEntries(SECTIONS.map((s) => [s.id, s])) as Record<string, SectionMeta>
const sec = (id: string): SectionMeta => SECTION_BY_ID[id]

function SectionHead({ meta }: { meta: SectionMeta }) {
  return (
    <>
      <div className="section__head">
        <div className="section__num">§{meta.num}</div>
        <div className="section__titles">
          <span className="section__kicker">{meta.kicker}</span>
          <h2 className="section__heading">
            {meta.title}
            {meta.tag && <span className="section__tag">{meta.tag}</span>}
          </h2>
          <p className="section__lede">{meta.lede}</p>
        </div>
      </div>
      {meta.spec && (
        <div className="section__spec">
          <div />
          <dl>
            <div>
              <dt>Figma node</dt>
              <dd>{meta.figmaNode}</dd>
            </div>
            {meta.spec.map((row) => (
              <div key={row.dt}>
                <dt>{row.dt}</dt>
                <dd>{row.dd}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </>
  )
}

function ToastDemo() {
  const toast = useToast()
  return (
    <div className="button-row">
      <Button
        variant="filled"
        onClick={() =>
          toast.add({
            type: 'success',
            title: 'Project verified',
            description: '42,180 t CO₂e is now eligible for issuance.',
          })
        }
      >
        Success
      </Button>
      <Button
        variant="outlined"
        onClick={() =>
          toast.add({
            type: 'warning',
            title: 'Sampling variance is high',
            description: 'Plot 7 deviates from the regional baseline by 18%.',
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="outlined"
        onClick={() =>
          toast.add({
            type: 'error',
            title: 'Audit failed',
            description: 'Two findings require remediation before issuance.',
            actionProps: { children: 'Open findings', onClick: () => {} },
          })
        }
      >
        Error + action
      </Button>
      <Button
        variant="text"
        onClick={() =>
          toast.add({
            type: 'info',
            title: 'Methodology v3.2 published',
            description: 'Existing projects keep v3.1 until their next reissuance window.',
          })
        }
      >
        Info
      </Button>
    </div>
  )
}

function App() {
  const [email, setEmail] = useState('')
  const [search, setSearch] = useState('Iberian rewilding')
  const [bad, setBad] = useState('not-an-email')
  const [terms, setTerms] = useState<CheckboxValue>(false)
  const [marketing, setMarketing] = useState<CheckboxValue>('indeterminate')
  const [card1, setCard1] = useState<CheckboxValue>(true)
  const [plan, setPlan] = useState('annual')
  const [verificationPlan, setVerificationPlan] = useState('basic')
  const [activeNav, setActiveNav] = useState('overview')
  const [activeMobileNav, setActiveMobileNav] = useState('sampling')
  const [activeSidebar, setActiveSidebar] = useState('farm-parcels')
  const [activeMobileSidebar, setActiveMobileSidebar] = useState('overview')
  const [formProjectName, setFormProjectName] = useState('Iberian rewilding pilot')
  const [formProjectCode, setFormProjectCode] = useState('iber-001')
  const [formMethodology, setFormMethodology] = useState('Methodology v3.2')
  const [formPlots, setFormPlots] = useState('12')
  const [formSampleDate, setFormSampleDate] = useState('2026-04-22')
  const [formVerification, setFormVerification] = useState('full')
  const [formTerms, setFormTerms] = useState<CheckboxValue>(false)
  const projectCodeError = !/^OGCR-/.test(formProjectCode)
  const [registry, setRegistry] = useState<string | null>('verra')
  const [methodology, setMethodology] = useState('Soil carbon v3.2')
  const [plotCount, setPlotCount] = useState<number | null>(12)
  const [variance, setVariance] = useState(18)
  const [boldOn, setBoldOn] = useState(false)
  const [notify, setNotify] = useState(true)
  const [ledgerPage, setLedgerPage] = useState(3)
  const [calDate, setCalDate] = useState<Date | undefined>(new Date(2026, 3, 22))
  const [sampleDate, setSampleDate] = useState<Date | undefined>(new Date(2026, 3, 22))

  return (
    <ToastProvider>
    <main className="page">
      <header className="page__hero reveal">
        <div className="page__hero-top">
          <Logo width={129} className="page__hero-logo" />
          <span className="page__kicker">Design System · v0.1 · 2026</span>
        </div>
        <h1 className="page__title">
          Design <span className="page__title-accent">system</span>
        </h1>
        <p className="page__subtitle">
          A working catalogue of every primitive and module shipped by the OGCR
          design system. Each entry reflects the live Figma source, with the
          tokens, dimensions, and node IDs needed to keep code and design in lock-step.
        </p>
        <dl className="page__meta">
          <div>
            <dt>Typeface</dt>
            <dd>Inter — Rasmus Andersson</dd>
          </div>
          <div>
            <dt>Mono</dt>
            <dd>JetBrains Mono</dd>
          </div>
          <div>
            <dt>Surface</dt>
            <dd>#f8f3ef · paper</dd>
          </div>
          <div>
            <dt>Accent</dt>
            <dd>#4f8263 · forest</dd>
          </div>
        </dl>
      </header>

      <div className="layout">
        <div className="specimens">
          <section id="tokens" className="section reveal">
            <SectionHead meta={sec('tokens')} />
            <div className="section__body">
              <div className="tokens">
                <div className="tokens__group">
                  <h3 className="tokens__group-title">Brand & primitives</h3>
                  <ul className="tokens__swatches">
                    {[
                      { name: '--color-brand-blue-300', value: '#3f88c6' },
                      { name: '--color-brand-blue-800', value: '#1c3d59' },
                      { name: '--color-brand-green-500', value: '#6db087' },
                      { name: '--color-red-500', value: '#ef4444' },
                      { name: '--color-red-600', value: '#dc2626' },
                      { name: '--color-orange-400', value: '#fb923c' },
                      { name: '--color-orange-500', value: '#f97316' },
                      { name: '--color-amber-300', value: '#fcd34d' },
                    ].map((t) => (
                      <li key={t.name} className="tokens__swatch">
                        <span className="tokens__chip" style={{ background: t.value }} />
                        <span className="tokens__name">{t.name}</span>
                        <span className="tokens__value">{t.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="tokens__group">
                  <h3 className="tokens__group-title">Surface</h3>
                  <ul className="tokens__swatches">
                    {[
                      { name: '--color-surface-page', value: '#f8f3ef' },
                      { name: '--color-surface-light', value: '#ffffff' },
                      { name: '--color-surface-neutral', value: '#f5f5f4' },
                      { name: '--color-surface-strong', value: '#0f3655' },
                      { name: '--color-surface-inverted', value: '#443321' },
                      { name: '--color-surface-positive', value: '#e2efe6' },
                      { name: '--color-surface-warning', value: '#ffedd5' },
                      { name: '--color-surface-negative', value: '#fee2e2' },
                    ].map((t) => (
                      <li key={t.name} className="tokens__swatch">
                        <span className="tokens__chip" style={{ background: t.value }} />
                        <span className="tokens__name">{t.name}</span>
                        <span className="tokens__value">{t.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="tokens__group">
                  <h3 className="tokens__group-title">Text & icon</h3>
                  <ul className="tokens__swatches">
                    {[
                      { name: '--color-text-primary', value: '#0f3655' },
                      { name: '--color-text-secondary', value: '#6a8196' },
                      { name: '--color-text-neutral', value: '#334155' },
                      { name: '--color-text-positive', value: '#416c51' },
                      { name: '--color-text-negative', value: '#b91c1c' },
                      { name: '--color-text-warning', value: '#c2410c' },
                    ].map((t) => (
                      <li key={t.name} className="tokens__swatch">
                        <span className="tokens__chip" style={{ background: t.value }} />
                        <span className="tokens__name">{t.name}</span>
                        <span className="tokens__value">{t.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="tokens__group">
                  <h3 className="tokens__group-title">Border</h3>
                  <ul className="tokens__swatches">
                    {[
                      { name: '--color-border-light', value: '#e7e5e4' },
                      { name: '--color-border-medium', value: '#d6d3d1' },
                      { name: '--color-border-strong', value: '#a8a29e' },
                      { name: '--color-border-high-contrast', value: '#443321' },
                      { name: '--color-border-positive-light', value: '#c5dfce' },
                      { name: '--color-border-warning-light', value: '#fed7aa' },
                      { name: '--color-border-negative-light', value: '#fecaca' },
                      { name: '--color-border-negative-strong', value: '#dc2626' },
                    ].map((t) => (
                      <li key={t.name} className="tokens__swatch">
                        <span className="tokens__chip" style={{ background: t.value }} />
                        <span className="tokens__name">{t.name}</span>
                        <span className="tokens__value">{t.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="tokens__group">
                  <h3 className="tokens__group-title">Interaction</h3>
                  <ul className="tokens__swatches">
                    {[
                      { name: '--color-interaction-primary-default', value: '#4f8263' },
                      { name: '--color-interaction-primary-hover', value: '#416c51' },
                      { name: '--color-interaction-primary-active', value: '#416c51' },
                      { name: '--color-interaction-primary-focus', value: '#e2efe6' },
                      { name: '--color-interaction-secondary-focus', value: '#e2d0bf' },
                      { name: '--color-focus-ring-error', value: '#fecaca' },
                    ].map((t) => (
                      <li key={t.name} className="tokens__swatch">
                        <span className="tokens__chip" style={{ background: t.value }} />
                        <span className="tokens__name">{t.name}</span>
                        <span className="tokens__value">{t.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="tokens__group">
                  <h3 className="tokens__group-title">Typography</h3>
                  <ul className="tokens__type">
                    {[
                      { name: 'text-h1', size: '32 → 40px', cls: 'text-h1' },
                      { name: 'text-h2', size: '24 → 32px', cls: 'text-h2' },
                      { name: 'text-h3', size: '20 → 24px', cls: 'text-h3' },
                      { name: 'text-h4', size: '18 → 20px', cls: 'text-h4' },
                      { name: 'text-body', size: '18 → 20px', cls: 'text-body' },
                      { name: 'text-body-l', size: '20 → 24px', cls: 'text-body-l' },
                      { name: 'text-body-s', size: '14 → 18px', cls: 'text-body-s' },
                      { name: 'text-lead', size: '20 → 24px', cls: 'text-lead' },
                      { name: 'text-quote', size: '24 → 32px · italic', cls: 'text-quote' },
                      { name: 'text-label-button', size: '14 → 18px', cls: 'text-label-button' },
                      { name: 'text-label-navigation', size: '14 → 18px', cls: 'text-label-navigation' },
                      { name: 'text-label-input', size: '14px', cls: 'text-label-input' },
                    ].map((t) => (
                      <li key={t.name} className="tokens__type-row">
                        <div className="tokens__type-meta">
                          <span className="tokens__name">.{t.name}</span>
                          <span className="tokens__value">{t.size}</span>
                        </div>
                        <span className={`tokens__type-sample ${t.cls}`}>The quick brown fox</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="tokens__group">
                  <h3 className="tokens__group-title">Spacing</h3>
                  <ul className="tokens__scale">
                    {[
                      { name: '--spacing-4', value: '4px', px: 4 },
                      { name: '--spacing-8', value: '8px', px: 8 },
                      { name: '--spacing-12', value: '12px', px: 12 },
                      { name: '--spacing-16', value: '16px', px: 16 },
                      { name: '--spacing-24', value: '24px', px: 24 },
                      { name: '--spacing-32', value: '32px', px: 32 },
                      { name: '--spacing-64', value: '64px', px: 64 },
                    ].map((t) => (
                      <li key={t.name} className="tokens__scale-row">
                        <span className="tokens__name">{t.name}</span>
                        <span
                          className="tokens__bar"
                          style={{ width: t.px }}
                          aria-hidden="true"
                        />
                        <span className="tokens__value">{t.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="tokens__group">
                  <h3 className="tokens__group-title">Radius</h3>
                  <ul className="tokens__radii">
                    {[
                      { name: '--radius-2', value: '2px', px: 2 },
                      { name: '--radius-4', value: '4px', px: 4 },
                      { name: '--radius-8', value: '8px', px: 8 },
                      { name: '--radius-12', value: '12px', px: 12 },
                      { name: '--radius-16', value: '16px', px: 16 },
                      { name: '--radius-full', value: '999px', px: 32 },
                    ].map((t) => (
                      <li key={t.name} className="tokens__radius-cell">
                        <span
                          className="tokens__radius-shape"
                          style={{ borderRadius: t.px }}
                          aria-hidden="true"
                        />
                        <span className="tokens__name">{t.name}</span>
                        <span className="tokens__value">{t.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="tokens__group">
                  <h3 className="tokens__group-title">Elevation & motion</h3>
                  <div className="tokens__misc">
                    <div className="tokens__elevation">
                      <span className="tokens__elevation-card" aria-hidden="true" />
                      <span className="tokens__name">--elevation-l</span>
                      <span className="tokens__value">card · 0 8 16 rgba(68,51,33,.16)</span>
                    </div>
                    <div className="tokens__motion">
                      <span className="tokens__name">--motion-fast</span>
                      <span className="tokens__value">150ms ease-out</span>
                    </div>
                    <div className="tokens__motion">
                      <span className="tokens__name">--motion-base</span>
                      <span className="tokens__value">200ms cubic-bezier(.2,0,0,1)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="navigation" className="section reveal">
            <SectionHead meta={sec('navigation')} />
            <div className="section__body">
              <div className="nav-stack">
                <div className="nav-chrome">
                  <Navigation
                    items={NAV_ITEMS}
                    activeId={activeNav}
                    onSelect={setActiveNav}
                    product="Operator platform"
                    trailing={
                      <button type="button" className="nav-bell" aria-label="Notifications">
                        <BellIcon />
                      </button>
                    }
                  />
                  <div className="nav-chrome__viewport">
                    <div className="nav-chrome__viewport-content">
                      the {activeNav} workspace lives here.
                    </div>
                  </div>
                </div>
                <div className="nav-mobile-frame">
                  <div className="nav-mobile-frame__viewport">
                    the {activeMobileNav} workspace lives here.
                  </div>
                  <Navigation
                    layout="mobile"
                    items={NAV_ITEMS}
                    activeId={activeMobileNav}
                    onSelect={setActiveMobileNav}
                  />
                </div>
              </div>
            </div>
          </section>

          <section id="sidebar" className="section reveal">
            <SectionHead meta={sec('sidebar')} />
            <div className="section__body">
              <div className="nav-stack">
                <div className="sidebar-chrome">
                  <SideNavigation
                    items={SIDEBAR_ITEMS}
                    activeId={activeSidebar}
                    onSelect={setActiveSidebar}
                    product="Operator platform"
                    user={{ name: 'Camila Rojas', role: 'Reviewer · OGCR', initials: 'CR' }}
                  />
                  <div className="sidebar-chrome__viewport">
                    <div className="sidebar-chrome__viewport-content">
                      the {activeSidebar} workspace lives here.
                    </div>
                  </div>
                </div>
                <div className="nav-mobile-frame">
                  <SideNavigation
                    layout="mobile"
                    items={SIDEBAR_ITEMS}
                    activeId={activeMobileSidebar}
                    onSelect={setActiveMobileSidebar}
                    product="Operator platform"
                    user={{ name: 'Camila Rojas', role: 'Reviewer · OGCR', initials: 'CR' }}
                  />
                  <div className="nav-mobile-frame__viewport">
                    the {activeMobileSidebar} workspace lives here.
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="kpi" className="section reveal">
            <SectionHead meta={sec('kpi')} />
            <div className="section__body">
              <div className="specimen-stack specimen-stack--narrow">
                <Kpi
                  label="Total credits issued"
                  value="694,820 t"
                  secondaryText="Year to date"
                  status={{ label: 'On track', tone: 'positive' }}
                  tone="positive"
                />
                <Kpi
                  label="Pending validations"
                  value="14"
                  secondaryText="3 due this week"
                  status={{ label: 'Attention', tone: 'warning' }}
                  tone="warning"
                />
                <Kpi
                  label="Failed audits"
                  value="2"
                  secondaryText="Reopened by reviewer"
                  status={{ label: 'Action needed', tone: 'negative' }}
                  tone="negative"
                />
                <Kpi
                  label="Active projects"
                  value="38"
                  secondaryText="Across 12 jurisdictions"
                  tone="neutral"
                />
              </div>
            </div>
          </section>

          <section id="buttons" className="section reveal">
            <SectionHead meta={sec('buttons')} />
            <div className="section__body">
              <div className="button-row">
                <Button variant="filled">Primary action</Button>
                <Button variant="filled" iconRight={<ArrowRightIcon />}>Continue</Button>
                <Button variant="outlined">Secondary</Button>
                <Button variant="outlined" iconLeft={<SearchIcon />}>Search</Button>
                <Button variant="text">Tertiary</Button>
                <Button variant="filled" disabled>Disabled</Button>
              </div>
            </div>
          </section>

          <section id="inputs" className="section reveal">
            <SectionHead meta={sec('inputs')} />
            <div className="section__body">
              <div className="specimen-stack specimen-stack--narrow">
                <Input
                  label="Email address"
                  placeholder="you@example.com"
                  iconLeft={<MailIcon />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  helperText="We'll never share your email."
                />
                <Input
                  label="Search"
                  placeholder="Search projects"
                  iconLeft={<SearchIcon />}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Input
                  label="Email address"
                  value={bad}
                  onChange={(e) => setBad(e.target.value)}
                  error
                  helperText="Enter a valid email address."
                />
              </div>
            </div>
          </section>

          <section id="cards" className="section reveal">
            <SectionHead meta={sec('cards')} />
            <div className="section__body">
              <div className="specimen-stack">
                <Card
                  title="Carbon credits issued"
                  subtitle="Quarterly summary"
                  trailing={<Pill tone="positive">+ 12.4%</Pill>}
                >
                  <div className="kv-list">
                    <div className="kv-row">
                      <span className="kv-row__key">This quarter</span>
                      <span className="kv-row__value">182,540 t CO₂e</span>
                    </div>
                    <div className="kv-row">
                      <span className="kv-row__key">Last quarter</span>
                      <span className="kv-row__value">162,310 t CO₂e</span>
                    </div>
                    <div className="kv-row">
                      <span className="kv-row__key">YTD</span>
                      <span className="kv-row__value">694,820 t CO₂e</span>
                    </div>
                  </div>
                </Card>
                <Card title="Sign in" subtitle="Use your work account" floating>
                  <div className="form-stack">
                    <Input label="Email address" placeholder="you@example.com" iconLeft={<MailIcon />} />
                    <Input label="Password" type="password" placeholder="••••••••" />
                    <div className="form-actions">
                      <Button variant="text">Forgot password?</Button>
                      <Button variant="filled">Sign in</Button>
                    </div>
                  </div>
                </Card>
                <Card
                  title="Project status"
                  subtitle="Mossy Earth – Iberian rewilding"
                  trailing={<Pill tone="warning">Pending review</Pill>}
                >
                  <p className="text-body-s card__paragraph">
                    Methodology validation in progress. Estimated decision in 8 days.
                  </p>
                  <div className="form-actions">
                    <Button variant="outlined">View details</Button>
                    <Button variant="filled" iconRight={<ArrowRightIcon />}>Open project</Button>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          <section id="context-menu" className="section reveal">
            <SectionHead meta={sec('context-menu')} />
            <div className="section__body">
              <div className="specimen-stack" style={{ gap: 16 }}>
                <ContextMenu
                  trigger={
                    <Button variant="outlined" iconLeft={<DotsThreeIcon />}>
                      Project actions
                    </Button>
                  }
                  header="Project actions"
                  status="3 selected"
                  items={[
                    { id: 'open', label: 'Open project', icon: <FolderIcon /> },
                    { id: 'export', label: 'Export sampling data', icon: <ChartBarIcon /> },
                    { id: 'invite', label: 'Invite reviewer', icon: <UserIcon /> },
                    { id: 'archive', label: 'Archive', icon: <DotsThreeIcon />, destructive: true },
                  ]}
                />
                <ContextMenu
                  trigger={<Button variant="text">More</Button>}
                  items={[
                    { id: 'rename', label: 'Rename' },
                    { id: 'duplicate', label: 'Duplicate' },
                    { id: 'share', label: 'Share' },
                    { id: 'remove', label: 'Remove from list', destructive: true },
                  ]}
                />
              </div>
            </div>
          </section>

          <section id="sidesheet" className="section reveal">
            <SectionHead meta={sec('sidesheet')} />
            <div className="section__body">
              <Sidesheet
                trigger={<Button>Open sidesheet</Button>}
                navLabel="All projects"
                title="Iberian rewilding"
                status="In review"
                primaryAction={{ label: 'Confirm' }}
                secondaryAction={{ label: 'Cancel' }}
              >
                <Input label="Project ID" value="OGCR-IBER-001" readOnly />
                <Input label="Reviewer" value="Camila Rojas" readOnly />
                <p className="text-body-s card__paragraph">
                  Methodology v3.2 with field sampling at 12 plots. Reviewer flagged two
                  variance issues that need clarification before issuance.
                </p>
                <div className="kv-list">
                  <div className="kv-row">
                    <span className="kv-row__key">Estimated credits</span>
                    <span className="kv-row__value">42,180 t CO₂e</span>
                  </div>
                  <div className="kv-row">
                    <span className="kv-row__key">Decision due</span>
                    <span className="kv-row__value">May 7, 2026</span>
                  </div>
                </div>
              </Sidesheet>
            </div>
          </section>

          <section id="messages" className="section reveal">
            <SectionHead meta={sec('messages')} />
            <div className="section__body">
              <div className="specimen-stack">
                <Message
                  state="neutral"
                  title="Methodology v3.2 published"
                  description="Existing projects retain v3.1 until their next reissuance window."
                  actionLabel="Read changelog"
                />
                <Message
                  state="success"
                  title="Project verified"
                  description="42,180 t CO₂e is now eligible for issuance."
                  actionLabel="View certificate"
                />
                <Message
                  state="warning"
                  title="Sampling variance is high"
                  description="Plot 7 deviates from the regional baseline by 18%."
                  actionLabel="Inspect"
                />
                <Message
                  state="error"
                  title="Audit failed"
                  description="Two findings require remediation before issuance can resume."
                  actionLabel="Open findings"
                />
                <Message
                  state="success"
                  type="floating"
                  title="Saved as draft"
                  description="Your edits will be available when you return."
                  onDismiss={() => {}}
                />
              </div>
            </div>
          </section>

          <section id="progress" className="section reveal">
            <SectionHead meta={sec('progress')} />
            <div className="section__body">
              <div className="specimen-stack specimen-stack--narrow">
                <ProgressBar label="Methodology validation" value={32} />
                <ProgressBar label="Sampling complete" value={64} tone="blue" />
                <ProgressBar label="Reviewer escalations" value={88} tone="orange" />
                <ProgressBar label="Archive sweep" value={100} tone="neutral" />
              </div>
            </div>
          </section>

          <section id="checkbox" className="section reveal">
            <SectionHead meta={sec('checkbox')} />
            <div className="section__body">
              <div className="specimen-stack">
                <Checkbox
                  label="I agree to the terms of service"
                  checked={terms}
                  onChange={(v) => setTerms(v)}
                />
                <Checkbox
                  label="Receive marketing emails"
                  checked={marketing}
                  onChange={(v) => setMarketing(v)}
                />
                <Checkbox label="Disabled option" checked disabled />
                <Checkbox label="Required field" error />
                <Checkbox
                  layout="border-left"
                  label="Verified registry"
                  secondaryText="Manual review by an OGCR analyst"
                  checked={card1}
                  onChange={(v) => setCard1(v)}
                />
                <Checkbox
                  layout="border-left"
                  label="Self-attested"
                  secondaryText="Project owner provides documentation only"
                  checked={card1 === true ? false : true}
                  onChange={(v) => setCard1(v)}
                />
              </div>
            </div>
          </section>

          <section id="radio" className="section reveal">
            <SectionHead meta={sec('radio')} />
            <div className="section__body">
              <div className="specimen-stack">
                <RadioGroup
                  aria-label="Plan"
                  value={plan}
                  onValueChange={(v) => setPlan(v as 'monthly' | 'annual')}
                >
                  <Radio value="monthly" label="Monthly" />
                  <Radio value="annual" label="Annual" />
                  <Radio value="custom" label="Custom" disabled />
                </RadioGroup>
                <RadioGroup
                  aria-label="Verification"
                  value={verificationPlan}
                  onValueChange={(v) => setVerificationPlan(v as 'basic' | 'full')}
                >
                  <Radio
                    layout="border-left"
                    value="basic"
                    label="Basic verification"
                    secondaryText="Document review only"
                  />
                  <Radio
                    layout="border-left"
                    value="full"
                    label="Full audit"
                    secondaryText="Field visit + sampling"
                  />
                </RadioGroup>
              </div>
            </div>
          </section>

          <section id="form" className="section reveal">
            <SectionHead meta={sec('form')} />
            <div className="section__body">
              <div className="specimen-form">
                <Form noValidate onSubmit={(e) => e.preventDefault()}>
                  <FormSection
                    step="I"
                    title="Project"
                    description="Identify the project being submitted for verification."
                  >
                    <FormRow>
                      <Input
                        label="Project name"
                        value={formProjectName}
                        onChange={(e) => setFormProjectName(e.target.value)}
                        placeholder="e.g. Iberian rewilding pilot"
                      />
                      <Input
                        label="Project code"
                        value={formProjectCode}
                        onChange={(e) => setFormProjectCode(e.target.value)}
                        error={projectCodeError}
                        helperText={
                          projectCodeError
                            ? 'Code must begin with OGCR-'
                            : 'Issued by the registry on intake.'
                        }
                      />
                    </FormRow>
                    <Input
                      label="Methodology"
                      value={formMethodology}
                      onChange={(e) => setFormMethodology(e.target.value)}
                      iconLeft={<FlaskIcon />}
                      helperText="Versioned methodology used for this issuance."
                    />
                  </FormSection>

                  <FormSection
                    step="II"
                    title="Sampling"
                    description="Field measurements that back the issuance request."
                  >
                    <FormRow>
                      <Input
                        label="Plot count"
                        type="number"
                        value={formPlots}
                        onChange={(e) => setFormPlots(e.target.value)}
                      />
                      <Input
                        label="Sampling date"
                        type="date"
                        value={formSampleDate}
                        onChange={(e) => setFormSampleDate(e.target.value)}
                      />
                    </FormRow>
                  </FormSection>

                  <FormSection
                    step="III"
                    title="Verification"
                    description="Reviewer level required for this submission."
                  >
                    <FormFieldset legend="Verification level" required inline>
                      <RadioGroup
                        aria-label="Verification level"
                        className="flex flex-row gap-12"
                        name="form-verify"
                        value={formVerification}
                        onValueChange={(v) => setFormVerification(v as 'basic' | 'full')}
                      >
                        <Radio
                          layout="border-left"
                          value="basic"
                          label="Basic verification"
                          secondaryText="Document review only"
                        />
                        <Radio
                          layout="border-left"
                          value="full"
                          label="Full audit"
                          secondaryText="Field visit and sampling"
                        />
                      </RadioGroup>
                    </FormFieldset>
                  </FormSection>

                  <FormSection
                    step="IV"
                    title="Confirm"
                    description="Acknowledge before submitting for review."
                  >
                    <Checkbox
                      label="I confirm that the data above is accurate and complete."
                      checked={formTerms}
                      onChange={(v) => setFormTerms(v)}
                    />
                  </FormSection>

                  <FormFooter note="Required fields are marked *">
                    <Button variant="filled" type="submit" iconRight={<ArrowRightIcon />}>
                      Submit for review
                    </Button>
                    <Button variant="outlined" type="button">Save draft</Button>
                    <Button variant="text" type="button">Cancel</Button>
                  </FormFooter>
                </Form>
              </div>
            </div>
          </section>

          <section id="table" className="section reveal">
            <SectionHead meta={sec('table')} />
            <div className="section__body">
              <div className="specimen-table">
                <DataTable
                  caption="Issuance ledger · last 30 days"
                  columns={issuanceColumns}
                  data={ISSUANCES}
                  initialSorting={[{ id: 'updated', desc: true }]}
                />
              </div>
            </div>
          </section>

          <section id="avatar" className="section reveal">
            <SectionHead meta={sec('avatar')} />
            <div className="section__body">
              <div className="button-row">
                <Avatar size="xs" name="Camila Rojas" />
                <Avatar size="s" name="Diego Marín" />
                <Avatar size="m" name="Iberian Rewilding" />
                <Avatar size="l" shape="square" name="Mossy Earth" />
                <Avatar size="xl" src="https://i.pravatar.cc/96?img=12" name="Reviewer" />
              </div>
            </div>
          </section>

          <section id="select" className="section reveal">
            <SectionHead meta={sec('select')} />
            <div className="section__body">
              <div className="specimen-stack specimen-stack--narrow">
                <Select
                  aria-label="Registry"
                  value={registry}
                  onValueChange={setRegistry}
                  options={[
                    { value: 'verra', label: 'Verra (VCS)' },
                    { value: 'gold', label: 'Gold Standard' },
                    { value: 'puro', label: 'Puro.earth' },
                    { value: 'isometric', label: 'Isometric' },
                    { value: 'legacy', label: 'Legacy registry', disabled: true },
                  ]}
                />
                <Select
                  aria-label="Methodology"
                  placeholder="Select methodology"
                  options={[
                    { value: 'soil', label: 'Soil carbon v3.2' },
                    { value: 'forest', label: 'Afforestation v2.8' },
                    { value: 'blue', label: 'Blue carbon v3.1' },
                  ]}
                />
                <Select
                  aria-label="Required registry"
                  error
                  placeholder="Selection required"
                  options={[{ value: 'a', label: 'Option A' }]}
                />
                <Select
                  aria-label="Disabled registry"
                  disabled
                  placeholder="Unavailable"
                  options={[{ value: 'a', label: 'Option A' }]}
                />
              </div>
            </div>
          </section>

          <section id="combobox" className="section reveal">
            <SectionHead meta={sec('combobox')} />
            <div className="section__body">
              <div className="specimen-stack specimen-stack--narrow">
                <Combobox
                  value={methodology}
                  onValueChange={setMethodology}
                  placeholder="Search methodologies…"
                  items={[
                    'Soil carbon v3.2',
                    'Afforestation v2.8',
                    'Blue carbon v3.1',
                    'Biochar v1.4',
                    'Enhanced weathering v2.0',
                    'Peatland restoration v3.0',
                  ]}
                />
              </div>
            </div>
          </section>

          <section id="number-field" className="section reveal">
            <SectionHead meta={sec('number-field')} />
            <div className="section__body">
              <div className="specimen-stack specimen-stack--narrow">
                <NumberField
                  label="Plot count"
                  value={plotCount}
                  onValueChange={setPlotCount}
                  min={0}
                  max={99}
                />
                <NumberField
                  label="Sampling radius (m)"
                  defaultValue={25}
                  step={5}
                  min={0}
                  helperText="Snaps to 5-metre increments."
                />
                <NumberField
                  label="Estimated credits"
                  defaultValue={42180}
                  helperText="Tonnes CO₂e."
                />
                <NumberField label="Locked" defaultValue={12} disabled />
              </div>
            </div>
          </section>

          <section id="slider" className="section reveal">
            <SectionHead meta={sec('slider')} />
            <div className="section__body">
              <div className="specimen-stack specimen-stack--narrow">
                <Slider
                  label="Sampling variance"
                  value={variance}
                  onValueChange={setVariance}
                  showValue
                  max={100}
                />
                <Slider label="Confidence threshold" defaultValue={80} showValue />
                <Slider label="Out of tolerance" defaultValue={64} showValue error />
                <Slider label="Locked" defaultValue={40} disabled />
              </div>
            </div>
          </section>

          <section id="toggle" className="section reveal">
            <SectionHead meta={sec('toggle')} />
            <div className="section__body">
              <div className="specimen-stack" style={{ gap: 16 }}>
                <div className="button-row">
                  <Toggle aria-label="Bold" pressed={boldOn} onPressedChange={setBoldOn}>
                    Bold
                  </Toggle>
                  <Toggle aria-label="Grid view">
                    <SquaresFourIcon />
                  </Toggle>
                  <Toggle aria-label="Disabled" disabled>
                    Disabled
                  </Toggle>
                </div>
                <ToggleGroup
                  aria-label="View"
                  defaultValue={['grid']}
                  items={[
                    { value: 'grid', label: 'Grid', icon: <SquaresFourIcon /> },
                    { value: 'chart', label: 'Chart', icon: <ChartBarIcon /> },
                    { value: 'files', label: 'Files', icon: <FolderIcon /> },
                  ]}
                />
              </div>
            </div>
          </section>

          <section id="switch" className="section reveal">
            <SectionHead meta={sec('switch')} />
            <div className="section__body">
              <div className="specimen-stack">
                <Switch
                  label="Email notifications"
                  secondaryText="Sent when a review status changes"
                  checked={notify}
                  onCheckedChange={setNotify}
                />
                <Switch label="Auto-publish methodology updates" />
                <Switch label="Locked on" checked disabled />
                <Switch
                  label="Requires attention"
                  secondaryText="Toggle to acknowledge"
                  error
                />
              </div>
            </div>
          </section>

          <section id="tabs" className="section reveal">
            <SectionHead meta={sec('tabs')} />
            <div className="section__body">
              <Tabs
                defaultValue="overview"
                items={[
                  {
                    value: 'overview',
                    label: 'Overview',
                    icon: <SquaresFourIcon />,
                    content: (
                      <p className="text-body-s card__paragraph">
                        Project summary, current status, and key decision dates.
                      </p>
                    ),
                  },
                  {
                    value: 'sampling',
                    label: 'Sampling',
                    icon: <FlaskIcon />,
                    content: (
                      <p className="text-body-s card__paragraph">
                        Field measurements collected across 12 plots.
                      </p>
                    ),
                  },
                  {
                    value: 'audit',
                    label: 'Audit',
                    icon: <ChartBarIcon />,
                    content: (
                      <p className="text-body-s card__paragraph">
                        Reviewer findings and the remediation log.
                      </p>
                    ),
                  },
                  {
                    value: 'archive',
                    label: 'Archive',
                    disabled: true,
                    content: (
                      <p className="text-body-s card__paragraph">Read-only historical records.</p>
                    ),
                  },
                ]}
              />
            </div>
          </section>

          <section id="accordion" className="section reveal">
            <SectionHead meta={sec('accordion')} />
            <div className="section__body">
              <div className="specimen-stack--narrow">
                <Accordion
                  defaultValue={['methodology']}
                  items={[
                    {
                      value: 'methodology',
                      title: 'What methodology applies?',
                      content:
                        'Soil carbon v3.2 governs sampling cadence, plot density, and the baseline model used for this issuance.',
                    },
                    {
                      value: 'sampling',
                      title: 'How is sampling verified?',
                      content:
                        'An OGCR analyst cross-checks field measurements against the regional baseline and flags variance above 15%.',
                    },
                    {
                      value: 'timeline',
                      title: 'What is the decision timeline?',
                      content:
                        'Most reviews resolve within 8 business days of a complete submission.',
                    },
                    {
                      value: 'disabled',
                      title: 'Unavailable section',
                      content: 'Not yet published.',
                      disabled: true,
                    },
                  ]}
                />
              </div>
            </div>
          </section>

          <section id="collapsible" className="section reveal">
            <SectionHead meta={sec('collapsible')} />
            <div className="section__body">
              <div className="specimen-stack--narrow">
                <Collapsible trigger="Advanced sampling parameters" defaultOpen>
                  <div className="kv-list">
                    <div className="kv-row">
                      <span className="kv-row__key">Plot density</span>
                      <span className="kv-row__value">1 per 4 ha</span>
                    </div>
                    <div className="kv-row">
                      <span className="kv-row__key">Core depth</span>
                      <span className="kv-row__value">30 cm</span>
                    </div>
                    <div className="kv-row">
                      <span className="kv-row__key">Replicates</span>
                      <span className="kv-row__value">3 per plot</span>
                    </div>
                  </div>
                </Collapsible>
              </div>
            </div>
          </section>

          <section id="breadcrumb" className="section reveal">
            <SectionHead meta={sec('breadcrumb')} />
            <div className="section__body">
              <Breadcrumb
                items={[
                  { label: 'Projects', href: '#' },
                  { label: 'Iberian rewilding', href: '#' },
                  { label: 'Sampling', href: '#' },
                  { label: 'Plot 7' },
                ]}
              />
            </div>
          </section>

          <section id="pagination" className="section reveal">
            <SectionHead meta={sec('pagination')} />
            <div className="section__body">
              <Pagination page={ledgerPage} pageCount={12} onPageChange={setLedgerPage} />
            </div>
          </section>

          <section id="separator" className="section reveal">
            <SectionHead meta={sec('separator')} />
            <div className="section__body">
              <div className="specimen-stack specimen-stack--narrow">
                <p className="text-body-s card__paragraph">Issuance summary</p>
                <Separator />
                <p className="text-body-s card__paragraph">Reviewer notes</p>
                <Separator label="then" />
                <div className="button-row" style={{ alignItems: 'center', height: 40 }}>
                  <span className="text-body-s">Draft</span>
                  <Separator orientation="vertical" />
                  <span className="text-body-s">In review</span>
                  <Separator orientation="vertical" />
                  <span className="text-body-s">Issued</span>
                </div>
              </div>
            </div>
          </section>

          <section id="popover" className="section reveal">
            <SectionHead meta={sec('popover')} />
            <div className="section__body">
              <div className="button-row">
                <Popover
                  trigger={
                    <Button variant="outlined" iconLeft={<InfoIcon />}>
                      What&apos;s this?
                    </Button>
                  }
                  title="Methodology v3.2"
                  description="Governs sampling cadence and the baseline model. Existing projects keep v3.1 until their next reissuance window."
                />
                <Popover
                  showArrow
                  trigger={<Button variant="text">With arrow</Button>}
                  title="Heads up"
                  description="This popover points back at its trigger."
                />
              </div>
            </div>
          </section>

          <section id="dialog" className="section reveal">
            <SectionHead meta={sec('dialog')} />
            <div className="section__body">
              <div className="button-row">
                <Dialog
                  trigger={<Button variant="filled">Open dialog</Button>}
                  title="Submit for review"
                  description="The reviewer will be notified once you submit."
                  primaryAction={{ label: 'Submit' }}
                  secondaryAction={{ label: 'Cancel' }}
                >
                  <p style={{ margin: 0 }}>
                    Methodology v3.2 · 12 plots · 42,180 t CO₂e estimated. You can keep editing
                    after submission until a reviewer is assigned.
                  </p>
                </Dialog>
              </div>
            </div>
          </section>

          <section id="alert-dialog" className="section reveal">
            <SectionHead meta={sec('alert-dialog')} />
            <div className="section__body">
              <div className="button-row">
                <AlertDialog
                  trigger={<Button variant="outlined">Archive project</Button>}
                  title="Archive this project?"
                  description="It moves to the archive and stops accruing credits. You can restore it within 30 days."
                  confirmLabel="Archive"
                />
                <AlertDialog
                  tone="danger"
                  trigger={<Button variant="outlined">Delete issuance</Button>}
                  title="Delete this issuance?"
                  description="This permanently removes the issuance record and its sampling data. This cannot be undone."
                  confirmLabel="Delete"
                />
              </div>
            </div>
          </section>

          <section id="skeleton" className="section reveal">
            <SectionHead meta={sec('skeleton')} />
            <div className="section__body">
              <div className="specimen-stack specimen-stack--narrow">
                <div className="button-row" style={{ alignItems: 'center' }}>
                  <Skeleton variant="circular" width={48} height={48} />
                  <div style={{ flex: 1 }}>
                    <Skeleton variant="text" lines={2} />
                  </div>
                </div>
                <Skeleton variant="rectangular" height={120} />
                <Skeleton variant="text" width="40%" />
              </div>
            </div>
          </section>

          <section id="textarea" className="section reveal">
            <SectionHead meta={sec('textarea')} />
            <div className="section__body">
              <div className="specimen-stack specimen-stack--narrow">
                <Textarea
                  label="Reviewer notes"
                  placeholder="Summarise the variance findings…"
                  defaultValue="Plot 7 deviates from the regional baseline by 18%. Recommend a second core sample before issuance."
                  helperText="Shared with the project owner once submitted."
                />
                <Textarea
                  label="Remediation summary"
                  placeholder="Describe the corrective action…"
                  rows={3}
                  errorText="A remediation summary is required before review can resume."
                />
                <Textarea
                  label="Locked note"
                  defaultValue="Archived — read only."
                  resize="none"
                  disabled
                />
              </div>
            </div>
          </section>

          <section id="toast" className="section reveal">
            <SectionHead meta={sec('toast')} />
            <div className="section__body">
              <ToastDemo />
            </div>
          </section>

          <section id="tooltip" className="section reveal">
            <SectionHead meta={sec('tooltip')} />
            <div className="section__body">
              <div className="button-row">
                <Tooltip
                  trigger={
                    <Button variant="outlined" iconLeft={<InfoIcon />}>
                      Methodology
                    </Button>
                  }
                >
                  v3.2 governs sampling cadence and the baseline model.
                </Tooltip>
                <Tooltip
                  side="right"
                  trigger={
                    <button type="button" className="nav-bell" aria-label="Notifications">
                      <BellIcon />
                    </button>
                  }
                >
                  3 reviews awaiting your sign-off
                </Tooltip>
                <Tooltip
                  side="bottom"
                  showArrow={false}
                  trigger={<Button variant="text">No arrow</Button>}
                >
                  A plain tooltip without the pointer.
                </Tooltip>
              </div>
            </div>
          </section>

          <section id="menu" className="section reveal">
            <SectionHead meta={sec('menu')} />
            <div className="section__body">
              <div className="button-row">
                <Menu
                  trigger={
                    <Button variant="outlined" iconLeft={<DotsThreeIcon />}>
                      Project menu
                    </Button>
                  }
                  items={[
                    {
                      type: 'group',
                      id: 'view',
                      label: 'View',
                      items: [
                        { id: 'overview', label: 'Overview', icon: <SquaresFourIcon />, shortcut: '⌘1' },
                        { id: 'sampling', label: 'Sampling', icon: <FlaskIcon />, shortcut: '⌘2' },
                      ],
                    },
                    { type: 'separator', id: 'sep-1' },
                    { type: 'checkbox', id: 'flagged', label: 'Show flagged only', defaultChecked: true },
                    {
                      type: 'radio-group',
                      id: 'sort',
                      defaultValue: 'updated',
                      options: [
                        { value: 'updated', label: 'Sort by updated' },
                        { value: 'credits', label: 'Sort by credits' },
                      ],
                    },
                    { type: 'separator', id: 'sep-2' },
                    {
                      type: 'submenu',
                      id: 'export',
                      label: 'Export as',
                      icon: <ChartBarIcon />,
                      items: [
                        { id: 'csv', label: 'CSV' },
                        { id: 'json', label: 'JSON' },
                      ],
                    },
                    { id: 'archive', label: 'Archive project', destructive: true },
                  ]}
                />
                <Menu
                  showArrow
                  trigger={<Button variant="text">More</Button>}
                  items={[
                    { id: 'rename', label: 'Rename', icon: <FolderIcon /> },
                    { id: 'invite', label: 'Invite reviewer', icon: <UserIcon /> },
                    { type: 'separator', id: 'sep' },
                    { id: 'remove', label: 'Remove from list', destructive: true },
                  ]}
                />
              </div>
            </div>
          </section>

          <section id="toolbar" className="section reveal">
            <SectionHead meta={sec('toolbar')} />
            <div className="section__body">
              <div className="specimen-stack" style={{ gap: 16 }}>
                <Toolbar aria-label="Project toolbar">
                  <ToolbarGroup>
                    <ToolbarButton aria-label="Grid view">
                      <SquaresFourIcon />
                    </ToolbarButton>
                    <ToolbarButton aria-label="Chart view">
                      <ChartBarIcon />
                    </ToolbarButton>
                    <ToolbarButton aria-label="Files view">
                      <FolderIcon />
                    </ToolbarButton>
                  </ToolbarGroup>
                  <ToolbarSeparator />
                  <ToolbarInput
                    aria-label="Filter projects"
                    placeholder="Filter projects…"
                    className="flex-1"
                  />
                  <ToolbarSeparator />
                  <ToolbarButton>Export</ToolbarButton>
                </Toolbar>
                <Toolbar aria-label="Compact toolbar" density="compact">
                  <ToolbarButton aria-label="Overview">
                    <SquaresFourIcon />
                  </ToolbarButton>
                  <ToolbarButton aria-label="Sampling">
                    <FlaskIcon />
                  </ToolbarButton>
                  <ToolbarSeparator />
                  <ToolbarButton aria-label="Settings">
                    <GearIcon />
                  </ToolbarButton>
                </Toolbar>
              </div>
            </div>
          </section>

          <section id="scroll-area" className="section reveal">
            <SectionHead meta={sec('scroll-area')} />
            <div className="section__body">
              <div className="specimen-stack specimen-stack--narrow">
                <ScrollArea
                  maxHeight={200}
                  className="border border-border-light rounded-12 bg-surface-light"
                  viewportClassName="p-16"
                >
                  <div className="kv-list">
                    {ISSUANCES.concat(ISSUANCES).map((row, i) => (
                      <div key={`${row.project}-${i}`} className="kv-row">
                        <span className="kv-row__key">{row.project}</span>
                        <span className="kv-row__value">
                          {row.credits.toLocaleString('en-US')} t
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </section>

          <section id="calendar" className="section reveal">
            <SectionHead meta={sec('calendar')} />
            <div className="section__body">
              <div className="button-row" style={{ alignItems: 'flex-start' }}>
                <Calendar
                  mode="single"
                  selected={calDate}
                  onSelect={setCalDate}
                  defaultMonth={new Date(2026, 3, 1)}
                  className="border border-border-light rounded-16 shadow-elevation-l"
                />
              </div>
            </div>
          </section>

          <section id="date-picker" className="section reveal">
            <SectionHead meta={sec('date-picker')} />
            <div className="section__body">
              <div className="specimen-stack specimen-stack--narrow">
                <DatePicker
                  value={sampleDate}
                  onChange={setSampleDate}
                  clearable
                  formatOptions={{ year: 'numeric', month: 'long', day: 'numeric' }}
                />
                <DatePicker placeholder="Sampling date" />
                <DatePicker error placeholder="Date required" />
                <DatePicker defaultValue={new Date(2026, 3, 22)} disabled />
              </div>
            </div>
          </section>

          <footer className="colophon">
            <span>© OGCR · Operator platform</span>
            <span>Set in Inter</span>
            <span>Pulled from Figma 2P6XrQJhT8I39IR5LGK7RT</span>
          </footer>
        </div>

        <nav className="toc" aria-label="Sections">
          <p className="toc__heading">Sections</p>
          <ul className="toc__list">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a className="toc__link" href={`#${s.id}`}>
                  <span className="toc__num">§{s.num}</span>
                  <span>{s.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
    </ToastProvider>
  )
}

export default App
