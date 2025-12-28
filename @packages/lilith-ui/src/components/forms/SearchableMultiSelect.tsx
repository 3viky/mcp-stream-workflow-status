/**
 * SearchableMultiSelect Component
 *
 * A dropdown multi-select component with fuzzy search capability.
 * Designed for large option lists (e.g., 50+ languages, services, etc.)
 * where users need to quickly find and select multiple items.
 *
 * Features:
 * - Fuzzy search for finding options quickly
 * - Multi-select with selected items shown as chips/tags
 * - Keyboard navigation support
 * - Accessible (ARIA compliant)
 * - Theme-aware styling
 */

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  forwardRef,
} from 'react'
import type { KeyboardEvent } from 'react'
import styled, { css } from 'styled-components'

/**
 * Option type for SearchableMultiSelect
 */
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  group?: string
}

/**
 * Props for SearchableMultiSelect component
 */
export interface SearchableMultiSelectProps {
  /** Array of options to display */
  options: SelectOption[] | string[]
  /** Currently selected values */
  value: string[]
  /** Callback when selection changes */
  onChange: (selected: string[]) => void
  /** Placeholder text for the search input */
  placeholder?: string
  /** Label for the component */
  label?: string
  /** Whether the component is disabled */
  disabled?: boolean
  /** Maximum number of items that can be selected (0 = unlimited) */
  maxSelections?: number
  /** Whether to show selected items as chips below the input */
  showChips?: boolean
  /** Whether to show the count of selected items */
  showCount?: boolean
  /** Custom class name */
  className?: string
  /** Minimum characters to start fuzzy search (default: 1) */
  minSearchLength?: number
  /** Whether to group options by their group property */
  groupBy?: boolean
  /** Custom no results message */
  noResultsMessage?: string
  /** Whether to close dropdown after selection */
  closeOnSelect?: boolean
  /** Fuzzy search threshold (0-1, lower = stricter matching) */
  fuzzyThreshold?: number
  /** ID for accessibility */
  id?: string
  /** data-testid for testing */
  'data-testid'?: string
}

// Normalize options to SelectOption format
function normalizeOptions(options: SelectOption[] | string[]): SelectOption[] {
  return options.map(opt =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  )
}

/**
 * Simple fuzzy search implementation
 * Returns a score from 0-1 (1 being perfect match)
 */
function fuzzyMatch(text: string, pattern: string): number {
  if (!pattern) return 1
  if (!text) return 0

  const textLower = text.toLowerCase()
  const patternLower = pattern.toLowerCase()

  // Exact match
  if (textLower === patternLower) return 1

  // Contains match
  if (textLower.includes(patternLower)) {
    // Prefer matches at start of string
    if (textLower.startsWith(patternLower)) return 0.95
    // Prefer matches at start of word
    if (textLower.includes(' ' + patternLower) || textLower.includes('-' + patternLower)) return 0.85
    return 0.7
  }

  // Character-by-character fuzzy match
  let patternIdx = 0
  let consecutiveMatches = 0
  let maxConsecutive = 0
  let totalMatches = 0

  for (let i = 0; i < textLower.length && patternIdx < patternLower.length; i++) {
    if (textLower[i] === patternLower[patternIdx]) {
      patternIdx++
      totalMatches++
      consecutiveMatches++
      maxConsecutive = Math.max(maxConsecutive, consecutiveMatches)
    } else {
      consecutiveMatches = 0
    }
  }

  if (patternIdx < patternLower.length) {
    return 0 // Not all pattern characters found
  }

  // Score based on how much of the pattern matched and consecutive matches
  const matchRatio = totalMatches / patternLower.length
  const consecutiveBonus = maxConsecutive / patternLower.length
  return Math.min(0.6, matchRatio * 0.4 + consecutiveBonus * 0.2)
}

// Styled Components
const Container = styled.div`
  position: relative;
  width: 100%;
`

