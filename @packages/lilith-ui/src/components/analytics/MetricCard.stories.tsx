import type { Meta, StoryObj } from '@storybook/react'
import { MetricCard } from './MetricCard'

const meta: Meta<typeof MetricCard> = {
  title: 'Analytics/MetricCard',
  component: MetricCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Revenue: Story = {
  args: {
    title: 'Total Revenue',
    value: '$12,456',
    change: 12.5,
    trend: 'up',
  },
}

export const Subscribers: Story = {
  args: {
    title: 'Total Subscribers',
    value: '1,234',
    change: 8.3,
    trend: 'up',
  },
}

export const EngagementDown: Story = {
  args: {
    title: 'Engagement Rate',
    value: '64%',
    change: -3.2,
    trend: 'down',
  },
}

export const ViewsNeutral: Story = {
  args: {
    title: 'Total Views',
    value: '45.2K',
    change: 0,
    trend: 'neutral',
  },
}
