import React, { useState } from 'react'
import styled from 'styled-components'
import { useMutation } from '@tanstack/react-query'
import { AlertTriangle } from 'lucide-react'
import { useContentFlagging, FlagScoreIndicator } from '@transftw/text-utils'

// Types
export interface InquiryFormProps {
  deploymentId: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

interface InquiryData {
  name: string
  email: string
  message: string
}

interface InquiryResponse {
  success: boolean
  inquiryId: string
}

// Styled Components
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
  width: 100%;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.surface};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.surface};
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const Button = styled.button`
  padding: 0.875rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.active.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const ErrorMessage = styled.div`
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
`

const CharacterCount = styled.div<{ isNearLimit: boolean }>`
  font-size: 0.75rem;
  color: ${({ theme, isNearLimit }) =>
    isNearLimit ? theme.colors.warning : theme.colors.text.secondary};
  text-align: right;
`

const FlagWarning = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-size: 14px;
  color: #dc2626;
`

const FieldFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`

// Component
export function InquiryForm({
  deploymentId,
  onSuccess,
  onError,
}: InquiryFormProps) {
  const [formData, setFormData] = useState<InquiryData>({
    name: '',
    email: '',
    message: '',
  })

  const MAX_MESSAGE_LENGTH = 1000

  // Content flagging for inquiry messages
  const messageFlagging = useContentFlagging(formData.message, {
    threshold: 50,
    context: 'message',
    debounceMs: 150,
  })

  const isFlagged = !messageFlagging.passes && formData.message.length > 0

  const submitInquiry = useMutation<InquiryResponse, Error, InquiryData>({
    mutationFn: async (data: InquiryData) => {
      const response = await fetch('/api/messaging/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, deploymentId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to submit inquiry')
      }

      return response.json()
    },
    onSuccess: (_data) => {
      // Reset form
      setFormData({ name: '', email: '', message: '' })
      onSuccess?.()
    },
    onError: (error) => {
      onError?.(error)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      onError?.(new Error('Name is required'))
      return
    }
    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      onError?.(new Error('Valid email is required'))
      return
    }
    if (!formData.message.trim()) {
      onError?.(new Error('Message is required'))
      return
    }
    if (formData.message.length > MAX_MESSAGE_LENGTH) {
      onError?.(new Error(`Message must be ${MAX_MESSAGE_LENGTH} characters or less`))
      return
    }
    // Block submission if content is flagged
    if (isFlagged) {
      onError?.(new Error('Message contains flagged content. Please modify before sending.'))
      return
    }

    submitInquiry.mutate(formData)
  }

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const messageLength = formData.message.length
  const isNearLimit = messageLength > MAX_MESSAGE_LENGTH * 0.9

  return (
    <FormContainer onSubmit={handleSubmit}>
      <InputGroup>
        <Label htmlFor="inquiry-name">Name</Label>
        <Input
          id="inquiry-name"
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          placeholder="Your name"
          disabled={submitInquiry.isPending}
          required
        />
      </InputGroup>

      <InputGroup>
        <Label htmlFor="inquiry-email">Email</Label>
        <Input
          id="inquiry-email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          placeholder="your.email@example.com"
          disabled={submitInquiry.isPending}
          required
        />
      </InputGroup>

      {isFlagged && (
        <FlagWarning>
          <AlertTriangle size={16} />
          Message contains flagged content — please modify before sending
        </FlagWarning>
      )}

      <InputGroup>
        <Label htmlFor="inquiry-message">Message</Label>
        <TextArea
          id="inquiry-message"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          placeholder="How can we help you?"
          disabled={submitInquiry.isPending}
          maxLength={MAX_MESSAGE_LENGTH}
          required
          style={isFlagged ? { borderColor: '#dc2626' } : undefined}
        />
        <FieldFooter>
          <CharacterCount isNearLimit={isNearLimit}>
            {messageLength}/{MAX_MESSAGE_LENGTH}
          </CharacterCount>
          {formData.message.length > 0 && (
            <FlagScoreIndicator
              score={messageFlagging.score}
              passes={messageFlagging.passes}
              threshold={50}
              size="sm"
              showBar={false}
            />
          )}
        </FieldFooter>
      </InputGroup>

      {submitInquiry.isError && (
        <ErrorMessage>
          {submitInquiry.error.message || 'Failed to send inquiry. Please try again.'}
        </ErrorMessage>
      )}

      <Button type="submit" disabled={submitInquiry.isPending || isFlagged || messageFlagging.isAnalyzing}>
        {isFlagged ? 'Content Flagged' : submitInquiry.isPending ? 'Sending...' : 'Send Inquiry'}
      </Button>
    </FormContainer>
  )
}
