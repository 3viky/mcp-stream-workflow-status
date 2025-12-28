import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Modal, ModalActions } from '../feedback/Modal'
import { Button } from '../primitives/Button'
import { Alert } from '../primitives/Alert'

export interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  requireTypedConfirmation?: string
  countdown?: number
  onConfirm: () => void | Promise<void>
  onCancel: () => void
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
`

const Message = styled.p`
  color: ${(props) => props.theme.colors.text};
  margin: 0;
  line-height: 1.6;
`

const TypedConfirmInput = styled.input`
  width: 100%;
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.base};
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`

const TypedConfirmLabel = styled.label`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};

  code {
    padding: 2px 6px;
    background: ${(props) => props.theme.colors.surface};
    border-radius: ${(props) => props.theme.borderRadius.sm};
    font-family: monospace;
    color: ${(props) => props.theme.colors.primary};
  }
`

const CountdownText = styled.span`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
`

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  requireTypedConfirmation,
  countdown,
  onConfirm,
  onCancel
}) => {
  const [typedValue, setTypedValue] = useState('')
  const [isConfirming, setIsConfirming] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState(countdown)

  useEffect(() => {
    if (isOpen) {
      setTypedValue('')
      setRemainingSeconds(countdown)
    }
  }, [isOpen, countdown])

  useEffect(() => {
    if (!isOpen || !remainingSeconds || remainingSeconds <= 0) return

    const timer = setInterval(() => {
      setRemainingSeconds(prev => {
        if (!prev || prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, remainingSeconds])

  const handleConfirm = async () => {
    setIsConfirming(true)
    try {
      await onConfirm()
    } finally {
      setIsConfirming(false)
    }
  }

  const canConfirm =
    (!requireTypedConfirmation || typedValue === requireTypedConfirmation) &&
    (!countdown || remainingSeconds === 0) &&
    !isConfirming

  const getAlertVariant = () => {
    switch (variant) {
      case 'danger':
        return 'error'
      case 'warning':
        return 'warning'
      default:
        return 'info'
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      maxWidth="500px"
    >
      <Content>
        <Alert variant={getAlertVariant()}>
          <Message>{message}</Message>
        </Alert>

        {requireTypedConfirmation && (
          <div>
            <TypedConfirmLabel>
              Type <code>{requireTypedConfirmation}</code> to confirm:
            </TypedConfirmLabel>
            <TypedConfirmInput
              type="text"
              value={typedValue}
              onChange={(e) => setTypedValue(e.target.value)}
              placeholder={requireTypedConfirmation}
              autoFocus
            />
          </div>
        )}

        {countdown !== undefined && remainingSeconds !== undefined && remainingSeconds > 0 && (
          <CountdownText>
            Please wait {remainingSeconds} second{remainingSeconds !== 1 ? 's' : ''} before confirming...
          </CountdownText>
        )}
      </Content>

      <ModalActions>
        <Button
          variant="ghost"
          onClick={onCancel}
          disabled={isConfirming}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          onClick={handleConfirm}
          disabled={!canConfirm || isConfirming}
        >
          {confirmLabel}
        </Button>
      </ModalActions>
    </Modal>
  )
}
