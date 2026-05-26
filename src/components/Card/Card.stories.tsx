import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from '.'
import { Pill } from '../Pill'
import { Button } from '../Button'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: { layout: 'padded' },
  args: { title: 'Card title', subtitle: 'A short subtitle' },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Carbon credits issued',
    subtitle: 'Quarterly summary',
    children: (
      <p className="m-0 text-body-s text-text-secondary">182,540 t CO₂e this quarter.</p>
    ),
  },
}

export const WithTrailing: Story = {
  args: {
    title: 'Project status',
    subtitle: 'Mossy Earth – Iberian rewilding',
    trailing: <Pill tone="warning">Pending review</Pill>,
    children: (
      <p className="m-0 text-body-s text-text-secondary">
        Methodology validation in progress.
      </p>
    ),
  },
}

export const Floating: Story = {
  args: {
    title: 'Sign in',
    subtitle: 'Use your work account',
    floating: true,
    children: (
      <div className="flex justify-end gap-8">
        <Button variant="text">Forgot password?</Button>
        <Button variant="filled">Sign in</Button>
      </div>
    ),
  },
}
