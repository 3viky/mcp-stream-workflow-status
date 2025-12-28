/**
 * Grid Component
 *
 * CSS Grid layout component with responsive column configuration.
 * Provides a flexible grid system with customizable gaps and alignment.
 * Theme-agnostic with semantic token usage.
 */

import styled, { css } from 'styled-components'
import type { ThemeInterface } from '@transftw/theme-provider'
import type { CSSProperties, ReactNode } from 'react'

export interface GridProps {
  /** Grid items */
  children: ReactNode
  /** Number of columns or custom grid-template-columns string */
  columns?: number | string
  /** Gap between all grid items */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Gap between rows only */
  rowGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Gap between columns only */
  columnGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Grid auto rows template */
  autoRows?: string
  /** Grid auto columns template */
  autoColumns?: string
  /** Align items on the block (column) axis */
  alignItems?: CSSProperties['alignItems']
  /** Justify items on the inline (row) axis */
  justifyItems?: CSSProperties['justifyItems']
  /** Additional CSS class name */
  className?: string
  /** Responsive column configuration by breakpoint */
  responsive?: {
    /** Columns at small breakpoint (640px+) */
    sm?: number
    /** Columns at medium breakpoint (768px+) */
    md?: number
    /** Columns at large breakpoint (1024px+) */
    lg?: number
    /** Columns at extra large breakpoint (1280px+) */
    xl?: number
  }
}

const StyledGrid = styled.div<{
  $columns: number | string
  $gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  $rowGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  $columnGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  $autoRows?: string
  $autoColumns?: string
  $alignItems?: CSSProperties['alignItems']
  $justifyItems?: CSSProperties['justifyItems']
  $responsive?: GridProps['responsive']
}>`
  display: grid;
  grid-template-columns: ${props =>
    typeof props.$columns === 'number'
      ? `repeat(${props.$columns}, 1fr)`
      : props.$columns};

  ${props => {
    const theme = props.theme as ThemeInterface
    const getGapValue = (gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
      if (!gap || gap === 'none') return '0'
      return theme.spacing[gap]
    }

    if (props.$rowGap || props.$columnGap) {
      return css`
        row-gap: ${getGapValue(props.$rowGap)};
        column-gap: ${getGapValue(props.$columnGap)};
      `
    } else if (props.$gap) {
      return css`
        gap: ${getGapValue(props.$gap)};
      `
    }
    return ''
  }}

  ${props => props.$autoRows && css`
    grid-auto-rows: ${props.$autoRows};
  `}

  ${props => props.$autoColumns && css`
    grid-auto-columns: ${props.$autoColumns};
  `}

  ${props => props.$alignItems && css`
    align-items: ${props.$alignItems};
  `}

  ${props => props.$justifyItems && css`
    justify-items: ${props.$justifyItems};
  `}

  /* Responsive breakpoints */
  ${props => props.$responsive?.sm && css`
    @media (min-width: 640px) {
      grid-template-columns: repeat(${props.$responsive.sm}, 1fr);
    }
  `}

  ${props => props.$responsive?.md && css`
    @media (min-width: 768px) {
      grid-template-columns: repeat(${props.$responsive.md}, 1fr);
    }
  `}

  ${props => props.$responsive?.lg && css`
    @media (min-width: 1024px) {
      grid-template-columns: repeat(${props.$responsive.lg}, 1fr);
    }
  `}

  ${props => props.$responsive?.xl && css`
    @media (min-width: 1280px) {
      grid-template-columns: repeat(${props.$responsive.xl}, 1fr);
    }
  `}
`

/**
 * CSS Grid layout component with responsive column configuration.
 * Provides a flexible grid system with customizable gaps and alignment.
 *
 * @example
 * // Basic 3-column grid
 * <Grid columns={3} gap="lg">
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </Grid>
 *
 * @example
 * // Responsive grid (1 col mobile, 2 tablet, 4 desktop)
 * <Grid
 *   columns={1}
 *   responsive={{ sm: 2, md: 3, lg: 4 }}
 *   gap="md"
 * >
 *   {items.map(item => (
 *     <StatCard key={item.id} {...item} />
 *   ))}
 * </Grid>
 *
 * @example
 * // Custom grid template with different row/column gaps
 * <Grid
 *   columns="200px 1fr 200px"
 *   rowGap="sm"
 *   columnGap="lg"
 *   alignItems="center"
 * >
 *   <div>Sidebar</div>
 *   <div>Content</div>
 *   <div>Aside</div>
 * </Grid>
 */
export function Grid({
  children,
  columns = 1,
  gap = 'md',
  rowGap,
  columnGap,
  autoRows,
  autoColumns,
  alignItems,
  justifyItems,
  className,
  responsive
}: GridProps) {
  return (
    <StyledGrid
      $columns={columns}
      $gap={gap}
      $rowGap={rowGap}
      $columnGap={columnGap}
      $autoRows={autoRows}
      $autoColumns={autoColumns}
      $alignItems={alignItems}
      $justifyItems={justifyItems}
      $responsive={responsive}
      className={className}
    >
      {children}
    </StyledGrid>
  )
}
