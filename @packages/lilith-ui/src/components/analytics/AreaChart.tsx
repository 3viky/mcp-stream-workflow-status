import React from 'react'
import styled from 'styled-components'
import {
  calculateChartDimensions,
  calculateScale,
  createLinearScale,
  generateLinePath,
  generateAreaPath
} from '../../utils/chart'

export interface AreaDataPoint {
  x: number | string | Date
  y: number
  label?: string
}

export interface AreaChartProps {
  data: AreaDataPoint[]
  width?: number
  height?: number
  color?: string
  fillOpacity?: number
  showGrid?: boolean
  showAxes?: boolean
  showTooltip?: boolean
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

const Tooltip = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: ${(props) => props.$x}px;
  top: ${(props) => props.$y}px;
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  padding: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  pointer-events: none;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  width = 600,
  height = 300,
  color,
  fillOpacity = 0.3,
  showGrid = true,
  showAxes = true,
  showTooltip = true
}) => {
  const [hoveredPoint, setHoveredPoint] = React.useState<{ x: number; y: number; value: number } | null>(null)
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

  const linePath = generateLinePath(pathPoints, false)
  const areaPath = generateAreaPath(
    linePath,
    pathPoints[0]?.x || padding,
    pathPoints[pathPoints.length - 1]?.x || padding + dims.chartWidth,
    padding + dims.chartHeight
  )

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

  // Create gradient for area fill
  const gradientId = `area-gradient-${Math.random().toString(36).substr(2, 9)}`

  return (
    <ChartContainer style={{ position: 'relative' }}>
      <ChartSvg viewBox={`0 0 ${width} ${height}`}>
        {/* Define gradient */}
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color || 'currentColor'} stopOpacity={fillOpacity} />
            <stop offset="100%" stopColor={color || 'currentColor'} stopOpacity="0.05" />
          </linearGradient>
        </defs>

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
        {areaPath && (
          <path
            d={areaPath}
            fill={`url(#${gradientId})`}
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

        {/* Interactive hover points */}
        {showTooltip &&
          pathPoints.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="6"
              fill="transparent"
              stroke="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredPoint({ x: point.x, y: point.y, value: data[i].y })}
              onMouseLeave={() => setHoveredPoint(null)}
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

      {/* Tooltip */}
      {showTooltip && hoveredPoint && (
        <Tooltip $x={hoveredPoint.x} $y={hoveredPoint.y - 40}>
          {hoveredPoint.value.toFixed(2)}
        </Tooltip>
      )}
    </ChartContainer>
  )
}
