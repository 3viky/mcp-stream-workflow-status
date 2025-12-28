/**
 * Pagination Component
 *
 * Theme-agnostic pagination with page navigation and info display.
 * Automatically adapts styling based on active theme (luxe or cyberpunk).
 *
 * IMPORTANT: This component preserves ALL business logic from cyberpunk-ui/ui-table.
 * Only styling has been converted to styled-components with semantic tokens.
 */

import styled, { css } from 'styled-components'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Pagination component props
 */
export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems?: number
  itemsPerPage?: number
}

// Styled Components

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border};
`

const PageInfo = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`

const PageControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`

const PageButton = styled.button<{ $active?: boolean }>`
  min-width: 36px;
  height: 36px;
  padding: 0 ${props => props.theme.spacing.sm};
  background: ${props => props.$active
    ? props.theme.colors.primary
    : props.theme.colors.background};
  color: ${props => props.$active
    ? props.theme.colors.background
    : props.theme.colors.primary};
  border: 2px solid ${props => props.$active
    ? props.theme.colors.primary
    : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.$active ? props.theme.shadows.sm : 'none'};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.sm};
  }

  /* Cyberpunk neon glow on active */
  ${props => props.$active && props.theme.extensions?.cyberpunk && css`
    box-shadow: 0 0 10px ${props.theme.colors.primary};

    &:hover:not(:disabled) {
      box-shadow: 0 0 15px ${props.theme.colors.primary};
    }
  `}

  /* Cyberpunk neon glow on hover */
  ${props => !props.$active && props.theme.extensions?.cyberpunk && css`
    &:hover:not(:disabled) {
      box-shadow: 0 0 5px ${props.theme.colors.primary};
    }
  `}
`

const Ellipsis = styled.span`
  padding: 0 ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text.secondary};
`

/**
 * Cyberpunk-themed pagination component with page navigation and info display.
 * Features theme-aware styling with ellipsis for large page counts.
 *
 * @param props - Pagination component props
 * @param props.currentPage - Current active page number (1-indexed)
 * @param props.totalPages - Total number of pages
 * @param props.onPageChange - Page change handler
 * @param props.totalItems - Optional total number of items for info display
 * @param props.itemsPerPage - Optional items per page for info display
 * @returns A styled pagination component with theme-aware aesthetics
 *
 * @example
 * // Basic pagination
 * <Pagination
 *   currentPage={currentPage}
 *   totalPages={10}
 *   onPageChange={(page) => setCurrentPage(page)}
 * />
 *
 * @example
 * // Pagination with item info
 * <Pagination
 *   currentPage={2}
 *   totalPages={5}
 *   totalItems={100}
 *   itemsPerPage={20}
 *   onPageChange={handlePageChange}
 * />
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  // PRESERVED: Original page number generation algorithm with ellipsis logic
  const generatePageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      pages.push(totalPages)
    }

    return pages
  }

  // PRESERVED: Original previous page handler
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  // PRESERVED: Original next page handler
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  // PRESERVED: Original page click handler
  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number') {
      onPageChange(page)
    }
  }

  // PRESERVED: Original info text generation logic
  const getInfoText = () => {
    if (totalItems && itemsPerPage) {
      const start = (currentPage - 1) * itemsPerPage + 1
      const end = Math.min(currentPage * itemsPerPage, totalItems)
      return `Showing ${start}-${end} of ${totalItems} items`
    }
    return `Page ${currentPage} of ${totalPages}`
  }

  // PRESERVED: Original hide logic for single page
  if (totalPages <= 1) {
    return null
  }

  return (
    <PaginationContainer>
      <PageInfo>{getInfoText()}</PageInfo>

      <PageControls>
        {/* PRESERVED: Previous button */}
        <PageButton
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </PageButton>

        {/* PRESERVED: Page number buttons with ellipsis */}
        {generatePageNumbers().map((page, index) =>
          typeof page === 'string' ? (
            <Ellipsis key={`ellipsis-${index}`}>
              {page}
            </Ellipsis>
          ) : (
            <PageButton
              key={page}
              onClick={() => handlePageClick(page)}
              $active={page === currentPage}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </PageButton>
          )
        )}

        {/* PRESERVED: Next button */}
        <PageButton
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </PageButton>
      </PageControls>
    </PaginationContainer>
  )
}
