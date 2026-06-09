import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from '.'

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: { layout: 'padded' },
  args: { label: 'Auto-retire credits on issuance' },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const On: Story = { args: { defaultChecked: true } }
export const WithSecondaryText: Story = {
  args: {
    defaultChecked: true,
    secondaryText: 'Credits are retired automatically once the batch is verified.',
  },
}
export const Error: Story = { args: { error: true, secondaryText: 'This setting is required.' } }
export const Disabled: Story = { args: { disabled: true, defaultChecked: true } }

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-16">
      <Switch label="Off" />
      <Switch label="On" defaultChecked />
      <Switch label="Error" error />
      <Switch label="Disabled off" disabled />
      <Switch label="Disabled on" disabled defaultChecked />
    </div>
  ),
}
