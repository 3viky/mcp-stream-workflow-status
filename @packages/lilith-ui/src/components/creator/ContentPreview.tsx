import React from 'react'
import styled from 'styled-components'
import { Card } from '../primitives/Card'
import { Badge } from '../primitives/Badge'

export interface ContentPreviewProps {
  title: string
  content: string
  author?: string
  publishedAt?: Date
  tags?: string[]
  coverImage?: string
  status?: 'draft' | 'published' | 'scheduled'
  variant?: 'compact' | 'detailed'
}

const PreviewCard = styled(Card)`
  overflow: hidden;
`

const CoverImage = styled.div<{ $url: string }>`
  width: 100%;
  height: 200px;
  background: url(${(props) => props.$url});
  background-size: cover;
  background-position: center;
`

const ContentSection = styled.div`
  padding: ${(props) => props.theme.spacing.lg};
`

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing.md};
`

const Title = styled.h2`
  margin: 0;
  font-size: ${(props) => props.theme.typography.fontSize['2xl']};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text};
`

const Meta = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.md};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`

const Content = styled.div`
  color: ${(props) => props.theme.colors.text};
  line-height: 1.6;
  margin-bottom: ${(props) => props.theme.spacing.md};

  /* Limit height for compact view */
  max-height: 200px;
  overflow: hidden;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(transparent, ${(props) => props.theme.colors.background});
  }
`

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.xs};
`

const CompactPreview = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  padding: ${(props) => props.theme.spacing.md};
`

const CompactImage = styled.div<{ $url: string }>`
  width: 120px;
  height: 120px;
  background: url(${(props) => props.$url});
  background-size: cover;
  background-position: center;
  border-radius: ${(props) => props.theme.borderRadius.md};
  flex-shrink: 0;
`

const CompactContent = styled.div`
  flex: 1;
  min-width: 0;
`

const CompactTitle = styled.h3`
  margin: 0 0 ${(props) => props.theme.spacing.xs} 0;
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => props.theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const CompactText = styled.p`
  margin: 0;
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`

export const ContentPreview: React.FC<ContentPreviewProps> = ({
  title,
  content,
  author,
  publishedAt,
  tags,
  coverImage,
  status = 'draft',
  variant = 'detailed'
}) => {
  const getStatusVariant = () => {
    switch (status) {
      case 'published':
        return 'success'
      case 'scheduled':
        return 'warning'
      default:
        return 'default'
    }
  }

  const stripHtml = (html: string): string => {
    const tmp = document.createElement('DIV')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  if (variant === 'compact') {
    return (
      <PreviewCard>
        <CompactPreview>
          {coverImage && <CompactImage $url={coverImage} />}
          <CompactContent>
            <Header>
              <CompactTitle>{title}</CompactTitle>
              <Badge variant={getStatusVariant()}>{status}</Badge>
            </Header>
            <CompactText>{stripHtml(content)}</CompactText>
            {author || publishedAt ? (
              <Meta>
                {author && <span>By {author}</span>}
                {publishedAt && <span>{publishedAt.toLocaleDateString()}</span>}
              </Meta>
            ) : null}
          </CompactContent>
        </CompactPreview>
      </PreviewCard>
    )
  }

  return (
    <PreviewCard>
      {coverImage && <CoverImage $url={coverImage} />}
      <ContentSection>
        <Header>
          <Title>{title}</Title>
          <Badge variant={getStatusVariant()}>{status}</Badge>
        </Header>

        {(author || publishedAt) && (
          <Meta>
            {author && <span>By {author}</span>}
            {publishedAt && <span>{publishedAt.toLocaleDateString()}</span>}
          </Meta>
        )}

        <Content dangerouslySetInnerHTML={{ __html: content }} />

        {tags && tags.length > 0 && (
          <Tags>
            {tags.map((tag, index) => (
              <Badge key={index} variant="default">
                {tag}
              </Badge>
            ))}
          </Tags>
        )}
      </ContentSection>
    </PreviewCard>
  )
}
