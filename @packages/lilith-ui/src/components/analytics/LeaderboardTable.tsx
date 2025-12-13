import React from 'react'
import styled from 'styled-components'
import { Avatar } from '../primitives/Avatar'

export interface LeaderboardEntry {
  id: string
  rank: number
  name: string
  avatar?: string
  score: number
  change?: number
  metadata?: Record<string, unknown>
}

export interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  title?: string
  scoreLabel?: string
  showChange?: boolean
  showBadges?: boolean
  onEntryClick?: (entry: LeaderboardEntry) => void
}

const Container = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  overflow: hidden;
`

const Header = styled.div`
  padding: ${(props) => props.theme.spacing.lg};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Title = styled.h3`
  margin: 0;
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text};
`

const ScoreLabel = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const List = styled.div`
  max-height: 500px;
  overflow-y: auto;
`

const Entry = styled.div<{ $clickable?: boolean; $highlighted?: boolean }>`
  display: grid;
  grid-template-columns: 60px 1fr auto;
  gap: ${(props) => props.theme.spacing.md};
  align-items: center;
  padding: ${(props) => props.theme.spacing.md} ${(props) => props.theme.spacing.lg};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  cursor: ${(props) => (props.$clickable ? 'pointer' : 'default')};
  background: ${(props) => props.$highlighted ? props.theme.colors.primary + '10' : 'transparent'};
  transition: background 0.2s;

  &:hover {
    background: ${(props) => props.$clickable ? props.theme.colors.background : 'transparent'};
  }

  &:last-child {
    border-bottom: none;
  }
`

const Rank = styled.div<{ $rank: number }>`
  font-size: ${(props) => {
    if (props.$rank === 1) return props.theme.typography.fontSize.xl
    if (props.$rank === 2 || props.$rank === 3) return props.theme.typography.fontSize.lg
    return props.theme.typography.fontSize.base
  }};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => {
    if (props.$rank === 1) return '#FFD700' // Gold
    if (props.$rank === 2) return '#C0C0C0' // Silver
    if (props.$rank === 3) return '#CD7F32' // Bronze
    return props.theme.colors.text.secondary
  }};
  text-align: center;
`

const Info = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
`

const Name = styled.div`
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => props.theme.colors.text};
`

const Score = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${(props) => props.theme.spacing.xs};
`

const ScoreValue = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text};
`

const Change = styled.div<{ $direction: 'up' | 'down' | 'neutral' }>`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => {
    if (props.$direction === 'up') return props.theme.colors.success
    if (props.$direction === 'down') return props.theme.colors.error
    return props.theme.colors.text.secondary
  }};
`

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  entries,
  title = 'Leaderboard',
  scoreLabel = 'Score',
  showChange = false,
  showBadges = true,
  onEntryClick
}) => {
  const formatScore = (score: number): string => {
    if (score >= 1000000) {
      return `${(score / 1000000).toFixed(1)}M`
    }
    if (score >= 1000) {
      return `${(score / 1000).toFixed(1)}K`
    }
    return score.toString()
  }

  const getRankEmoji = (rank: number): string => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return ''
  }

  const getChangeDirection = (change: number): 'up' | 'down' | 'neutral' => {
    if (change > 0) return 'up'
    if (change < 0) return 'down'
    return 'neutral'
  }

  return (
    <Container>
      <Header>
        <Title>{title}</Title>
        <ScoreLabel>{scoreLabel}</ScoreLabel>
      </Header>

      <List>
        {entries.map((entry) => (
          <Entry
            key={entry.id}
            $clickable={!!onEntryClick}
            $highlighted={entry.rank === 1}
            onClick={() => onEntryClick?.(entry)}
          >
            <Rank $rank={entry.rank}>
              {showBadges && getRankEmoji(entry.rank)}
              {!showBadges || entry.rank > 3 ? `#${entry.rank}` : ''}
            </Rank>

            <Info>
              {entry.avatar && (
                <Avatar
                  src={entry.avatar}
                  alt={entry.name}
                  size="md"
                />
              )}
              <Name>{entry.name}</Name>
            </Info>

            <Score>
              <ScoreValue>{formatScore(entry.score)}</ScoreValue>
              {showChange && entry.change !== undefined && entry.change !== 0 && (
                <Change $direction={getChangeDirection(entry.change)}>
                  {entry.change > 0 ? '▲' : '▼'} {Math.abs(entry.change)}
                </Change>
              )}
            </Score>
          </Entry>
        ))}
      </List>
    </Container>
  )
}
