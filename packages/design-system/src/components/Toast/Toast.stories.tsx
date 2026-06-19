import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToastProvider, useToast } from '.'
import { Button } from '../Button'

function ToastDemo() {
  const toast = useToast()
  return (
    <div className="flex flex-wrap gap-12">
      <Button
        variant="outlined"
        onClick={() =>
          toast.add({ title: 'Batch verified', description: '1,250 t CO₂ cleared for issuance.', type: 'success' })
        }
      >
        Success
      </Button>
      <Button
        variant="outlined"
        onClick={() => toast.add({ title: 'Issuance failed', description: 'Reviewer signature missing.', type: 'error' })}
      >
        Error
      </Button>
      <Button
        variant="outlined"
        onClick={() => toast.add({ title: 'Sampling overdue', description: 'Next sample due in 2 days.', type: 'warning' })}
      >
        Warning
      </Button>
      <Button
        variant="outlined"
        onClick={() =>
          toast.add({
            title: 'Export ready',
            description: 'Your ledger export is available.',
            type: 'info',
            actionProps: { children: 'Download' },
          })
        }
      >
        Info + action
      </Button>
    </div>
  )
}

const meta = {
  title: 'Components/Toast',
  component: ToastProvider,
  parameters: { layout: 'centered' },
  args: { children: <ToastDemo /> },
} satisfies Meta<typeof ToastProvider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
