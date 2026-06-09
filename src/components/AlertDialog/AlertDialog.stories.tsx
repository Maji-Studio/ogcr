import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlertDialog } from '.'
import { Button } from '../Button'

const meta = {
  title: 'Components/AlertDialog',
  component: AlertDialog,
  parameters: { layout: 'centered' },
  args: {
    title: 'Discard changes?',
    description: 'Your edits to this protocol draft will be lost.',
    trigger: <Button variant="outlined">Discard</Button>,
    confirmLabel: 'Discard',
    cancelLabel: 'Keep editing',
  },
} satisfies Meta<typeof AlertDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Danger: Story = {
  args: {
    tone: 'danger',
    title: 'Delete this project?',
    description: 'This permanently removes the project and all of its credits. This cannot be undone.',
    trigger: <Button variant="outlined">Delete project</Button>,
    confirmLabel: 'Delete project',
    cancelLabel: 'Cancel',
  },
}