const Label = styled.label`
  display: block;
  font-size: ${props => props.theme.typography?.fontSize?.sm || '14px'};
  font-weight: 500;
  color: ${props => props.theme.colors?.text?.primary || '#374151'};
  margin-bottom: ${props => props.theme.spacing?.xs || '4px'};
`

const InputContainer = styled.div<{ $focused: boolean; $disabled: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  min-height: 40px;
  padding: 6px 12px;
  background: ${props => props.theme.colors?.background || 'white'};
  border: 2px solid ${props =>
    props.$focused
      ? props.theme.colors?.primary || '#3b82f6'
      : props.theme.colors?.border || '#d1d5db'};
  border-radius: ${props => props.theme.borderRadius?.md || '8px'};
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'text')};
  opacity: ${props => (props.$disabled ? 0.5 : 1)};
  transition: border-color 0.15s, box-shadow 0.15s;

  ${props =>
    props.$focused &&
    css`
      box-shadow: 0 0 0 3px ${props.theme.colors?.primary || '#3b82f6'}20;
    `}
`

const SearchInput = styled.input`
  flex: 1;
  min-width: 120px;
  border: none;
  outline: none;
  background: transparent;
  font-size: ${props => props.theme.typography?.fontSize?.sm || '14px'};
  color: ${props => props.theme.colors?.text?.primary || '#374151'};

  &::placeholder {
    color: ${props => props.theme.colors?.text?.secondary || '#9ca3af'};
  }

  &:disabled {
    cursor: not-allowed;
  }
`

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: ${props => props.theme.colors?.primary || '#3b82f6'}15;
  color: ${props => props.theme.colors?.primary || '#3b82f6'};
  border-radius: ${props => props.theme.borderRadius?.sm || '4px'};
  font-size: 12px;
  font-weight: 500;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ChipRemove = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  padding: 0;
  font-size: 16px;
  line-height: 1;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
`

const Dropdown = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  margin-top: 4px;
  background: ${props => props.theme.colors?.background || 'white'};
  border: 1px solid ${props => props.theme.colors?.border || '#d1d5db'};
  border-radius: ${props => props.theme.borderRadius?.md || '8px'};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  max-height: 300px;
  overflow-y: auto;
  display: ${props => (props.$visible ? 'block' : 'none')};
`

const OptionGroup = styled.div`
  padding: 4px 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors?.border || '#e5e7eb'};
  }
`

const GroupLabel = styled.div`
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${props => props.theme.colors?.text?.secondary || '#6b7280'};
`

const Option = styled.div<{ $highlighted: boolean; $selected: boolean; $disabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.$disabled ? 0.5 : 1)};
  background: ${props => {
    if (props.$highlighted) return props.theme.colors?.primary + '10' || '#eff6ff'
    if (props.$selected) return props.theme.colors?.surface || '#f9fafb'
    return 'transparent'
  }};
  color: ${props =>
    props.$selected
      ? props.theme.colors?.primary || '#3b82f6'
      : props.theme.colors?.text?.primary || '#374151'};
  font-size: ${props => props.theme.typography?.fontSize?.sm || '14px'};

  &:hover:not([disabled]) {
    background: ${props => props.theme.colors?.primary + '10' || '#eff6ff'};
  }
`

const Checkbox = styled.span<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 2px solid ${props =>
    props.$checked
      ? props.theme.colors?.primary || '#3b82f6'
      : props.theme.colors?.border || '#d1d5db'};
  border-radius: 3px;
  background: ${props =>
    props.$checked ? props.theme.colors?.primary || '#3b82f6' : 'transparent'};
  color: white;
  font-size: 10px;
  transition: all 0.15s;

  &::after {
    content: '${props => (props.$checked ? '\\2713' : '')}';
  }
`

const NoResults = styled.div`
  padding: 16px 12px;
  text-align: center;
  color: ${props => props.theme.colors?.text?.secondary || '#6b7280'};
  font-size: ${props => props.theme.typography?.fontSize?.sm || '14px'};
