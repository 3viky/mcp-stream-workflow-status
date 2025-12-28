/**
 * MessageComposer Composite Component
 *
 * Rich message composition with attachments, emojis, formatting, and content flagging
 */

import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import {
  Send,
  Smile,
  Paperclip,
  Image as ImageIcon,
  Bold,
  Italic,
  Link,
  X,
  AlertTriangle,
} from 'lucide-react'
import {
  useContentFlagging,
  FlagScoreIndicator,
  type ContentFlaggingConfig,
} from '@transftw/text-utils'

export interface MessageComposerConfig {
  /** Allow emoji picker */
  allowEmoji?: boolean
  /** Allow file attachments */
  allowAttachments?: boolean
  /** Allow image uploads */
  allowImages?: boolean
  /** Allow text formatting (bold, italic, links) */
  allowFormatting?: boolean
  /** Max message length */
  maxLength?: number
  /** Max file size (bytes) */
  maxFileSize?: number
  /** Placeholder text */
  placeholder?: string
  /** Show character counter */
  showCharCounter?: boolean
  /** Enable content flagging */
  enableContentFlagging?: boolean
  /** Content flagging threshold (0-100) */
  flagThreshold?: number
  /** Content flagging context */
  flagContext?: ContentFlaggingConfig['context']
}

export interface Attachment {
  id: string
  type: 'file' | 'image'
  name: string
  size: number
  url?: string
  preview?: string
}

export interface MessageComposerProps {
  /** Send message handler */
  onSend: (content: string, attachments?: Attachment[]) => void
  /** Disabled state */
  disabled?: boolean
  /** Configuration options */
  config?: MessageComposerConfig
  /** Additional CSS class */
  className?: string
}

const ComposerContainer = styled.div<{ $hasError?: boolean }>`
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.colors.surface || '#111827'};
  border: 1px solid ${(props) =>
    props.$hasError
      ? props.theme.colors.error || '#ef4444'
      : props.theme.colors.border || '#374151'};
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: ${(props) =>
      props.$hasError
        ? props.theme.colors.error || '#ef4444'
        : props.theme.colors.primary || '#3b82f6'};
  }
`

const AttachmentsPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 12px 0;
`

const AttachmentChip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: ${(props) => props.theme.colors.background || '#1f2937'};
  border: 1px solid ${(props) => props.theme.colors.border || '#374151'};
  border-radius: 8px;
  font-size: 12px;
  color: ${(props) => props.theme.colors.text || '#ffffff'};

  img {
    width: 32px;
    height: 32px;
    object-fit: cover;
    border-radius: 4px;
  }
`

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  background: transparent;
  color: ${(props) => props.theme.colors.text.secondary || '#9ca3af'};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.colors.error || '#ef4444'};
  }
`

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
`

const TextArea = styled.textarea`
  width: 100%;
  min-height: 60px;
  max-height: 200px;
  padding: 0;
  border: none;
  background: transparent;
  color: ${(props) => props.theme.colors.text || '#ffffff'};
  font-size: 14px;
  font-family: inherit;
  line-height: 1.5;
  resize: none;
  outline: none;

  &::placeholder {
    color: ${(props) => props.theme.colors.text.secondary || '#9ca3af'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid ${(props) => props.theme.colors.border || '#374151'};
`

const ToolbarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  color: ${(props) => props.theme.colors.text.secondary || '#9ca3af'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.colors.background || '#1f2937'};
    color: ${(props) => props.theme.colors.text || '#ffffff'};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

