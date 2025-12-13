import type { ReactNode } from 'react'
import styled, { css } from 'styled-components'

/**
 * Modal component props
 */
export interface ModalProps {
  /** Whether the modal is visible */
  isOpen: boolean
  /** Callback fired when the modal should close */
  onClose: () => void
  /** Modal title displayed in the header */
  title: string
  /** Modal content */
  children: ReactNode
  /** Maximum width of the modal (default: '600px') */
  maxWidth?: string
  /** Maximum height of the modal (default: '90vh') */
  maxHeight?: string
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${props => props.theme.zIndex?.modal || 1000};
  padding: ${props => props.theme.spacing.lg};
`

const ModalContent = styled.div<{ $maxWidth?: string; $maxHeight?: string }>`
  background: ${props => props.theme.colors.surface || props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  max-width: ${props => props.$maxWidth || '600px'};
  width: 100%;
  max-height: ${props => props.$maxHeight || '90vh'};
  display: flex;
  flex-direction: column;
  box-shadow: ${props => props.theme.shadows.xl};

  /* Cyberpunk neon glow effect */
  ${props => props.theme.extensions?.cyberpunk && css`
    box-shadow: 0 0 30px ${props.theme.colors.primary}40,
                ${props.theme.shadows.xl};
  `}
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.xl};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  flex-shrink: 0;
`

const ModalTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};

  /* Cyberpunk text glow */
  ${props => props.theme.extensions?.cyberpunk && css`
    text-shadow: 0 0 10px ${props.theme.colors.primary};
  `}
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.accent || props.theme.colors.secondary};
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color ${props => props.theme.transitions.normal};

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`

const ModalBody = styled.div`
  padding: ${props => props.theme.spacing.xl};
  overflow-y: auto;
  flex: 1;
`

/**
 * Cyberpunk-themed modal dialog with neon border and glow effect.
 * Features a dark overlay, closeable header, and scrollable content area.
 *
 * @param props - Modal component props
 * @param props.isOpen - Whether the modal is visible
 * @param props.onClose - Callback fired when the modal should close
 * @param props.title - Modal title displayed in the header
 * @param props.children - Modal content
 * @param props.maxWidth - Maximum width of the modal (default: '600px')
 * @param props.maxHeight - Maximum height of the modal (default: '90vh')
 * @returns A modal dialog or null if not open
 *
 * @example
 * // Basic confirmation modal
 * function Example() {
 *   const [isOpen, setIsOpen] = useState(false)
 *   return (
 *     <div>
 *       <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
 *       <Modal
 *         isOpen={isOpen}
 *         onClose={() => setIsOpen(false)}
 *         title="Confirm Action"
 *       >
 *         <p>Are you sure you want to continue?</p>
 *         <ModalActions>
 *           <Button variant="secondary" onClick={() => setIsOpen(false)}>
 *             Cancel
 *           </Button>
 *           <Button variant="danger" onClick={() => setIsOpen(false)}>
 *             Confirm
 *           </Button>
 *         </ModalActions>
 *       </Modal>
 *     </div>
 *   )
 * }
 */
export function Modal({ isOpen, onClose, title, children, maxWidth, maxHeight }: ModalProps) {
  if (!isOpen) return null

  return (
    <Overlay onClick={onClose}>
      <ModalContent
        $maxWidth={maxWidth}
        $maxHeight={maxHeight}
        onClick={e => e.stopPropagation()}
      >
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContent>
    </Overlay>
  )
}

/**
 * ModalActions component props
 */
export interface ModalActionsProps {
  /** Action buttons or elements */
  children: ReactNode
}

const ActionsContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.xl};
  justify-content: flex-end;
`

/**
 * Modal actions container for action buttons at the bottom of a modal.
 * Provides right-aligned flexbox layout with spacing.
 *
 * @param props - ModalActions component props
 * @param props.children - Action buttons or elements
 * @returns A right-aligned actions container
 *
 * @example
 * // Typical modal action buttons
 * <ModalActions>
 *   <Button variant="secondary">Cancel</Button>
 *   <Button variant="primary">Save</Button>
 * </ModalActions>
 */
export function ModalActions({ children }: ModalActionsProps) {
  return <ActionsContainer>{children}</ActionsContainer>
}
