import { useState } from 'react'
import styled from 'styled-components'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MessageThread } from '../composites/MessageThread'

// Types
export interface SupportChatProps {
  orderId?: string
  userId: string
}

interface SupportTicket {
  id: string
  name: string
  roomType: string
  creatorId: string
  participants: string[]
  isActive: boolean
  orderId: string | null
  ticketMetadata: Record<string, unknown> | null
  createdAt: string
  closedAt: string | null
}

interface CreateTicketData {
  subject: string
  message: string
  orderId?: string
}

// Styled Components
const SupportContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.5rem;
  height: 600px;
  max-width: 1200px;
  width: 100%;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`

const TicketSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding-right: 1.5rem;

  @media (max-width: 968px) {
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding-right: 0;
    padding-bottom: 1.5rem;
  }
`

const CreateTicketButton = styled.button`
  padding: 0.875rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.active.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const TicketList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  max-height: 500px;
`

const TicketItem = styled.div<{ isSelected: boolean }>`
  padding: 1rem;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.hover.primary : theme.colors.surface};
  border: 1px solid ${({ theme, isSelected }) =>
    isSelected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const TicketTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const TicketMeta = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const TicketBadge = styled.span<{ status: 'open' | 'closed' }>`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background-color: ${({ theme, status }) =>
    status === 'open' ? theme.colors.success : theme.colors.disabled.background};
  color: ${({ theme, status }) =>
    status === 'open' ? theme.colors.success : theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 0.5rem;
`

const MessageArea = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  padding: 2rem;
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const Modal = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
`

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1.5rem;
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.surface};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.surface};
  min-height: 100px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme, variant }) =>
    variant === 'secondary' ? theme.colors.surface : theme.colors.primary};
  color: ${({ theme, variant }) =>
    variant === 'secondary' ? theme.colors.text.primary : 'white'};
  border: ${({ theme, variant }) =>
    variant === 'secondary' ? `1px solid ${theme.colors.border}` : 'none'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ theme, variant }) =>
      variant === 'secondary' ? theme.colors.hover.surface : theme.colors.active.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

// Component
export function SupportChat({ orderId, userId }: SupportChatProps) {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState<CreateTicketData>({
    subject: '',
    message: '',
    orderId,
  })

  const queryClient = useQueryClient()

  // Fetch support tickets
  const { data: tickets, isLoading } = useQuery<{ data: SupportTicket[] }>({
    queryKey: ['support-tickets', userId],
    queryFn: async () => {
      const response = await fetch('/api/chat/support/tickets', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (!response.ok) throw new Error('Failed to fetch tickets')
      return response.json()
    },
  })

  // Create ticket mutation
  const createTicket = useMutation({
    mutationFn: async (data: CreateTicketData) => {
      const response = await fetch('/api/chat/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to create ticket')
      return response.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] })
      setSelectedTicket(data.ticketId)
      setShowCreateModal(false)
      setFormData({ subject: '', message: '', orderId })
    },
  })

  const handleCreateTicket = () => {
    if (!formData.subject.trim() || !formData.message.trim()) return
    createTicket.mutate(formData)
  }

  const ticketList = tickets?.data || []

  return (
    <>
      <SupportContainer>
        <TicketSidebar>
          <CreateTicketButton onClick={() => setShowCreateModal(true)}>
            + New Ticket
          </CreateTicketButton>

          <TicketList>
            {isLoading ? (
              <div>Loading tickets...</div>
            ) : ticketList.length === 0 ? (
              <EmptyState>
                <p>No support tickets yet</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Create one to get started
                </p>
              </EmptyState>
            ) : (
              ticketList.map((ticket) => (
                <TicketItem
                  key={ticket.id}
                  isSelected={selectedTicket === ticket.id}
                  onClick={() => setSelectedTicket(ticket.id)}
                >
                  <TicketTitle>{ticket.name}</TicketTitle>
                  <TicketMeta>
                    {new Date(ticket.createdAt).toLocaleDateString()}
                    <TicketBadge status={ticket.isActive ? 'open' : 'closed'}>
                      {ticket.isActive ? 'Open' : 'Closed'}
                    </TicketBadge>
                  </TicketMeta>
                  {ticket.orderId && (
                    <TicketMeta style={{ marginTop: '0.25rem' }}>
                      Order: {ticket.orderId.slice(0, 8)}...
                    </TicketMeta>
                  )}
                </TicketItem>
              ))
            )}
          </TicketList>
        </TicketSidebar>

        <MessageArea>
          {selectedTicket ? (
            <MessageThread
              threadId={selectedTicket}
              currentUserId={userId}
              messages={[]}
              config={{
                showTimestamps: true,
                enableInput: true,
                autoScroll: true,
              }}
            />
          ) : (
            <EmptyState>
              <h3>Select a ticket</h3>
              <p>Choose a support ticket from the list to view the conversation</p>
            </EmptyState>
          )}
        </MessageArea>
      </SupportContainer>

      {showCreateModal && (
        <ModalOverlay onClick={() => setShowCreateModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Create Support Ticket</ModalTitle>

            <FormGroup>
              <Label htmlFor="ticket-subject">Subject</Label>
              <Input
                id="ticket-subject"
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="Brief description of your issue"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="ticket-message">Message</Label>
              <TextArea
                id="ticket-message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Describe your issue in detail..."
              />
            </FormGroup>

            {orderId && (
              <FormGroup>
                <Label>Order ID</Label>
                <Input type="text" value={orderId} disabled />
              </FormGroup>
            )}

            <ButtonGroup>
              <Button
                variant="secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateTicket}
                disabled={createTicket.isPending}
              >
                {createTicket.isPending ? 'Creating...' : 'Create Ticket'}
              </Button>
            </ButtonGroup>
          </Modal>
        </ModalOverlay>
      )}
    </>
  )
}
