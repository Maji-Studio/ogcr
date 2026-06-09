import type { Meta, StoryObj } from '@storybook/react-vite'
import { Collapsible } from '.'

const meta = {
  title: 'Components/Collapsible',
  component: Collapsible,
  parameters: { layout: 'padded' },
  args: {
    trigger: 'Advanced settings',
    children: (
      <p className="m-0">
        These options are hidden by default to keep the form focused. Expand to configure buffer
        pool contribution and reversal handling.
      </p>
    ),
  },
  decorators: [(Story) => <div className="w-[420px] max-w-full"><Story /></div>],
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const OpenByDefault: Story = { args: { defaultOpen: true } }
export const Disabled: Story = { args: { disabled: true } }
