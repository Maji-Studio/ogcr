import type { Meta, StoryObj } from '@storybook/react-vite'
import { Popover } from '.'
import { Button } from '../Button'
import { InfoIcon } from '../icons'

const meta = {
  title: 'Components/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
  args: {
    trigger: <Button variant="outlined">Open popover</Button>,
    title: 'Verification status',
    description:
      'This batch has cleared automated checks and is awaiting a reviewer signature before issuance.',
  },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Open: Story = { args: { defaultOpen: true } }

export const WithArrow: Story = { args: { defaultOpen: true, showArrow: true } }

export const RichContent: Story = {
  args: {
    defaultOpen: true,
    trigger: <Button variant="outlined" iconLeft={<InfoIcon />}>Details</Button>,
    title: 'Removal credits',
    description: undefined,
    children: (
      <div className="flex flex-col gap-12">
        <p className="m-0 font-standard font-normal text-s leading-[1.4] text-text-secondary">
          Credits are minted per verified tonne of CO₂ removed and retired on issuance.
        </p>
        <Button variant="filled">View ledger</Button>
      </div>
    ),
  },
}
