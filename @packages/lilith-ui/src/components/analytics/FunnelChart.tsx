import React from 'react'
import styled from 'styled-components'

export interface FunnelStage {
  label: string
  value: number
  color?: string
}

export interface FunnelChartProps {
  stages: FunnelStage[]
  height?: number
  showPercentages?: boolean
  showValues?: boolean
  colorScheme?: 'gradient' | 'distinct'
}

const Container = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md};
`

const ChartSvg = styled.svg`
  display: block;
  width: 100%;
  height: auto;
`

const StageLabel = styled.text`
  fill: ${(props) => props.theme.colors.text};
  font-size: 14px;
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
`

const StageValue = styled.text`
  fill: ${(props) => props.theme.colors.text};
  font-size: 12px;
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
`

const ConversionRate = styled.text`
  fill: ${(props) => props.theme.colors.text.secondary};
  font-size: 11px;
  font-style: italic;
`

const defaultGradientColors = [
  '#8B5CF6',
  '#7C3AED',
  '#6D28D9',
  '#5B21B6',
  '#4C1D95'
]

const defaultDistinctColors = [
  '#8B5CF6',
  '#EC4899',
  '#10B981',
  '#F59E0B',
  '#3B82F6'
]

export const FunnelChart: React.FC<FunnelChartProps> = ({
  stages,
  height = 400,
  showPercentages = true,
  showValues = true,
  colorScheme = 'gradient'
}) => {
  const width = 600
  const stageHeight = height / stages.length
  const maxValue = Math.max(...stages.map(s => s.value))
  const padding = 40

  const colors = colorScheme === 'gradient' ? defaultGradientColors : defaultDistinctColors

  // Calculate trapezoid points for each stage
  const renderStages = () => {
    return stages.map((stage, i) => {
      const y = i * stageHeight
      const percentage = (stage.value / maxValue) * 100
      const widthPercent = percentage / 100

      // Top width
      const topWidthPercent = i === 0 ? 1 : (stages[i - 1].value / maxValue)
      const topLeft = padding + ((1 - topWidthPercent) / 2) * (width - padding * 2)
      const topRight = width - padding - ((1 - topWidthPercent) / 2) * (width - padding * 2)

      // Bottom width
      const bottomLeft = padding + ((1 - widthPercent) / 2) * (width - padding * 2)
      const bottomRight = width - padding - ((1 - widthPercent) / 2) * (width - padding * 2)

      // Trapezoid path
      const path = `
        M ${topLeft} ${y}
        L ${topRight} ${y}
        L ${bottomRight} ${y + stageHeight}
        L ${bottomLeft} ${y + stageHeight}
        Z
      `

      const color = stage.color || colors[i % colors.length]

      // Calculate conversion rate from previous stage
      const conversionRate = i > 0
        ? ((stage.value / stages[i - 1].value) * 100).toFixed(1)
        : null

      // Center position for text
      const centerY = y + stageHeight / 2
      const centerX = width / 2

      return (
        <g key={i}>
          {/* Trapezoid */}
          <path
            d={path}
            fill={color}
            fillOpacity="0.8"
            stroke="white"
            strokeWidth="2"
          />

          {/* Stage label */}
          <StageLabel
            x={centerX}
            y={centerY - 8}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {stage.label}
          </StageLabel>

          {/* Value and percentage */}
          {(showValues || showPercentages) && (
            <StageValue
              x={centerX}
              y={centerY + 8}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {showValues && stage.value.toLocaleString()}
              {showValues && showPercentages && ' • '}
              {showPercentages && `${percentage.toFixed(1)}%`}
            </StageValue>
          )}

          {/* Conversion rate */}
          {conversionRate && (
            <ConversionRate
              x={centerX}
              y={y - 4}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {conversionRate}% conversion
            </ConversionRate>
          )}
        </g>
      )
    })
  }

  return (
    <Container>
      <ChartSvg viewBox={`0 0 ${width} ${height}`}>
        {renderStages()}
      </ChartSvg>
    </Container>
  )
}
