import type { Meta, StoryObj } from '@storybook/react-vite'
import { StepList, StepListItem } from '.'
import { Pill } from '../Pill'
import { MapIcon, FlaskIcon } from '../icons'

const meta = {
  title: 'Components/StepList',
  component: StepList,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="w-[480px] max-w-full"><Story /></div>],
} satisfies Meta<typeof StepList>

export default meta
type Story = StoryObj<typeof meta>

const farmSetup = (
  <>
    <StepListItem
      state="done"
      title="Add your farm details"
      description="Name, address and total area."
      trailing="2 min"
    />
    <StepListItem
      state="current"
      title="Draw your parcels"
      description="Outline each field on the map."
      tags={<Pill tone="progress">3 of 8 drawn</Pill>}
      trailing="10 min"
    />
    <StepListItem
      state="todo"
      title="Upload soil samples"
      description="Add lab results for each sampled parcel."
      trailing="5 min"
    />
    <StepListItem
      state="locked"
      title="Invite your advisor"
      description="Available once your parcels are drawn."
    />
    <StepListItem
      state="attention"
      title="Confirm land use"
      description="Two parcels have a land use that does not match your records."
      tags={<Pill tone="warning">Needs review</Pill>}
    />
  </>
)

/** A bordered stack with all five states: done, current, to do, locked, needs attention. */
export const Bordered: Story = {
  render: () => <StepList aria-label="Set up your farm">{farmSetup}</StepList>,
}

export const Plain: Story = {
  render: () => <StepList variant="plain" aria-label="Set up your farm">{farmSetup}</StepList>,
}

/** The dotted connector reads as a sequence, so it suits short ordered flows. */
export const Connector: Story = {
  render: () => (
    <StepList variant="plain" connector aria-label="Set up your farm">
      {farmSetup}
    </StepList>
  ),
}

/** Rows with `onClick` or `href` become real buttons and links. Locked rows never do. */
export const Interactive: Story = {
  render: () => (
    <StepList aria-label="Set up your farm">
      <StepListItem state="done" title="Add your farm details" onClick={() => {}} trailing="Edit" />
      <StepListItem
        state="current"
        title="Draw your parcels"
        description="Outline each field on the map."
        href="#parcels"
      />
      <StepListItem state="todo" title="Upload soil samples" onClick={() => {}} />
      <StepListItem state="locked" title="Invite your advisor" onClick={() => {}} />
    </StepList>
  ),
}

/** `icon` swaps the state glyph for a neutral tile. State text stays for screen readers. */
export const WithIcons: Story = {
  render: () => (
    <StepList aria-label="Season tasks">
      <StepListItem
        state="current"
        icon={<MapIcon />}
        title="Walk the northern parcels"
        description="Confirm field boundaries before sampling."
      />
      <StepListItem
        state="todo"
        icon={<FlaskIcon />}
        title="Send soil samples to the lab"
        description="Spring 2026 sampling round."
        tags={<Pill>12 samples</Pill>}
      />
    </StepList>
  ),
}

export const TitlesOnly: Story = {
  render: () => (
    <StepList variant="plain" connector aria-label="Verification">
      <StepListItem state="done" title="Submit baseline" />
      <StepListItem state="current" title="Review by auditor" />
      <StepListItem state="todo" title="Issue credits" />
    </StepList>
  ),
}
