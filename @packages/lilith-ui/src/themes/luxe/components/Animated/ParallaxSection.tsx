/**
 * ParallaxSection Component
 *
 * Section with parallax scrolling background effect.
 * Creates depth and visual interest.
 */

import styled from 'styled-components'

import { useParallax } from '../../hooks/useParallax.js'
import { luxeTheme } from '../../styles/tokens.js'

export interface ParallaxSectionProps {
  /** Background image URL */
  backgroundImage?: string;
  /** Parallax speed (-1 to 1) */
  speed?: number;
  /** Minimum height */
  minHeight?: string;
  /** Background overlay opacity (0-1) */
  overlayOpacity?: number;
  /** Custom className */
  className?: string;
  /** Child elements */
  children: React.ReactNode;
}

const SectionContainer = styled.section<{
  $minHeight: string;
}>`
  position: relative;
  min-height: ${({ $minHeight }) => $minHeight};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ParallaxBackground = styled.div<{
  $backgroundImage?: string;
  $offset: number;
}>`
  position: absolute;
  inset: 0;
  background-image: ${({ $backgroundImage }) =>
    $backgroundImage ? `url(${$backgroundImage})` : 'none'};
  background-size: cover;
  background-position: center;
  transform: translateY(${({ $offset }) => $offset}px);
  will-change: transform;
`

const Overlay = styled.div<{ $opacity: number }>`
  position: absolute;
  inset: 0;
  background-color: ${luxeTheme.colors.overlayDark};
  opacity: ${({ $opacity }) => $opacity};
`

const Content = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: ${luxeTheme.containers['2xl']};
  padding: ${luxeTheme.spacing[16]} ${luxeTheme.spacing[6]};

  @media (max-width: ${luxeTheme.breakpoints.md}) {
    padding: ${luxeTheme.spacing[12]} ${luxeTheme.spacing[4]};
  }
`

export function ParallaxSection({
  backgroundImage,
  speed = 0.5,
  minHeight = '500px',
  overlayOpacity = 0.5,
  className,
  children,
}: ParallaxSectionProps) {
  const offset = useParallax({ speed, enabled: !!backgroundImage })

  return (
    <SectionContainer $minHeight={minHeight} className={className}>
      {backgroundImage && (
        <>
          <ParallaxBackground
            $backgroundImage={backgroundImage}
            $offset={offset}
          />
          <Overlay $opacity={overlayOpacity} />
        </>
      )}
      <Content>{children}</Content>
    </SectionContainer>
  )
}
