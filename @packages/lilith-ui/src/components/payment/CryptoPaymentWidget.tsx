import { useState, useEffect, useCallback } from 'react'
import styled, { css } from 'styled-components'

export type CryptoCurrency = 'BTC' | 'ETH' | 'USDT' | 'USDC'

export interface CryptoPaymentWidgetProps {
  amountUsd: number
  invoiceUrl: string
  paymentId: string
  onPaymentComplete?: (paymentId: string) => void
  onPaymentFailed?: (paymentId: string, reason: string) => void
  onStatusChange?: (status: CryptoPaymentStatus) => void
  pollInterval?: number
  selectedCurrency?: CryptoCurrency
  onCurrencySelect?: (currency: CryptoCurrency) => void
}

export type CryptoPaymentStatus =
  | 'waiting'
  | 'confirming'
  | 'confirmed'
  | 'sending'
  | 'finished'
  | 'expired'
  | 'failed'

interface CurrencyInfo {
  symbol: CryptoCurrency
  name: string
  icon: string
  color: string
}

// Acceptable: Cryptocurrency brand colors must match official branding
const CURRENCIES: CurrencyInfo[] = [
  { symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', color: '#627EEA' },
  { symbol: 'USDT', name: 'Tether', icon: '₮', color: '#26A17B' },
  { symbol: 'USDC', name: 'USD Coin', icon: '$', color: '#2775CA' },
]

const Container = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 400px;
  margin: 0 auto;

  ${({ theme }) =>
    theme.extensions?.cyberpunk &&
    css`
      box-shadow: 0 0 20px ${theme.colors.primary}40;
    `}
`

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize['xl']};
`

const Amount = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
`

const CurrencySelector = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const CurrencyButton = styled.button<{ $selected: boolean; $color: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ $selected, $color, theme }) =>
    $selected ? $color : theme.colors.border};
  background: ${({ $selected, $color }) =>
    $selected ? `${$color}20` : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ $color }) => $color};
    background: ${({ $color }) => `${$color}10`};
  }
`

const CurrencyIcon = styled.span<{ $color: string }>`
  font-size: ${({ theme }) => theme.typography.fontSize['xl']};
  color: ${({ $color }) => $color};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const CurrencyName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`

const PaymentInfo = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const QRPlaceholder = styled.div`
  width: 200px;
  height: 200px;
  background: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const AddressLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  text-align: center;
`

const AddressValue = styled.div`
  font-family: monospace;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  word-break: break-all;
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-align: center;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primary}20;
  }
`

const StatusContainer = styled.div<{ $status: CryptoPaymentStatus }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, $status }) => {
    switch ($status) {
      case 'waiting':
        return `${theme.colors.info}20`
      case 'confirming':
      case 'sending':
        return `${theme.colors.warning}20`
      case 'confirmed':
      case 'finished':
        return `${theme.colors.success}20`
      case 'expired':
      case 'failed':
        return `${theme.colors.error}20`
      default:
        return theme.colors.surface
    }
  }};
  border: 1px solid ${({ theme, $status }) => {
    switch ($status) {
      case 'waiting':
        return theme.colors.info
      case 'confirming':
      case 'sending':
        return theme.colors.warning
      case 'confirmed':
      case 'finished':
        return theme.colors.success
      case 'expired':
      case 'failed':
        return theme.colors.error
      default:
        return theme.colors.border
    }
  }};
`

const StatusDot = styled.span<{ $status: CryptoPaymentStatus }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ theme, $status }) => {
    switch ($status) {
      case 'waiting':
        return theme.colors.info
      case 'confirming':
      case 'sending':
        return theme.colors.warning
      case 'confirmed':
      case 'finished':
        return theme.colors.success
      case 'expired':
      case 'failed':
        return theme.colors.error
      default:
        return theme.colors.text.secondary
    }
  }};

  ${({ $status }) =>
    ($status === 'waiting' || $status === 'confirming' || $status === 'sending') &&
    css`
      animation: pulse 1.5s infinite;
    `}

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
`

