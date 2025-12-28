import React, { useState } from 'react'
import styled from 'styled-components'
import { Input } from '../primitives/Input'
import { Select } from '../primitives/Select'
import type { SelectOption } from '../primitives/Select'

export interface PhoneInputProps {
  value: string
  onChange: (value: string, countryCode: string) => void
  countryCode?: string
  disabled?: boolean
  placeholder?: string
}

const Container = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
`

const CountrySelect = styled(Select)`
  width: 120px;
`

const NumberInput = styled(Input)`
  flex: 1;
`

const countryCodes: SelectOption[] = [
  { value: '+1', label: '🇺🇸 +1' },
  { value: '+44', label: '🇬🇧 +44' },
  { value: '+61', label: '🇦🇺 +61' },
  { value: '+81', label: '🇯🇵 +81' },
  { value: '+86', label: '🇨🇳 +86' },
  { value: '+91', label: '🇮🇳 +91' },
  { value: '+49', label: '🇩🇪 +49' },
  { value: '+33', label: '🇫🇷 +33' },
  { value: '+39', label: '🇮🇹 +39' },
  { value: '+34', label: '🇪🇸 +34' },
  { value: '+7', label: '🇷🇺 +7' },
  { value: '+55', label: '🇧🇷 +55' },
  { value: '+52', label: '🇲🇽 +52' },
  { value: '+82', label: '🇰🇷 +82' }
]

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  countryCode = '+1',
  disabled = false,
  placeholder = '(555) 123-4567'
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState(countryCode)
  const [phoneNumber, setPhoneNumber] = useState(value)

  const formatPhoneNumber = (input: string): string => {
    // Remove all non-digits
    const digits = input.replace(/\D/g, '')

    // Format based on country code
    if (selectedCountryCode === '+1') {
      // US format: (XXX) XXX-XXXX
      if (digits.length <= 3) return digits
      if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
    }

    // Default format for other countries
    return digits
  }

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value
    setSelectedCountryCode(newCode)
    onChange(phoneNumber, newCode)
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
    onChange(formatted, selectedCountryCode)
  }

  return (
    <Container>
      <CountrySelect
        value={selectedCountryCode}
        onChange={handleCountryChange}
        options={countryCodes}
        disabled={disabled}
      />
      <NumberInput
        type="tel"
        value={phoneNumber}
        onChange={handleNumberChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </Container>
  )
}
