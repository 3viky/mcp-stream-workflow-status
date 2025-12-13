import React, { useState } from 'react'
import type { KeyboardEvent } from 'react'
import styled from 'styled-components'
import { Input } from '../primitives/Input'

export interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  suggestions?: string[]
  disabled?: boolean
}

const Container = styled.div`
  width: 100%;
`

const TagContainer = styled.div<{ $disabled?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.sm};
  background: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  min-height: 42px;
  cursor: ${(props) => props.$disabled ? 'not-allowed' : 'text'};
  opacity: ${(props) => props.$disabled ? 0.6 : 1};

  &:focus-within {
    border-color: ${(props) => !props.$disabled && props.theme.colors.primary};
  }
`

const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  background: ${(props) => props.theme.colors.primary};
  color: white;
  border-radius: ${(props) => props.theme.borderRadius.full};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
`

const TagText = styled.span``

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 16px;
  line-height: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`

const StyledInput = styled(Input)`
  flex: 1;
  min-width: 120px;
  border: none;
  padding: ${(props) => props.theme.spacing.xs};

  &:focus {
    outline: none;
  }
`

const Suggestions = styled.div`
  margin-top: ${(props) => props.theme.spacing.sm};
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.xs};
`

const SuggestionLabel = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`

const SuggestionTag = styled.button`
  background: none;
  border: 1px solid ${(props) => props.theme.colors.border};
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.full};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    background: ${(props) => props.theme.colors.primary}10;
    color: ${(props) => props.theme.colors.primary};
  }
`

const Hint = styled.div`
  margin-top: ${(props) => props.theme.spacing.xs};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`

export const TagInput: React.FC<TagInputProps> = ({
  value,
  onChange,
  placeholder = 'Type and press Enter to add tags...',
  maxTags,
  suggestions = [],
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState('')

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase()
    if (!trimmed) return
    if (value.includes(trimmed)) return
    if (maxTags && value.length >= maxTags) return

    onChange([...value, trimmed])
    setInputValue('')
  }

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1)
    }
  }

  const filteredSuggestions = suggestions.filter(
    (suggestion) => !value.includes(suggestion.toLowerCase())
  )

  return (
    <Container>
      <TagContainer $disabled={disabled} onClick={() => !disabled && document.getElementById('tag-input')?.focus()}>
        {value.map((tag, index) => (
          <Tag key={index}>
            <TagText>{tag}</TagText>
            {!disabled && (
              <RemoveButton
                onClick={(e) => {
                  e.stopPropagation()
                  removeTag(index)
                }}
                aria-label={`Remove ${tag}`}
              >
                ×
              </RemoveButton>
            )}
          </Tag>
        ))}
        {(!maxTags || value.length < maxTags) && !disabled && (
          <StyledInput
            id="tag-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : ''}
            disabled={disabled}
          />
        )}
      </TagContainer>

      {filteredSuggestions.length > 0 && !disabled && (
        <Suggestions>
          <div style={{ width: '100%' }}>
            <SuggestionLabel>Suggestions:</SuggestionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {filteredSuggestions.map((suggestion) => (
                <SuggestionTag
                  key={suggestion}
                  onClick={() => addTag(suggestion)}
                  type="button"
                >
                  {suggestion}
                </SuggestionTag>
              ))}
            </div>
          </div>
        </Suggestions>
      )}

      {maxTags && (
        <Hint>
          {value.length} / {maxTags} tags
        </Hint>
      )}
    </Container>
  )
}
