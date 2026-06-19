import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScrollArea } from '.'

const meta = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  parameters: { layout: 'centered' },
  args: { children: null },
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

const lines = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`)

export const Vertical: Story = {
  render: () => (
    <ScrollArea
      maxHeight={200}
      className="w-[240px] rounded-12 border border-border-light bg-surface-light"
      viewportClassName="p-12"
    >
      <ul className="flex flex-col gap-8 font-standard text-s text-text-primary">
        {lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </ScrollArea>
  ),
}

export const AlwaysVisible: Story = {
  render: () => (
    <ScrollArea
      maxHeight={200}
      scrollbars="always"
      className="w-[240px] rounded-12 border border-border-light bg-surface-light"
      viewportClassName="p-12"
    >
      <ul className="flex flex-col gap-8 font-standard text-s text-text-primary">
        {lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </ScrollArea>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <ScrollArea
      orientation="horizontal"
      className="w-[280px] rounded-12 border border-border-light bg-surface-light"
      viewportClassName="p-12"
    >
      <div className="flex gap-12 w-max font-standard text-s text-text-primary">
        {lines.map((l) => (
          <span key={l} className="shrink-0 px-12 py-8 rounded-8 bg-surface-neutral">
            {l}
          </span>
        ))}
      </div>
    </ScrollArea>
  ),
}

export const Both: Story = {
  render: () => (
    <ScrollArea
      orientation="both"
      maxHeight={200}
      className="w-[280px] rounded-12 border border-border-light bg-surface-light"
      viewportClassName="p-12"
    >
      <div className="grid grid-rows-[repeat(20,auto)] grid-flow-col gap-12 w-max font-standard text-s text-text-primary">
        {Array.from({ length: 120 }, (_, i) => (
          <span key={i} className="shrink-0 px-12 py-8 rounded-8 bg-surface-neutral whitespace-nowrap">
            Cell {i + 1}
          </span>
        ))}
      </div>
    </ScrollArea>
  ),
}
