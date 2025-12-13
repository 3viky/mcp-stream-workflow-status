import { useEffect, useRef, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'

/**
 * Props for ThreeDSecureModal component
 */
export interface ThreeDSecureModalProps {
  isOpen: boolean
  authUrl: string
  subscriptionId: string
  onSuccess: () => void
  onError: (error: Error) => void
  onClose: () => void
  timeoutMs?: number
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${props => props.theme.zIndex?.modal || 1000};
  padding: ${props => props.theme.spacing.lg};
  animation: ${fadeIn} 0.2s ease-out;
`

const ModalContainer = styled.div`
  background: ${props => props.theme.colors.surface || props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: ${props => props.theme.shadows.xl};
  animation: ${slideIn} 0.3s ease-out;

  ${props => props.theme.extensions?.cyberpunk && css`
    box-shadow: 0 0 40px ${props.theme.colors.primary}40,
                ${props.theme.shadows.xl};
  `}
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`

const Title = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};

  ${props => props.theme.extensions?.cyberpunk && css`
    text-shadow: 0 0 10px ${props.theme.colors.primary};
  `}
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color ${props => props.theme.transitions.normal};
  border-radius: ${props => props.theme.borderRadius.sm};

  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}10;
  }
`

const Content = styled.div`
  padding: ${props => props.theme.spacing.lg};
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`

const InfoBox = styled.div`
  background: ${props => props.theme.colors.primary}10;
  border: 1px solid ${props => props.theme.colors.primary}40;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  display: flex;
  gap: ${props => props.theme.spacing.md};
  align-items: flex-start;
`

const InfoIcon = styled.span`
  font-size: 24px;
  flex-shrink: 0;
`

const InfoText = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.sm};
  line-height: 1.5;
`

const IframeContainer = styled.div`
  width: 100%;
  height: 400px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  position: relative;
  background: ${props => props.theme.colors.background};
`

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.colors.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.md};
`

const pulseAnimation = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
`

const LoadingIcon = styled.div`
  font-size: 48px;
  animation: ${pulseAnimation} 1.5s ease-in-out infinite;
`

const LoadingText = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin: 0;
`

const TimerBar = styled.div`
  margin-top: ${props => props.theme.spacing.md};
`

const TimerLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.xs};
`

const TimerTrack = styled.div`
  height: 4px;
  background: ${props => props.theme.colors.border};
  border-radius: 2px;
  overflow: hidden;
`

const TimerProgress = styled.div<{ $progress: number; $warning: boolean }>`
  height: 100%;
  background: ${props => props.$warning ? props.theme.colors.warning : props.theme.colors.primary};
  border-radius: 2px;
  width: ${props => props.$progress}%;
  transition: width 1s linear, background-color 0.3s;

  ${props => props.theme.extensions?.cyberpunk && css`
    box-shadow: 0 0 8px ${props.$warning
      ? props.theme.colors.warning
      : props.theme.colors.primary};
  `}
`

const Footer = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.md};
`

const CancelButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};

  &:hover {
    border-color: ${props => props.theme.colors.error};
    color: ${props => props.theme.colors.error};
  }
`

const DEFAULT_TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes

/**
 * Modal for handling 3D Secure authentication.
 * Displays Segpay's 3DS authentication page in an iframe and
 * listens for completion via postMessage.
 */
export function ThreeDSecureModal({
  isOpen,
  authUrl,
  subscriptionId: _subscriptionId,
  onSuccess,
  onError,
  onClose,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: ThreeDSecureModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState(timeoutMs)

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(true)
      setTimeRemaining(timeoutMs)
      return
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === '3ds_complete') {
        if (event.data.success) {
          onSuccess()
        } else {
          onError(new Error(event.data.error || '3D Secure authentication failed'))
        }
      }
    }

    window.addEventListener('message', handleMessage)

    const timeoutId = setTimeout(() => {
      onError(new Error('3D Secure authentication timed out. Please try again.'))
    }, timeoutMs)

    const intervalId = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1000))
    }, 1000)

    return () => {
      window.removeEventListener('message', handleMessage)
      clearTimeout(timeoutId)
      clearInterval(intervalId)
    }
  }, [isOpen, timeoutMs, onSuccess, onError])

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleCancel = () => {
    onClose()
  }

  if (!isOpen) return null

  const progress = (timeRemaining / timeoutMs) * 100
  const isWarning = timeRemaining < 60000 // Less than 1 minute
  const minutes = Math.floor(timeRemaining / 60000)
  const seconds = Math.floor((timeRemaining % 60000) / 1000)

  return (
    <Overlay onClick={e => e.stopPropagation()}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <Header>
          <Title>
            <span>🔐</span>
            Secure Authentication
          </Title>
          <CloseButton onClick={handleCancel} aria-label="Close">
            ✕
          </CloseButton>
        </Header>

        <Content>
          <InfoBox>
            <InfoIcon>🛡️</InfoIcon>
            <InfoText>
              Your bank requires additional verification for this payment. Please complete
              the authentication in the form below. This is a one-time verification to
              protect your account.
            </InfoText>
          </InfoBox>

          <IframeContainer>
            {isLoading && (
              <LoadingOverlay>
                <LoadingIcon>🔒</LoadingIcon>
                <LoadingText>Loading secure authentication...</LoadingText>
              </LoadingOverlay>
            )}
            <StyledIframe
              ref={iframeRef}
              src={authUrl}
              onLoad={handleIframeLoad}
              title="3D Secure Authentication"
              sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
            />
          </IframeContainer>

          <TimerBar>
            <TimerLabel>
              <span>Time remaining</span>
              <span style={{ color: isWarning ? 'orange' : undefined }}>
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
            </TimerLabel>
            <TimerTrack>
              <TimerProgress $progress={progress} $warning={isWarning} />
            </TimerTrack>
          </TimerBar>
        </Content>

        <Footer>
          <CancelButton onClick={handleCancel}>
            Cancel Payment
          </CancelButton>
        </Footer>
      </ModalContainer>
    </Overlay>
  )
}
