import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { List, ListItem } from '.'
import { Avatar } from '../Avatar'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
import { Pill } from '../Pill'
import { FolderIcon, LeafIcon, TrashIcon, WarningIcon } from '../icons'

const meta = {
  title: 'Components/List',
  component: List,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

const frame = (children: React.ReactNode) => <div className="max-w-[560px]">{children}</div>

/** Parcels with the area as a trailing value and a remove action. */
export const Parcels: Story = {
  render: () =>
    frame(
      <List aria-label="Parcels">
        <ListItem
          leading={<LeafIcon className="h-20 w-20" />}
          title="Hinterfeld"
          description="Arable · winter wheat"
          trailing="12.4 ha"
          action={<Button variant="text" size="m" iconOnly aria-label="Remove Hinterfeld" iconLeft={<TrashIcon />} />}
        />
        <ListItem
          leading={<LeafIcon className="h-20 w-20" />}
          title="Bachwiese"
          description="Grassland · permanent"
          trailing="4.1 ha"
          action={<Button variant="text" size="m" iconOnly aria-label="Remove Bachwiese" iconLeft={<TrashIcon />} />}
        />
        <ListItem
          leading={<LeafIcon className="h-20 w-20" />}
          title="Obergut"
          description="Orchard · apples"
          trailing="2.8 ha"
          action={<Button variant="text" size="m" iconOnly aria-label="Remove Obergut" iconLeft={<TrashIcon />} />}
        />
      </List>,
    ),
}

/** An excluded parcel: struck through and dimmed, while the Restore action keeps full strength. */
export const ExcludedParcel: Story = {
  render: () =>
    frame(
      <List aria-label="Parcels">
        <ListItem title="Hinterfeld" description="Arable · winter wheat" trailing="12.4 ha" />
        <ListItem
          strikethrough
          title="Waldrand"
          description="Excluded: under 0.5 ha"
          trailing="0.3 ha"
          action={<Button variant="text" size="m">Restore</Button>}
        />
      </List>,
    ),
}

/** Rows that go somewhere: `href` makes them links and adds a chevron. */
export const Navigational: Story = {
  render: () =>
    frame(
      <List aria-label="Farms">
        <ListItem href="#farm-1" leading={<FolderIcon className="h-20 w-20" />} title="Hof Sonnenberg" description="3 parcels · 19.3 ha" />
        <ListItem href="#farm-2" leading={<FolderIcon className="h-20 w-20" />} title="Biohof Lindenmatt" description="5 parcels · 41.0 ha" />
        <ListItem
          href="#farm-3"
          leading={<FolderIcon className="h-20 w-20" />}
          title="Gut Rheinau"
          description="1 parcel · 6.2 ha"
          trailing={<Pill tone="warning">Needs review</Pill>}
        />
      </List>,
    ),
}

/** Clickable rows with a separately focusable action, a selected row and a warning strip. */
export const InteractiveStates: Story = {
  render: () => {
    const [selected, setSelected] = useState('hinterfeld')
    const rows = [
      { id: 'hinterfeld', title: 'Hinterfeld', description: '12.4 ha' },
      { id: 'bachwiese', title: 'Bachwiese', description: '4.1 ha' },
    ]
    return frame(
      <List aria-label="Pick a parcel">
        {rows.map((row) => (
          <ListItem
            key={row.id}
            title={row.title}
            description={row.description}
            selected={selected === row.id}
            onClick={() => setSelected(row.id)}
            action={<Button variant="text" size="m">Edit</Button>}
          />
        ))}
        <ListItem
          highlight="warning"
          leading={<WarningIcon className="h-20 w-20" />}
          title="Obergut"
          description="Boundary overlaps Bachwiese"
          onClick={() => {}}
        />
        <ListItem muted title="Waldrand" description="No crop recorded" />
      </List>,
    )
  },
}

/** People and choices as leading nodes: avatar with initials, checkbox. */
export const LeadingSlots: Story = {
  render: () =>
    frame(
      <List aria-label="Team">
        <ListItem
          leading={<Avatar size="l" name="Anna Keller" />}
          title="Anna Keller"
          description="Farm manager"
          trailing={<Pill tone="positive">Verified</Pill>}
        />
        <ListItem
          leading={<Avatar size="l" name="Marco Brunner" />}
          title="Marco Brunner"
          description="Advisor"
        />
        <ListItem leading={<Checkbox label="Select Hinterfeld" />} title="Hinterfeld" description="12.4 ha" />
      </List>,
    ),
}

/** The borderless divided stack used inside a sheet. */
export const Plain: Story = {
  render: () =>
    frame(
      <List variant="plain" aria-label="Soil samples">
        <ListItem title="Sample 1, topsoil" description="Hinterfeld · 14 Mar 2026" trailing="2.1 % SOC" />
        <ListItem title="Sample 2, topsoil" description="Bachwiese · 14 Mar 2026" trailing="3.4 % SOC" />
        <ListItem title="Sample 3, subsoil" description="Hinterfeld · 14 Mar 2026" trailing="0.9 % SOC" />
      </List>,
    ),
}
