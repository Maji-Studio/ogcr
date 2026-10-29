import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { OptionCard, OptionCardGroup } from '.'
import { Pill } from '../Pill'
import { FileTextIcon, HandshakeIcon, ListIcon, MapIcon, PlantIcon, UserIcon } from '../icons'

const meta = {
  title: 'Components/OptionCard',
  component: OptionCard,
  parameters: { layout: 'padded' },
  args: { value: 'farmer', title: 'Farmer' },
} satisfies Meta<typeof OptionCard>

export default meta
type Story = StoryObj<typeof meta>

/** Vertical cards, two columns. The `.choice` look: tinted tile, centred copy, selection shown by the border and halo. */
export const WhoAreYou: Story = {
  render: () => {
    const [role, setRole] = useState('farmer')
    return (
      <OptionCardGroup aria-label="Who are you?" columns={2} value={role} onValueChange={setRole}>
        <OptionCard
          layout="vertical"
          value="farmer"
          title="Farmer"
          description="I manage my own land and want to report my practices."
          leading={<PlantIcon />}
          leadingTone="positive"
        />
        <OptionCard
          layout="vertical"
          value="intermediary"
          title="Intermediary"
          description="I collect data for several farms, for example a cooperative or an advisor."
          leading={<HandshakeIcon />}
        />
      </OptionCardGroup>
    )
  },
}

/** Horizontal cards with a trailing radio dot, an optional tag and a disabled option. */
export const HowToAddParcels: Story = {
  render: () => {
    const [method, setMethod] = useState('draw')
    return (
      <div className="max-w-[520px]">
        <OptionCardGroup aria-label="How do you want to add parcels?" value={method} onValueChange={setMethod}>
          <OptionCard
            value="draw"
            title="Draw on the map"
            description="Trace each parcel boundary by hand."
            leading={<MapIcon />}
            leadingTone="positive"
            tag={<Pill tone="positive">Most accurate</Pill>}
          />
          <OptionCard
            value="import"
            title="Import a file"
            description="Upload a GeoJSON, Shapefile or KML export."
            leading={<FileTextIcon />}
          />
          <OptionCard
            value="list"
            title="Pick from the register"
            description="Choose from parcels registered to your farm."
            leading={<ListIcon />}
            disabled
            tag={<Pill>Not available in your region</Pill>}
          />
        </OptionCardGroup>
      </div>
    )
  },
}

/** Compact three-up cards with the radio before the title (the `.mopt` look). */
export const MethodThreeUp: Story = {
  render: () => {
    const [method, setMethod] = useState('measured')
    return (
      <OptionCardGroup aria-label="Soil carbon method" columns={3} value={method} onValueChange={setMethod}>
        <OptionCard indicatorPosition="start" indicator value="measured" title="Measured" description="Lab results from soil samples." />
        <OptionCard indicatorPosition="start" indicator value="modelled" title="Modelled" description="Estimated from practices and climate." />
        <OptionCard indicatorPosition="start" indicator value="mixed" title="Mixed" description="Samples where you have them, model elsewhere." />
      </OptionCardGroup>
    )
  },
}

/** `multiple` switches the group to checkbox semantics. */
export const MultipleSelection: Story = {
  render: () => {
    const [practices, setPractices] = useState<string[]>(['cover', 'notill'])
    return (
      <div className="max-w-[520px]">
        <OptionCardGroup multiple aria-label="Practices you used this season" value={practices} onValueChange={setPractices}>
          <OptionCard value="cover" title="Cover crops" description="Winter rye between main crops." leading={<PlantIcon />} />
          <OptionCard value="notill" title="No-till" description="Direct drilling, no ploughing." leading={<UserIcon />} />
          <OptionCard value="compost" title="Compost applied" description="Green waste compost, spring." leading={<FileTextIcon />} />
        </OptionCardGroup>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="max-w-[520px]">
      <OptionCardGroup aria-label="Locked choice" defaultValue="draw" disabled>
        <OptionCard value="draw" title="Draw on the map" description="Trace each parcel boundary by hand." leading={<MapIcon />} />
        <OptionCard value="import" title="Import a file" description="Upload a GeoJSON export." leading={<FileTextIcon />} />
      </OptionCardGroup>
    </div>
  ),
}
