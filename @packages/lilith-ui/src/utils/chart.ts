/**
 * Shared chart utilities
 * Follows DRY principle by centralizing chart calculation logic
 */

export interface ChartDimensions {
  width: number
  height: number
  padding: number
  chartWidth: number
  chartHeight: number
}

export interface ScaleConfig {
  min: number
  max: number
  range: number
}

/**
 * Calculate chart dimensions with padding
 */
export function calculateChartDimensions(
  width: number,
  height: number,
  padding: number
): ChartDimensions {
  return {
    width,
    height,
    padding,
    chartWidth: width - padding * 2,
    chartHeight: height - padding * 2
  }
}

/**
 * Calculate scale configuration for a set of values
 */
export function calculateScale(values: number[], includeZero = true): ScaleConfig {
  const min = includeZero ? Math.min(...values, 0) : Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  return { min, max, range }
}

/**
 * Create a linear scale function
 */
export function createLinearScale(
  domain: [number, number],
  range: [number, number]
): (value: number) => number {
  const [domainMin, domainMax] = domain
  const [rangeMin, rangeMax] = range
  const domainRange = domainMax - domainMin || 1
  const rangeRange = rangeMax - rangeMin

  return (value: number) => {
    const normalized = (value - domainMin) / domainRange
    return rangeMin + normalized * rangeRange
  }
}

/**
 * Generate evenly spaced tick values
 */
export function generateTicks(min: number, max: number, count: number): number[] {
  const step = (max - min) / (count - 1)
  return Array.from({ length: count }, (_, i) => min + step * i)
}

/**
 * Generate SVG path for line chart
 */
export function generateLinePath(
  points: Array<{ x: number; y: number }>,
  curve = false
): string {
  if (points.length === 0) return ''

  const pathSegments = points.map((point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`

    if (curve && i > 0) {
      const prev = points[i - 1]
      const cp1x = prev.x + (point.x - prev.x) / 3
      const cp1y = prev.y
      const cp2x = point.x - (point.x - prev.x) / 3
      const cp2y = point.y
      return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`
    }

    return `L ${point.x} ${point.y}`
  })

  return pathSegments.join(' ')
}

/**
 * Generate SVG path for area under line
 */
export function generateAreaPath(
  linePath: string,
  firstX: number,
  lastX: number,
  baselineY: number
): string {
  return `${linePath} L ${lastX} ${baselineY} L ${firstX} ${baselineY} Z`
}

/**
 * Calculate points for a sparkline
 */
export function calculateSparklinePoints(
  data: number[],
  width: number,
  height: number
): Array<{ x: number; y: number }> {
  if (data.length === 0) return []

  const scale = calculateScale(data, false)
  const xScale = createLinearScale([0, data.length - 1], [0, width])
  const yScale = createLinearScale([scale.min, scale.max], [height, 0])

  return data.map((value, index) => ({
    x: xScale(index),
    y: yScale(value)
  }))
}
