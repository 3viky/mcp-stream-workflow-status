import React from 'react'
import styled from 'styled-components'

import { RankingBreakdown } from './RankingBreakdown'
import type { RankingFactor } from './RankingBreakdown'
import { RankingTipCard } from './RankingTipCard'
import type { RankingTip } from './RankingTipCard'

export interface RankingExplanation {
  searchScore: number
  breakdown: {
    rating: { value: number; weight: number; contribution: number }
    ctr: { value: number; weight: number; contribution: number }
    activity: { value: number; weight: number; contribution: number }
    randomness: { value: number; weight: number; contribution: number }
    newness: { value: number; weight: number; contribution: number }
  }
  reviewStats?: {
    totalReviews: number
    averageRating: number
  }
}

export interface RankingDashboardProps {
  explanation: RankingExplanation
  tips: RankingTip[]
  isLoading?: boolean
  error?: string
  onRefresh?: () => void
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.xl};
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SectionTitle = styled.h2`
  margin: 0;
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => props.theme.colors.text.primary};
`

const RefreshButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const TipsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
`

const NoTipsMessage = styled.div`
  padding: ${(props) => props.theme.spacing.xl};
  text-align: center;
  background: ${(props) => `${props.theme.colors.success}10`};
  border: 1px solid ${(props) => `${props.theme.colors.success}30`};
  border-radius: ${(props) => props.theme.borderRadius.lg};
`

const NoTipsIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${(props) => props.theme.spacing.md};
`

const NoTipsTitle = styled.h3`
  margin: 0 0 ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => props.theme.colors.success};
`

const NoTipsDescription = styled.p`
  margin: 0;
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.xl} ${(props) => props.theme.spacing.xl};
  gap: ${(props) => props.theme.spacing.md};
`

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${(props) => props.theme.colors.border};
  border-top-color: ${(props) => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

const LoadingText = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`

const ErrorContainer = styled.div`
  padding: ${(props) => props.theme.spacing.lg};
  background: ${(props) => `${props.theme.colors.error}10`};
  border: 1px solid ${(props) => `${props.theme.colors.error}30`};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  text-align: center;
`

const ErrorTitle = styled.h3`
  margin: 0 0 ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSize.base};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => props.theme.colors.error};
`

const ErrorDescription = styled.p`
  margin: 0;
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`

const factorLabels: Record<string, string> = {
  rating: 'Reviews',
  ctr: 'Profile Appeal',
  activity: 'Activity',
  randomness: 'Discovery Boost',
  newness: 'New Listing Boost',
}

export const RankingDashboard: React.FC<RankingDashboardProps> = ({
  explanation,
  tips,
  isLoading,
  error,
  onRefresh,
}) => {
  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading your ranking data...</LoadingText>
      </LoadingContainer>
    )
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorTitle>Unable to load ranking data</ErrorTitle>
        <ErrorDescription>{error}</ErrorDescription>
        {onRefresh && (
          <RefreshButton onClick={onRefresh} style={{ marginTop: '16px' }}>
            Try Again
          </RefreshButton>
        )}
      </ErrorContainer>
    )
  }

  const factors: RankingFactor[] = Object.entries(explanation.breakdown).map(
    ([name, data]) => ({
      name,
      label: factorLabels[name] || name,
      value: data.value,
      weight: data.weight,
      contribution: data.contribution,
    }),
  )

  return (
    <Container>
      <Section>
        <SectionHeader>
          <SectionTitle>Your Search Ranking</SectionTitle>
          {onRefresh && (
            <RefreshButton onClick={onRefresh} disabled={isLoading}>
              &#8635; Refresh
            </RefreshButton>
          )}
        </SectionHeader>
        <RankingBreakdown
          factors={factors}
          totalScore={explanation.searchScore}
          showWeights
        />
      </Section>

      <Section>
        <SectionTitle>Improvement Tips</SectionTitle>
        {tips.length > 0 ? (
          <TipsList>
            {tips.map((tip, index) => (
              <RankingTipCard key={`${tip.factor}-${index}`} tip={tip} />
            ))}
          </TipsList>
        ) : (
          <NoTipsMessage>
            <NoTipsIcon>&#127942;</NoTipsIcon>
            <NoTipsTitle>Excellent Performance!</NoTipsTitle>
            <NoTipsDescription>
              All your ranking factors are performing well. Keep up the great work!
            </NoTipsDescription>
          </NoTipsMessage>
        )}
      </Section>
    </Container>
  )
}
