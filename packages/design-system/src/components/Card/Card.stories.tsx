import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from '.'
import { Pill } from '../Pill'
import { Button } from '../Button'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: { layout: 'padded' },
  args: { title: 'Card title', subtitle: 'A short subtitle' },
  argTypes: {
    padding: { control: 'inline-radio', options: ['none', 's', 'm', 'l'] },
  },
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

/** `m` (16px) is the spec default; `l` (24px) suits page-level panels, `none` a flush media card. */
export const Padding: Story = {
  render: () => (
    <div className="flex flex-col gap-16 max-w-[480px]">
      <Card padding="none" title="none · 0" />
      <Card padding="s" title="s · 12px" />
      <Card padding="m" title="m · 16px (default)" />
      <Card padding="l" title="l · 24px" />
    </div>
  ),
}

export const Floating: Story = {
  args: {
    title: 'Sign in',
    subtitle: 'Use your work account',
    floating: true,
    children: (
      <div className="flex justify-start gap-8">
        <Button variant="filled">Sign in</Button>
        <Button variant="text">Forgot password?</Button>
      </div>
    ),
  },
}
