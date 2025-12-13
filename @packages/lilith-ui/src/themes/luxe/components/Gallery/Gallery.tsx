/**
 * Gallery Component
 *
 * Responsive image grid with lightbox viewer.
 * Supports lazy loading, keyboard navigation, and category filtering.
 */

import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'

import { luxeTheme } from '../../styles/tokens.js'

export interface GalleryImage {
  /** Image source URL */
  src: string;
  /** Image alt text */
  alt: string;
  /** Optional thumbnail (for performance) */
  thumbnail?: string;
  /** Image title */
  title?: string;
  /** Image description */
  description?: string;
  /** Category */
  category?: string;
}

export interface GalleryProps {
  /** Array of images */
  images: GalleryImage[];
  /** Number of columns (responsive) */
  columns?: 2 | 3 | 4;
  /** Enable category filtering */
  showFilters?: boolean;
  /** Gap between images */
  gap?: keyof typeof luxeTheme.spacing;
  /** Custom className */
  className?: string;
}

const GalleryContainer = styled.div`
  width: 100%;
`

const FilterBar = styled.div`
  display: flex;
  gap: ${luxeTheme.spacing[3]};
  margin-bottom: ${luxeTheme.spacing[6]};
  flex-wrap: wrap;
`

const FilterButton = styled.button<{ $isActive: boolean }>`
  padding: ${luxeTheme.spacing[2]} ${luxeTheme.spacing[4]};
  font-family: ${luxeTheme.typography.fonts.body};
  font-size: ${luxeTheme.typography.sizes.sm};
  font-weight: ${luxeTheme.typography.weights.medium};
  color: ${({ $isActive }) =>
    $isActive ? luxeTheme.colors.white : luxeTheme.colors.text};
  background-color: ${({ $isActive }) =>
    $isActive ? luxeTheme.colors.primary : 'transparent'};
  border: 2px solid
    ${({ $isActive }) =>
      $isActive ? luxeTheme.colors.primary : luxeTheme.colors.border};
  border-radius: ${luxeTheme.borderRadius.full};
  cursor: pointer;
  transition: all ${luxeTheme.transitions.base};
  text-transform: capitalize;

  &:hover {
    border-color: ${luxeTheme.colors.primary};
    background-color: ${({ $isActive }) =>
      $isActive ? luxeTheme.colors.charcoal : luxeTheme.colors.hover};
  }

  &:focus-visible {
    outline: 2px solid ${luxeTheme.colors.focus};
    outline-offset: 2px;
  }
`

const Grid = styled.div<{ $columns: number; $gap: keyof typeof luxeTheme.spacing }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, 1fr);
  gap: ${({ $gap }) => luxeTheme.spacing[$gap]};

  @media (max-width: ${luxeTheme.breakpoints.lg}) {
    grid-template-columns: repeat(
      ${({ $columns }) => Math.max(1, $columns - 1)},
      1fr
    );
  }

  @media (max-width: ${luxeTheme.breakpoints.md}) {
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
  border-radius: ${luxeTheme.borderRadius.lg};
  cursor: pointer;
  border: none;
  padding: 0;
  background: none;
  transition: transform ${luxeTheme.transitions.base};

  &:hover {
    transform: scale(1.02);
  }

  &:focus-visible {
    outline: 2px solid ${luxeTheme.colors.focus};
    outline-offset: 4px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${luxeTheme.transitions.slow};
  }

  &:hover img {
    transform: scale(1.1);
  }
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${luxeTheme.colors.overlay};
  opacity: 0;
  transition: opacity ${luxeTheme.transitions.base};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${luxeTheme.colors.white};
  font-family: ${luxeTheme.typography.fonts.heading};
  font-size: ${luxeTheme.typography.sizes.lg};
  padding: ${luxeTheme.spacing[4]};
  text-align: center;

  ${GalleryItem}:hover & {
    opacity: 1;
  }
`

const Lightbox = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: ${luxeTheme.colors.overlayDark};
  z-index: ${luxeTheme.zIndices.modal};
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  padding: ${luxeTheme.spacing[6]};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity ${luxeTheme.transitions.base};

  @media (max-width: ${luxeTheme.breakpoints.md}) {
    padding: ${luxeTheme.spacing[4]};
  }
`

const LightboxContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${luxeTheme.spacing[4]};
`

const LightboxImage = styled.img`
  max-width: 100%;
  max-height: 80vh;
  border-radius: ${luxeTheme.borderRadius.lg};
  box-shadow: ${luxeTheme.shadows['2xl']};
`

const LightboxInfo = styled.div`
  text-align: center;
  color: ${luxeTheme.colors.white};
  max-width: 600px;
`

const LightboxTitle = styled.h3`
  font-family: ${luxeTheme.typography.fonts.heading};
  font-size: ${luxeTheme.typography.sizes.xl};
  margin-bottom: ${luxeTheme.spacing[2]};
`

const LightboxDescription = styled.p`
  font-family: ${luxeTheme.typography.fonts.body};
  font-size: ${luxeTheme.typography.sizes.base};
  color: ${luxeTheme.colors.textInverse};
  opacity: 0.9;
`

const LightboxButton = styled.button`
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: ${luxeTheme.borderRadius.full};
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${luxeTheme.colors.white};
  cursor: pointer;
  transition: all ${luxeTheme.transitions.base};
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }

  &:focus-visible {
    outline: 2px solid ${luxeTheme.colors.white};
    outline-offset: 2px;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`

const CloseButton = styled(LightboxButton)`
  top: ${luxeTheme.spacing[4]};
  right: ${luxeTheme.spacing[4]};
`

const PrevButton = styled(LightboxButton)`
  left: ${luxeTheme.spacing[4]};
  top: 50%;
  transform: translateY(-50%);
`

const NextButton = styled(LightboxButton)`
  right: ${luxeTheme.spacing[4]};
  top: 50%;
  transform: translateY(-50%);
`

export function Gallery({
  images,
  columns = 3,
  showFilters = false,
  gap = 4,
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
