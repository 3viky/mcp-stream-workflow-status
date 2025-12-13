/**
 * Simple UI components for dashboard
 * Self-contained, no external dependencies
 */

import styled from 'styled-components'

export const Card = styled.div`
  background: ${props => props.theme.colors.bg.secondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};

  &:hover {
    background: ${props => props.theme.colors.hover.surface};
  }
`

export const Button = styled.button`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text.primary};
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover.primary};
    box-shadow: ${props => props.theme.shadows.glow};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const Badge = styled.span<{ variant?: 'success' | 'warning' | 'error' | 'info' }>`
  display: inline-block;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSize.xs};
  font-weight: ${props => props.theme.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  background: ${props => {
    switch (props.variant) {
      case 'success': return props.theme.colors.success + '20';
      case 'warning': return props.theme.colors.warning + '20';
      case 'error': return props.theme.colors.error + '20';
      case 'info': return props.theme.colors.info + '20';
      default: return props.theme.colors.bg.tertiary;
    }
  }};

  color: ${props => {
    switch (props.variant) {
      case 'success': return props.theme.colors.success;
      case 'warning': return props.theme.colors.warning;
      case 'error': return props.theme.colors.error;
      case 'info': return props.theme.colors.info;
      default: return props.theme.colors.text.secondary;
    }
  }};
`

export const Heading = styled.h1<{ as?: 'h1' | 'h2' | 'h3' | 'h4' }>`
  margin: 0;
  color: ${props => props.theme.colors.text.primary};
  font-weight: ${props => props.theme.fontWeight.bold};

  ${props => {
    switch (props.as) {
      case 'h1': return `font-size: ${props.theme.fontSize.xxl};`;
      case 'h2': return `font-size: ${props.theme.fontSize.xl};`;
      case 'h3': return `font-size: ${props.theme.fontSize.lg};`;
      case 'h4': return `font-size: ${props.theme.fontSize.base};`;
      default: return `font-size: ${props.theme.fontSize.xxl};`;
    }
  }}
`

export const StatusBadge = styled(Badge)<{ status?: string }>`
  ${props => {
    const statusColors = {
      active: 'info',
      completed: 'success',
      blocked: 'error',
      paused: 'warning',
      initializing: 'info',
      archived: 'info',
    } as const;

    const variant = statusColors[props.status as keyof typeof statusColors] || 'info';
    return `
      background: ${props.theme.colors[variant]}20;
      color: ${props.theme.colors[variant]};
    `;
  }}
`

export const Input = styled.input`
  background: ${props => props.theme.colors.bg.tertiary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colors.text.primary};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.sm};
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}40;
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.muted};
  }
`

export const Select = styled.select`
  background: ${props => props.theme.colors.bg.tertiary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colors.text.primary};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.sm};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}40;
  }

  option {
    background: ${props => props.theme.colors.bg.secondary};
    color: ${props => props.theme.colors.text.primary};
  }
`
