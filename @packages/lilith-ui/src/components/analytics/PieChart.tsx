import React from 'react'
import styled from 'styled-components'

export interface PieDataPoint {
  label: string
  value: number
  color?: string
}

export interface PieChartProps {
  data: PieDataPoint[]
  size?: number
  donut?: boolean
  donutWidth?: number
  showLabels?: boolean
  showLegend?: boolean
}

const ChartContainer = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md};
`

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.lg};
`

const ChartSvg = styled.svg`
  display: block;
`

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.sm};
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
`

const LegendColor = styled.div<{ $color: string }>`
  width: 16px;
  height: 16px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  background: ${(props) => props.$color};
`

const LegendLabel = styled.span`
  color: ${(props) => props.theme.colors.text};
`

const LegendValue = styled.span`
  color: ${(props) => props.theme.colors.text.secondary};
  margin-left: auto;
`

const defaultColors = [
  '#8B5CF6',
  '#EC4899',
  '#10B981',
  '#F59E0B',
  '#3B82F6',
  '#6366F1',
  '#14B8A6',
  '#F97316'
]

export const PieChart: React.FC<PieChartProps> = ({
  data,
  size = 200,
  donut = false,
  donutWidth = 40,
  showLabels = false,
  showLegend = true
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const centerX = size / 2
  const centerY = size / 2
  const radius = size / 2 - 10

  let currentAngle = -90 // Start at top

  const slices = data.map((item, i) => {
    const percentage = (item.value / total) * 100
    const angle = (item.value / total) * 360
    const color = item.color || defaultColors[i % defaultColors.length]

    // Calculate slice path
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle

    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    const x1 = centerX + radius * Math.cos(startRad)
    const y1 = centerY + radius * Math.sin(startRad)
    const x2 = centerX + radius * Math.cos(endRad)
    const y2 = centerY + radius * Math.sin(endRad)

    const largeArc = angle > 180 ? 1 : 0

    let path: string
    if (donut) {
      const innerRadius = radius - donutWidth
      const x3 = centerX + innerRadius * Math.cos(endRad)
      const y3 = centerY + innerRadius * Math.sin(endRad)
      const x4 = centerX + innerRadius * Math.cos(startRad)
      const y4 = centerY + innerRadius * Math.sin(startRad)

      path = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
        'Z'
      ].join(' ')
    } else {
      path = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ')
    }

    // Calculate label position
    const labelAngle = startAngle + angle / 2
    const labelRad = (labelAngle * Math.PI) / 180
    const labelRadius = donut ? radius - donutWidth / 2 : (radius * 2) / 3
    const labelX = centerX + labelRadius * Math.cos(labelRad)
    const labelY = centerY + labelRadius * Math.sin(labelRad)

    return {
      path,
      color,
      label: item.label,
      value: item.value,
      percentage,
      labelX,
      labelY
    }
  })

  return (
    <ChartContainer>
      <Container>
        <ChartSvg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {slices.map((slice, i) => (
            <g key={i}>
              <path
                d={slice.path}
                fill={slice.color}
                stroke="white"
                strokeWidth="2"
              />
              {showLabels && slice.percentage > 5 && (
                <text
                  x={slice.labelX}
                  y={slice.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="600"
                >
                  {slice.percentage.toFixed(0)}%
                </text>
              )}
            </g>
          ))}
        </ChartSvg>

        {showLegend && (
          <Legend>
            {slices.map((slice, i) => (
              <LegendItem key={i}>
                <LegendColor $color={slice.color} />
                <LegendLabel>{slice.label}</LegendLabel>
                <LegendValue>
                  {slice.value} ({slice.percentage.toFixed(1)}%)
                </LegendValue>
              </LegendItem>
            ))}
          </Legend>
        )}
      </Container>
    </ChartContainer>
  )
}
