import React from 'react'
import styled from 'styled-components'
import { Input } from '../primitives/Input'

export interface DatePickerProps {
  value: Date | null
  onChange: (date: Date | null) => void
  min?: Date
  max?: Date
  disabled?: boolean
  placeholder?: string
}

const Container = styled.div`
  width: 100%;
`

const StyledInput = styled(Input)`
  &::-webkit-calendar-picker-indicator {
    filter: ${(props) => props.theme.colors.text.primary === '#fff' ? 'invert(1)' : 'none'};
    cursor: pointer;
  }
`

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  min,
  max,
  disabled = false,
  placeholder = 'Select date'
}) => {
  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const parseDate = (dateString: string): Date => {
    return new Date(dateString + 'T00:00:00')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onChange(parseDate(e.target.value))
    } else {
      onChange(null)
    }
  }

  return (
    <Container>
      <StyledInput
        type="date"
        value={value ? formatDate(value) : ''}
        onChange={handleChange}
        min={min ? formatDate(min) : undefined}
        max={max ? formatDate(max) : undefined}
        disabled={disabled}
        placeholder={placeholder}
      />
    </Container>
  )
}
