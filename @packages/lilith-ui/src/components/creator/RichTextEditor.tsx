import React, { useState } from 'react'
import styled from 'styled-components'

export interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  minHeight?: string
}

const EditorContainer = styled.div`
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  overflow: hidden;
  background: ${(props) => props.theme.colors.background};
`

const Toolbar = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.xs};
  padding: ${(props) => props.theme.spacing.sm};
  background: ${(props) => props.theme.colors.surface};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  flex-wrap: wrap;
`

const ToolbarGroup = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.xs};
  padding-right: ${(props) => props.theme.spacing.sm};
  border-right: 1px solid ${(props) => props.theme.colors.border};

  &:last-child {
    border-right: none;
  }
`

const ToolButton = styled.button<{ $active?: boolean }>`
  background: ${(props) => props.$active ? props.theme.colors.primary + '20' : 'transparent'};
  border: none;
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  cursor: pointer;
  color: ${(props) => props.$active ? props.theme.colors.primary : props.theme.colors.text};
  font-weight: ${(props) => props.$active ? props.theme.typography.fontWeight.semibold : 'normal'};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.colors.primary}10;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const EditorTextarea = styled.div<{ $minHeight?: string; $disabled?: boolean }>`
  padding: ${(props) => props.theme.spacing.md};
  min-height: ${(props) => props.$minHeight || '200px'};
  font-size: ${(props) => props.theme.typography.fontSize.base};
  color: ${(props) => props.theme.colors.text};
  line-height: 1.6;
  overflow-y: auto;
  outline: none;
  opacity: ${(props) => props.$disabled ? 0.6 : 1};
  cursor: ${(props) => props.$disabled ? 'not-allowed' : 'text'};

  &:empty:before {
    content: attr(data-placeholder);
    color: ${(props) => props.theme.colors.text.secondary};
    pointer-events: none;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: ${(props) => props.theme.spacing.md} 0;
    font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  }

  p {
    margin: ${(props) => props.theme.spacing.sm} 0;
  }

  strong {
    font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  }

  em {
    font-style: italic;
  }

  u {
    text-decoration: underline;
  }

  ul, ol {
    margin: ${(props) => props.theme.spacing.sm} 0;
    padding-left: ${(props) => props.theme.spacing.xl};
  }

  a {
    color: ${(props) => props.theme.colors.primary};
    text-decoration: underline;
  }

  code {
    background: ${(props) => props.theme.colors.surface};
    padding: 2px 6px;
    border-radius: ${(props) => props.theme.borderRadius.sm};
    font-family: monospace;
  }
`

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start writing...',
  disabled = false,
  minHeight
}) => {
  const [editorRef, setEditorRef] = useState<HTMLDivElement | null>(null)

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef?.focus()
  }

  const handleInput = () => {
    if (editorRef) {
      onChange(editorRef.innerHTML)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
  }

  return (
    <EditorContainer>
      <Toolbar>
        <ToolbarGroup>
          <ToolButton
            onClick={() => execCommand('bold')}
            title="Bold"
            disabled={disabled}
          >
            <strong>B</strong>
          </ToolButton>
          <ToolButton
            onClick={() => execCommand('italic')}
            title="Italic"
            disabled={disabled}
          >
            <em>I</em>
          </ToolButton>
          <ToolButton
            onClick={() => execCommand('underline')}
            title="Underline"
            disabled={disabled}
          >
            <u>U</u>
          </ToolButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolButton
            onClick={() => execCommand('formatBlock', '<h1>')}
            title="Heading 1"
            disabled={disabled}
          >
            H1
          </ToolButton>
          <ToolButton
            onClick={() => execCommand('formatBlock', '<h2>')}
            title="Heading 2"
            disabled={disabled}
          >
            H2
          </ToolButton>
          <ToolButton
            onClick={() => execCommand('formatBlock', '<h3>')}
            title="Heading 3"
            disabled={disabled}
          >
            H3
          </ToolButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolButton
            onClick={() => execCommand('insertUnorderedList')}
            title="Bullet List"
            disabled={disabled}
          >
            • List
          </ToolButton>
          <ToolButton
            onClick={() => execCommand('insertOrderedList')}
            title="Numbered List"
            disabled={disabled}
          >
            1. List
          </ToolButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolButton
            onClick={() => {
              const url = prompt('Enter URL:')
              if (url) execCommand('createLink', url)
            }}
            title="Insert Link"
            disabled={disabled}
          >
            🔗 Link
          </ToolButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolButton
            onClick={() => execCommand('removeFormat')}
            title="Clear Formatting"
            disabled={disabled}
          >
            Clear
          </ToolButton>
        </ToolbarGroup>
      </Toolbar>

      <EditorTextarea
        ref={setEditorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
        $minHeight={minHeight}
        $disabled={disabled}
      />
    </EditorContainer>
  )
}
