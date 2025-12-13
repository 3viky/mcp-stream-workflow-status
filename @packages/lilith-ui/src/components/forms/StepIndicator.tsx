/**
 * StepIndicator Component
 *
 * Visual progress indicator for multi-step forms.
 * Displays step numbers, labels, and completion status with connecting lines.
 */

import React from 'react'
import styled, { css } from 'styled-components'

export interface StepIndicatorProps {
  /** Array of step labels */
  steps: string[]
  /** Current active step (0-indexed) */
  currentStep: number
  /** Array of completed step indices */
  completedSteps?: number[]
  /** Display variant */
  variant?: 'horizontal' | 'vertical'
  /** Callback when a step is clicked */
  onStepClick?: (stepIndex: number) => void
}

const Container = styled.div<{ $variant: 'horizontal' | 'vertical' }>`
  display: flex;
  flex-direction: ${props => props.$variant === 'vertical' ? 'column' : 'row'};
  gap: ${props => props.$variant === 'vertical' ? props.theme.spacing.lg : 0};
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.lg};
  }
`

const StepWrapper = styled.div<{ $variant: 'horizontal' | 'vertical' }>`
  display: flex;
  flex-direction: ${props => props.$variant === 'vertical' ? 'row' : 'column'};
  align-items: center;
  flex: 1;
  position: relative;

  &:not(:last-child) {
    ${props => props.$variant === 'horizontal' && css`
      &::after {
        content: '';
        position: absolute;
        top: 14px;
        left: calc(50% + 20px);
        right: calc(-50% + 20px);
        height: 2px;
        background: ${props.theme.colors.border};
        z-index: 0;

        @media (max-width: 768px) {
          display: none;
        }
      }
    `}

    ${props => props.$variant === 'vertical' && css`
      &::after {
        content: '';
        position: absolute;
        top: 32px;
        left: 14px;
        bottom: -${props.theme.spacing.lg};
        width: 2px;
        background: ${props.theme.colors.border};
        z-index: 0;
      }
    `}
  }
`

const StepCircle = styled.div<{
  $active: boolean
  $completed: boolean
  $clickable: boolean
}>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  position: relative;
  z-index: 1;
  transition: all ${props => props.theme.transitions.normal};
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  flex-shrink: 0;

  ${({ $completed, $active, theme }) => {
    if ($completed) {
      return css`
        background: ${theme.colors.success};
        border: 2px solid ${theme.colors.success};
        color: #ffffff;

        ${theme.extensions?.cyberpunk && css`
          box-shadow: 0 0 10px ${theme.colors.success}66;
        `}
      `
    }

    if ($active) {
      return css`
        background: ${theme.colors.primary};
        border: 2px solid ${theme.colors.primary};
        color: #ffffff;

        ${theme.extensions?.cyberpunk && css`
          box-shadow: ${theme.extensions.cyberpunk.neonGlow.magenta};
        `}
      `
    }

    return css`
      background: ${theme.colors.surface};
      border: 2px solid ${theme.colors.border};
      color: ${theme.colors.text.secondary};
    `
  }}

  &:hover {
    ${props => props.$clickable && css`
      transform: scale(1.1);
      box-shadow: ${props.theme.shadows.md};
    `}
  }
`

const CheckIcon = styled.span`
  font-size: ${props => props.theme.typography.fontSize.base};
  line-height: 1;
`

const StepLabel = styled.div<{
  $active: boolean
  $completed: boolean
  $variant: 'horizontal' | 'vertical'
}>`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.$active ? props.theme.typography.fontWeight.semibold : props.theme.typography.fontWeight.normal};
  color: ${({ $completed, $active, theme }) => {
    if ($completed) return theme.colors.success
    if ($active) return theme.colors.primary
    return theme.colors.text.secondary
  }};
  text-align: ${props => props.$variant === 'vertical' ? 'left' : 'center'};
  margin: ${props => props.$variant === 'vertical'
    ? `0 0 0 ${props.theme.spacing.md}`
    : `${props.theme.spacing.sm} 0 0 0`};
  transition: color ${props => props.theme.transitions.normal};

  @media (max-width: 768px) {
    text-align: left;
    margin: 0 0 0 ${props => props.theme.spacing.md};
  }
`

const StepContent = styled.div<{ $variant: 'horizontal' | 'vertical' }>`
  display: flex;
  flex-direction: ${props => props.$variant === 'vertical' ? 'row' : 'column'};
  align-items: ${props => props.$variant === 'vertical' ? 'center' : 'center'};

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`

/**
 * StepIndicator displays progress through multi-step processes.
 * Shows numbered steps with labels, highlights current step, and marks completed steps.
 *
 * @example
 * // Basic horizontal step indicator
 * <StepIndicator
 *   steps={['Personal Info', 'Address', 'Payment', 'Review']}
 *   currentStep={1}
 *   completedSteps={[0]}
 * />
 *
 * @example
 * // Vertical step indicator with click handling
 * <StepIndicator
 *   steps={['Step 1', 'Step 2', 'Step 3']}
 *   currentStep={1}
 *   completedSteps={[0]}
 *   variant="vertical"
 *   onStepClick={(index) => console.log('Clicked step', index)}
 * />
 */
export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  completedSteps = [],
  variant = 'horizontal',
  onStepClick
}) => {
  const isStepCompleted = (index: number): boolean => {
    return completedSteps.includes(index)
  }

  const isStepClickable = (index: number): boolean => {
    return !!onStepClick && (isStepCompleted(index) || index === currentStep)
  }

  const handleStepClick = (index: number) => {
    if (isStepClickable(index)) {
      onStepClick?.(index)
    }
  }

  return (
    <Container $variant={variant} role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={steps.length}>
      {steps.map((label, index) => {
        const isActive = index === currentStep
        const isCompleted = isStepCompleted(index)
        const isClickable = isStepClickable(index)

        return (
          <StepWrapper
            key={index}
            $variant={variant}
            onClick={() => handleStepClick(index)}
          >
            <StepContent $variant={variant}>
              <StepCircle
                $active={isActive}
                $completed={isCompleted}
                $clickable={isClickable}
                aria-label={`Step ${index + 1}: ${label}`}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? <CheckIcon>✓</CheckIcon> : index + 1}
              </StepCircle>
              <StepLabel
                $active={isActive}
                $completed={isCompleted}
                $variant={variant}
              >
                {label}
              </StepLabel>
            </StepContent>
          </StepWrapper>
        )
      })}
    </Container>
  )
}
