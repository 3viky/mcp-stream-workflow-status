/**
 * Shared number formatting utilities
 * Follows DRY principle by centralizing formatting logic
 */

export type NumberFormat = 'number' | 'currency' | 'percentage' | 'compact'

export interface FormatOptions {
  format?: NumberFormat
  currency?: string
  locale?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

/**
 * Format a number based on the specified format type
 */
export function formatNumber(value: number, options: FormatOptions = {}): string {
  const {
    format = 'number',
    currency = 'USD',
    locale = 'en-US',
    minimumFractionDigits,
    maximumFractionDigits
  } = options

  switch (format) {
    case 'currency':
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: minimumFractionDigits ?? 0,
        maximumFractionDigits: maximumFractionDigits ?? 0
      }).format(value)

    case 'percentage':
      return `${value.toFixed(maximumFractionDigits ?? 1)}%`

    case 'compact':
      return formatCompactNumber(value)

    default:
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits,
        maximumFractionDigits
      }).format(value)
  }
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`
  }
  return value.toString()
}

/**
 * Format a value that could be string or number
 */
export function formatValue(
  value: string | number,
  options: FormatOptions = {}
): string {
  if (typeof value === 'string') return value
  return formatNumber(value, options)
}

/**
 * Format a date with locale support
 */
export function formatDate(date: Date | string, locale = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale)
}

/**
 * Format a date and time with locale support
 */
export function formatDateTime(date: Date | string, locale = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString(locale)
}

/**
 * Format a relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  if (weeks < 4) return `${weeks}w ago`
  if (months < 12) return `${months}mo ago`
  return `${years}y ago`
}
