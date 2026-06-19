import type { Meta, StoryObj } from '@storybook/react-vite'
import { Sidesheet } from '.'
import { Button } from '../Button'
import { Input } from '../Input'

const meta = {
  title: 'Modules/Sidesheet',
  component: Sidesheet,
  parameters: { layout: 'padded' },
  args: {
    title: 'Sidesheet title',
    trigger: <Button>Open sidesheet</Button>,
  },
} satisfies Meta<typeof Sidesheet>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultOpen: true,
    navLabel: 'All projects',
    title: 'Iberian rewilding',
    status: 'In review',
    primaryAction: { label: 'Confirm' },
    secondaryAction: { label: 'Cancel' },
    children: (
      <>
        <Input label="Project ID" defaultValue="OGCR-IBER-001" readOnly />
        <Input label="Reviewer" defaultValue="Camila Rojas" readOnly />
        <p className="text-body-s text-text-secondary m-0">
          Methodology v3.2 with field sampling at 12 plots.
        </p>
      </>
    ),
  },
}

export const ClosedByDefault: Story = {
  args: {
    navLabel: 'All projects',
    title: 'Iberian rewilding',
    status: 'In review',
    primaryAction: { label: 'Confirm' },
    secondaryAction: { label: 'Cancel' },
    children: <p className="text-body-s text-text-secondary m-0">Hidden until trigger pressed.</p>,
  },
}
