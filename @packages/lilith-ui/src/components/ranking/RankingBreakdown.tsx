import React from 'react'
import styled, { useTheme } from 'styled-components'

export interface RankingFactor {
  name: string
  label: string
  value: number
  weight: number
  contribution: number
  color?: string
}

export interface RankingBreakdownProps {
  factors: RankingFactor[]
  totalScore: number
  showWeights?: boolean
  showContributions?: boolean
  orientation?: 'horizontal' | 'vertical'
}

const Container = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.lg};
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.lg};
`

const Title = styled.h3`
  margin: 0;
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => props.theme.colors.text.primary};
`

const TotalScore = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${(props) => props.theme.spacing.xs};
`

const ScoreValue = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize['2xl']};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.primary};
`

const ScoreLabel = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`

const FactorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
`

const FactorRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: ${(props) => props.theme.spacing.md};
  align-items: center;
`

const FactorLabel = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.text.primary};
`

const BarContainer = styled.div`
  height: 24px;
  background: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.full};
  overflow: hidden;
  position: relative;
`

const BarFill = styled.div<{ $value: number; $color: string }>`
  height: 100%;
  width: ${(props) => Math.min(100, props.$value * 100)}%;
  background: ${(props) => props.$color};
  border-radius: ${(props) => props.theme.borderRadius.full};
  transition: width 0.3s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${(props) => props.theme.colors.text.primary}1a 50%, /* 10% opacity */
      transparent 100%
    );
  }
`

const FactorMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 80px;
`

const FactorValue = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
`

const FactorWeight = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  color: ${(props) => props.theme.colors.text.secondary};
`

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.md};
  margin-top: ${(props) => props.theme.spacing.lg};
  padding-top: ${(props) => props.theme.spacing.md};
  border-top: 1px solid ${(props) => props.theme.colors.border};
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  color: ${(props) => props.theme.colors.text.secondary};
`

const LegendDot = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => props.$color};
`

export const RankingBreakdown: React.FC<RankingBreakdownProps> = ({
  factors,
  totalScore,
  showWeights = true,
  showContributions = false,
}) => {
  const theme = useTheme()

  const getColor = (name: string, customColor?: string) => {
    if (customColor) return customColor

    // Map factor names to theme colors
    const defaultColors: Record<string, string> = {
      rating: theme.colors.success, // green
      ctr: theme.colors.info || theme.colors.secondary, // blue
      activity: theme.colors.primary, // primary theme color
      randomness: theme.colors.text.secondary, // gray
      newness: theme.colors.warning, // amber
    }

    return defaultColors[name] || theme.colors.text.secondary
  }

  return (
    <Container>
      <Header>
        <Title>Ranking Breakdown</Title>
        <TotalScore>
          <ScoreValue>{Math.round(totalScore * 100)}</ScoreValue>
          <ScoreLabel>/ 100</ScoreLabel>
        </TotalScore>
      </Header>

      <FactorList>
        {factors.map((factor) => (
          <FactorRow key={factor.name}>
            <FactorLabel>{factor.label}</FactorLabel>
            <BarContainer>
              <BarFill
                $value={factor.value}
                $color={getColor(factor.name, factor.color)}
              />
            </BarContainer>
            <FactorMeta>
              <FactorValue>
                {showContributions
                  ? `+${Math.round(factor.contribution * 100)}`
                  : `${Math.round(factor.value * 100)}%`}
              </FactorValue>
              {showWeights && (
                <FactorWeight>{Math.round(factor.weight * 100)}% weight</FactorWeight>
              )}
            </FactorMeta>
          </FactorRow>
        ))}
      </FactorList>

      <Legend>
        {factors.map((factor) => (
          <LegendItem key={factor.name}>
            <LegendDot $color={getColor(factor.name, factor.color)} />
            {factor.label} ({Math.round(factor.weight * 100)}%)
          </LegendItem>
        ))}
      </Legend>
    </Container>
  )
}
