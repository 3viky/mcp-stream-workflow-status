import React, { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../primitives/Button'
import { Input } from '../primitives/Input'

export interface DateRange {
  start: Date
  end: Date
}

export interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
  presets?: {
    label: string
    getValue: () => DateRange
  }[]
  maxDate?: Date
  minDate?: Date
}

const Container = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md};
`

const Presets = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
  flex-wrap: wrap;
  margin-bottom: ${(props) => props.theme.spacing.md};
  padding-bottom: ${(props) => props.theme.spacing.md};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`

const DateInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: ${(props) => props.theme.spacing.sm};
  align-items: center;
`

const Label = styled.label`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.xs};
  display: block;
`

const Separator = styled.span`
  color: ${(props) => props.theme.colors.text.secondary};
`

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  presets,
  maxDate,
  minDate
}) => {
  const [_isCustom, setIsCustom] = useState(true)

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      start: new Date(e.target.value)
    })
    setIsCustom(true)
  }

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      end: new Date(e.target.value)
    })
    setIsCustom(true)
  }

  const handlePresetClick = (preset: { label: string; getValue: () => DateRange }) => {
    onChange(preset.getValue())
    setIsCustom(false)
  }

  const defaultPresets = [
    {
      label: 'Today',
      getValue: () => {
        const now = new Date()
        return {
          start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          end: now
        }
      }
    },
    {
      label: 'Last 7 Days',
      getValue: () => {
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - 7)
        return { start, end }
      }
    },
    {
      label: 'Last 30 Days',
      getValue: () => {
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - 30)
        return { start, end }
      }
    },
    {
      label: 'Last 90 Days',
      getValue: () => {
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - 90)
        return { start, end }
      }
    },
    {
      label: 'This Month',
      getValue: () => {
        const now = new Date()
        return {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: now
        }
      }
    },
    {
      label: 'Last Month',
      getValue: () => {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const end = new Date(now.getFullYear(), now.getMonth(), 0)
        return { start, end }
      }
    }
  ]

  const presetsToUse = presets || defaultPresets

  return (
    <Container>
      <Presets>
        {presetsToUse.map((preset) => (
          <Button
            key={preset.label}
            variant="ghost"
            size="sm"
            onClick={() => handlePresetClick(preset)}
          >
            {preset.label}
          </Button>
        ))}
      </Presets>

      <DateInputs>
        <div>
          <Label>Start Date</Label>
          <Input
            type="date"
            value={formatDate(value.start)}
            onChange={handleStartChange}
            max={maxDate ? formatDate(maxDate) : undefined}
            min={minDate ? formatDate(minDate) : undefined}
          />
        </div>

        <Separator>→</Separator>

        <div>
          <Label>End Date</Label>
          <Input
            type="date"
            value={formatDate(value.end)}
            onChange={handleEndChange}
            max={maxDate ? formatDate(maxDate) : undefined}
            min={minDate ? formatDate(minDate) : undefined}
          />
        </div>
      </DateInputs>
    </Container>
  )
}