`

const SelectedCount = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors?.text?.secondary || '#6b7280'};
  margin-left: auto;
  padding-left: 8px;
`

const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
`

const ClearAllButton = styled.button`
  padding: 2px 8px;
  background: none;
  border: none;
  color: ${props => props.theme.colors?.primary || '#3b82f6'};
  font-size: 12px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

const HighlightText = styled.span<{ $highlight: boolean }>`
  ${props =>
    props.$highlight &&
    css`
      background: ${props.theme.colors?.warning || '#fef3c7'};
      font-weight: 500;
    `}
`

/**
 * Highlight matching text in option label
 */
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text

  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const index = lowerText.indexOf(lowerQuery)

  if (index === -1) return text

  return (
    <>
      {text.slice(0, index)}
      <HighlightText $highlight>{text.slice(index, index + query.length)}</HighlightText>
      {text.slice(index + query.length)}
    </>
  )
}

/**
 * SearchableMultiSelect - A dropdown multi-select with fuzzy search
 */
export const SearchableMultiSelect = forwardRef<HTMLInputElement, SearchableMultiSelectProps>(
  (
    {
      options: rawOptions,
      value = [],
      onChange,
      placeholder = 'Search...',
      label,
      disabled = false,
      maxSelections = 0,
      showChips = true,
      showCount = true,
      className,
      minSearchLength = 1,
      groupBy = false,
      noResultsMessage = 'No options found',
      closeOnSelect = false,
      fuzzyThreshold = 0.3,
      id,
      'data-testid': dataTestId,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const options = useMemo(() => normalizeOptions(rawOptions), [rawOptions])

    // Filter and sort options based on search query
    const filteredOptions = useMemo(() => {
      if (searchQuery.length < minSearchLength) {
        return options
      }

      const scored = options
        .map(option => ({
          option,
          score: fuzzyMatch(option.label, searchQuery),
        }))
        .filter(item => item.score >= fuzzyThreshold)
        .sort((a, b) => b.score - a.score)

      return scored.map(item => item.option)
    }, [options, searchQuery, minSearchLength, fuzzyThreshold])

    // Group options if needed
    const groupedOptions = useMemo(() => {
      if (!groupBy) {
        return { '': filteredOptions }
      }

      return filteredOptions.reduce((groups, option) => {
        const group = option.group || ''
        if (!groups[group]) groups[group] = []
        groups[group].push(option)
        return groups
      }, {} as Record<string, SelectOption[]>)
    }, [filteredOptions, groupBy])

    // Flat list for keyboard navigation
    const flatOptions = useMemo(() => {
      return Object.values(groupedOptions).flat()
    }, [groupedOptions])

    // Handle selection toggle
    const toggleOption = useCallback(
      (optionValue: string) => {
        if (disabled) return

        const isSelected = value.includes(optionValue)
        let newValue: string[]

        if (isSelected) {
          newValue = value.filter(v => v !== optionValue)
        } else {
          if (maxSelections > 0 && value.length >= maxSelections) {
            return // Max selections reached
          }
          newValue = [...value, optionValue]
        }

        onChange(newValue)

        if (closeOnSelect) {
          setIsOpen(false)
          setSearchQuery('')
        }
      },
      [value, onChange, disabled, maxSelections, closeOnSelect]
    )

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault()
            setIsOpen(true)
            setHighlightedIndex(prev =>
              prev < flatOptions.length - 1 ? prev + 1 : 0
            )
            break
          case 'ArrowUp':
            e.preventDefault()
            setHighlightedIndex(prev =>
              prev > 0 ? prev - 1 : flatOptions.length - 1
            )
            break
          case 'Enter':
            e.preventDefault()
            if (highlightedIndex >= 0 && flatOptions[highlightedIndex]) {
              toggleOption(flatOptions[highlightedIndex].value)
            }
            break
          case 'Escape':
            setIsOpen(false)
            setSearchQuery('')
            break
          case 'Backspace':
            if (!searchQuery && value.length > 0) {
              // Remove last selected item
              onChange(value.slice(0, -1))
            }
            break
        }
      },
      [flatOptions, highlightedIndex, toggleOption, searchQuery, value, onChange]
    )

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false)
          setSearchQuery('')
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Reset highlighted index when options change
    useEffect(() => {
      setHighlightedIndex(-1)
    }, [searchQuery])

    // Get selected option labels
    const selectedLabels = useMemo(() => {
      return value.map(v => {
        const option = options.find(o => o.value === v)
        return option?.label || v
      })
    }, [value, options])

    const handleClearAll = useCallback(() => {
      onChange([])
    }, [onChange])

    return (
      <Container ref={containerRef} className={className} data-testid={dataTestId}>
        {label && <Label htmlFor={id}>{label}</Label>}

        <InputContainer
          $focused={isOpen}
          $disabled={disabled}
          onClick={() => {
            if (!disabled) {
              inputRef.current?.focus()
              setIsOpen(true)
            }
          }}
        >
          {/* Show inline chips (max 3) */}
          {showChips &&
            selectedLabels.slice(0, 3).map((label, idx) => (
              <Chip key={value[idx]}>
                {label}
                <ChipRemove
                  type="button"
                  onClick={e => {
                    e.stopPropagation()
                    toggleOption(value[idx])
                  }}
                  aria-label={`Remove ${label}`}
                >
                  ×
                </ChipRemove>
              </Chip>
            ))}
          {selectedLabels.length > 3 && (
            <Chip>+{selectedLabels.length - 3} more</Chip>
          )}

          <SearchInput
            ref={node => {
              inputRef.current = node
              if (typeof ref === 'function') ref(node)
              else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
            }}
            id={id}
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : ''}
            disabled={disabled}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={`${id}-listbox`}
            role="combobox"
          />

          {showCount && value.length > 0 && (
            <SelectedCount>{value.length} selected</SelectedCount>
          )}
        </InputContainer>

        <Dropdown $visible={isOpen} id={`${id}-listbox`} role="listbox" aria-multiselectable="true">
          {flatOptions.length === 0 ? (
            <NoResults>{noResultsMessage}</NoResults>
          ) : (
            Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
              <OptionGroup key={groupName || 'default'}>
                {groupBy && groupName && <GroupLabel>{groupName}</GroupLabel>}
                {groupOptions.map((option) => {
                  const isSelected = value.includes(option.value)
                  const flatIdx = flatOptions.indexOf(option)
                  const isHighlighted = flatIdx === highlightedIndex

                  return (
                    <Option
                      key={option.value}
                      $highlighted={isHighlighted}
                      $selected={isSelected}
                      $disabled={option.disabled || false}
                      onClick={() => !option.disabled && toggleOption(option.value)}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <Checkbox $checked={isSelected} />
                      {highlightMatch(option.label, searchQuery)}
                    </Option>
                  )
                })}
              </OptionGroup>
            ))
          )}
        </Dropdown>

        {/* Show all selected chips below */}
        {showChips && selectedLabels.length > 3 && (
          <ChipsContainer>
            {selectedLabels.map((label, idx) => (
              <Chip key={value[idx]}>
                {label}
                <ChipRemove
                  type="button"
                  onClick={() => toggleOption(value[idx])}
                  aria-label={`Remove ${label}`}
                >
                  ×
                </ChipRemove>
              </Chip>
            ))}
            <ClearAllButton type="button" onClick={handleClearAll}>
              Clear all
            </ClearAllButton>
          </ChipsContainer>
        )}
      </Container>
    )
  }
)

SearchableMultiSelect.displayName = 'SearchableMultiSelect'

export default SearchableMultiSelect
