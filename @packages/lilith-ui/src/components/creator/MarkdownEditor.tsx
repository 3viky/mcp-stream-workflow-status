import React, { useState } from 'react'
import styled from 'styled-components'
import { Textarea } from '../primitives/Textarea'
import { Tabs } from '../feedback/Tabs'
import type { Tab } from '../feedback/Tabs'

export interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  minHeight?: string
  showPreview?: boolean
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

const ToolButton = styled.button`
  background: transparent;
  border: none;
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  cursor: pointer;
  color: ${(props) => props.theme.colors.text};
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

const EditorTextarea = styled(Textarea)<{ $minHeight?: string }>`
  border: none;
  border-radius: 0;
  min-height: ${(props) => props.$minHeight || '300px'};
  font-family: 'Courier New', monospace;
  resize: vertical;

  &:focus {
    border: none;
    outline: none;
  }
`

const PreviewContainer = styled.div<{ $minHeight?: string }>`
  padding: ${(props) => props.theme.spacing.md};
  min-height: ${(props) => props.$minHeight || '300px'};
  overflow-y: auto;
  line-height: 1.6;

  h1, h2, h3, h4, h5, h6 {
    margin: ${(props) => props.theme.spacing.md} 0 ${(props) => props.theme.spacing.sm} 0;
    font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  }

  h1 { font-size: ${(props) => props.theme.typography.fontSize['3xl']}; }
  h2 { font-size: ${(props) => props.theme.typography.fontSize['2xl']}; }
  h3 { font-size: ${(props) => props.theme.typography.fontSize.xl}; }

  p {
    margin: ${(props) => props.theme.spacing.sm} 0;
  }

  ul, ol {
    margin: ${(props) => props.theme.spacing.sm} 0;
    padding-left: ${(props) => props.theme.spacing.xl};
  }

  code {
    background: ${(props) => props.theme.colors.surface};
    padding: 2px 6px;
    border-radius: ${(props) => props.theme.borderRadius.sm};
    font-family: 'Courier New', monospace;
  }

  pre {
    background: ${(props) => props.theme.colors.surface};
    padding: ${(props) => props.theme.spacing.md};
    border-radius: ${(props) => props.theme.borderRadius.md};
    overflow-x: auto;

    code {
      background: none;
      padding: 0;
    }
  }

  blockquote {
    border-left: 4px solid ${(props) => props.theme.colors.primary};
    padding-left: ${(props) => props.theme.spacing.md};
    margin: ${(props) => props.theme.spacing.md} 0;
    color: ${(props) => props.theme.colors.text.secondary};
  }

  a {
    color: ${(props) => props.theme.colors.primary};
    text-decoration: underline;
  }

  img {
    max-width: 100%;
    border-radius: ${(props) => props.theme.borderRadius.md};
  }
`

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = '# Start writing in Markdown...',
  disabled = false,
  minHeight,
  showPreview = true
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)

    onChange(newText)

    // Restore selection
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  // Simple markdown to HTML converter (basic implementation)
  const renderMarkdown = (markdown: string): string => {
    return markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
      // Line breaks
      .replace(/\n/gim, '<br />')
  }

  const tabs: Tab[] = [
    { key: 'write', label: 'Write' },
    ...(showPreview ? [{ key: 'preview', label: 'Preview' }] : [])
  ]

  return (
    <EditorContainer>
      <Toolbar>
        <ToolButton onClick={() => insertMarkdown('**', '**')} disabled={disabled}>
          <strong>Bold</strong>
        </ToolButton>
        <ToolButton onClick={() => insertMarkdown('*', '*')} disabled={disabled}>
          <em>Italic</em>
        </ToolButton>
        <ToolButton onClick={() => insertMarkdown('# ', '')} disabled={disabled}>
          H1
        </ToolButton>
        <ToolButton onClick={() => insertMarkdown('## ', '')} disabled={disabled}>
          H2
        </ToolButton>
        <ToolButton onClick={() => insertMarkdown('### ', '')} disabled={disabled}>
          H3
        </ToolButton>
        <ToolButton onClick={() => insertMarkdown('- ', '')} disabled={disabled}>
          • List
        </ToolButton>
        <ToolButton onClick={() => insertMarkdown('[', '](url)')} disabled={disabled}>
          🔗 Link
        </ToolButton>
        <ToolButton onClick={() => insertMarkdown('`', '`')} disabled={disabled}>
          {'<>'} Code
        </ToolButton>
      </Toolbar>

      {showPreview && (
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(key) => setActiveTab(key as 'write' | 'preview')}
        />
      )}

      {activeTab === 'write' ? (
        <EditorTextarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          $minHeight={minHeight}
        />
      ) : (
        <PreviewContainer
          $minHeight={minHeight}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
        />
      )}
    </EditorContainer>
  )
}