const StatusText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`

const ExternalLink = styled.a`
  display: block;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing.md};

  &:hover {
    text-decoration: underline;
  }
`

const InfoText = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin: ${({ theme }) => theme.spacing.md} 0 0;
`

const QRPlaceholderText = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  line-height: 1.5;
`

function getStatusMessage(status: CryptoPaymentStatus): string {
  switch (status) {
    case 'waiting':
      return 'Waiting for payment...'
    case 'confirming':
      return 'Payment detected, confirming...'
    case 'confirmed':
      return 'Payment confirmed!'
    case 'sending':
      return 'Processing payment...'
    case 'finished':
      return 'Payment complete!'
    case 'expired':
      return 'Payment expired'
    case 'failed':
      return 'Payment failed'
    default:
      return 'Unknown status'
  }
}

export function CryptoPaymentWidget({
  amountUsd,
  invoiceUrl,
  paymentId,
  onPaymentComplete,
  onPaymentFailed,
  onStatusChange,
  pollInterval = 10000,
  selectedCurrency = 'BTC',
  onCurrencySelect,
}: CryptoPaymentWidgetProps) {
  const [status, setStatus] = useState<CryptoPaymentStatus>('waiting')
  const [copied, setCopied] = useState(false)

  const handleStatusUpdate = useCallback(
    (newStatus: CryptoPaymentStatus) => {
      setStatus(newStatus)
      onStatusChange?.(newStatus)

      if (newStatus === 'finished' || newStatus === 'confirmed') {
        onPaymentComplete?.(paymentId)
      } else if (newStatus === 'expired' || newStatus === 'failed') {
        onPaymentFailed?.(paymentId, `Payment ${newStatus}`)
      }
    },
    [paymentId, onPaymentComplete, onPaymentFailed, onStatusChange]
  )

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payments/${paymentId}/status`)
        if (response.ok) {
          const data = await response.json()
          if (data.status !== status) {
            handleStatusUpdate(data.status)
          }
        }
      } catch {
        // Polling errors are expected, fail silently
      }
    }, pollInterval)

    return () => clearInterval(interval)
  }, [paymentId, pollInterval, status, handleStatusUpdate])

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }

  const isTerminal = status === 'finished' || status === 'expired' || status === 'failed'

  return (
    <Container>
      <Header>
        <Title>Pay with Crypto</Title>
        <Amount>${amountUsd.toFixed(2)} USD</Amount>
      </Header>

      {!isTerminal && (
        <>
          <CurrencySelector>
            {CURRENCIES.map((currency) => (
              <CurrencyButton
                key={currency.symbol}
                $selected={selectedCurrency === currency.symbol}
                $color={currency.color}
                onClick={() => onCurrencySelect?.(currency.symbol)}
                type="button"
              >
                <CurrencyIcon $color={currency.color}>{currency.icon}</CurrencyIcon>
                <CurrencyName>{currency.symbol}</CurrencyName>
              </CurrencyButton>
            ))}
          </CurrencySelector>

          <PaymentInfo>
            <QRPlaceholder>
              <QRPlaceholderText>
                QR Code
                <br />
                (from NOWPayments)
              </QRPlaceholderText>
            </QRPlaceholder>
            <AddressLabel>Send {selectedCurrency} to:</AddressLabel>
            <AddressValue onClick={() => handleCopy('address_placeholder')}>
              {copied ? 'Copied!' : 'Click to copy address'}
            </AddressValue>
          </PaymentInfo>
        </>
      )}

      <StatusContainer $status={status}>
        <StatusDot $status={status} />
        <StatusText>{getStatusMessage(status)}</StatusText>
      </StatusContainer>

      {invoiceUrl && !isTerminal && (
        <ExternalLink href={invoiceUrl} target="_blank" rel="noopener noreferrer">
          Open payment page in new tab
        </ExternalLink>
      )}

      <InfoText>
        {isTerminal
          ? status === 'finished'
            ? 'Thank you for your payment!'
            : 'Please try again or choose a different payment method.'
          : 'Payment will be confirmed after blockchain verification.'}
      </InfoText>
    </Container>
  )
}
