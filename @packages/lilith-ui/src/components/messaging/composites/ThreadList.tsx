/**
 * ThreadList Composite Component
 *
 * Scrollable list of thread items with virtual scrolling for performance
 */

import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Loader2, AlertCircle, Search } from 'lucide-react'
import { ThreadListItem } from '../primitives/ThreadListItem'

export interface ThreadListConfig {
  /** Enable virtual scrolling (for large lists) */
  enableVirtualScroll?: boolean
  /** Item height for virtual scrolling (px) */
  itemHeight?: number
  /** Enable search/filter */
  enableSearch?: boolean
  /** Search placeholder */
  searchPlaceholder?: string
  /** Empty state message */
  emptyMessage?: string
  /** Loading text */
  loadingText?: string
  /** Show unread count badge */
  showUnreadBadges?: boolean
}

export interface ThreadListProps {
  /** List of threads */
  threads: Array<{
    id: string
    participantIds: string[]
    participantNames?: string[]
    lastMessage?: {
      content: string
      senderId: string
      createdAt: string
    } | null
    unreadCount: number
    updatedAt: string
  }>
  /** Current user ID */
  currentUserId: string
  /** Currently selected thread ID */
  selectedThreadId?: string
  /** Thread selection handler */
  onSelectThread?: (threadId: string) => void
  /** Loading state */
  isLoading?: boolean
  /** Error state */
  error?: Error | null
  /** Configuration options */
  config?: ThreadListConfig
  /** Additional CSS class */
  className?: string
}

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${(props) => props.theme.colors.background || '#1f2937'};
  border-radius: 8px;
  overflow: hidden;
`

const SearchContainer = styled.div`
  padding: 12px;
  border-bottom: 1px solid ${(props) => props.theme.colors.border || '#374151'};
  background: ${(props) => props.theme.colors.surface || '#111827'};
`

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${(props) => props.theme.colors.background || '#1f2937'};
  border: 1px solid ${(props) => props.theme.colors.border || '#374151'};
  border-radius: 8px;
  color: ${(props) => props.theme.colors.text || '#ffffff'};

  input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: inherit;
    font-size: 14px;

    &::placeholder {
      color: ${(props) => props.theme.colors.text.secondary || '#9ca3af'};
    }
  }
`

const ScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.border || '#374151'};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.colors.hover.surface || '#4b5563'};
  }
`

const VirtualScrollWrapper = styled.div`
  position: relative;
  width: 100%;
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 12px;
  color: ${(props) => props.theme.colors.text.secondary || '#9ca3af'};
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

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 12px;
  color: ${(props) => props.theme.colors.error || '#ef4444'};
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: ${(props) => props.theme.colors.text.secondary || '#9ca3af'};
  text-align: center;
`

const defaultConfig: Required<ThreadListConfig> = {
  enableVirtualScroll: true,
  itemHeight: 72,
  enableSearch: true,
  searchPlaceholder: 'Search conversations...',
  emptyMessage: 'No conversations yet',
  loadingText: 'Loading conversations...',
  showUnreadBadges: true,
}

export function ThreadList({
  threads,
  currentUserId,
  selectedThreadId,
  onSelectThread,
  isLoading = false,
  error = null,
  config,
  className,
}: ThreadListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const mergedConfig = { ...defaultConfig, ...config }

  // Filter threads based on search query
  const filteredThreads = threads.filter((thread) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const participantMatch = thread.participantNames?.some((name) =>
      name.toLowerCase().includes(query),
    )
    const messageMatch = thread.lastMessage?.content.toLowerCase().includes(query)
    return participantMatch || messageMatch
  })

  // Virtual scrolling calculations
  const totalHeight = filteredThreads.length * mergedConfig.itemHeight
  const startIndex = Math.floor(scrollTop / mergedConfig.itemHeight)
  const endIndex = Math.min(
    filteredThreads.length,
    Math.ceil((scrollTop + containerHeight) / mergedConfig.itemHeight) + 1,
  )
  const visibleThreads = filteredThreads.slice(startIndex, endIndex)
  const offsetY = startIndex * mergedConfig.itemHeight

  // Update container height and scroll position
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const updateDimensions = () => {
      setContainerHeight(container.clientHeight)
    }

    const handleScroll = () => {
      setScrollTop(container.scrollTop)
    }

    updateDimensions()
    container.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', updateDimensions)

    return () => {
      container.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  const renderThreads = () => {
    if (mergedConfig.enableVirtualScroll && filteredThreads.length > 20) {
      return (
        <VirtualScrollWrapper style={{ height: `${totalHeight}px` }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleThreads.map((thread) => (
              <ThreadListItem
                key={thread.id}
                thread={{
                  id: thread.id,
                  participants: thread.participantIds,
                  lastMessage: thread.lastMessage || undefined,
                  unreadCount: thread.unreadCount,
                }}
                currentUserId={currentUserId}
                isSelected={thread.id === selectedThreadId}
                onSelect={onSelectThread}
              />
            ))}
          </div>
        </VirtualScrollWrapper>
      )
    }

    return (
      <>
        {filteredThreads.map((thread) => (
          <ThreadListItem
            key={thread.id}
            thread={{
              id: thread.id,
              participants: thread.participantIds,
              lastMessage: thread.lastMessage || undefined,
              unreadCount: thread.unreadCount,
            }}
            currentUserId={currentUserId}
            isSelected={thread.id === selectedThreadId}
            onSelect={onSelectThread}
          />
        ))}
      </>
    )
  }

  return (
    <ListContainer className={className}>
      {mergedConfig.enableSearch && (
        <SearchContainer>
          <SearchInput>
            <Search size={16} />
            <input
              type="text"
              placeholder={mergedConfig.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchInput>
        </SearchContainer>
      )}

      <ScrollContainer ref={scrollContainerRef}>
        {isLoading && (
          <LoadingContainer>
            <LoadingSpinner size={32} />
            <span>{mergedConfig.loadingText}</span>
          </LoadingContainer>
        )}

        {error && (
          <ErrorContainer>
            <AlertCircle size={32} />
            <span>Failed to load conversations</span>
            <span style={{ fontSize: '12px' }}>{error.message}</span>
          </ErrorContainer>
        )}

        {!isLoading && !error && filteredThreads.length === 0 && (
          <EmptyState>
            <span>
              {searchQuery
                ? `No conversations matching "${searchQuery}"`
                : mergedConfig.emptyMessage}
            </span>
          </EmptyState>
        )}

        {!isLoading && !error && filteredThreads.length > 0 && renderThreads()}
      </ScrollContainer>
    </ListContainer>
  )
}
