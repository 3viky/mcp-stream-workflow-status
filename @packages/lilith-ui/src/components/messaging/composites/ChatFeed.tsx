/**
 * ChatFeed Composite Component
 *
 * Live chat feed optimized for high-volume broadcast scenarios (streams, events)
 */

import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Loader2, AlertCircle, ChevronDown } from 'lucide-react'
import { MessageBubble } from '../primitives/MessageBubble'
import { MessageInput } from '../primitives/MessageInput'

export interface ChatFeedConfig {
  /** Auto-scroll to bottom on new messages */
  autoScroll?: boolean
  /** Max messages to render (performance) */
  maxMessages?: number
  /** Show timestamps */
  showTimestamps?: boolean
  /** Show priority badges */
  showPriorityBadges?: boolean
  /** Enable message input */
  enableInput?: boolean
  /** Input placeholder */
  inputPlaceholder?: string
  /** Show "scroll to bottom" button when scrolled up */
  showScrollButton?: boolean
  /** Show live indicator */
  showLiveIndicator?: boolean
  /** Empty state message */
  emptyMessage?: string
}

export interface ChatFeedProps {
  /** Feed/room ID */
  feedId: string
  /** Current user ID */
  currentUserId: string
  /** Messages to display */
  messages: Array<{
    id: string
    content: string
    senderId: string
    createdAt: string
    editedAt?: string
    priority?: 'NORMAL' | 'VIP' | 'WHALE' | 'URGENT'
  }>
  /** Loading state */
  isLoading?: boolean
  /** Error state */
  error?: Error | null
  /** Live connection status */
  isLive?: boolean
  /** Send message handler */
  onSendMessage?: (content: string) => void
  /** Configuration options */
  config?: ChatFeedConfig
  /** Additional CSS class */
  className?: string
}

const FeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${(props) => props.theme.colors.background || '#1f2937'};
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`

const LiveIndicator = styled.div<{ $isLive: boolean }>`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${(props) =>
    props.$isLive
      ? 'rgba(34, 197, 94, 0.2)'
      : 'rgba(107, 114, 128, 0.2)'};
  color: ${(props) => (props.$isLive ? '#22c55e' : '#6b7280')};
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  z-index: 10;
  backdrop-filter: blur(4px);

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(props) => (props.$isLive ? '#22c55e' : '#6b7280')};
    animation: ${(props) => (props.$isLive ? 'pulse 2s ease-in-out infinite' : 'none')};
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.border || '#374151'};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.colors.hover.surface || '#4b5563'};
  }
`

const ScrollToBottomButton = styled.button<{ $visible: boolean }>`
  position: absolute;
  bottom: 80px;
  right: 16px;
  display: ${(props) => (props.$visible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.primary || '#3b82f6'};
  color: ${(props) => props.theme.colors.text || '#ffffff'};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 12px;
  color: ${(props) => props.theme.colors.text.secondary || '#9ca3af'};
`

const LoadingSpinner = styled(Loader2)`
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 12px;
  color: ${(props) => props.theme.colors.error || '#ef4444'};
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: ${(props) => props.theme.colors.text.secondary || '#9ca3af'};
  text-align: center;
`

const InputContainer = styled.div`
  padding: 16px;
  border-top: 1px solid ${(props) => props.theme.colors.border || '#374151'};
  background: ${(props) => props.theme.colors.surface || '#111827'};
`

const defaultConfig: Required<ChatFeedConfig> = {
  autoScroll: true,
  maxMessages: 200,
  showTimestamps: true,
  showPriorityBadges: true,
  enableInput: true,
  inputPlaceholder: 'Join the chat...',
  showScrollButton: true,
  showLiveIndicator: true,
  emptyMessage: 'No messages yet. Be the first to chat!',
}

export function ChatFeed({
  feedId: _feedId,
  currentUserId,
  messages,
  isLoading = false,
  error = null,
  isLive = false,
  onSendMessage,
  config,
  className,
}: ChatFeedProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [isNearBottom, setIsNearBottom] = useState(true)
  const mergedConfig = { ...defaultConfig, ...config }

  // Limit messages for performance
  const displayMessages = messages.slice(-mergedConfig.maxMessages)

  // Track scroll position
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight
      const nearBottom = distanceFromBottom < 100

      setIsNearBottom(nearBottom)
      setShowScrollButton(mergedConfig.showScrollButton && !nearBottom)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [mergedConfig.showScrollButton])

  // Auto-scroll to bottom on new messages (only if user is near bottom)
  useEffect(() => {
    if (mergedConfig.autoScroll && isNearBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [displayMessages, mergedConfig.autoScroll, isNearBottom])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = (content: string) => {
    if (onSendMessage) {
      onSendMessage(content)
      // Force scroll to bottom when user sends a message
      setTimeout(() => scrollToBottom(), 100)
    }
  }

  return (
    <FeedContainer className={className}>
      {mergedConfig.showLiveIndicator && (
        <LiveIndicator $isLive={isLive}>{isLive ? 'Live' : 'Offline'}</LiveIndicator>
      )}

      <MessagesContainer ref={messagesContainerRef}>
        {isLoading && (
          <LoadingContainer>
            <LoadingSpinner size={32} />
            <span>Loading chat...</span>
          </LoadingContainer>
        )}

        {error && (
          <ErrorContainer>
            <AlertCircle size={32} />
            <span>Failed to load chat</span>
            <span style={{ fontSize: '12px' }}>{error.message}</span>
          </ErrorContainer>
        )}

        {!isLoading && !error && displayMessages.length === 0 && (
          <EmptyState>
            <span>{mergedConfig.emptyMessage}</span>
          </EmptyState>
        )}

        {!isLoading && !error && displayMessages.length > 0 && (
          <>
            {displayMessages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                currentUserId={currentUserId}
                showTimestamp={mergedConfig.showTimestamps}
                showPriorityBadge={mergedConfig.showPriorityBadges}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </MessagesContainer>

      {mergedConfig.showScrollButton && (
        <ScrollToBottomButton $visible={showScrollButton} onClick={scrollToBottom}>
          <ChevronDown size={20} />
        </ScrollToBottomButton>
      )}

      {mergedConfig.enableInput && (
        <InputContainer>
          <MessageInput
            onSend={handleSend}
            placeholder={mergedConfig.inputPlaceholder}
            disabled={isLoading || !!error}
          />
        </InputContainer>
      )}
    </FeedContainer>
  )
}
