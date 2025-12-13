/**
 * Tabs Component
 *
 * Tabbed interface component for navigation with active state indicator.
 * Features smooth transitions and keyboard navigation support.
 * Theme-agnostic with semantic token usage.
 */

import styled, { css } from 'styled-components'
import type { ThemeInterface } from '@transftw/theme-provider'
import type { ReactNode } from 'react'

/**
 * Tab definition
 */
export interface Tab {
  key: string
  label: string
  content?: ReactNode
}

export interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (key: string) => void
  /** Optional custom class name */
  className?: string
}

const TabsContainer = styled.div`
  border-bottom: 2px solid ${props => (props.theme as ThemeInterface).colors.border};
  margin-bottom: ${props => (props.theme as ThemeInterface).spacing.lg};
`

const TabList = styled.div`
  display: flex;
  gap: ${props => (props.theme as ThemeInterface).spacing.xs};
  overflow-x: auto;

  /* Hide scrollbar for cleaner appearance */
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

const Tab = styled.button<{ $isActive: boolean }>`
  padding: ${props => (props.theme as ThemeInterface).spacing.md}
    ${props => (props.theme as ThemeInterface).spacing.lg};
  background: none;
  border: none;
  border-bottom: 2px solid
    ${props => {
      const theme = props.theme as ThemeInterface
      return props.$isActive ? theme.colors.primary : 'transparent'
    }};
  color: ${props => {
    const theme = props.theme as ThemeInterface
    return props.$isActive ? theme.colors.primary : theme.colors.text.secondary
  }};
  font-size: ${props => (props.theme as ThemeInterface).typography.fontSize.sm};
  font-weight: ${props => {
    const theme = props.theme as ThemeInterface
    return props.$isActive
      ? theme.typography.fontWeight.semibold
      : theme.typography.fontWeight.normal
  }};
  font-family: ${props => (props.theme as ThemeInterface).typography.fontFamily.body};
  margin-bottom: -2px;
  cursor: pointer;
  transition: color ${props => (props.theme as ThemeInterface).transitions.fast};
  white-space: nowrap;

  &:hover {
    color: ${props => (props.theme as ThemeInterface).colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${props => (props.theme as ThemeInterface).colors.primary};
    outline-offset: 2px;
  }

  /* Cyberpunk neon effect on active tab */
  ${props => {
    const theme = props.theme as ThemeInterface
    return (
      props.$isActive &&
      theme.extensions?.cyberpunk &&
      css`
        text-shadow: ${theme.extensions.cyberpunk.neonGlow.magenta};
        box-shadow: 0 0 10px ${theme.colors.primary}50;
      `
    )
  }}
`

const TabPanel = styled.div`
  padding: ${props => (props.theme as ThemeInterface).spacing.md} 0;
`

/**
 * Tabbed interface component for navigation with active state indicator.
 * Features smooth transitions and keyboard navigation support.
 *
 * @example
 * // Basic tabs
 * <Tabs
 *   tabs={[
 *     { key: 'overview', label: 'Overview' },
 *     { key: 'details', label: 'Details' },
 *     { key: 'settings', label: 'Settings' }
 *   ]}
 *   activeTab={activeTab}
 *   onTabChange={setActiveTab}
 * />
 *
 * @example
 * // Tabs with content
 * <Tabs
 *   tabs={[
 *     { key: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
 *     { key: 'tab2', label: 'Tab 2', content: <div>Content 2</div> }
 *   ]}
 *   activeTab={currentTab}
 *   onTabChange={handleTabChange}
 * />
 */
export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  const activeTabContent = tabs.find(tab => tab.key === activeTab)

  return (
    <div className={className}>
      <TabsContainer>
        <TabList role="tablist">
          {tabs.map(tab => (
            <Tab
              key={tab.key}
              $isActive={tab.key === activeTab}
              onClick={() => onTabChange(tab.key)}
              aria-selected={tab.key === activeTab}
              role="tab"
            >
              {tab.label}
            </Tab>
          ))}
        </TabList>
      </TabsContainer>
      {activeTabContent?.content && (
        <TabPanel role="tabpanel">{activeTabContent.content}</TabPanel>
      )}
    </div>
  )
}
