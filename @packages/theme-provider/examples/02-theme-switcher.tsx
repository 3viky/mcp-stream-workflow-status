/**
 * Example 02: Theme Switcher Component
 *
 * Demonstrates runtime theme switching with the useTheme hook.
 */

import React from 'react'
import styled from 'styled-components'
import { useTheme } from '@transftw/theme-provider'

const SwitcherContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
`

const SwitcherButton = styled.button<{ $active: boolean }>`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$active ? props.theme.colors.text.primary : props.theme.colors.text.secondary};
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-family: ${props => props.theme.typography.fontFamily.body};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`

const Label = styled.span`
  font-family: ${props => props.theme.typography.fontFamily.body};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.primary};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
`

export function ThemeSwitcher() {
  const { themeName, setTheme } = useTheme()

  return (
    <SwitcherContainer>
      <Label>Theme:</Label>
      <SwitcherButton
        $active={themeName === 'cyberpunk'}
        onClick={() => setTheme('cyberpunk')}
      >
        🌃 Cyberpunk
      </SwitcherButton>
      <SwitcherButton
        $active={themeName === 'luxe'}
        onClick={() => setTheme('luxe')}
      >
        ✨ Luxe
      </SwitcherButton>
    </SwitcherContainer>
  )
}

/**
 * Result:
 * - Displays current active theme
 * - Allows switching between themes
 * - Theme preference persists in localStorage
 * - All components update immediately
 */
