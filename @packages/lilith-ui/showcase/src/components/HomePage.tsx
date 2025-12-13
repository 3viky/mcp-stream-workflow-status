import styled from 'styled-components'
import { useTheme } from '@transftw/theme-provider'
import { Button } from '@transftw/lilith-ui'
import { Link } from 'react-router-dom'

const Hero = styled.div`
  text-align: center;
  padding: 80px 20px;
  max-width: 800px;
  margin: 0 auto;
`

const Title = styled.h1`
  font-size: 72px;
  font-weight: bold;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary},
    ${props => props.theme.colors.secondary}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  line-height: 1.2;
`

const Subtitle = styled.p`
  font-size: 24px;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 40px;
  line-height: 1.6;
`

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 60px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`

const FeatureCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 30px;
  text-align: center;
  transition: all 0.3s;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`

const FeatureIcon = styled.div`
  font-size: 48px;
  margin-bottom: 15px;
`

const FeatureTitle = styled.h3`
  font-size: 20px;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 10px;
`

const FeatureDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.6;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 40px;
  flex-wrap: wrap;
`

const StyledLink = styled(Link)`
  text-decoration: none;
`

const CurrentThemeBadge = styled.div`
  display: inline-block;
  padding: 8px 16px;
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.full};
  color: ${props => props.theme.colors.primary};
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 1px;
`

export function HomePage() {
  const { themeName } = useTheme()

  return (
    <Hero>
      <CurrentThemeBadge>
        Current Theme: {themeName}
      </CurrentThemeBadge>

      <Title>egirl-ui</Title>
      <Subtitle>
        A theme-agnostic React component library that automatically adapts between
        luxe and cyberpunk aesthetics.
      </Subtitle>

      <ButtonGroup>
        <StyledLink to="/primitives">
          <Button variant="primary" size="lg">
            Browse Components
          </Button>
        </StyledLink>
        <a
          href="https://github.com/transquinnftw/egirl-platform"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <Button variant="secondary" size="lg">
            View on GitHub
          </Button>
        </a>
      </ButtonGroup>

      <Features>
        <FeatureCard>
          <FeatureIcon>🎨</FeatureIcon>
          <FeatureTitle>Theme Agnostic</FeatureTitle>
          <FeatureDescription>
            Components automatically adapt to luxe or cyberpunk themes without code changes.
            Use semantic tokens for consistent theming.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>⚡</FeatureIcon>
          <FeatureTitle>Runtime Switching</FeatureTitle>
          <FeatureDescription>
            Switch themes instantly without page reload. Perfect for giving users
            control over their visual experience.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>📦</FeatureIcon>
          <FeatureTitle>60+ Components</FeatureTitle>
          <FeatureDescription>
            Comprehensive library covering primitives, layout, typography, navigation,
            feedback, data display, and animations.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>🔒</FeatureIcon>
          <FeatureTitle>Type Safe</FeatureTitle>
          <FeatureDescription>
            Built with TypeScript for full type safety. Intellisense support for all
            component props and theme tokens.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>💅</FeatureIcon>
          <FeatureTitle>Styled Components</FeatureTitle>
          <FeatureDescription>
            Modern CSS-in-JS with theme context integration. Scoped styles with
            no global CSS conflicts.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>✨</FeatureIcon>
          <FeatureTitle>Two Themes</FeatureTitle>
          <FeatureDescription>
            Luxe theme with elegant serif typography and soft shadows. Cyberpunk
            theme with neon colors and dramatic effects.
          </FeatureDescription>
        </FeatureCard>
      </Features>
    </Hero>
  )
}
