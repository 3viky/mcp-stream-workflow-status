/**
 * StepIndicator Storybook Story
 *
 * Demonstrates the StepIndicator component with various configurations.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { StepIndicator } from '../components/forms/StepIndicator'

const meta: Meta<typeof StepIndicator> = {
  title: 'Forms/StepIndicator',
  component: StepIndicator,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['horizontal', 'vertical']
    },
    currentStep: {
      control: 'number'
    }
  }
}

export default meta
type Story = StoryObj<typeof StepIndicator>

export const HorizontalBasic: Story = {
  args: {
    steps: ['Personal Info', 'Address', 'Payment', 'Review'],
    currentStep: 1,
    completedSteps: [0],
    variant: 'horizontal'
  }
}

export const HorizontalAllCompleted: Story = {
  args: {
    steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
    currentStep: 3,
    completedSteps: [0, 1, 2],
    variant: 'horizontal'
  }
}

export const VerticalBasic: Story = {
  args: {
    steps: ['Account Setup', 'Profile Details', 'Preferences', 'Confirmation'],
    currentStep: 2,
    completedSteps: [0, 1],
    variant: 'vertical'
  }
}

export const ThreeSteps: Story = {
  args: {
    steps: ['Basic', 'Advanced', 'Complete'],
    currentStep: 1,
    completedSteps: [0],
    variant: 'horizontal'
  }
}

export const FirstStep: Story = {
  args: {
    steps: ['Start', 'Middle', 'End'],
    currentStep: 0,
    completedSteps: [],
    variant: 'horizontal'
  }
}

export const Interactive: Story = {
  args: {
    steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
    currentStep: 1,
    completedSteps: [0],
    variant: 'horizontal',
    onStepClick: (index) => {
      console.log('Clicked step:', index)
    }
  }
}
