import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator, ToolbarLink, ToolbarInput } from '.'
import { SquaresFourIcon, ChartBarIcon, FolderIcon, SearchIcon } from '../icons'

const meta = {
  title: 'Components/Toolbar',
  component: Toolbar,
  parameters: { layout: 'centered' },
  args: { 'aria-label': 'Toolbar', children: null },
} satisfies Meta<typeof Toolbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Toolbar aria-label="Formatting">
      <ToolbarGroup>
        <ToolbarButton>
          <SquaresFourIcon /> Grid
        </ToolbarButton>
        <ToolbarButton>
          <ChartBarIcon /> Chart
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton>
        <FolderIcon /> Files
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarLink href="#docs">Docs</ToolbarLink>
    </Toolbar>
  ),
}

export const Vertical: Story = {
  render: () => (
    <Toolbar aria-label="Tools" orientation="vertical">
      <ToolbarButton aria-label="Grid">
        <SquaresFourIcon />
      </ToolbarButton>
      <ToolbarButton aria-label="Chart">
        <ChartBarIcon />
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Files">
        <FolderIcon />
      </ToolbarButton>
    </Toolbar>
  ),
}

export const WithInput: Story = {
  render: () => (
    <Toolbar aria-label="Records">
      <ToolbarInput type="search" placeholder="Filter records" aria-label="Filter records" className="w-[200px]" />
      <ToolbarSeparator />
      <ToolbarButton aria-label="Search">
        <SearchIcon />
      </ToolbarButton>
      <ToolbarButton>
        <FolderIcon /> Files
      </ToolbarButton>
    </Toolbar>
  ),
}

export const Compact: Story = {
  render: () => (
    <Toolbar aria-label="Formatting" density="compact">
      <ToolbarGroup>
        <ToolbarButton>
          <SquaresFourIcon /> Grid
        </ToolbarButton>
        <ToolbarButton>
          <ChartBarIcon /> Chart
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarInput type="search" placeholder="Filter" aria-label="Filter" className="w-[140px]" />
    </Toolbar>
  ),
}
