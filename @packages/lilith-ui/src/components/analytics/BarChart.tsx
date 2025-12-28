import React from 'react'
import styled from 'styled-components'

export interface BarDataPoint {
  label: string
  value: number
  color?: string
}

export interface BarChartProps {
  data: BarDataPoint[]
  width?: number
  height?: number
  orientation?: 'horizontal' | 'vertical'
  showValues?: boolean
  showGrid?: boolean
}

const ChartContainer = styled.div`
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

export const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 600,
  height = 300,
  orientation = 'vertical',
  showValues = true,
  showGrid = true
}) => {
  const padding = 60
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  const maxValue = Math.max(...data.map(d => d.value))

  const barCount = data.length
  const barSpacing = orientation === 'vertical' ? chartWidth / barCount : chartHeight / barCount
  const barWidth = barSpacing * 0.7

  const renderVerticalBars = () => {
    return data.map((item, i) => {
      const barHeight = (item.value / maxValue) * chartHeight
      const x = padding + i * barSpacing + (barSpacing - barWidth) / 2
      const y = padding + chartHeight - barHeight

      return (
        <g key={i}>
          {/* Bar */}
          <rect
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            fill={item.color || 'currentColor'}
            opacity="0.8"
            rx="4"
          />

          {/* Value label */}
          {showValues && (
            <text
              x={x + barWidth / 2}
              y={y - 8}
              textAnchor="middle"
              fontSize="12"
              fill="currentColor"
              fontWeight="600"
            >
              {item.value}
            </text>
          )}

          {/* X-axis label */}
          <text
            x={x + barWidth / 2}
            y={padding + chartHeight + 20}
            textAnchor="middle"
            fontSize="12"
            fill="currentColor"
            fillOpacity="0.6"
          >
            {item.label}
          </text>
        </g>
      )
    })
  }

  const renderHorizontalBars = () => {
    return data.map((item, i) => {
      const barLength = (item.value / maxValue) * chartWidth
      const x = padding
      const y = padding + i * barSpacing + (barSpacing - barWidth) / 2

      return (
        <g key={i}>
          {/* Bar */}
          <rect
            x={x}
            y={y}
            width={barLength}
            height={barWidth}
            fill={item.color || 'currentColor'}
            opacity="0.8"
            rx="4"
          />

          {/* Value label */}
          {showValues && (
            <text
              x={x + barLength + 8}
              y={y + barWidth / 2 + 4}
              fontSize="12"
              fill="currentColor"
              fontWeight="600"
            >
              {item.value}
            </text>
          )}

          {/* Y-axis label */}
          <text
            x={padding - 10}
            y={y + barWidth / 2 + 4}
            textAnchor="end"
            fontSize="12"
            fill="currentColor"
            fillOpacity="0.6"
          >
            {item.label}
          </text>
        </g>
      )
    })
  }

  const renderGrid = () => {
    if (!showGrid) return null

    const gridLines = []

    if (orientation === 'vertical') {
      // Horizontal grid lines
      for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i
        gridLines.push(
          <line
            key={`h-${i}`}
            x1={padding}
            y1={y}
            x2={padding + chartWidth}
            y2={y}
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeWidth="1"
          />
        )
      }
    } else {
      // Vertical grid lines
      for (let i = 0; i <= 4; i++) {
        const x = padding + (chartWidth / 4) * i
        gridLines.push(
          <line
            key={`v-${i}`}
            x1={x}
            y1={padding}
            x2={x}
            y2={padding + chartHeight}
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeWidth="1"
          />
        )
      }
    }

    return gridLines
  }

  return (
    <ChartContainer>
      <ChartSvg viewBox={`0 0 ${width} ${height}`}>
        {/* Grid */}
        {renderGrid()}

        {/* Axes */}
        {orientation === 'vertical' ? (
          <>
            {/* Y-axis */}
            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={padding + chartHeight}
              stroke="currentColor"
              strokeOpacity="0.3"
              strokeWidth="2"
            />
            {/* X-axis */}
            <line
              x1={padding}
              y1={padding + chartHeight}
              x2={padding + chartWidth}
              y2={padding + chartHeight}
              stroke="currentColor"
              strokeOpacity="0.3"
              strokeWidth="2"
            />
          </>
        ) : (
          <>
            {/* Y-axis */}
            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={padding + chartHeight}
              stroke="currentColor"
              strokeOpacity="0.3"
              strokeWidth="2"
            />
            {/* X-axis */}
            <line
              x1={padding}
              y1={padding + chartHeight}
              x2={padding + chartWidth}
              y2={padding + chartHeight}
              stroke="currentColor"
              strokeOpacity="0.3"
              strokeWidth="2"
            />
          </>
        )}

        {/* Bars */}
        {orientation === 'vertical' ? renderVerticalBars() : renderHorizontalBars()}
      </ChartSvg>
    </ChartContainer>
  )
}
