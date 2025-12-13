import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Input } from '../primitives/Input'
import { Select } from '../primitives/Select'
import type { SelectOption } from '../primitives/Select'
import { Button } from '../primitives/Button'

export interface SearchField {
  id: string
  label: string
  type: 'text' | 'select' | 'date' | 'number'
  options?: SelectOption[]
  placeholder?: string
}

export interface SearchFilter {
  [key: string]: string | number | boolean
}

export interface SavedSearch {
  id: string
  name: string
  filters: SearchFilter
}

export interface AdvancedSearchProps {
  fields: SearchField[]
  onSearch: (filters: SearchFilter) => void
  savedSearches?: SavedSearch[]
  onSaveSearch?: (name: string, filters: SearchFilter) => void
  onLoadSearch?: (search: SavedSearch) => void
  onDeleteSearch?: (searchId: string) => void
  placeholder?: string
}

const SearchContainer = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.lg};
`

const QuickSearch = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.md};
`

const AdvancedToggle = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.primary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  cursor: pointer;
  padding: ${(props) => props.theme.spacing.sm} 0;
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};

  &:hover {
    text-decoration: underline;
  }
`

const AdvancedFields = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${(props) => props.theme.spacing.md};
  margin-top: ${(props) => props.theme.spacing.md};
  padding-top: ${(props) => props.theme.spacing.md};
  border-top: 1px solid ${(props) => props.theme.colors.border};
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.xs};
`

const FieldLabel = styled.label`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.text};
`

const Actions = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
  margin-top: ${(props) => props.theme.spacing.md};
  padding-top: ${(props) => props.theme.spacing.md};
  border-top: 1px solid ${(props) => props.theme.colors.border};
`

const SavedSearches = styled.div`
  margin-top: ${(props) => props.theme.spacing.md};
  padding-top: ${(props) => props.theme.spacing.md};
  border-top: 1px solid ${(props) => props.theme.colors.border};
`

const SavedSearchTitle = styled.h4`
  margin: 0 0 ${(props) => props.theme.spacing.sm} 0;
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const SavedSearchList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.sm};
`

const SavedSearchChip = styled.button`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  background: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.full};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.colors.primary}20;
    border-color: ${(props) => props.theme.colors.primary};
  }
`

const DeleteButton = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 12px;

  &:hover {
    background: ${(props) => props.theme.colors.error}20;
    color: ${(props) => props.theme.colors.error};
  }
`

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  fields,
  onSearch,
  savedSearches,
  onSaveSearch,
  onLoadSearch,
  onDeleteSearch,
  placeholder = 'Quick search...'
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filters, setFilters] = useState<SearchFilter>({})
  const [quickSearchValue, setQuickSearchValue] = useState('')
  const [saveName, setSaveName] = useState('')

  useEffect(() => {
    // Set quick search from filters if exists
    const quickField = fields.find(f => f.type === 'text')
    if (quickField && filters[quickField.id]) {
      setQuickSearchValue(String(filters[quickField.id]))
    }
  }, [filters, fields])

  const handleQuickSearch = (value: string) => {
    setQuickSearchValue(value)
    const quickField = fields.find(f => f.type === 'text')
    if (quickField) {
      const newFilters = { [quickField.id]: value }
      setFilters(newFilters)
      onSearch(newFilters)
    }
  }

  const handleFilterChange = (fieldId: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [fieldId]: value }))
  }

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleClear = () => {
    setFilters({})
    setQuickSearchValue('')
    onSearch({})
  }

  const handleSave = () => {
    if (saveName && onSaveSearch) {
      onSaveSearch(saveName, filters)
      setSaveName('')
    }
  }

  const handleLoad = (search: SavedSearch) => {
    setFilters(search.filters)
    if (onLoadSearch) {
      onLoadSearch(search)
    }
    onSearch(search.filters)
  }

  const handleDelete = (e: React.MouseEvent, searchId: string) => {
    e.stopPropagation()
    if (onDeleteSearch) {
      onDeleteSearch(searchId)
    }
  }

  const renderField = (field: SearchField) => {
    const value = filters[field.id] || ''

    switch (field.type) {
      case 'select':
        return (
          <Select
            value={value as string}
            onChange={(e) => handleFilterChange(field.id, e.target.value)}
            options={field.options || []}
          />
        )
      case 'date':
      case 'number':
      case 'text':
      default:
        return (
          <Input
            type={field.type}
            value={value as string}
            onChange={(e) => handleFilterChange(field.id, e.target.value)}
            placeholder={field.placeholder}
          />
        )
    }
  }

  return (
    <SearchContainer>
      <QuickSearch>
        <Input
          type="text"
          value={quickSearchValue}
          onChange={(e) => handleQuickSearch(e.target.value)}
          placeholder={placeholder}
        />
      </QuickSearch>

      <AdvancedToggle onClick={() => setShowAdvanced(!showAdvanced)}>
        {showAdvanced ? '▼' : '▶'} Advanced Search
      </AdvancedToggle>

      {showAdvanced && (
        <>
          <AdvancedFields>
            {fields.map(field => (
              <Field key={field.id}>
                <FieldLabel>{field.label}</FieldLabel>
                {renderField(field)}
              </Field>
            ))}
          </AdvancedFields>

          <Actions>
            <Button variant="primary" onClick={handleSearch}>
              Search
            </Button>
            <Button variant="ghost" onClick={handleClear}>
              Clear
            </Button>
            {onSaveSearch && (
              <>
                <Input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="Save search as..."
                  style={{ width: '200px' }}
                />
                <Button
                  variant="secondary"
                  onClick={handleSave}
                  disabled={!saveName || Object.keys(filters).length === 0}
                >
                  Save
                </Button>
              </>
            )}
          </Actions>
        </>
      )}

      {savedSearches && savedSearches.length > 0 && (
        <SavedSearches>
          <SavedSearchTitle>Saved Searches</SavedSearchTitle>
          <SavedSearchList>
            {savedSearches.map(search => (
              <SavedSearchChip key={search.id} onClick={() => handleLoad(search)}>
                {search.name}
                {onDeleteSearch && (
                  <DeleteButton onClick={(e) => handleDelete(e, search.id)}>
                    ×
                  </DeleteButton>
                )}
              </SavedSearchChip>
            ))}
          </SavedSearchList>
        </SavedSearches>
      )}
    </SearchContainer>
  )
}
