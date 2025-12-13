/**
 * MailboxTabs Composite Component
 *
 * Tabbed navigation for mailbox categories (Primary, VIP, Support, Archived)
 */

import React, { useState } from 'react'
import styled from 'styled-components'
import { Mail, Crown, HeadphonesIcon, Archive, Loader2 } from 'lucide-react'

export type MailboxTab = 'primary' | 'vip' | 'support' | 'archived'

export interface MailboxTabConfig {
  id: MailboxTab
  label: string
  icon?: React.ReactNode
  unreadCount?: number
  enabled?: boolean
}

export interface MailboxTabsConfig {
  /** Tabs to display */
  tabs?: MailboxTabConfig[]
  /** Show unread badges */
  showUnreadBadges?: boolean
  /** Default active tab */
  defaultTab?: MailboxTab
}

export interface MailboxTabsProps {
  /** Active tab */
  activeTab?: MailboxTab
  /** Tab change handler */
  onTabChange?: (tab: MailboxTab) => void
  /** Unread counts per tab */
  unreadCounts?: Partial<Record<MailboxTab, number>>
  /** Loading state per tab */
  loadingTabs?: MailboxTab[]
  /** Configuration options */
  config?: MailboxTabsConfig
  /** Children to render in active tab content */
  children?: React.ReactNode
  /** Additional CSS class */
  className?: string
}

const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${(props) => props.theme.colors.background || '#1f2937'};
  border-radius: 8px;
  overflow: hidden;
`

const TabsHeader = styled.div`
  display: flex;
  background: ${(props) => props.theme.colors.surface || '#111827'};
  border-bottom: 1px solid ${(props) => props.theme.colors.border || '#374151'};
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.border || '#374151'};
    border-radius: 2px;
  }
`

const Tab = styled.button<{ $active: boolean; $disabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  background: ${(props) =>
    props.$active
      ? props.theme.colors.background || '#1f2937'
      : 'transparent'};
  color: ${(props) =>
    props.$active
      ? props.theme.colors.text || '#ffffff'
      : props.theme.colors.text.secondary || '#9ca3af'};
  font-size: 14px;
  font-weight: ${(props) => (props.$active ? '600' : '400')};
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  white-space: nowrap;
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
  position: relative;

  &:hover:not(:disabled) {
    background: ${(props) =>
      props.$active
        ? props.theme.colors.background || '#1f2937'
        : 'rgba(255, 255, 255, 0.05)'};
    color: ${(props) => props.theme.colors.text || '#ffffff'};
  }

  ${(props) =>
    props.$active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: ${props.theme.colors.primary || '#3b82f6'};
    }
  `}
`

const TabIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`

const UnreadBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: ${(props) => props.theme.colors.primary || '#3b82f6'};
  color: ${(props) => props.theme.colors.text || '#ffffff'};
  font-size: 11px;
  font-weight: 700;
  border-radius: 10px;
`

const TabContent = styled.div`
  flex: 1;
  overflow: hidden;
`

const LoadingSpinner = styled(Loader2)`
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const defaultTabs: MailboxTabConfig[] = [
  {
    id: 'primary',
    label: 'Primary',
    icon: <Mail size={16} />,
    enabled: true,
  },
  {
    id: 'vip',
    label: 'VIP',
    icon: <Crown size={16} />,
    enabled: true,
  },
  {
    id: 'support',
    label: 'Support',
    icon: <HeadphonesIcon size={16} />,
    enabled: true,
  },
  {
    id: 'archived',
    label: 'Archived',
    icon: <Archive size={16} />,
    enabled: true,
  },
]

const defaultConfig: Required<Omit<MailboxTabsConfig, 'tabs'>> & { tabs: MailboxTabConfig[] } = {
  tabs: defaultTabs,
  showUnreadBadges: true,
  defaultTab: 'primary',
}

export function MailboxTabs({
  activeTab: controlledActiveTab,
  onTabChange,
  unreadCounts = {},
  loadingTabs = [],
  config,
  children,
  className,
}: MailboxTabsProps) {
  const mergedConfig = { ...defaultConfig, ...config }
  const [internalActiveTab, setInternalActiveTab] = useState<MailboxTab>(
    mergedConfig.defaultTab,
  )

  // Use controlled or uncontrolled mode
  const activeTab = controlledActiveTab ?? internalActiveTab

  const handleTabClick = (tab: MailboxTab) => {
    if (!mergedConfig.tabs.find((t) => t.id === tab)?.enabled) return

    if (onTabChange) {
      onTabChange(tab)
    } else {
      setInternalActiveTab(tab)
    }
  }

  const getUnreadCount = (tabId: MailboxTab): number => {
    return unreadCounts[tabId] ?? 0
  }

  const isTabLoading = (tabId: MailboxTab): boolean => {
    return loadingTabs.includes(tabId)
  }

  return (
    <TabsContainer className={className}>
      <TabsHeader>
        {mergedConfig.tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const isDisabled = tab.enabled === false
          const unreadCount = getUnreadCount(tab.id)
          const isLoading = isTabLoading(tab.id)

          return (
            <Tab
              key={tab.id}
              $active={isActive}
              $disabled={isDisabled}
              onClick={() => handleTabClick(tab.id)}
              disabled={isDisabled}
            >
              <TabIcon>
                {isLoading ? <LoadingSpinner size={16} /> : tab.icon}
              </TabIcon>
              <span>{tab.label}</span>
              {mergedConfig.showUnreadBadges && unreadCount > 0 && (
                <UnreadBadge>{unreadCount > 99 ? '99+' : unreadCount}</UnreadBadge>
              )}
            </Tab>
          )
        })}
      </TabsHeader>

      <TabContent>{children}</TabContent>
    </TabsContainer>
  )
}
