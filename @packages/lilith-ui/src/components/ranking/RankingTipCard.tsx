import React, { useState } from 'react'
import styled from 'styled-components'

export type TipPriority = 'high' | 'medium' | 'low'
export type RankingFactor = 'rating' | 'ctr' | 'activity'

export interface RankingTip {
  factor: RankingFactor
  priority: TipPriority
  tip: string
  actionItems: string[]
  potentialImprovement: number
  currentValue: number
  targetValue: number
}

export interface RankingTipCardProps {
  tip: RankingTip
  expanded?: boolean
  onToggle?: () => void
}

const Card = styled.div<{ $priority: TipPriority }>`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-left: 4px solid ${(props) => {
    switch (props.$priority) {
      case 'high':
        return props.theme.colors.error
      case 'medium':
        return props.theme.colors.warning
      case 'low':
        return props.theme.colors.success
      default:
        return props.theme.colors.border
    }
  }};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  overflow: hidden;
  transition: box-shadow ${(props) => props.theme.transitions.fast};

  &:hover {
    box-shadow: ${(props) => props.theme.shadows.md};
  }
`

const CardHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: ${(props) => props.theme.spacing.md};
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  gap: ${(props) => props.theme.spacing.md};

  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.primary};
    outline-offset: -2px;
  }
`

const HeaderContent = styled.div`
  flex: 1;
  min-width: 0;
`

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`

const PriorityBadge = styled.span<{ $priority: TipPriority }>`
  display: inline-flex;
  align-items: center;
  padding: calc(${(props) => props.theme.spacing.xs} / 2) ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.full};
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.05em; /* Acceptable: No theme equivalent */
  background: ${(props) => {
    switch (props.$priority) {
      case 'high':
        return `${props.theme.colors.error}20`
      case 'medium':
        return `${props.theme.colors.warning}20`
      case 'low':
        return `${props.theme.colors.success}20`
      default:
        return props.theme.colors.background
    }
  }};
  color: ${(props) => {
    switch (props.$priority) {
      case 'high':
        return props.theme.colors.error
      case 'medium':
        return props.theme.colors.warning
      case 'low':
        return props.theme.colors.success
      default:
        return props.theme.colors.text.secondary
    }
  }};
`

const FactorBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: calc(${(props) => props.theme.spacing.xs} / 2) ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.full};
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text.secondary};
  text-transform: capitalize;
`

const TipText = styled.p`
  margin: 0;
  font-size: ${(props) => props.theme.typography.fontSize.base};
  color: ${(props) => props.theme.colors.text.primary};
  line-height: 1.5;
`

const ImprovementBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  padding: ${(props) => props.theme.spacing.sm};
  background: ${(props) => `${props.theme.colors.success}10`};
  border-radius: ${(props) => props.theme.borderRadius.md};
`

const ImprovementValue = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.success};
`

const ImprovementLabel = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  color: ${(props) => props.theme.colors.text.secondary};
`

const ExpandIcon = styled.span<{ $expanded: boolean }>`
  font-size: 20px;
  color: ${(props) => props.theme.colors.text.secondary};
  transition: transform 0.2s ease;
  transform: rotate(${(props) => (props.$expanded ? '180deg' : '0deg')});
`

const ExpandedContent = styled.div<{ $expanded: boolean }>`
  max-height: ${(props) => (props.$expanded ? '500px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease;
`

const ActionItems = styled.div`
  padding: ${(props) => props.theme.spacing.md};
  padding-top: 0;
  border-top: 1px solid ${(props) => props.theme.colors.border};
`

const ActionItemsTitle = styled.h4`
  margin: 0 0 ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => props.theme.colors.text.primary};
`

const ActionList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`

const ActionItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.xs} 0;
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  line-height: 1.5;

  &::before {
    content: '\\2022';
    color: ${(props) => props.theme.colors.primary};
    font-weight: bold;
    flex-shrink: 0;
  }
`

const ProgressSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
  padding: ${(props) => props.theme.spacing.md};
  background: ${(props) => props.theme.colors.background};
`

const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background: ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.full};
  overflow: hidden;
  position: relative;
`

const CurrentProgress = styled.div<{ $value: number }>`
  height: 100%;
  width: ${(props) => props.$value * 100}%;
  background: ${(props) => props.theme.colors.primary};
  border-radius: ${(props) => props.theme.borderRadius.full};
`

const TargetMarker = styled.div<{ $value: number }>`
  position: absolute;
  top: -4px;
  bottom: -4px;
  left: ${(props) => props.$value * 100}%;
  width: 2px;
  background: ${(props) => props.theme.colors.success};
`

const ProgressLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  color: ${(props) => props.theme.colors.text.secondary};
  min-width: 100px;
`

export const RankingTipCard: React.FC<RankingTipCardProps> = ({
  tip,
  expanded: controlledExpanded,
  onToggle,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(false)

  const isControlled = controlledExpanded !== undefined
  const expanded = isControlled ? controlledExpanded : internalExpanded

  const handleToggle = () => {
    if (onToggle) {
      onToggle()
    } else if (!isControlled) {
      setInternalExpanded(!internalExpanded)
    }
  }

  const factorLabels: Record<RankingFactor, string> = {
    rating: 'Reviews',
    ctr: 'Profile Appeal',
    activity: 'Activity',
  }

  return (
    <Card $priority={tip.priority}>
      <CardHeader onClick={handleToggle} aria-expanded={expanded}>
        <HeaderContent>
          <TopRow>
            <PriorityBadge $priority={tip.priority}>{tip.priority}</PriorityBadge>
            <FactorBadge>{factorLabels[tip.factor]}</FactorBadge>
          </TopRow>
          <TipText>{tip.tip}</TipText>
        </HeaderContent>
        <ImprovementBadge>
          <ImprovementValue>+{Math.round(tip.potentialImprovement * 100)}</ImprovementValue>
          <ImprovementLabel>points</ImprovementLabel>
        </ImprovementBadge>
        <ExpandIcon $expanded={expanded}>&#9660;</ExpandIcon>
      </CardHeader>

      <ExpandedContent $expanded={expanded}>
        <ProgressSection>
          <ProgressLabels>
            <span>Current: {Math.round(tip.currentValue * 100)}%</span>
          </ProgressLabels>
          <ProgressBar>
            <CurrentProgress $value={tip.currentValue} />
            <TargetMarker $value={tip.targetValue} />
          </ProgressBar>
          <ProgressLabels>
            <span>Target: {Math.round(tip.targetValue * 100)}%</span>
          </ProgressLabels>
        </ProgressSection>

        <ActionItems>
          <ActionItemsTitle>Action Items</ActionItemsTitle>
          <ActionList>
            {tip.actionItems.map((item, index) => (
              <ActionItem key={index}>{item}</ActionItem>
            ))}
          </ActionList>
        </ActionItems>
      </ExpandedContent>
    </Card>
  )
}
