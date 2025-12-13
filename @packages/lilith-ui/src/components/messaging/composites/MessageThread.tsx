/**
 * MessageThread Composite Component
 *
 * Config-driven message thread view with auto-scrolling and live updates
 */

import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Loader2, AlertCircle } from 'lucide-react'
import { MessageBubble } from '../primitives/MessageBubble'
import { MessageInput } from '../primitives/MessageInput'

export interface MessageThreadConfig {
  /** Auto-scroll to bottom on new messages */
  autoScroll?: boolean
  /** Show timestamps on messages */
  showTimestamps?: boolean
  /** Show priority badges */
  showPriorityBadges?: boolean
  /** Enable message input */
  enableInput?: boolean
  /** Placeholder text for input */
  inputPlaceholder?: string
  /** Max message length */
  maxMessageLength?: number
  /** Allow emoji picker */
  allowEmoji?: boolean
  /** Thread header content */
  header?: React.ReactNode
  /** Loading text */
  loadingText?: string
  /** Empty state message */
  emptyMessage?: string
}

export interface MessageThreadProps {
  /** Thread/room ID */
  threadId: string
  /** Current user ID for sender/receiver distinction */
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
  /** Send message handler */
  onSendMessage?: (content: string) => void
  /** Configuration options */
  config?: MessageThreadConfig
  /** Additional CSS class */
  className?: string
}

const ThreadContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${(props) => props.theme.colors.background || '#1f2937'};
  border-radius: 8px;
  overflow: hidden;
`

const ThreadHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${(props) => props.theme.colors.border || '#374151'};
  background: ${(props) => props.theme.colors.surface || '#111827'};
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

const defaultConfig: Required<MessageThreadConfig> = {
  autoScroll: true,
  showTimestamps: true,
  showPriorityBadges: false,
  enableInput: true,
  inputPlaceholder: 'Type a message...',
  maxMessageLength: 2000,
  allowEmoji: true,
  header: null,
  loadingText: 'Loading messages...',
  emptyMessage: 'No messages yet. Start the conversation!',
}

export function MessageThread({
  threadId: _threadId,
  currentUserId,
  messages,
  isLoading = false,
  error = null,
  onSendMessage,
  config,
  className,
}: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const mergedConfig = { ...defaultConfig, ...config }

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (mergedConfig.autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, mergedConfig.autoScroll])

  const handleSend = (content: string) => {
    if (onSendMessage) {
      onSendMessage(content)
    }
  }

  return (
    <ThreadContainer className={className}>
      {mergedConfig.header && <ThreadHeader>{mergedConfig.header}</ThreadHeader>}

      <MessagesContainer ref={messagesContainerRef}>
        {isLoading && (
          <LoadingContainer>
            <LoadingSpinner size={32} />
            <span>{mergedConfig.loadingText}</span>
          </LoadingContainer>
        )}

        {error && (
          <ErrorContainer>
            <AlertCircle size={32} />
            <span>Failed to load messages</span>
            <span style={{ fontSize: '12px' }}>{error.message}</span>
          </ErrorContainer>
        )}

        {!isLoading && !error && messages.length === 0 && (
          <EmptyState>
            <span>{mergedConfig.emptyMessage}</span>
          </EmptyState>
        )}

        {!isLoading && !error && messages.length > 0 && (
          <>
            {messages.map((message) => (
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

      {mergedConfig.enableInput && (
        <InputContainer>
          <MessageInput
            onSend={handleSend}
            placeholder={mergedConfig.inputPlaceholder}
            maxLength={mergedConfig.maxMessageLength}
            allowEmoji={mergedConfig.allowEmoji}
            disabled={isLoading || !!error}
          />
        </InputContainer>
      )}
    </ThreadContainer>
  )
}
