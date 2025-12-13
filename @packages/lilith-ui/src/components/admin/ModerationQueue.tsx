import React, { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../primitives/Button'
import { Badge } from '../primitives/Badge'
import { Tabs } from '../feedback/Tabs'
import type { Tab } from '../feedback/Tabs'

export interface ModerationItem {
  id: string
  type: 'content' | 'user' | 'report'
  title: string
  description: string
  reporter?: string
  reportedAt: Date
  status: 'pending' | 'approved' | 'rejected'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  preview?: {
    type: 'text' | 'image' | 'video'
    content: string
  }
}

export interface ModerationQueueProps {
  items: ModerationItem[]
  onApprove: (itemId: string, notes?: string) => void | Promise<void>
  onReject: (itemId: string, reason: string) => void | Promise<void>
  onBulkAction?: (action: 'approve' | 'reject', itemIds: string[]) => void | Promise<void>
  loading?: boolean
}

const QueueContainer = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  overflow: hidden;
`

const QueueHeader = styled.div`
  padding: ${(props) => props.theme.spacing.lg};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`

const Title = styled.h3`
  margin: 0 0 ${(props) => props.theme.spacing.sm} 0;
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text};
`

const Stats = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.lg};
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
`

const ItemList = styled.div`
  max-height: 600px;
  overflow-y: auto;
`

const QueueItem = styled.div<{ $selected?: boolean }>`
  padding: ${(props) => props.theme.spacing.lg};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  background: ${(props) => props.$selected ? props.theme.colors.primary + '10' : 'transparent'};
  transition: background 0.2s;

  &:hover {
    background: ${(props) => props.theme.colors.background};
  }

  &:last-child {
    border-bottom: none;
  }
`

const ItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing.sm};
`

const ItemInfo = styled.div`
  flex: 1;
`

const ItemTitle = styled.h4`
  margin: 0 0 ${(props) => props.theme.spacing.xs} 0;
  font-size: ${(props) => props.theme.typography.fontSize.base};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => props.theme.colors.text};
`

const ItemMeta = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
  align-items: center;
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
`

const ItemDescription = styled.p`
  margin: 0 0 ${(props) => props.theme.spacing.md} 0;
  color: ${(props) => props.theme.colors.text};
  line-height: 1.6;
`

const Preview = styled.div`
  padding: ${(props) => props.theme.spacing.md};
  background: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
  margin-bottom: ${(props) => props.theme.spacing.md};
  border: 1px solid ${(props) => props.theme.colors.border};
`

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
`

const PreviewText = styled.div`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-style: italic;
`

const Actions = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
`

const EmptyState = styled.div`
  padding: ${(props) => props.theme.spacing.xl};
  text-align: center;
  color: ${(props) => props.theme.colors.text.secondary};
`

const PriorityBadgeWrapper = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
  align-items: center;
`

export const ModerationQueue: React.FC<ModerationQueueProps> = ({
  items,
  onApprove,
  onReject,
  
  
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())
  const [selectedIds] = useState<Set<string>>(new Set())

  const filteredItems = items.filter(item => item.status === activeTab)
  const pendingCount = items.filter(i => i.status === 'pending').length
  const urgentCount = items.filter(i => i.priority === 'urgent' && i.status === 'pending').length

  const handleApprove = async (itemId: string) => {
    setProcessingIds(prev => new Set(prev).add(itemId))
    try {
      await onApprove(itemId)
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    }
  }

  const handleReject = async (itemId: string) => {
    const reason = window.prompt('Rejection reason:')
    if (!reason) return

    setProcessingIds(prev => new Set(prev).add(itemId))
    try {
      await onReject(itemId, reason)
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    }
  }

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'error'
      case 'high':
        return 'warning'
      default:
        return 'default'
    }
  }

  const tabs: Tab[] = [
    { key: 'pending', label: `Pending (${pendingCount})` },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' }
  ]

  return (
    <QueueContainer>
      <QueueHeader>
        <Title>Moderation Queue</Title>
        <Stats>
          <span>{pendingCount} pending</span>
          {urgentCount > 0 && <span style={{ color: 'var(--color-error)' }}>{urgentCount} urgent</span>}
        </Stats>
      </QueueHeader>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={(key) => setActiveTab(key as 'pending' | 'approved' | 'rejected')} />

      <ItemList>
        {filteredItems.length === 0 ? (
          <EmptyState>
            No {activeTab} items in the queue
          </EmptyState>
        ) : (
          filteredItems.map(item => {
            const isProcessing = processingIds.has(item.id)
            const isSelected = selectedIds.has(item.id)

            return (
              <QueueItem key={item.id} $selected={isSelected}>
                <ItemHeader>
                  <ItemInfo>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemMeta>
                      <PriorityBadgeWrapper>
                        <Badge variant={getPriorityVariant(item.priority)}>
                          {item.priority}
                        </Badge>
                        <Badge>{item.type}</Badge>
                      </PriorityBadgeWrapper>
                      {item.reporter && <span>Reported by: {item.reporter}</span>}
                      <span>{new Date(item.reportedAt).toLocaleString()}</span>
                    </ItemMeta>
                  </ItemInfo>
                </ItemHeader>

                <ItemDescription>{item.description}</ItemDescription>

                {item.preview && (
                  <Preview>
                    {item.preview.type === 'image' ? (
                      <PreviewImage src={item.preview.content} alt="Preview" />
                    ) : (
                      <PreviewText>{item.preview.content}</PreviewText>
                    )}
                  </Preview>
                )}

                {item.status === 'pending' && (
                  <Actions>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApprove(item.id)}
                      disabled={isProcessing}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleReject(item.id)}
                      disabled={isProcessing}
                    >
                      Reject
                    </Button>
                  </Actions>
                )}
              </QueueItem>
            )
          })
        )}
      </ItemList>
    </QueueContainer>
  )
}
