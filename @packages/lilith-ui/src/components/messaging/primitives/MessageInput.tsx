/**
 * MessageInput Component
 *
 * Input field for composing messages with emoji support and send button
 */

import { useState } from 'react'
import type { KeyboardEvent, ChangeEvent } from 'react'
import styled from 'styled-components'
import { Send, Smile } from 'lucide-react'

export interface MessageInputProps {
  onSend: (content: string) => void
  placeholder?: string
  disabled?: boolean
  allowEmoji?: boolean
  maxLength?: number
  className?: string
}

const InputContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 12px;
  background: ${(props) => props.theme.colors.surface || '#1f2937'};
  border-top: 1px solid ${(props) => props.theme.colors.border || '#374151'};
`

const InputWrapper = styled.div`
  flex: 1;
  position: relative;
`

const TextArea = styled.textarea`
  width: 100%;
  min-height: 40px;
  max-height: 120px;
  padding: 10px 40px 10px 12px;
  background: ${(props) => props.theme.colors.background || '#111827'};
  color: ${(props) => props.theme.colors.text || '#ffffff'};
  border: 1px solid ${(props) => props.theme.colors.border || '#374151'};
  border-radius: 20px;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary || '#3b82f6'};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.text.secondary || '#9ca3af'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const EmojiButton = styled.button`
  position: absolute;
  right: 8px;
  bottom: 8px;
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.text.secondary || '#9ca3af'};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: ${(props) => props.theme.colors.primary || '#3b82f6'};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

const SendButton = styled.button<{ $hasContent: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${(props) =>
    props.$hasContent ? props.theme.colors.primary || '#3b82f6' : 'transparent'};
  color: ${(props) => (props.$hasContent ? '#ffffff' : props.theme.colors.text.secondary || '#9ca3af')};
  border: 1px solid
    ${(props) =>
      props.$hasContent ? 'transparent' : props.theme.colors.border || '#374151'};
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.colors.hover.primary || '#2563eb'};
    color: #ffffff;
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

const CharCounter = styled.span<{ $isNearLimit: boolean }>`
  position: absolute;
  bottom: -18px;
  right: 8px;
  font-size: 11px;
  color: ${(props) =>
    props.$isNearLimit ? props.theme.colors.warning || '#f59e0b' : props.theme.colors.text.secondary || '#9ca3af'};
`

export function MessageInput({
  onSend,
  placeholder = 'Type a message...',
  disabled = false,
  allowEmoji = true,
  maxLength = 2000,
  className,
}: MessageInputProps) {
  const [content, setContent] = useState('')

  const handleSend = () => {
    const trimmedContent = content.trim()
    if (trimmedContent && !disabled) {
      onSend(trimmedContent)
      setContent('')
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    if (newContent.length <= maxLength) {
      setContent(newContent)
    }
  }

  const handleEmojiClick = () => {
    // TODO: Implement emoji picker
    console.log('Emoji picker not yet implemented')
  }

  const hasContent = content.trim().length > 0
  const isNearLimit = content.length > maxLength * 0.9

  return (
    <InputContainer className={className}>
      <InputWrapper>
        <TextArea
          value={content}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          aria-label="Message input"
        />
        {allowEmoji && (
          <EmojiButton
            type="button"
            onClick={handleEmojiClick}
            disabled={disabled}
            aria-label="Add emoji"
          >
            <Smile size={20} />
          </EmojiButton>
        )}
        {maxLength && content.length > 0 && (
          <CharCounter $isNearLimit={isNearLimit}>
            {content.length}/{maxLength}
          </CharCounter>
        )}
      </InputWrapper>
      <SendButton
        type="button"
        onClick={handleSend}
        disabled={disabled || !hasContent}
        $hasContent={hasContent}
        aria-label="Send message"
      >
        <Send size={18} />
      </SendButton>
    </InputContainer>
  )
}
