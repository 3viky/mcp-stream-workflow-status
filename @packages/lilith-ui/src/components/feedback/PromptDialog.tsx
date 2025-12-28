import React, { useEffect, useCallback } from 'react'
import styled, { css } from 'styled-components'

export interface PromptDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  onCancel?: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'danger' | 'warning' | 'success'
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${props => props.theme.zIndex?.modal || 9999};
  padding: ${props => props.theme.spacing.md};
  font-family: ${props => props.theme.typography.fontFamily.mono || 'monospace'};
`

const DialogContent = styled.div<{ $borderColor: string }>`
  background-color: ${props => props.theme.colors.surface || props.theme.colors.background};
  border: 2px solid ${props => props.$borderColor};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  max-width: 400px;
  width: 100%;
  box-shadow: 0 0 20px ${props => props.$borderColor};
  animation: fadeInScale 0.3s ease-out;

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`

const DialogTitle = styled.h2<{ $titleColor: string }>`
  color: ${props => props.$titleColor};
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  font-family: ${props => props.theme.typography.fontFamily.mono || 'monospace'};

  /* Cyberpunk text glow */
  ${props => props.theme.extensions?.cyberpunk && css`
    text-shadow: 0 0 10px ${props.$titleColor};
  `}
`

const DialogMessage = styled.p`
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.base};
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
  line-height: 1.5;
  font-family: ${props => props.theme.typography.fontFamily.mono || 'monospace'};
`

const DialogActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
`

const Button = styled.button<{ $variant: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' }>`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-family: ${props => props.theme.typography.fontFamily.mono || 'monospace'};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  border: 2px solid ${props => {
    switch (props.$variant) {
      case 'danger': return props.theme.colors.error
      case 'warning': return props.theme.colors.warning
      case 'success': return props.theme.colors.success
      case 'secondary': return props.theme.colors.border
      default: return props.theme.colors.primary
    }
  }};
  background: ${props => {
    switch (props.$variant) {
      case 'secondary': return 'transparent'
      case 'danger': return props.theme.colors.error
      case 'warning': return props.theme.colors.warning
      case 'success': return props.theme.colors.success
      default: return props.theme.colors.primary
    }
  }};
  color: ${props => {
    switch (props.$variant) {
      case 'secondary': return props.theme.colors.text.primary
      default: return '#000'
    }
  }};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  /* Cyberpunk neon glow on hover */
  ${props => props.theme.extensions?.cyberpunk && css`
    &:hover {
      box-shadow: 0 0 10px ${() => {
        switch (props.$variant) {
          case 'danger': return props.theme.colors.error
          case 'warning': return props.theme.colors.warning
          case 'success': return props.theme.colors.success
          case 'secondary': return props.theme.colors.border
          default: return props.theme.colors.primary
        }
      }};
    }
  `}
`

/**
 * Cyberpunk-themed prompt dialog with keyboard support and variant styles.
 * Features backdrop blur, keyboard navigation (Enter/Escape), and animated entrance.
 *
 * @param props - PromptDialog component props
 * @param props.isOpen - Controls dialog visibility
 * @param props.onClose - Callback when dialog should close
 * @param props.onConfirm - Callback when user confirms action
 * @param props.onCancel - Optional callback when user cancels (also calls onClose)
 * @param props.title - Dialog title text
 * @param props.message - Dialog message/description text
 * @param props.confirmText - Text for confirm button (default: 'Confirm')
 * @param props.cancelText - Text for cancel button (default: 'Cancel')
 * @param props.variant - Visual style variant: 'default', 'danger', 'warning', or 'success'
 * @returns A modal dialog component or null when closed
 *
 * @example
 * // Basic confirmation dialog
 * <PromptDialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={handleDelete}
 *   title="Confirm Delete"
 *   message="Are you sure you want to delete this item?"
 * />
 */
const PromptDialog: React.FC<PromptDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default'
}) => {
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel()
    }
    onClose()
  }, [onCancel, onClose])

  const handleConfirm = useCallback(() => {
    onConfirm()
    onClose()
  }, [onConfirm, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return

    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'Enter') {
      handleConfirm()
    }
  }, [isOpen, onClose, handleConfirm])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  if (!isOpen) return null

  const getVariantColors = () => {
    switch (variant) {
      case 'danger':
        return {
          border: 'var(--error-color)',
          titleColor: 'var(--error-color)',
          buttonVariant: 'danger' as const
        }
      case 'warning':
        return {
          border: 'var(--warning-color)',
          titleColor: 'var(--warning-color)',
          buttonVariant: 'warning' as const
        }
      case 'success':
        return {
          border: 'var(--success-color)',
          titleColor: 'var(--success-color)',
          buttonVariant: 'success' as const
        }
      default:
        return {
          border: 'var(--primary-color)',
          titleColor: 'var(--primary-color)',
          buttonVariant: 'primary' as const
        }
    }
  }

  const variantColors = getVariantColors()

  return (
    <Overlay onClick={handleBackdropClick}>
      <DialogContent $borderColor={variantColors.border}>
        <DialogTitle $titleColor={variantColors.titleColor}>
          {title}
        </DialogTitle>

        <DialogMessage>
          {message}
        </DialogMessage>

        <DialogActions>
          <Button
            $variant="secondary"
            onClick={handleCancel}
          >
            {cancelText}
          </Button>

          <Button
            $variant={variantColors.buttonVariant}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </DialogActions>
      </DialogContent>
    </Overlay>
  )
}

export default PromptDialog
