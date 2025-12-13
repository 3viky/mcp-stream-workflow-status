import React, { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'

export interface RangeSliderProps {
  min: number
  max: number
  step?: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  disabled?: boolean
  showValues?: boolean
  formatValue?: (value: number) => string
}

const Container = styled.div`
  width: 100%;
  padding: ${(props) => props.theme.spacing.md} 0;
`

const Track = styled.div`
  position: relative;
  height: 6px;
  background: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.full};
  margin: ${(props) => props.theme.spacing.md} 0;
`

const Range = styled.div<{ $left: number; $width: number }>`
  position: absolute;
  height: 100%;
  background: ${(props) => props.theme.colors.primary};
  border-radius: ${(props) => props.theme.borderRadius.full};
  left: ${(props) => props.$left}%;
  width: ${(props) => props.$width}%;
`

const Thumb = styled.div<{ $position: number; $disabled?: boolean }>`
  position: absolute;
  width: 20px;
  height: 20px;
  background: ${(props) => props.theme.colors.primary};
  border: 3px solid white;
  border-radius: 50%;
  top: 50%;
  left: ${(props) => props.$position}%;
  transform: translate(-50%, -50%);
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'grab')};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.1s;

  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
  }

  &:active {
    cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'grabbing')};
    transform: translate(-50%, -50%) scale(1.15);
  }
`

const Values = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`

const ValueLabel = styled.div`
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => props.theme.colors.text};
`

export const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  disabled = false,
  showValues = true,
  formatValue = (val) => val.toString()
}) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null)

  const getPercentage = (val: number) => {
    return ((val - min) / (max - min)) * 100
  }

  const getValueFromPosition = useCallback((clientX: number): number => {
    if (!trackRef.current) return min

    const rect = trackRef.current.getBoundingClientRect()
    const percentage = (clientX - rect.left) / rect.width
    const rawValue = min + percentage * (max - min)

    // Round to step
    const steppedValue = Math.round(rawValue / step) * step

    // Clamp to min/max
    return Math.max(min, Math.min(max, steppedValue))
  }, [min, max, step])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging) return

    const newValue = getValueFromPosition(e.clientX)

    if (dragging === 'min') {
      // Don't let min thumb pass max thumb
      onChange([Math.min(newValue, value[1] - step), value[1]])
    } else {
      // Don't let max thumb pass min thumb
      onChange([value[0], Math.max(newValue, value[0] + step)])
    }
  }, [dragging, getValueFromPosition, onChange, value, step])

  const handleMouseUp = useCallback(() => {
    setDragging(null)
  }, [])

  const handleMouseDown = (thumb: 'min' | 'max') => {
    if (!disabled) {
      setDragging(thumb)
    }
  }

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [dragging, handleMouseMove, handleMouseUp])

  const minPercent = getPercentage(value[0])
  const maxPercent = getPercentage(value[1])

  return (
    <Container>
      <Track ref={trackRef}>
        <Range $left={minPercent} $width={maxPercent - minPercent} />
        <Thumb
          $position={minPercent}
          $disabled={disabled}
          onMouseDown={() => handleMouseDown('min')}
        />
        <Thumb
          $position={maxPercent}
          $disabled={disabled}
          onMouseDown={() => handleMouseDown('max')}
        />
      </Track>

      {showValues && (
        <Values>
          <ValueLabel>{formatValue(value[0])}</ValueLabel>
          <ValueLabel>{formatValue(value[1])}</ValueLabel>
        </Values>
      )}
    </Container>
  )
}
