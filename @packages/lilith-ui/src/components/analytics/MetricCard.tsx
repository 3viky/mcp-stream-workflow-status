import React from 'react'
import styled from 'styled-components'
import { formatValue } from '../../utils/formatters'
import type { NumberFormat } from '../../utils/formatters'
import { Sparkline as SparklineComponent } from '../data/Sparkline'

export interface MetricCardProps {
  label: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  format?: NumberFormat
  sparkline?: number[]
  icon?: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
}

const Card = styled.div<{ $variant: string }>`
  padding: ${(props) => props.theme.spacing.lg};
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  position: relative;
  overflow: hidden;

  ${(props) => props.$variant !== 'default' && `
    border-left: 4px solid ${
      props.$variant === 'primary' ? props.theme.colors.primary :
      props.$variant === 'success' ? props.theme.colors.success :
      props.$variant === 'warning' ? props.theme.colors.warning :
      props.$variant === 'error' ? props.theme.colors.error :
      props.theme.colors.border
    };
  `}
`

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing.sm};
`

const Label = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
`

const Icon = styled.div`
  color: ${(props) => props.theme.colors.primary};
  opacity: 0.6;
`

const Value = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize['3xl']};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.xs};
  line-height: 1;
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`

const Change = styled.span<{ $trend: 'up' | 'down' | 'neutral' }>`
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

const StyledSparkline = styled(SparklineComponent)`
  position: absolute;
  bottom: 0;
  right: 0;
  opacity: 0.1;
  pointer-events: none;
`

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  trend = 'neutral',
  format = 'number',
  sparkline,
  icon,
  variant = 'default'
}) => {
  return (
    <Card $variant={variant}>
      <Header>
        <Label>{label}</Label>
        {icon && <Icon>{icon}</Icon>}
      </Header>
      <Value>{formatValue(value, { format })}</Value>
      {change !== undefined && (
        <Footer>
          <Change $trend={trend}>
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {change > 0 ? '+' : ''}{change}%
          </Change>
        </Footer>
      )}
      {sparkline && sparkline.length > 0 && (
        <StyledSparkline data={sparkline} />
      )}
    </Card>
  )
}
