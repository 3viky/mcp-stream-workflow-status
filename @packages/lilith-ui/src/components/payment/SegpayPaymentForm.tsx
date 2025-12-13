import React, { useState, useCallback } from 'react'
import styled, { css } from 'styled-components'

/**
 * Result of a successful payment submission
 */
export interface PaymentResult {
  subscriptionId: string
  status: 'active' | 'pending_3ds'
  clientSecret?: string
}

/**
 * Error from payment processing
 */
export interface PaymentError {
  code: string
  message: string
  field?: string
}

/**
 * Props for SegpayPaymentForm component
 */
export interface SegpayPaymentFormProps {
  tierId: string
  tierName: string
  priceUsd: number
  onSuccess: (result: PaymentResult) => void
  onError: (error: PaymentError) => void
  onCancel: () => void
  isLoading?: boolean
}

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`

const Label = styled.label`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`

const InputWrapper = styled.div`
  position: relative;
`

const StyledInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-family: 'Fira Code', monospace;
  transition: border-color ${props => props.theme.transitions.normal},
              box-shadow ${props => props.theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.$hasError
      ? `${props.theme.colors.error}20`
      : `${props.theme.colors.primary}20`};
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
    opacity: 0.5;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${props => props.theme.extensions?.cyberpunk && css`
    &:focus {
      box-shadow: 0 0 10px ${props.$hasError
        ? props.theme.colors.error
        : props.theme.colors.primary}40;
    }
  `}
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
`

const ErrorText = styled.span`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.typography.fontSize.xs};
  margin-top: ${props => props.theme.spacing.xs};
`

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.sm};
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  margin-top: 2px;
  accent-color: ${props => props.theme.colors.primary};
  cursor: pointer;
