import React from 'react'
import styled from 'styled-components'

export interface DashboardLayoutProps {
  children: React.ReactNode
  columns?: number
  gap?: number
  minWidgetWidth?: number
}

const Grid = styled.div<{ $columns: number; $gap: number; $minWidth: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$columns}, 1fr);
  gap: ${(props) => props.$gap}px;
  width: 100%;

  /* Responsive breakpoints */
  @media (max-width: 1200px) {
    grid-template-columns: repeat(${(props) => Math.max(2, props.$columns - 1)}, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(${(props) => Math.min(2, props.$columns)}, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }

  /* Auto-fit for minimum widget width */
  @media (min-width: 481px) {
    grid-template-columns: repeat(
      auto-fit,
      minmax(${(props) => props.$minWidth}px, 1fr)
    );
  }
`

const Widget = styled.div<{ $span?: number }>`
  grid-column: span ${(props) => props.$span || 1};
  min-width: 0; /* Prevent grid overflow */

  /* Responsive span adjustments */
  @media (max-width: 768px) {
    grid-column: span ${(props) => Math.min(props.$span || 1, 2)};
  }

  @media (max-width: 480px) {
    grid-column: span 1;
  }
`

export interface DashboardWidgetProps {
  span?: number
  children: React.ReactNode
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({ span, children }) => {
  return <Widget $span={span}>{children}</Widget>
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  columns = 3,
  gap = 16,
  minWidgetWidth = 300
}) => {
  return (
    <Grid $columns={columns} $gap={gap} $minWidth={minWidgetWidth}>
      {children}
    </Grid>
  )
}

// Export both for convenience
DashboardLayout.displayName = 'DashboardLayout'
DashboardWidget.displayName = 'DashboardWidget'
