import React from 'react'
import styled from 'styled-components'
import { Spinner } from '../primitives/Spinner'

export interface ServiceStatus {
  name: string
  status: 'healthy' | 'degraded' | 'down' | 'unknown'
  responseTime?: number
  lastCheck?: Date
  message?: string
}

export interface ResourceMetric {
  name: string
  value: number
  max: number
  unit: string
  threshold?: {
    warning: number
    critical: number
  }
}

export interface SystemHealthIndicatorProps {
  services: ServiceStatus[]
  metrics?: ResourceMetric[]
  onRefresh?: () => void
  loading?: boolean
  compact?: boolean
}

const HealthCard = styled.div<{ $compact?: boolean }>`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.$compact ? props.theme.spacing.md : props.theme.spacing.lg};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing.md};
`

const Title = styled.h3`
  margin: 0;
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text};
`

const OverallStatus = styled.div<{ $status: 'healthy' | 'degraded' | 'down' }>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};

  ${(props) => {
    switch (props.$status) {
      case 'healthy':
        return `
          background: ${props.theme.colors.success}20;
          color: ${props.theme.colors.success};
        `
      case 'degraded':
        return `
          background: ${props.theme.colors.warning}20;
          color: ${props.theme.colors.warning};
        `
      case 'down':
        return `
          background: ${props.theme.colors.error}20;
          color: ${props.theme.colors.error};
        `
    }
  }}
`

const StatusIndicator = styled.div<{ $status: 'healthy' | 'degraded' | 'down' | 'unknown' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => {
    switch (props.$status) {
      case 'healthy':
        return props.theme.colors.success
      case 'degraded':
        return props.theme.colors.warning
      case 'down':
        return props.theme.colors.error
      default:
        return props.theme.colors.text.secondary
    }
  }};

  ${(props) => props.$status === 'healthy' && `
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `}
`

const ServiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.sm};
`

const ServiceItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.md};

  &:hover {
    background: ${(props) => props.theme.colors.background};
  }
`

const ServiceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  flex: 1;
`

const ServiceName = styled.span`
  color: ${(props) => props.theme.colors.text};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
`

const ServiceMeta = styled.span`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
`

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${(props) => props.theme.spacing.md};
  margin-top: ${(props) => props.theme.spacing.lg};
  padding-top: ${(props) => props.theme.spacing.lg};
  border-top: 1px solid ${(props) => props.theme.colors.border};
`

const MetricCard = styled.div`
  padding: ${(props) => props.theme.spacing.md};
  background: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
`

const MetricName = styled.div`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`

const MetricValue = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`

const MetricBar = styled.div`
  height: 6px;
  background: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  overflow: hidden;
`

const MetricFill = styled.div<{ $percentage: number; $level: 'normal' | 'warning' | 'critical' }>`
  height: 100%;
  width: ${(props) => props.$percentage}%;
  background: ${(props) => {
    switch (props.$level) {
      case 'critical':
        return props.theme.colors.error
      case 'warning':
        return props.theme.colors.warning
      default:
        return props.theme.colors.success
    }
  }};
  transition: width 0.3s ease;
`

export const SystemHealthIndicator: React.FC<SystemHealthIndicatorProps> = ({
  services,
  metrics,
  loading = false,
  compact = false
}) => {
  const overallStatus = services.some(s => s.status === 'down')
    ? 'down'
    : services.some(s => s.status === 'degraded')
    ? 'degraded'
    : 'healthy'

  const getMetricLevel = (metric: ResourceMetric): 'normal' | 'warning' | 'critical' => {
    if (!metric.threshold) return 'normal'
    const percentage = (metric.value / metric.max) * 100
    if (percentage >= metric.threshold.critical) return 'critical'
    if (percentage >= metric.threshold.warning) return 'warning'
    return 'normal'
  }

  return (
    <HealthCard $compact={compact}>
      <Header>
        <Title>System Health</Title>
        {loading ? (
          <Spinner size="sm" />
        ) : (
          <OverallStatus $status={overallStatus}>
            <StatusIndicator $status={overallStatus} />
            {overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
          </OverallStatus>
        )}
      </Header>

      <ServiceList>
        {services.map((service) => (
          <ServiceItem key={service.name}>
            <ServiceInfo>
              <StatusIndicator $status={service.status} />
              <ServiceName>{service.name}</ServiceName>
              {service.responseTime !== undefined && (
                <ServiceMeta>{service.responseTime}ms</ServiceMeta>
              )}
            </ServiceInfo>
            {service.message && (
              <ServiceMeta>{service.message}</ServiceMeta>
            )}
          </ServiceItem>
        ))}
      </ServiceList>

      {metrics && metrics.length > 0 && (
        <MetricsGrid>
          {metrics.map((metric) => {
            const percentage = (metric.value / metric.max) * 100
            const level = getMetricLevel(metric)

            return (
              <MetricCard key={metric.name}>
                <MetricName>{metric.name}</MetricName>
                <MetricValue>
                  {metric.value.toFixed(0)} {metric.unit}
                </MetricValue>
                <MetricBar>
                  <MetricFill $percentage={percentage} $level={level} />
                </MetricBar>
              </MetricCard>
            )
          })}
        </MetricsGrid>
      )}
    </HealthCard>
  )
}
