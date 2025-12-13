/**
 * AddressInput Component
 *
 * Structured address input with separate fields for street, city, state, postal code, and country.
 * Supports optional autocomplete integration and postal code validation.
 */

import React from 'react'
import styled from 'styled-components'
import { Input } from '../primitives/Input'
import { Select } from '../primitives/Select'
import type { SelectOption } from '../primitives/Select'

export interface Address {
  street?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface AddressInputProps {
  /** Address value */
  value?: Address
  /** Callback when address changes */
  onChange: (address: Address) => void
  /** Array of allowed countries (ISO codes) */
  countries?: string[]
  /** Enable autocomplete integration (currently mock) */
  enableAutocomplete?: boolean
  /** Whether fields are disabled */
  disabled?: boolean
  /** Show labels for fields */
  showLabels?: boolean
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  width: 100%;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const FullWidthRow = styled.div`
  width: 100%;
`

// Common countries for dropdown
const DEFAULT_COUNTRIES: SelectOption[] = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
  { value: 'CN', label: 'China' },
  { value: 'IN', label: 'India' },
  { value: 'BR', label: 'Brazil' },
  { value: 'MX', label: 'Mexico' },
  { value: 'ES', label: 'Spain' },
  { value: 'IT', label: 'Italy' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'SE', label: 'Sweden' },
  { value: 'NO', label: 'Norway' },
  { value: 'DK', label: 'Denmark' },
  { value: 'FI', label: 'Finland' },
  { value: 'PL', label: 'Poland' },
  { value: 'RU', label: 'Russia' }
]

/**
 * Validate postal code format based on country
 */
const validatePostalCode = (postalCode: string, country?: string): boolean => {
  if (!postalCode) return true

  const patterns: Record<string, RegExp> = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
    GB: /^[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}$/i,
    AU: /^\d{4}$/,
    DE: /^\d{5}$/,
    FR: /^\d{5}$/,
    JP: /^\d{3}-?\d{4}$/,
    CN: /^\d{6}$/,
    IN: /^\d{6}$/,
    BR: /^\d{5}-?\d{3}$/
  }

  const pattern = country ? patterns[country] : null
  return pattern ? pattern.test(postalCode) : true
}

/**
 * AddressInput provides structured input for physical addresses.
 * Includes validation and optional autocomplete support.
 *
 * @example
 * // Basic address input
 * const [address, setAddress] = useState<Address>({})
 *
 * <AddressInput
 *   value={address}
 *   onChange={setAddress}
 * />
 *
 * @example
 * // Limited to specific countries
 * <AddressInput
 *   value={address}
 *   onChange={setAddress}
 *   countries={['US', 'CA', 'MX']}
 * />
 *
 * @example
 * // With autocomplete enabled
 * <AddressInput
 *   value={address}
 *   onChange={setAddress}
 *   enableAutocomplete={true}
 * />
 */
export const AddressInput: React.FC<AddressInputProps> = ({
  value = {},
  onChange,
  countries,
  enableAutocomplete = false,
  disabled = false,
  showLabels = true
}) => {
  const handleFieldChange = (field: keyof Address, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue
    })
  }

  const countryOptions = countries
    ? DEFAULT_COUNTRIES.filter(c => countries.includes(c.value as string))
    : DEFAULT_COUNTRIES

  const postalCodeError = value.postalCode && value.country
    ? !validatePostalCode(value.postalCode, value.country)
      ? 'Invalid postal code format'
      : undefined
    : undefined

  return (
    <Container role="group" aria-label="Address input">
      <FullWidthRow>
        <Input
          label={showLabels ? 'Street Address' : undefined}
          placeholder="123 Main St"
          value={value.street || ''}
          onChange={(e) => handleFieldChange('street', e.target.value)}
          disabled={disabled}
          fullWidth
          autoComplete={enableAutocomplete ? 'street-address' : 'off'}
        />
      </FullWidthRow>

      <Row>
        <Input
          label={showLabels ? 'City' : undefined}
          placeholder="City"
          value={value.city || ''}
          onChange={(e) => handleFieldChange('city', e.target.value)}
          disabled={disabled}
          fullWidth
          autoComplete={enableAutocomplete ? 'address-level2' : 'off'}
        />

        <Input
          label={showLabels ? 'State/Province' : undefined}
          placeholder="State"
          value={value.state || ''}
          onChange={(e) => handleFieldChange('state', e.target.value)}
          disabled={disabled}
          fullWidth
          autoComplete={enableAutocomplete ? 'address-level1' : 'off'}
        />
      </Row>

      <Row>
        <Input
          label={showLabels ? 'Postal Code' : undefined}
          placeholder="Postal Code"
          value={value.postalCode || ''}
          onChange={(e) => handleFieldChange('postalCode', e.target.value)}
          disabled={disabled}
          fullWidth
          error={postalCodeError}
          autoComplete={enableAutocomplete ? 'postal-code' : 'off'}
        />

        <Select
          placeholder="Select Country"
          value={value.country || ''}
          onChange={(e) => handleFieldChange('country', e.target.value)}
          options={countryOptions}
          disabled={disabled}
          fullWidth
        />
      </Row>
    </Container>
  )
}
