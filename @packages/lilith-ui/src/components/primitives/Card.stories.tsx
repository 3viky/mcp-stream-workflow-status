import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Primitives/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <>
        <h3>Card Title</h3>
        <p>This is a basic card component with some content inside.</p>
      </>
    ),
  },
}

export const WithPadding: Story = {
  args: {
    padding: 'lg',
    children: (
      <>
        <h3>Card with Large Padding</h3>
        <p>This card has more spacing around its content.</p>
      </>
    ),
  },
}