const SendButton = styled.button<{ $blocked?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  background: ${(props) =>
    props.$blocked
      ? props.theme.colors.error || '#ef4444'
      : props.theme.colors.primary || '#3b82f6'};
  color: ${(props) => props.theme.colors.text || '#ffffff'};
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${(props) =>
      props.$blocked
        ? '#dc2626'
        : props.theme.colors.hover.primary || '#2563eb'};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const CharCounter = styled.span<{ $overLimit: boolean }>`
  font-size: 12px;
  color: ${(props) =>
    props.$overLimit
      ? props.theme.colors.error || '#ef4444'
      : props.theme.colors.text.secondary || '#9ca3af'};
`

const HiddenFileInput = styled.input`
  display: none;
`

const FlagWarning = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: ${(props) => props.theme.colors.error || '#ef4444'}15;
  border-top: 1px solid ${(props) => props.theme.colors.error || '#ef4444'}30;
  font-size: 12px;
  color: ${(props) => props.theme.colors.error || '#ef4444'};
`

const defaultConfig: Required<MessageComposerConfig> = {
  allowEmoji: true,
  allowAttachments: true,
  allowImages: true,
  allowFormatting: true,
  maxLength: 2000,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  placeholder: 'Type a message...',
  showCharCounter: true,
  enableContentFlagging: true,
  flagThreshold: 50,
  flagContext: 'message',
}

export function MessageComposer({
  onSend,
  disabled = false,
  config,
  className,
}: MessageComposerProps) {
  const [content, setContent] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const mergedConfig = { ...defaultConfig, ...config }

  // Content flagging
  const { passes: flagPasses, score: flagScore, isAnalyzing } = useContentFlagging(
    mergedConfig.enableContentFlagging ? content : '',
    {
      threshold: mergedConfig.flagThreshold,
      context: mergedConfig.flagContext,
      debounceMs: 150,
      enabled: mergedConfig.enableContentFlagging,
    }
  )

  const charCount = content.length
  const overLimit = charCount > mergedConfig.maxLength
  const hasContent = content.trim().length > 0 || attachments.length > 0
  const isFlagged = mergedConfig.enableContentFlagging && !flagPasses && content.length > 0
  const canSend = hasContent && !overLimit && !disabled && !isFlagged

  const handleSend = () => {
    if (!canSend) return

    onSend(content.trim(), attachments.length > 0 ? attachments : undefined)
    setContent('')
    setAttachments([])

    // Reset textarea height
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto'
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)

    // Auto-expand textarea
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const files = Array.from(e.target.files || [])

    files.forEach((file) => {
      if (file.size > mergedConfig.maxFileSize) {
        alert(`File "${file.name}" is too large. Max size: ${mergedConfig.maxFileSize / 1024 / 1024}MB`)
        return
      }

      const attachment: Attachment = {
        id: `${Date.now()}-${Math.random()}`,
        type,
        name: file.name,
        size: file.size,
      }

      // Create preview for images
      if (type === 'image') {
        const reader = new FileReader()
        reader.onload = (e) => {
          attachment.preview = e.target?.result as string
          setAttachments((prev) => [...prev, attachment])
        }
        reader.readAsDataURL(file)
      } else {
        setAttachments((prev) => [...prev, attachment])
      }
    })

    // Reset input
    e.target.value = ''
  }

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  const insertFormatting = (format: 'bold' | 'italic' | 'link') => {
    if (!textAreaRef.current) return

    const start = textAreaRef.current.selectionStart
    const end = textAreaRef.current.selectionEnd
    const selectedText = content.substring(start, end)

    let formatted = ''
    switch (format) {
      case 'bold':
        formatted = `**${selectedText}**`
        break
      case 'italic':
        formatted = `*${selectedText}*`
        break
      case 'link':
        formatted = `[${selectedText}](url)`
        break
    }

    const newContent = content.substring(0, start) + formatted + content.substring(end)
    setContent(newContent)

    // Focus back to textarea
    setTimeout(() => {
      textAreaRef.current?.focus()
      textAreaRef.current?.setSelectionRange(start + formatted.length, start + formatted.length)
    }, 0)
  }

  return (
    <ComposerContainer className={className} $hasError={isFlagged}>
      {attachments.length > 0 && (
        <AttachmentsPreview>
          {attachments.map((attachment) => (
            <AttachmentChip key={attachment.id}>
              {attachment.type === 'image' && attachment.preview && (
                <img src={attachment.preview} alt={attachment.name} />
              )}
              <span>{attachment.name}</span>
              <RemoveButton onClick={() => removeAttachment(attachment.id)}>
                <X size={14} />
              </RemoveButton>
            </AttachmentChip>
          ))}
        </AttachmentsPreview>
      )}

      <InputArea>
        <TextArea
          ref={textAreaRef}
          value={content}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={mergedConfig.placeholder}
          disabled={disabled}
          maxLength={mergedConfig.maxLength}
        />

        <Toolbar>
          <ToolbarSection>
            {mergedConfig.allowFormatting && (
              <>
                <IconButton
                  onClick={() => insertFormatting('bold')}
                  disabled={disabled}
                  title="Bold"
                >
                  <Bold size={16} />
                </IconButton>
                <IconButton
                  onClick={() => insertFormatting('italic')}
                  disabled={disabled}
                  title="Italic"
                >
                  <Italic size={16} />
                </IconButton>
                <IconButton
                  onClick={() => insertFormatting('link')}
                  disabled={disabled}
                  title="Link"
                >
                  <Link size={16} />
                </IconButton>
              </>
            )}

            {mergedConfig.allowEmoji && (
              <IconButton disabled={disabled} title="Emoji">
                <Smile size={16} />
              </IconButton>
            )}

            {mergedConfig.allowAttachments && (
              <>
                <IconButton
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                  title="Attach file"
                >
                  <Paperclip size={16} />
                </IconButton>
                <HiddenFileInput
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => handleFileSelect(e, 'file')}
                  multiple
                />
              </>
            )}

            {mergedConfig.allowImages && (
              <>
                <IconButton
                  onClick={() => imageInputRef.current?.click()}
                  disabled={disabled}
                  title="Upload image"
                >
                  <ImageIcon size={16} />
                </IconButton>
                <HiddenFileInput
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, 'image')}
                  multiple
                />
              </>
            )}
          </ToolbarSection>

          <ToolbarSection>
            {mergedConfig.enableContentFlagging && content.length > 0 && (
              <FlagScoreIndicator
                score={flagScore}
                passes={flagPasses}
                threshold={mergedConfig.flagThreshold}
                size="sm"
                showBar={false}
              />
            )}
            {mergedConfig.showCharCounter && (
              <CharCounter $overLimit={overLimit}>
                {charCount}/{mergedConfig.maxLength}
              </CharCounter>
            )}
            <SendButton
              onClick={handleSend}
              disabled={!canSend || isAnalyzing}
              $blocked={isFlagged}
              title={isFlagged ? 'Content flagged - please modify' : 'Send message'}
            >
              {isFlagged ? <AlertTriangle size={16} /> : <Send size={16} />}
              {isFlagged ? 'Flagged' : 'Send'}
            </SendButton>
          </ToolbarSection>
        </Toolbar>
      </InputArea>

      {isFlagged && (
        <FlagWarning>
          <AlertTriangle size={14} />
          Content flagged — please modify before sending
        </FlagWarning>
      )}
    </ComposerContainer>
  )
}
