import React, { useState } from 'react'
import styled from 'styled-components'
import { Input } from '../primitives/Input'

export interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  disabled?: boolean
  presets?: string[]
  showInput?: boolean
}

const Container = styled.div`
  width: 100%;
`

const PickerWrapper = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  align-items: center;
`

const ColorSwatch = styled.button<{ $color: string; $disabled?: boolean }>`
  width: 48px;
  height: 48px;
  background: ${(props) => props.$color};
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  position: relative;
  overflow: hidden;
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};

  &:hover {
    border-color: ${(props) => !props.$disabled && props.theme.colors.primary};
  }
`

const HiddenColorInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`

const Presets = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
  flex-wrap: wrap;
  margin-top: ${(props) => props.theme.spacing.md};
`

const PresetSwatch = styled.button<{ $color: string; $selected: boolean }>`
  width: 32px;
  height: 32px;
  background: ${(props) => props.$color};
  border: 2px solid ${(props) => (props.$selected ? props.theme.colors.primary : props.theme.colors.border)};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
    border-color: ${(props) => props.theme.colors.primary};
  }
`

const Label = styled.label`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.xs};
  display: block;
`

const defaultPresets = [
  '#FF6B6B', // Red
  '#F06292', // Pink
  '#BA68C8', // Purple
  '#9575CD', // Deep Purple
  '#7986CB', // Indigo
  '#64B5F6', // Blue
  '#4FC3F7', // Light Blue
  '#4DD0E1', // Cyan
  '#4DB6AC', // Teal
  '#81C784', // Green
  '#AED581', // Light Green
  '#FFD54F', // Yellow
  '#FFB74D', // Orange
  '#FF8A65', // Deep Orange
  '#A1887F', // Brown
  '#90A4AE'  // Blue Grey
]

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  disabled = false,
  presets,
  showInput = true
}) => {
  const [inputValue, setInputValue] = useState(value)

  const presetsToUse = presets || defaultPresets

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    onChange(newColor)
    setInputValue(newColor)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    // Validate hex color format
    if (/^#[0-9A-F]{6}$/i.test(newValue)) {
      onChange(newValue)
    }
  }

  const handlePresetClick = (color: string) => {
    if (!disabled) {
      onChange(color)
      setInputValue(color)
    }
  }

  return (
    <Container>
      <PickerWrapper>
        <ColorSwatch $color={value} $disabled={disabled}>
          <HiddenColorInput
            type="color"
            value={value}
            onChange={handleColorChange}
            disabled={disabled}
          />
        </ColorSwatch>

        {showInput && (
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            disabled={disabled}
            placeholder="#000000"
            pattern="^#[0-9A-Fa-f]{6}$"
            style={{ flex: 1, fontFamily: 'monospace' }}
          />
        )}
      </PickerWrapper>

      {presetsToUse.length > 0 && (
        <>
          <Label style={{ marginTop: '16px' }}>Presets</Label>
          <Presets>
            {presetsToUse.map((color) => (
              <PresetSwatch
                key={color}
                $color={color}
                $selected={value.toLowerCase() === color.toLowerCase()}
                onClick={() => handlePresetClick(color)}
                type="button"
              />
            ))}
          </Presets>
        </>
      )}
    </Container>
  )
}
