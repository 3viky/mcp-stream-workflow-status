/**
 * DateTimePicker Component
 *
 * Combined date and time picker with support for 12h/24h formats.
 * Reuses DatePicker component for date selection and adds time input.
 */

import React from 'react'
import styled from 'styled-components'
import { DatePicker } from './DatePicker'
import { Input } from '../primitives/Input'
import { Select } from '../primitives/Select'

export interface DateTimePickerProps {
  /** Date and time value */
  value?: Date
  /** Callback when date/time changes */
  onChange: (date: Date) => void
  /** Minimum allowed date */
  minDate?: Date
  /** Maximum allowed date */
  maxDate?: Date
  /** Show time selection */
  showTime?: boolean
  /** Time format */
  timeFormat?: '12h' | '24h'
  /** Whether the picker is disabled */
  disabled?: boolean
  /** Placeholder for date input */
  placeholder?: string
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  width: 100%;
`

const TimeRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: ${props => props.theme.spacing.md};
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const TimeInput = styled(Input)`
  input[type="number"] {
    -moz-appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`

/**
 * Format time component to 2 digits
 */
const padTime = (value: number): string => {
  return value.toString().padStart(2, '0')
}

/**
 * DateTimePicker combines date and time selection into a single component.
 * Supports both 12-hour and 24-hour time formats with AM/PM selection.
 *
 * @example
 * // Basic date and time picker
 * const [dateTime, setDateTime] = useState(new Date())
 *
 * <DateTimePicker
 *   value={dateTime}
 *   onChange={setDateTime}
 *   showTime={true}
 * />
 *
 * @example
 * // 12-hour format with min/max dates
 * <DateTimePicker
 *   value={appointmentTime}
 *   onChange={setAppointmentTime}
 *   showTime={true}
 *   timeFormat="12h"
 *   minDate={new Date()}
 *   maxDate={addDays(new Date(), 30)}
 * />
 *
 * @example
 * // Date only (no time)
 * <DateTimePicker
 *   value={birthDate}
 *   onChange={setBirthDate}
 *   showTime={false}
 * />
 */
export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  showTime = true,
  timeFormat = '24h',
  disabled = false,
  placeholder = 'Select date and time'
}) => {
  const handleDateChange = (newDate: Date | null) => {
    if (!newDate) {
      onChange(new Date())
      return
    }

    // Preserve time if it exists
    if (value) {
      newDate.setHours(value.getHours())
      newDate.setMinutes(value.getMinutes())
    }

    onChange(newDate)
  }

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = value ? new Date(value) : new Date()
    let hour = parseInt(e.target.value, 10)

    if (isNaN(hour)) return

    if (timeFormat === '12h') {
      const isPM = newValue.getHours() >= 12
      hour = hour % 12
      if (isPM) hour += 12
    } else {
      hour = Math.max(0, Math.min(23, hour))
    }

    newValue.setHours(hour)
    onChange(newValue)
  }

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = value ? new Date(value) : new Date()
    let minute = parseInt(e.target.value, 10)

    if (isNaN(minute)) return

    minute = Math.max(0, Math.min(59, minute))
    newValue.setMinutes(minute)
    onChange(newValue)
  }

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = value ? new Date(value) : new Date()
    const currentHour = newValue.getHours()
    const isPM = e.target.value === 'PM'

    if (isPM && currentHour < 12) {
      newValue.setHours(currentHour + 12)
    } else if (!isPM && currentHour >= 12) {
      newValue.setHours(currentHour - 12)
    }

    onChange(newValue)
  }

  const getDisplayHour = (): number => {
    if (!value) return timeFormat === '12h' ? 12 : 0

    const hour = value.getHours()
    if (timeFormat === '12h') {
      return hour % 12 || 12
    }
    return hour
  }

  const getMinutes = (): number => {
    return value ? value.getMinutes() : 0
  }

  const isPM = (): boolean => {
    return value ? value.getHours() >= 12 : false
  }

  return (
    <Container>
      <DatePicker
        value={value || null}
        onChange={handleDateChange}
        min={minDate}
        max={maxDate}
        disabled={disabled}
        placeholder={placeholder}
      />

      {showTime && (
        <TimeRow>
          <TimeInput
            type="number"
            label="Hour"
            value={padTime(getDisplayHour())}
            onChange={handleHourChange}
            min={timeFormat === '12h' ? 1 : 0}
            max={timeFormat === '12h' ? 12 : 23}
            disabled={disabled}
            fullWidth
          />

          <TimeInput
            type="number"
            label="Minute"
            value={padTime(getMinutes())}
            onChange={handleMinuteChange}
            min={0}
            max={59}
            disabled={disabled}
            fullWidth
          />

          {timeFormat === '12h' && (
            <Select
              value={isPM() ? 'PM' : 'AM'}
              onChange={handlePeriodChange}
              options={[
                { value: 'AM', label: 'AM' },
                { value: 'PM', label: 'PM' }
              ]}
              disabled={disabled}
              fullWidth
            />
          )}
        </TimeRow>
      )}
    </Container>
  )
}
