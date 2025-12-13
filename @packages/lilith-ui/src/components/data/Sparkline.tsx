import React from 'react'
import styled from 'styled-components'
import { calculateSparklinePoints, generateLinePath } from '../../utils/chart'

export interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  strokeWidth?: number
  showArea?: boolean
  className?: string
}

const SparklineSvg = styled.svg`
  display: block;
`

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 120,
  height = 40,
  color = 'currentColor',
  strokeWidth = 2,
  showArea = false,
  className
}) => {
  if (!data || data.length === 0) return null

  const points = calculateSparklinePoints(data, width, height)
  const linePath = generateLinePath(points, false)

  const areaPath = showArea
    ? `${linePath} L ${width} ${height} L 0 ${height} Z`
    : null

  return (
    <SparklineSvg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
    >
      {showArea && areaPath && (
        <path
          d={areaPath}
          fill={color}
          fillOpacity="0.1"
        />
      )}
      <polyline
        points={points.map(p => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SparklineSvg>
  )
}
