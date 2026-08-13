// Demo fixtures for the design-system specimen page (src/App.tsx). Demo-only —
// nothing here is exported from the library barrel.

import type { NavItem } from '../components/Navigation'
import { Pill } from '../components/Pill'
import type { SideNavigationItem } from '../components/SideNavigation'
import {
  ChartBarIcon,
  FlaskIcon,
  FolderIcon,
  GearIcon,
  LeafIcon,
  SquaresFourIcon,
  UserIcon,
} from '../components/icons'
import type { ColumnDef } from '@tanstack/react-table'
export const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: <SquaresFourIcon /> },
  { id: 'sampling', label: 'Sampling', icon: <FlaskIcon /> },
  { id: 'insights', label: 'Insights', icon: <ChartBarIcon /> },
  { id: 'projects', label: 'Projects', icon: <FolderIcon /> },
  { id: 'profile', label: 'Profile', icon: <UserIcon /> },
]

export const SIDEBAR_ITEMS: SideNavigationItem[] = [
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

export type Issuance = {
  project: string
  methodology: string
  plots: number
  credits: number
  status: 'verified' | 'review' | 'flagged'
  updated: string
}

export const ISSUANCES: Issuance[] = [
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

export const issuanceColumns: ColumnDef<Issuance>[] = [
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
