import React from 'react'
import styled, { keyframes } from 'styled-components'
import { formatValue } from '../../utils/formatters'
import type { NumberFormat } from '../../utils/formatters'
import { calculateSparklinePoints, generateLinePath } from '../../utils/chart'

export interface RealtimeMetricProps {
  value: number
  label: string
  previousValue?: number
  updateInterval?: number
  format?: NumberFormat
  trend?: 'up' | 'down' | 'neutral'
  sparklineData?: number[]
}

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`

const Container = styled.div`
  padding: ${(props) => props.theme.spacing.lg};
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  position: relative;
  overflow: hidden;
`

const Label = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`

const ValueContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`

const Value = styled.div<{ $animate: boolean }>`
  font-size: ${(props) => props.theme.typography.fontSize['3xl']};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text};
  line-height: 1;
  animation: ${(props) => props.$animate ? pulse : 'none'} 0.3s ease-out;
`

const Change = styled.div<{ $trend: 'up' | 'down' | 'neutral' }>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => {
    switch (props.$trend) {
      case 'up':
        return props.theme.colors.success
      case 'down':
        return props.theme.colors.error
      default:
        return props.theme.colors.text.secondary
    }
  }};
`

const TrendIcon = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.lg};
`

const SparklineContainer = styled.div`
  position: absolute;
  bottom: ${(props) => props.theme.spacing.md};
  right: ${(props) => props.theme.spacing.md};
  width: 120px;
  height: 40px;
  opacity: 0.3;
`

const SparklineSvg = styled.svg`
  display: block;
  width: 100%;
  height: 100%;
`

const LiveIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-top: ${(props) => props.theme.spacing.xs};
`

const LiveDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.success};
  animation: ${pulse} 2s infinite;
`

export const RealtimeMetric: React.FC<RealtimeMetricProps> = ({
  value,
  label,
  previousValue,
  updateInterval,
  format = 'number',
  trend = 'neutral',
  sparklineData
}) => {
  const [animate, setAnimate] = React.useState(false)
  const prevValueRef = React.useRef(value)

  // Trigger animation when value changes
  React.useEffect(() => {
    if (value !== prevValueRef.current) {
      setAnimate(true)
      prevValueRef.current = value
      const timer = setTimeout(() => setAnimate(false), 300)
      return () => clearTimeout(timer)
    }
  }, [value])

  // Calculate change from previous value
  const changeValue = previousValue !== undefined ? ((value - previousValue) / previousValue) * 100 : 0

  // Render sparkline
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null

    const points = calculateSparklinePoints(sparklineData, 120, 40)
    const path = generateLinePath(points, true)

    return (
      <SparklineContainer>
        <SparklineSvg viewBox="0 0 120 40">
          <path
            d={path}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </SparklineSvg>
      </SparklineContainer>
    )
  }

  return (
    <Container>
      <Label>{label}</Label>
      <ValueContainer>
        <Value $animate={animate}>
          {formatValue(value, { format })}
        </Value>
        {previousValue !== undefined && (
          <Change $trend={trend}>
            <TrendIcon>
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trend === 'neutral' && '→'}
            </TrendIcon>
            {Math.abs(changeValue).toFixed(1)}%
          </Change>
        )}
      </ValueContainer>
      {updateInterval && (
        <LiveIndicator>
          <LiveDot />
          LIVE
        </LiveIndicator>
      )}
      {renderSparkline()}
    </Container>
  )
}
