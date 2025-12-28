import React from 'react'
import styled from 'styled-components'
import {
  calculateChartDimensions,
  calculateScale,
  createLinearScale,
  generateLinePath,
  generateAreaPath
} from '../../utils/chart'

export interface DataPoint {
  x: number | string | Date
  y: number
  label?: string
}

export interface LineChartProps {
  data: DataPoint[]
  width?: number
  height?: number
  color?: string
  showGrid?: boolean
  showAxes?: boolean
  showPoints?: boolean
  curve?: boolean
  fillArea?: boolean
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

export const LineChart: React.FC<LineChartProps> = ({
  data,
  width = 600,
  height = 300,
  color,
  showGrid = true,
  showAxes = true,
  showPoints = true,
  curve = false,
  fillArea = false
}) => {
  const padding = 40
  const dims = calculateChartDimensions(width, height, padding)

  const yValues = data.map(d => d.y)
  const yScale = calculateScale(yValues, true)

  const xCount = data.length - 1
  const xScaleFn = createLinearScale([0, xCount || 1], [padding, padding + dims.chartWidth])
  const yScaleFn = createLinearScale([yScale.min, yScale.max], [padding + dims.chartHeight, padding])

  // Generate path points
  const pathPoints = data.map((d, i) => ({
    x: xScaleFn(i),
    y: yScaleFn(d.y)
  }))

  const linePath = generateLinePath(pathPoints, curve)
  const areaPath = fillArea
    ? generateAreaPath(linePath, pathPoints[0].x, pathPoints[pathPoints.length - 1].x, padding + dims.chartHeight)
    : ''

  // Generate grid lines
  const gridLines = []
  if (showGrid) {
    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (dims.chartHeight / 4) * i
      gridLines.push(
        <line
          key={`h-${i}`}
          x1={padding}
          y1={y}
          x2={padding + dims.chartWidth}
          y2={y}
          stroke="currentColor"
          strokeOpacity="0.1"
          strokeWidth="1"
        />
      )
    }

    // Vertical grid lines
    for (let i = 0; i <= 4; i++) {
      const x = padding + (dims.chartWidth / 4) * i
      gridLines.push(
        <line
          key={`v-${i}`}
          x1={x}
          y1={padding}
          x2={x}
          y2={padding + dims.chartHeight}
          stroke="currentColor"
          strokeOpacity="0.1"
          strokeWidth="1"
        />
      )
    }
  }

  return (
    <ChartContainer>
      <ChartSvg viewBox={`0 0 ${width} ${height}`}>
        {/* Grid */}
        {gridLines}

        {/* Axes */}
        {showAxes && (
          <>
            {/* Y-axis */}
            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={padding + dims.chartHeight}
              stroke="currentColor"
              strokeOpacity="0.3"
              strokeWidth="2"
            />
            {/* X-axis */}
            <line
              x1={padding}
              y1={padding + dims.chartHeight}
              x2={padding + dims.chartWidth}
              y2={padding + dims.chartHeight}
              stroke="currentColor"
              strokeOpacity="0.3"
              strokeWidth="2"
            />
          </>
        )}

        {/* Area fill */}
        {fillArea && areaPath && (
          <path
            d={areaPath}
            fill={color || 'currentColor'}
            fillOpacity="0.1"
          />
        )}

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={color || 'currentColor'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}
        {showPoints &&
          pathPoints.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="4"
              fill={color || 'currentColor'}
              stroke="white"
              strokeWidth="2"
            />
          ))}

        {/* Y-axis labels */}
        {showAxes && [0, 1, 2, 3, 4].map(i => {
          const value = yScale.max - (yScale.range / 4) * i
          const y = padding + (dims.chartHeight / 4) * i
          return (
            <text
              key={`y-${i}`}
              x={padding - 10}
              y={y + 4}
              textAnchor="end"
              fontSize="12"
              fill="currentColor"
              fillOpacity="0.6"
            >
              {Math.round(value)}
            </text>
          )
        })}
      </ChartSvg>
    </ChartContainer>
  )
}
