/**
 * DynamicFieldArray Component
 *
 * Add/remove form field groups dynamically with min/max constraints.
 * Allows users to manage repeating field groups (e.g., multiple addresses, phone numbers).
 */

import React from 'react'
import styled from 'styled-components'
import { Button } from '../primitives/Button'

export interface DynamicFieldArrayProps<T = unknown> {
  /** Array of field data */
  fields: T[]
  /** Callback when adding a new field */
  onAdd: () => void
  /** Callback when removing a field */
  onRemove: (index: number) => void
  /** Function to render each field */
  renderField: (field: T, index: number) => React.ReactNode
  /** Label for add button */
  addButtonLabel?: string
  /** Label for remove button */
  removeButtonLabel?: string
  /** Minimum number of fields */
  min?: number
  /** Maximum number of fields */
  max?: number
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
  width: 100%;
`

const FieldGroup = styled.div`
  position: relative;
  padding: ${props => props.theme.spacing.lg};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.surface};
  transition: all ${props => props.theme.transitions.normal};

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.sm};
  }
`

const FieldHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
`

const FieldIndex = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const FieldContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.lg};
`

const EmptyState = styled.div`
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.base};
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
`

/**
 * DynamicFieldArray allows adding and removing groups of form fields dynamically.
 * Enforces min/max constraints and provides customizable field rendering.
 *
 * @example
 * // Managing multiple addresses
 * const [addresses, setAddresses] = useState([{ street: '', city: '' }])
 *
 * <DynamicFieldArray
 *   fields={addresses}
 *   onAdd={() => setAddresses([...addresses, { street: '', city: '' }])}
 *   onRemove={(index) => setAddresses(addresses.filter((_, i) => i !== index))}
 *   renderField={(field, index) => (
 *     <>
 *       <Input
 *         label="Street"
 *         value={field.street}
 *         onChange={(e) => {
 *           const newAddresses = [...addresses]
 *           newAddresses[index].street = e.target.value
 *           setAddresses(newAddresses)
 *         }}
 *       />
 *       <Input
 *         label="City"
 *         value={field.city}
 *         onChange={(e) => {
 *           const newAddresses = [...addresses]
 *           newAddresses[index].city = e.target.value
 *           setAddresses(newAddresses)
 *         }}
 *       />
 *     </>
 *   )}
 *   addButtonLabel="Add Address"
 *   min={1}
 *   max={5}
 * />
 *
 * @example
 * // Managing phone numbers with constraints
 * <DynamicFieldArray
 *   fields={phoneNumbers}
 *   onAdd={handleAddPhone}
 *   onRemove={handleRemovePhone}
 *   renderField={(phone, index) => (
 *     <PhoneInput value={phone} onChange={(val) => updatePhone(index, val)} />
 *   )}
 *   min={1}
 *   max={3}
 * />
 */
export const DynamicFieldArray = <T,>({
  fields,
  onAdd,
  onRemove,
  renderField,
  addButtonLabel = 'Add Item',
  removeButtonLabel = 'Remove',
  min = 0,
  max
}: DynamicFieldArrayProps<T>) => {
  const canAdd = max === undefined || fields.length < max
  const canRemove = fields.length > min

  return (
    <Container>
      {fields.length === 0 ? (
        <EmptyState>
          No items added yet. Click &quot;{addButtonLabel}&quot; to add one.
        </EmptyState>
      ) : (
        fields.map((field, index) => (
          <FieldGroup key={index}>
            <FieldHeader>
              <FieldIndex>
                Item {index + 1} of {fields.length}
              </FieldIndex>
              {canRemove && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onRemove(index)}
                  aria-label={`Remove item ${index + 1}`}
                >
                  {removeButtonLabel}
                </Button>
              )}
            </FieldHeader>
            <FieldContent>
              {renderField(field, index)}
            </FieldContent>
          </FieldGroup>
        ))
      )}

      <ActionButtons>
        <Button
          variant="secondary"
          onClick={onAdd}
          disabled={!canAdd}
          aria-label={addButtonLabel}
        >
          {addButtonLabel} {max !== undefined && `(${fields.length}/${max})`}
        </Button>
      </ActionButtons>
    </Container>
  )
}
