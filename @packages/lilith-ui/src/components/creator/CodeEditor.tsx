import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'

export interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  theme?: 'light' | 'dark'
  height?: number
  readOnly?: boolean
  showLineNumbers?: boolean
}

const EditorContainer = styled.div<{ $height?: number }>`
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  overflow: hidden;
  background: ${(props) => props.theme.colors.background};
  height: ${(props) => props.$height ? `${props.$height}px` : 'auto'};
  display: flex;
  flex-direction: column;
`

const EditorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  background: ${(props) => props.theme.colors.surface};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`

const LanguageLabel = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  text-transform: uppercase;
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
`

const ReadOnlyBadge = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  color: ${(props) => props.theme.colors.text.secondary};
  background: ${(props) => props.theme.colors.background};
  padding: 2px 8px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  border: 1px solid ${(props) => props.theme.colors.border};
`

const EditorBody = styled.div`
  display: flex;
  flex: 1;
  overflow: auto;
  position: relative;
`

const LineNumbers = styled.div`
  padding: ${(props) => props.theme.spacing.md} ${(props) => props.theme.spacing.sm};
  background: ${(props) => props.theme.colors.surface};
  border-right: 1px solid ${(props) => props.theme.colors.border};
  color: ${(props) => props.theme.colors.text.secondary};
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  line-height: 1.5;
  text-align: right;
  user-select: none;
  min-width: 40px;
`

const CodeTextarea = styled.textarea<{ $readOnly?: boolean }>`
  flex: 1;
  padding: ${(props) => props.theme.spacing.md};
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  line-height: 1.5;
  color: ${(props) => props.theme.colors.text};
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: auto;
  cursor: ${(props) => props.$readOnly ? 'not-allowed' : 'text'};
  opacity: ${(props) => props.$readOnly ? 0.7 : 1};

  &::placeholder {
    color: ${(props) => props.theme.colors.text.secondary};
  }
`


export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'javascript',
  height,
  readOnly = false,
  showLineNumbers = true,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [lineCount, setLineCount] = useState(1)

  useEffect(() => {
    const lines = value.split('\n').length
    setLineCount(lines)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!readOnly) {
      onChange(e.target.value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) return

    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = value.substring(0, start) + '  ' + value.substring(end)

      onChange(newValue)

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }
  }

  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1)

  return (
    <EditorContainer $height={height}>
      <EditorHeader>
        <LanguageLabel>{language}</LanguageLabel>
        {readOnly && <ReadOnlyBadge>Read Only</ReadOnlyBadge>}
      </EditorHeader>

      <EditorBody>
        {showLineNumbers && (
          <LineNumbers>
            {lineNumbers.map(num => (
              <div key={num}>{num}</div>
            ))}
          </LineNumbers>
        )}

        <CodeTextarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          $readOnly={readOnly}
          spellCheck={false}
          placeholder={`// Start writing ${language} code...`}
          aria-label="Code editor"
        />
      </EditorBody>
    </EditorContainer>
  )
}
