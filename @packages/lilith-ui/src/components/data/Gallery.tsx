/**
 * Gallery Component
 *
 * Responsive image grid with lightbox viewer.
 * Supports lazy loading, keyboard navigation, and category filtering.
 * Theme-adaptive via semantic tokens.
 */

import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'

export interface GalleryImage {
  /** Image source URL */
  src: string
  /** Image alt text */
  alt: string
  /** Optional thumbnail (for performance) */
  thumbnail?: string
  /** Image title */
  title?: string
  /** Image description */
  description?: string
  /** Category */
  category?: string
}

export interface GalleryProps {
  /** Array of images */
  images: GalleryImage[]
  /** Number of columns (responsive) */
  columns?: 2 | 3 | 4
  /** Enable category filtering */
  showFilters?: boolean
  /** Gap between images (theme spacing key) */
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  /** Custom className */
  className?: string
}

const GalleryContainer = styled.div`
  width: 100%;
`

const FilterBar = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
`

const FilterButton = styled.button<{ $isActive: boolean }>`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-family: ${props => props.theme.typography.fontFamily.body};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${({ $isActive, theme }) =>
    $isActive ? '#ffffff' : theme.colors.text.primary};
  background-color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary : 'transparent'};
  border: 2px solid
    ${({ $isActive, theme }) =>
      $isActive ? theme.colors.primary : theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.full};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  text-transform: capitalize;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${({ $isActive, theme }) =>
      $isActive ? theme.colors.primary : theme.colors.hover.surface};
  }

  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
`

const Grid = styled.div<{ $columns: number; $gap: string }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, 1fr);
  gap: ${({ $gap, theme }) => (theme.spacing as Record<string, string>)[$gap] || theme.spacing.md};

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(
      ${({ $columns }) => Math.max(1, $columns - 1)},
      1fr
    );
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(
      ${({ $columns }) => Math.max(1, $columns - 2)},
      1fr
    );
  }
`

const GalleryItem = styled.button`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: ${props => props.theme.borderRadius.lg};
  cursor: pointer;
  border: none;
  padding: 0;
  background: none;
  transition: transform ${props => props.theme.transitions.normal};

  &:hover {
    transform: scale(1.02);
  }

  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 4px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${props => props.theme.transitions.slow};
  }

  &:hover img {
    transform: scale(1.1);
  }
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  opacity: 0;
  transition: opacity ${props => props.theme.transitions.normal};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-family: ${props => props.theme.typography.fontFamily.heading};
  font-size: ${props => props.theme.typography.fontSize.lg};
  padding: ${props => props.theme.spacing.md};
  text-align: center;

  ${GalleryItem}:hover & {
    opacity: 1;
  }
`

const Lightbox = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: ${props => props.theme.zIndex.modal};
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.lg};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity ${props => props.theme.transitions.normal};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing.md};
  }
`

const LightboxContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`

const LightboxImage = styled.img`
  max-width: 100%;
  max-height: 80vh;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.xl};
`

const LightboxInfo = styled.div`
  text-align: center;
  color: #ffffff;
  max-width: 600px;
`

const LightboxTitle = styled.h3`
  font-family: ${props => props.theme.typography.fontFamily.heading};
  font-size: ${props => props.theme.typography.fontSize.xl};
  margin-bottom: ${props => props.theme.spacing.sm};
`

const LightboxDescription = styled.p`
  font-family: ${props => props.theme.typography.fontFamily.body};
  font-size: ${props => props.theme.typography.fontSize.base};
  color: #ffffff;
  opacity: 0.9;
`

const LightboxButton = styled.button`
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: ${props => props.theme.borderRadius.full};
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }

  &:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`

const CloseButton = styled(LightboxButton)`
  top: ${props => props.theme.spacing.md};
  right: ${props => props.theme.spacing.md};
`

const PrevButton = styled(LightboxButton)`
  left: ${props => props.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
`

const NextButton = styled(LightboxButton)`
  right: ${props => props.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
`

export function Gallery({
  images,
  columns = 3,
  showFilters = false,
  gap = 'md',
  className,
}: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')

  // Get unique categories
  const categories = Array.from(
    new Set(images.map((img) => img.category).filter(Boolean))
  )

  // Filter images
  const filteredImages =
    activeFilter === 'all'
      ? images
      : images.filter((img) => img.category === activeFilter)

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedIndex === null) return

      switch (e.key) {
        case 'Escape':
          setSelectedIndex(null)
          break
        case 'ArrowLeft':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev !== null && prev > 0 ? prev - 1 : prev
          )
          break
        case 'ArrowRight':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev !== null && prev < filteredImages.length - 1 ? prev + 1 : prev
          )
          break
      }
    },
    [selectedIndex, filteredImages.length]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedIndex])

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < filteredImages.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }

  const handlePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
  }

  const selectedImage =
    selectedIndex !== null ? filteredImages[selectedIndex] : null

  return (
    <GalleryContainer className={className}>
      {showFilters && categories.length > 0 && (
        <FilterBar>
          <FilterButton
            $isActive={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
          >
            All
          </FilterButton>
          {categories.map((category) => (
            <FilterButton
              key={category}
              $isActive={activeFilter === category}
              onClick={() => setActiveFilter(category!)}
            >
              {category}
            </FilterButton>
          ))}
        </FilterBar>
      )}

      <Grid $columns={columns} $gap={gap}>
        {filteredImages.map((image, index) => (
          <GalleryItem
            key={index}
            onClick={() => setSelectedIndex(index)}
            aria-label={`View ${image.alt}`}
          >
            <img
              src={image.thumbnail || image.src}
              alt={image.alt}
              loading="lazy"
            />
            {image.title && <Overlay>{image.title}</Overlay>}
          </GalleryItem>
        ))}
      </Grid>

      <Lightbox
        $isOpen={selectedIndex !== null}
        onClick={() => setSelectedIndex(null)}
        role="dialog"
        aria-modal="true"
        aria-label="Image viewer"
      >
        {selectedImage && (
          <LightboxContent onClick={(e) => e.stopPropagation()}>
            <CloseButton
              onClick={() => setSelectedIndex(null)}
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </CloseButton>

            {selectedIndex !== null && selectedIndex > 0 && (
              <PrevButton onClick={handlePrev} aria-label="Previous image">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </PrevButton>
            )}

            {selectedIndex !== null && selectedIndex < filteredImages.length - 1 && (
              <NextButton onClick={handleNext} aria-label="Next image">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </NextButton>
            )}

            <LightboxImage src={selectedImage.src} alt={selectedImage.alt} />

            {(selectedImage.title || selectedImage.description) && (
              <LightboxInfo>
                {selectedImage.title && (
                  <LightboxTitle>{selectedImage.title}</LightboxTitle>
                )}
                {selectedImage.description && (
                  <LightboxDescription>
                    {selectedImage.description}
                  </LightboxDescription>
                )}
              </LightboxInfo>
            )}
          </LightboxContent>
        )}
      </Lightbox>
    </GalleryContainer>
  )
}
