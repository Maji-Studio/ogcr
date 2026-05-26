import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Icons from '.'

const meta = {
  title: 'Foundation/Icons',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const All: Story = {
  render: () => {
    const entries = Object.entries(Icons).filter(([, v]) => typeof v === 'function')
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-16 text-text-primary">
        {entries.map(([name, Icon]) => {
          const Cmp = Icon as React.ComponentType<{ width?: number; height?: number }>
          return (
            <div
              key={name}
              className="flex flex-col items-center gap-8 p-16 bg-surface-light border border-border-medium rounded-8"
            >
              <Cmp width={28} height={28} />
              <span className="font-standard text-s text-text-secondary">{name}</span>
            </div>
          )
        })}
      </div>
    )
  },
}
