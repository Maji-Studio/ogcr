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
