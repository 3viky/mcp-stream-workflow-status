import React, { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../primitives/Button'
import { DatePicker } from '../forms/DatePicker'

export interface SchedulePreset {
  label: string
  getValue: () => Date
}

export interface SchedulePickerProps {
  value?: Date
  onChange: (date: Date) => void
  minDate?: Date
  timezone?: string
  showTimezone?: boolean
  presets?: SchedulePreset[]
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
  padding: ${(props) => props.theme.spacing.md};
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.sm};
`

const Label = styled.label`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.text};
`

const TimeInputGroup = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
  align-items: center;
`

const TimeInput = styled.input`
  padding: ${(props) => props.theme.spacing.sm};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  width: 80px;
  text-align: center;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`

const TimeSeparator = styled.span`
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text};
`

const TimezoneSelect = styled.select`
  padding: ${(props) => props.theme.spacing.sm};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`

const PresetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${(props) => props.theme.spacing.xs};
`

const PresetButton = styled(Button)`
  justify-content: center;
`

const Actions = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
  justify-content: space-between;
  padding-top: ${(props) => props.theme.spacing.sm};
  border-top: 1px solid ${(props) => props.theme.colors.border};
`

const SelectedDateTime = styled.div`
  padding: ${(props) => props.theme.spacing.sm};
  background: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text};
  text-align: center;
`

const defaultPresets: SchedulePreset[] = [
  {
    label: 'Now',
    getValue: () => new Date()
  },
  {
    label: 'In 1 hour',
    getValue: () => {
      const date = new Date()
      date.setHours(date.getHours() + 1)
      return date
    }
  },
  {
    label: 'Tomorrow 9am',
    getValue: () => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      date.setHours(9, 0, 0, 0)
      return date
    }
  },
  {
    label: 'Next Monday',
    getValue: () => {
      const date = new Date()
      const day = date.getDay()
      const diff = day === 0 ? 1 : 8 - day
      date.setDate(date.getDate() + diff)
      date.setHours(9, 0, 0, 0)
      return date
    }
  }
]

const timezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Phoenix',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney',
  'UTC'
]

export const SchedulePicker: React.FC<SchedulePickerProps> = ({
  value,
  onChange,
  minDate,
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  showTimezone = true,
  presets = defaultPresets
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value)
  const [selectedTimezone, setSelectedTimezone] = useState(timezone)

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)

    // Preserve time if already set
    if (selectedDate) {
      date.setHours(selectedDate.getHours(), selectedDate.getMinutes())
    }

    onChange(date)
  }

  const handleTimeChange = (type: 'hour' | 'minute', value: string) => {
    const date = selectedDate || new Date()
    const numValue = parseInt(value, 10)

    if (type === 'hour') {
      date.setHours(numValue)
    } else {
      date.setMinutes(numValue)
    }

    setSelectedDate(date)
    onChange(date)
  }

  const handlePresetClick = (preset: SchedulePreset) => {
    const date = preset.getValue()
    setSelectedDate(date)
    onChange(date)
  }

  const handlePublishNow = () => {
    const now = new Date()
    setSelectedDate(now)
    onChange(now)
  }

  const handleClear = () => {
    setSelectedDate(undefined)
  }

  const formatDateTime = (date?: Date): string => {
    if (!date) return 'No date selected'

    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: selectedTimezone
    }).format(date)
  }

  return (
    <Container>
      <Section>
        <Label>Quick Presets</Label>
        <PresetsGrid>
          {presets.map((preset, index) => (
            <PresetButton
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => handlePresetClick(preset)}
            >
              {preset.label}
            </PresetButton>
          ))}
        </PresetsGrid>
      </Section>

      <Section>
        <Label>Date</Label>
        <DatePicker
          value={selectedDate || null}
          onChange={(date) => date && handleDateChange(date)}
          min={minDate}
        />
      </Section>

      <Section>
        <Label>Time</Label>
        <TimeInputGroup>
          <TimeInput
            type="number"
            min="0"
            max="23"
            value={selectedDate?.getHours().toString().padStart(2, '0') || '00'}
            onChange={(e) => handleTimeChange('hour', e.target.value)}
            placeholder="HH"
            aria-label="Hour"
          />
          <TimeSeparator>:</TimeSeparator>
          <TimeInput
            type="number"
            min="0"
            max="59"
            value={selectedDate?.getMinutes().toString().padStart(2, '0') || '00'}
            onChange={(e) => handleTimeChange('minute', e.target.value)}
            placeholder="MM"
            aria-label="Minute"
          />
        </TimeInputGroup>
      </Section>

      {showTimezone && (
        <Section>
          <Label>Timezone</Label>
          <TimezoneSelect
            value={selectedTimezone}
            onChange={(e) => setSelectedTimezone(e.target.value)}
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </TimezoneSelect>
        </Section>
      )}

      <SelectedDateTime>
        {formatDateTime(selectedDate)}
      </SelectedDateTime>

      <Actions>
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Clear
        </Button>
        <Button variant="primary" size="sm" onClick={handlePublishNow}>
          Publish Now
        </Button>
      </Actions>
    </Container>
  )
}
