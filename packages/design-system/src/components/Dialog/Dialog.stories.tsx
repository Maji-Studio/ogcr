import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dialog } from '.'
import { Button } from '../Button'
import { Input } from '../Input'

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
  args: {
    title: 'Retire credits',
    description: 'This action moves the selected credits into a retired state.',
    trigger: <Button>Open dialog</Button>,
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <p className="m-0">
        Retired credits can no longer be transferred. A retirement certificate is issued to the
        beneficiary on the registry.
      </p>
    ),
    primaryAction: { label: 'Retire credits' },
    secondaryAction: { label: 'Cancel' },
  },
}

export const WithForm: Story = {
  args: {
    title: 'Name this project',
    description: undefined,
    children: <Input label="Project name" placeholder="e.g. Mangrove Restoration" />,
    primaryAction: { label: 'Save' },
    secondaryAction: { label: 'Cancel' },
  },
}

export const Small: Story = {
  args: {
    size: 's',
    title: 'Delete draft?',
    description: 'You can’t undo this.',
    primaryAction: { label: 'Delete' },
    secondaryAction: { label: 'Keep' },
  },
}

export const Large: Story = {
  args: {
    size: 'l',
    children: (
      <div className="flex flex-col gap-12">
        {Array.from({ length: 8 }).map((_, i) => (
          <p key={i} className="m-0">
            Paragraph {i + 1} of supporting content that demonstrates internal scrolling when the
            body exceeds the available height.
          </p>
        ))}
      </div>
    ),
    primaryAction: { label: 'Acknowledge' },
  },
}

export const NoClose: Story = {
  args: {
    showClose: false,
    children: <p className="m-0">There is no corner close button — use an action instead.</p>,
    primaryAction: { label: 'Got it' },
  },
}
