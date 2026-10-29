import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState } from '.'
import { Button } from '../Button'
import { MapIcon, PlusIcon, SearchIcon } from '../icons'

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: { layout: 'padded' },
  args: { title: 'No parcels yet' },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

const frame = (children: React.ReactNode) => <div className="max-w-[640px]">{children}</div>

export const Panel: Story = {
  render: () =>
    frame(
      <EmptyState
        icon={<MapIcon />}
        title="No parcels yet"
        description="Draw the boundary of each field you farm. You can add more later."
        action={<Button iconLeft={<PlusIcon />}>Draw a parcel</Button>}
      />,
    ),
}

export const PanelWithoutAction: Story = {
  render: () =>
    frame(
      <EmptyState
        icon={<SearchIcon />}
        title="No soil samples match"
        description="Try another season or clear the filters to see all samples."
      />,
    ),
}

/** Compact dashed row with an optional trailing action. */
export const Inline: Story = {
  render: () =>
    frame(
      <EmptyState
        variant="inline"
        title="No parcels in this farm."
        description="Import a file to add some."
        action={<Button variant="outlined" size="m">Import file</Button>}
      />,
    ),
}

export const InlineWithoutAction: Story = {
  render: () => frame(<EmptyState variant="inline" title="No notes for this season." />),
}
