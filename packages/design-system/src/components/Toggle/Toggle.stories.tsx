import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toggle, ToggleGroup } from '.'
import { SquaresFourIcon, ChartBarIcon, FolderIcon } from '../icons'

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>
type GroupStory = StoryObj<typeof ToggleGroup>

export const Single: Story = {
  args: { children: 'Bold', 'aria-label': 'Bold' },
}

export const IconOnly: Story = {
  args: { 'aria-label': 'Grid view', children: <SquaresFourIcon /> },
}

export const Group: GroupStory = {
  render: () => (
    <ToggleGroup
      aria-label="View"
      defaultValue={['grid']}
      items={[
        { value: 'grid', label: 'Grid', icon: <SquaresFourIcon /> },
        { value: 'chart', label: 'Chart', icon: <ChartBarIcon /> },
        { value: 'files', label: 'Files', icon: <FolderIcon /> },
      ]}
    />
  ),
}

export const IconGroup: GroupStory = {
  render: () => (
    <ToggleGroup
      aria-label="View"
      defaultValue={['grid']}
      items={[
        { value: 'grid', icon: <SquaresFourIcon />, 'aria-label': 'Grid' },
        { value: 'chart', icon: <ChartBarIcon />, 'aria-label': 'Chart' },
        { value: 'files', icon: <FolderIcon />, 'aria-label': 'Files' },
      ]}
    />
  ),
}

export const MultiSelect: GroupStory = {
  render: () => (
    <ToggleGroup
      aria-label="Filters"
      multiple
      defaultValue={['verified']}
      items={[
        { value: 'verified', label: 'Verified' },
        { value: 'pending', label: 'Pending' },
        { value: 'retired', label: 'Retired' },
      ]}
    />
  ),
}

const basemaps = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'satellite', label: 'Satellite' },
  { value: 'terrain', label: 'Terrain' },
]

/** OGCR rule: a segmented control holds at most 3 options. Above that, use a dropdown (Select). */
export const Segmented: GroupStory = {
  render: () => (
    <ToggleGroup appearance="segmented" aria-label="Basemap" defaultValue={['minimal']} items={basemaps} />
  ),
}

export const SegmentedSmall: GroupStory = {
  render: () => (
    <ToggleGroup appearance="segmented" size="s" aria-label="Basemap" defaultValue={['satellite']} items={basemaps} />
  ),
}

export const SegmentedWithIcons: GroupStory = {
  render: () => (
    <ToggleGroup
      appearance="segmented"
      aria-label="View"
      defaultValue={['grid']}
      items={[
        { value: 'grid', label: 'Parcels', leading: <SquaresFourIcon /> },
        { value: 'chart', label: 'Yield', leading: <ChartBarIcon /> },
        { value: 'files', label: 'Files', leading: <FolderIcon />, disabled: true },
      ]}
    />
  ),
}

const seasons = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' },
]

export const ChipsSeason: GroupStory = {
  render: () => (
    <ToggleGroup appearance="chip" multiple aria-label="Seasons" defaultValue={['2025']} items={seasons} />
  ),
}

export const ChipsSmall: GroupStory = {
  render: () => (
    <ToggleGroup appearance="chip" size="s" aria-label="Seasons" defaultValue={['2026']} items={seasons} />
  ),
}

/** Chips wrap and may carry a leading icon. Categories use icons, never colour swatches. */
export const ChipsWrapping: GroupStory = {
  render: () => (
    <div className="max-w-[320px]">
      <ToggleGroup
        appearance="chip"
        multiple
        aria-label="Crop filters"
        defaultValue={['wheat', 'maize']}
        items={[
          { value: 'wheat', label: 'Winter wheat', leading: <FolderIcon /> },
          { value: 'maize', label: 'Silage maize', leading: <FolderIcon /> },
          { value: 'barley', label: 'Spring barley', leading: <FolderIcon /> },
          { value: 'rape', label: 'Oilseed rape', leading: <FolderIcon /> },
          { value: 'fallow', label: 'Fallow', leading: <FolderIcon /> },
        ]}
      />
    </div>
  ),
}
