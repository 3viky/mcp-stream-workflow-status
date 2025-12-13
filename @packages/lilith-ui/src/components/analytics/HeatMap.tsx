import React from 'react'
import styled from 'styled-components'

export interface HeatMapCell {
  value: number
  label?: string
  row: number
  col: number
}

export interface HeatMapProps {
  data: HeatMapCell[][]
  cellSize?: number
  colorScale?: string[]
  showLabels?: boolean
  onCellClick?: (cell: HeatMapCell) => void
}

const Container = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md};
  overflow-x: auto;
`

const Grid = styled.div<{ $cellSize: number }>`
  display: inline-grid;
  gap: 2px;
  grid-template-columns: repeat(auto-fit, ${(props) => props.$cellSize}px);
`

const Cell = styled.div<{ $color: string; $size: number; $clickable: boolean }>`
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  background: ${(props) => props.$color};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => props.theme.colors.text};
  cursor: ${(props) => props.$clickable ? 'pointer' : 'default'};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;

  &:hover {
    ${(props) => props.$clickable && `
      transform: scale(1.1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      z-index: 1;
    `}
  }
`

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-4px);
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  ${Cell}:hover & {
    opacity: 1;
  }
`

const defaultColorScale = [
  '#dbeafe', // very light blue
  '#93c5fd', // light blue
  '#60a5fa', // medium blue
  '#3b82f6', // blue
  '#2563eb', // dark blue
  '#1d4ed8', // very dark blue
]

const interpolateColor = (value: number, min: number, max: number, colors: string[]): string => {
  if (max === min) return colors[0]

  const normalized = (value - min) / (max - min)
  const index = Math.min(Math.floor(normalized * colors.length), colors.length - 1)
  return colors[index]
}

export const HeatMap: React.FC<HeatMapProps> = ({
  data,
  cellSize = 40,
  colorScale = defaultColorScale,
  showLabels = false,
  onCellClick
}) => {
  const [hoveredCell, setHoveredCell] = React.useState<HeatMapCell | null>(null)

  if (!data.length || !data[0]?.length) {
    return <Container>No data available</Container>
  }

  // Flatten all cells to find min/max values
  const allCells = data.flat()
  const values = allCells.map(cell => cell.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)

  const cols = data[0].length

  return (
    <Container>
      <Grid $cellSize={cellSize} style={{ gridTemplateColumns: `repeat(${cols}, ${cellSize}px)` }}>
        {data.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const color = interpolateColor(cell.value, minValue, maxValue, colorScale)
            const isClickable = !!onCellClick

            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                $color={color}
                $size={cellSize}
                $clickable={isClickable}
                onClick={() => onCellClick?.(cell)}
                onMouseEnter={() => setHoveredCell(cell)}
                onMouseLeave={() => setHoveredCell(null)}
              >
                {showLabels && cell.label && <span>{cell.label}</span>}
                {hoveredCell?.row === cell.row && hoveredCell?.col === cell.col && (
                  <Tooltip>
                    {cell.label && `${cell.label}: `}
                    {cell.value.toFixed(2)}
                  </Tooltip>
                )}
              </Cell>
            )
          })
        )}
      </Grid>
    </Container>
  )
}
