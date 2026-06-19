import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion } from '.'

const items = [
  {
    value: 'methodology',
    title: 'What methodology does this project use?',
    content:
      'The project follows the Isometric Geologic Storage protocol, with quantification based on measured injection volumes.',
  },
  {
    value: 'monitoring',
    title: 'How is the storage monitored?',
    content:
      'Continuous pressure and temperature monitoring at the injection site, with quarterly third-party verification.',
  },
  {
    value: 'permanence',
    title: 'What is the permanence rating?',
    content: '10,000+ years, with a buffer pool contribution to cover reversal risk.',
  },
]

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: { layout: 'padded' },
  args: { items },
  decorators: [(Story) => <div className="w-[520px] max-w-full"><Story /></div>],
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = { args: { defaultValue: ['methodology'] } }
export const Multiple: Story = { args: { multiple: true, defaultValue: ['methodology', 'permanence'] } }
export const WithDisabledItem: Story = {
  args: {
    items: [...items.slice(0, 2), { ...items[2], disabled: true }],
  },
}
