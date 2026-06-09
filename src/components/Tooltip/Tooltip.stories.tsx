import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip, TooltipProvider } from '.'
import { Button } from '../Button'
import { InfoIcon } from '../icons'

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  args: {
    trigger: <Button variant="outlined">Hover me</Button>,
    children: 'Credits retire on issuance.',
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Open: Story = { args: { defaultOpen: true } }

export const NoArrow: Story = { args: { defaultOpen: true, showArrow: false } }

export const OnIconButton: Story = {
  args: {
    defaultOpen: true,
    side: 'right',
    trigger: (
      <button
        aria-label="What is this?"
        className="inline-flex items-center justify-center w-32 h-32 rounded-8 border border-border-medium bg-surface-light text-icon-secondary cursor-pointer [&>svg]:w-20 [&>svg]:h-20 focus-visible:outline-none focus-visible:shadow-focus-primary"
      >
        <InfoIcon />
      </button>
    ),
    children: 'Verified removals only.',
  },
}

/**
 * Mount one `TooltipProvider` near the app root to share open-delay across
 * adjacent tooltips — once the first opens, moving to a neighbour shows it
 * instantly (no reopen delay).
 */
export const Grouped: Story = {
  render: () => (
    <TooltipProvider delay={400}>
      <div className="flex items-center gap-12">
        <Tooltip trigger={<Button variant="outlined">Issuance</Button>}>
          Credits retire on issuance.
        </Tooltip>
        <Tooltip trigger={<Button variant="outlined">Verification</Button>}>
          Verified removals only.
        </Tooltip>
        <Tooltip trigger={<Button variant="outlined">Vintage</Button>}>
          Vintage reflects the removal year.
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
}
