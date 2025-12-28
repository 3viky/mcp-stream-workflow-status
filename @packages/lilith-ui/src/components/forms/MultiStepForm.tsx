import React, { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../primitives/Button'

export interface FormStep {
  id: string
  label: string
  component: React.ReactNode
  validate?: () => boolean | Promise<boolean>
}

export interface MultiStepFormProps {
  steps: FormStep[]
  onComplete: () => void | Promise<void>
  onCancel?: () => void
  showProgress?: boolean
}

const FormContainer = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  overflow: hidden;
`

const ProgressBar = styled.div`
  display: flex;
  background: ${(props) => props.theme.colors.background};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`

const ProgressStep = styled.div<{ $active: boolean; $completed: boolean }>`
  flex: 1;
  padding: ${(props) => props.theme.spacing.md};
  text-align: center;
  position: relative;
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.$active ? props.theme.typography.fontWeight.semibold : 'normal'};
  color: ${(props) => {
    if (props.$completed) return props.theme.colors.success
    if (props.$active) return props.theme.colors.primary
    return props.theme.colors.text.secondary
  }};
  background: ${(props) => props.$active ? props.theme.colors.primary + '10' : 'transparent'};

  &:not(:last-child)::after {
    content: '→';
    position: absolute;
    right: -12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${(props) => props.theme.colors.text.secondary};
  }
`

const StepNumber = styled.div<{ $active: boolean; $completed: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${(props) => {
    if (props.$completed) return props.theme.colors.success
    if (props.$active) return props.theme.colors.primary
    return props.theme.colors.surface
  }};
  border: 2px solid ${(props) => {
    if (props.$completed) return props.theme.colors.success
    if (props.$active) return props.theme.colors.primary
    return props.theme.colors.border
  }};
  color: ${(props) => (props.$active || props.$completed ? 'white' : props.theme.colors.text.secondary)};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${(props) => props.theme.spacing.xs};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
`

const StepContent = styled.div`
  padding: ${(props) => props.theme.spacing.xl};
  min-height: 300px;
`

const StepActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${(props) => props.theme.spacing.lg};
  border-top: 1px solid ${(props) => props.theme.colors.border};
  background: ${(props) => props.theme.colors.background};
`

const ActionGroup = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
`

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  steps,
  onComplete,
  onCancel,
  showProgress = true
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [isValidating, setIsValidating] = useState(false)

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  const handleNext = async () => {
    const step = steps[currentStep]

    if (step.validate) {
      setIsValidating(true)
      try {
        const isValid = await step.validate()
        if (!isValid) {
          setIsValidating(false)
          return
        }
      } catch (error) {
        setIsValidating(false)
        return
      }
      setIsValidating(false)
    }

    setCompletedSteps(prev => new Set(prev).add(currentStep))

    if (isLastStep) {
      await onComplete()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepIndex: number) => {
    // Allow clicking on completed steps or the next step
    if (completedSteps.has(stepIndex) || stepIndex === currentStep + 1) {
      setCurrentStep(stepIndex)
    }
  }

  return (
    <FormContainer>
      {showProgress && (
        <ProgressBar>
          {steps.map((step, index) => (
            <ProgressStep
              key={step.id}
              $active={index === currentStep}
              $completed={completedSteps.has(index)}
              onClick={() => handleStepClick(index)}
              style={{ cursor: (completedSteps.has(index) || index === currentStep + 1) ? 'pointer' : 'default' }}
            >
              <StepNumber $active={index === currentStep} $completed={completedSteps.has(index)}>
                {completedSteps.has(index) ? '✓' : index + 1}
              </StepNumber>
              {step.label}
            </ProgressStep>
          ))}
        </ProgressBar>
      )}

      <StepContent>
        {steps[currentStep].component}
      </StepContent>

      <StepActions>
        <ActionGroup>
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </ActionGroup>

        <ActionGroup>
          {!isFirstStep && (
            <Button variant="secondary" onClick={handleBack} disabled={isValidating}>
              Back
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={isValidating}
          >
            {isLastStep ? 'Complete' : 'Next'}
          </Button>
        </ActionGroup>
      </StepActions>
    </FormContainer>
  )
}
