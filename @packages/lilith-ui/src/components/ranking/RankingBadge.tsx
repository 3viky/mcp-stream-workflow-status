import React from 'react'
import styled, { keyframes, useTheme, type DefaultTheme } from 'styled-components'

export type BadgeType = 'top-rated' | 'rising-star' | 'verified' | 'new'

export interface RankingBadgeProps {
  type: BadgeType
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animated?: boolean
}

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`

const shine = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`

// Helper function to create badge config with theme colors
const getBadgeConfig = (theme: DefaultTheme) => ({
  'top-rated': {
    icon: '\u2B50', // Star
    label: 'Top Rated',
    color: theme.colors.warning,
    bgColor: `${theme.colors.warning}26`, // 15% opacity
    description: 'Consistently high ratings',
  },
  'rising-star': {
    icon: '\uD83D\uDE80', // Rocket
    label: 'Rising Star',
    color: theme.colors.primary,
    bgColor: `${theme.colors.primary}26`, // 15% opacity
    description: 'Rapidly improving ranking',
  },
  verified: {
    icon: '\u2714', // Checkmark
    label: 'Verified',
    color: theme.colors.success,
    bgColor: `${theme.colors.success}26`, // 15% opacity
    description: 'Identity verified',
  },
  new: {
    icon: '\u2728', // Sparkles
    label: 'New',
    color: theme.colors.info || theme.colors.secondary,
    bgColor: `${theme.colors.info || theme.colors.secondary}26`, // 15% opacity
    description: 'Recently joined',
  },
})

const getSizeConfig = (theme: DefaultTheme) => ({
  sm: {
    iconSize: theme.typography.fontSize.xs,
    fontSize: theme.typography.fontSize.xs,
    padding: `calc(${theme.spacing.xs} / 2) ${theme.spacing.sm}`,
    gap: theme.spacing.xs,
  },
  md: {
    iconSize: theme.typography.fontSize.base,
    fontSize: theme.typography.fontSize.sm,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    gap: theme.spacing.sm,
  },
  lg: {
    iconSize: theme.typography.fontSize.lg,
    fontSize: theme.typography.fontSize.base,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    gap: theme.spacing.sm,
  },
})

const BadgeContainer = styled.div<{
  $color: string
  $bgColor: string
  $size: 'sm' | 'md' | 'lg'
  $animated: boolean
}>`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => getSizeConfig(props.theme)[props.$size].gap};
  padding: ${(props) => getSizeConfig(props.theme)[props.$size].padding};
  background: ${(props) => props.$bgColor};
  border: 1px solid ${(props) => `${props.$color}40`};
  border-radius: ${(props) => props.theme.borderRadius.full};
  font-size: ${(props) => getSizeConfig(props.theme)[props.$size].fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => props.$color};
  white-space: nowrap;
  user-select: none;

  ${(props) =>
    props.$animated &&
    `
    animation: ${pulse} 2s ease-in-out infinite;
  `}
`

const IconWrapper = styled.span<{
  $size: 'sm' | 'md' | 'lg'
  $animated: boolean
  $color: string
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => getSizeConfig(props.theme)[props.$size].iconSize};
  line-height: 1;

  ${(props) =>
    props.$animated &&
    `
    background: linear-gradient(
      90deg,
      ${props.$color} 0%,
      ${props.$color}80 25%,
      ${props.theme.colors.text.primary} 50%,
      ${props.$color}80 75%,
      ${props.$color} 100%
    );
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ${shine} 3s linear infinite;
  `}
`

const Label = styled.span`
  letter-spacing: 0.025em;
`

export const RankingBadge: React.FC<RankingBadgeProps> = ({
  type,
  size = 'md',
  showLabel = true,
  animated = false,
}) => {
  const theme = useTheme()
  const config = getBadgeConfig(theme)[type]

  return (
    <BadgeContainer
      $color={config.color}
      $bgColor={config.bgColor}
      $size={size}
      $animated={animated}
      title={config.description}
      role="status"
      aria-label={`${config.label}: ${config.description}`}
    >
      <IconWrapper $size={size} $animated={animated} $color={config.color}>
        {config.icon}
      </IconWrapper>
      {showLabel && <Label>{config.label}</Label>}
    </BadgeContainer>
  )
}

/**
 * Determine which badge(s) to show based on ranking data
 */
export function getRankingBadges(data: {
  searchScore: number
  ratingValue: number
  isNew: boolean
  isVerified: boolean
  scoreImprovement?: number // week-over-week improvement
}): BadgeType[] {
  const badges: BadgeType[] = []

  // Top Rated: score > 0.8 and rating > 0.9
  if (data.searchScore > 0.8 && data.ratingValue > 0.9) {
    badges.push('top-rated')
  }

  // Rising Star: significant improvement in last week
  if (data.scoreImprovement && data.scoreImprovement > 0.1) {
    badges.push('rising-star')
  }

  // New: profile less than 30 days old
  if (data.isNew) {
    badges.push('new')
  }

  // Verified: identity verified
  if (data.isVerified) {
    badges.push('verified')
  }

  return badges
}