`

const ButtonRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
`

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};

  ${props => props.$variant === 'secondary' ? css`
    background: transparent;
    border: 2px solid ${props.theme.colors.border};
    color: ${props.theme.colors.text};

    &:hover:not(:disabled) {
      border-color: ${props.theme.colors.primary};
      color: ${props.theme.colors.primary};
    }
  ` : css`
    background: ${props.theme.colors.primary};
    border: 2px solid ${props.theme.colors.primary};
    color: ${props.theme.colors.background};

    &:hover:not(:disabled) {
      background: ${props.theme.colors.primary};
      filter: brightness(0.9);
      transform: translateY(-1px);
    }

    ${props.theme.extensions?.cyberpunk && css`
      box-shadow: 0 0 15px ${props.theme.colors.primary}40;

      &:hover:not(:disabled) {
        box-shadow: 0 0 25px ${props.theme.colors.primary}60;
      }
    `}
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

const CardIcon = styled.span`
  position: absolute;
  right: ${props => props.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  opacity: 0.5;
`

const PriceSummary = styled.div`
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: ${props => props.theme.spacing.md};
`

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const PriceLabel = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`

const PriceValue = styled.span`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`

const SecureNotice = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.success || '#22c55e'};
  font-size: ${props => props.theme.typography.fontSize.xs};
  margin-top: ${props => props.theme.spacing.sm};
`

interface FormErrors {
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  cardholderName?: string
  terms?: string
}

function validateLuhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '')
  if (digits.length < 13 || digits.length > 19) return false

  let sum = 0
  let isEven = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  const groups = digits.match(/.{1,4}/g)
  return groups ? groups.join(' ') : digits
}

function formatExpiryDate(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length > 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }
  return digits
}

function getCardType(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '')
  if (digits.startsWith('4')) return 'visa'
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'mastercard'
  if (digits.startsWith('34') || digits.startsWith('37')) return 'amex'
  if (digits.startsWith('6011') || digits.startsWith('65')) return 'discover'
  return 'unknown'
}

function getCardIcon(type: string): string {
  switch (type) {
    case 'visa': return '💳'
    case 'mastercard': return '💳'
    case 'amex': return '💳'
    case 'discover': return '💳'
    default: return '💳'
  }
}

/**
 * Segpay payment form for capturing card details securely.
 * Includes Luhn validation, card type detection, and 3DS preparation.
 */
export function SegpayPaymentForm({
  tierId,
  tierName,
  priceUsd,
  onSuccess,
  onError,
  onCancel,
  isLoading = false,
}: SegpayPaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardholderName, setCardholderName] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const cardType = getCardType(cardNumber)
  const isAmex = cardType === 'amex'

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    const cleanCardNumber = cardNumber.replace(/\s/g, '')
    if (!cleanCardNumber) {
      newErrors.cardNumber = 'Card number is required'
    } else if (!validateLuhn(cleanCardNumber)) {
      newErrors.cardNumber = 'Invalid card number'
    }

    if (!expiryDate) {
      newErrors.expiryDate = 'Expiry date is required'
    } else {
      const [month, year] = expiryDate.split('/')
      const monthNum = parseInt(month, 10)
      const yearNum = parseInt(`20${year}`, 10)
      const now = new Date()
      const expiry = new Date(yearNum, monthNum)

      if (monthNum < 1 || monthNum > 12) {
        newErrors.expiryDate = 'Invalid month'
      } else if (expiry <= now) {
        newErrors.expiryDate = 'Card has expired'
      }
    }

    const expectedCvvLength = isAmex ? 4 : 3
    if (!cvv) {
      newErrors.cvv = 'CVV is required'
    } else if (cvv.length !== expectedCvvLength) {
      newErrors.cvv = `CVV must be ${expectedCvvLength} digits`
    }

    if (!cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required'
    }

    if (!termsAccepted) {
      newErrors.terms = 'You must accept the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [cardNumber, expiryDate, cvv, cardholderName, termsAccepted, isAmex])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const [expiryMonth, expiryYear] = expiryDate.split('/')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paymentsUrl = (import.meta as any).env?.VITE_PAYMENTS_API_URL || 'http://localhost:4002/api'
      const response = await fetch(
        `${paymentsUrl}/subscriptions/with-payment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
          body: JSON.stringify({
            tierId,
            cardNumber: cardNumber.replace(/\s/g, ''),
            expiryMonth,
            expiryYear: `20${expiryYear}`,
            cvv,
            cardholderName: cardholderName.trim(),
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Payment failed')
      }

      const result = await response.json()
      onSuccess({
        subscriptionId: result.subscriptionId,
        status: result.requires3ds ? 'pending_3ds' : 'active',
        clientSecret: result.clientSecret,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred'
      onError({
        code: 'PAYMENT_FAILED',
        message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const disabled = isLoading || isSubmitting

  return (
    <FormContainer onSubmit={handleSubmit}>
      <PriceSummary>
        <PriceRow>
          <PriceLabel>{tierName} Subscription</PriceLabel>
          <PriceValue>${priceUsd}/mo</PriceValue>
        </PriceRow>
      </PriceSummary>

      <FormGroup>
        <Label htmlFor="cardNumber">Card Number</Label>
        <InputWrapper>
          <StyledInput
            id="cardNumber"
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={e => setCardNumber(formatCardNumber(e.target.value))}
            $hasError={!!errors.cardNumber}
            disabled={disabled}
            maxLength={19}
          />
          <CardIcon>{getCardIcon(cardType)}</CardIcon>
        </InputWrapper>
        {errors.cardNumber && <ErrorText>{errors.cardNumber}</ErrorText>}
      </FormGroup>

      <Row>
        <FormGroup>
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <StyledInput
            id="expiryDate"
            type="text"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={e => setExpiryDate(formatExpiryDate(e.target.value))}
            $hasError={!!errors.expiryDate}
            disabled={disabled}
            maxLength={5}
          />
          {errors.expiryDate && <ErrorText>{errors.expiryDate}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="cvv">CVV</Label>
          <StyledInput
            id="cvv"
            type="text"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder={isAmex ? '1234' : '123'}
            value={cvv}
            onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, isAmex ? 4 : 3))}
            $hasError={!!errors.cvv}
            disabled={disabled}
            maxLength={isAmex ? 4 : 3}
          />
          {errors.cvv && <ErrorText>{errors.cvv}</ErrorText>}
        </FormGroup>
      </Row>

      <FormGroup>
        <Label htmlFor="cardholderName">Cardholder Name</Label>
        <StyledInput
          id="cardholderName"
          type="text"
          autoComplete="cc-name"
          placeholder="Name as it appears on card"
          value={cardholderName}
          onChange={e => setCardholderName(e.target.value)}
          $hasError={!!errors.cardholderName}
          disabled={disabled}
        />
        {errors.cardholderName && <ErrorText>{errors.cardholderName}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <CheckboxWrapper>
          <Checkbox
            type="checkbox"
            checked={termsAccepted}
            onChange={e => setTermsAccepted(e.target.checked)}
            disabled={disabled}
          />
          <span>
            I agree to the <a href="/terms" target="_blank">Terms of Service</a> and{' '}
            <a href="/privacy" target="_blank">Privacy Policy</a>. I understand this is a recurring
            monthly subscription that can be cancelled at any time.
          </span>
        </CheckboxWrapper>
        {errors.terms && <ErrorText>{errors.terms}</ErrorText>}
      </FormGroup>

      <SecureNotice>
        <span>🔒</span>
        <span>Secured by Segpay • 256-bit encryption • 3D Secure enabled</span>
      </SecureNotice>

      <ButtonRow>
        <Button type="button" $variant="secondary" onClick={onCancel} disabled={disabled}>
          Cancel
        </Button>
        <Button type="submit" disabled={disabled || !termsAccepted}>
          {isSubmitting ? (
            <>
              <Spinner />
              Processing...
            </>
          ) : (
            `Subscribe • $${priceUsd}/mo`
          )}
        </Button>
      </ButtonRow>
    </FormContainer>
  )
}
