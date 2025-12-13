import type { Meta, StoryObj } from '@storybook/react'
import { DataTable } from './DataTable'

const meta: Meta<typeof DataTable> = {
  title: 'Data/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const sampleData = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Moderator' },
]

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role', sortable: false },
]

export const Default: Story = {
  args: {
    data: sampleData,
    columns,
    keyExtractor: (row: any) => row.id.toString(),
    isLoading: false,
  },
}

export const Loading: Story = {
  args: {
    data: [],
    columns,
    keyExtractor: (row: any) => row.id.toString(),
    isLoading: true,
  },
}

export const EmptyState: Story = {
  args: {
    data: [],
    columns,
    keyExtractor: (row: any) => row.id.toString(),
    isLoading: false,
  },
}
