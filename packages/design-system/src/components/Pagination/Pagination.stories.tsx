import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pagination } from '.'

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: { layout: 'padded' },
  args: { page: 1, pageCount: 10 },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.page)
    return <Pagination {...args} page={page} onPageChange={setPage} />
  },
}

export const MiddlePage: Story = { args: { page: 6, pageCount: 20 } }
export const FewPages: Story = { args: { page: 2, pageCount: 4 } }
export const LastPage: Story = { args: { page: 12, pageCount: 12 } }
