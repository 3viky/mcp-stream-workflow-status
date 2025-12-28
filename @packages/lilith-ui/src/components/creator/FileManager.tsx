import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { Button } from '../primitives/Button'
import { Input } from '../primitives/Input'

export interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: number
  thumbnail?: string
  modifiedAt?: Date
}

export interface FileManagerProps {
  files: FileItem[]
  onFileSelect?: (file: FileItem) => void
  onFileDelete?: (file: FileItem) => void
  onFileRename?: (file: FileItem, newName: string) => void
  viewMode?: 'grid' | 'list'
  allowUpload?: boolean
  onUpload?: (files: File[]) => void
}

const Container = styled.div`
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  background: ${(props) => props.theme.colors.background};
  overflow: hidden;
`

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => props.theme.spacing.md};
  background: ${(props) => props.theme.colors.surface};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  gap: ${(props) => props.theme.spacing.md};
  flex-wrap: wrap;
`

const ToolbarLeft = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
  align-items: center;
  flex: 1;
  min-width: 200px;
`

const ToolbarRight = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
  align-items: center;
`

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  overflow: hidden;
`

const ViewButton = styled.button<{ $active: boolean }>`
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  background: ${(props) => props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${(props) => props.$active ? '#fff' : props.theme.colors.text};
  border: none;
  cursor: pointer;
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.$active ? props.theme.colors.primary : props.theme.colors.surface};
  }
`

const FileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${(props) => props.theme.spacing.md};
  padding: ${(props) => props.theme.spacing.md};
`

const FileList = styled.div`
  display: flex;
  flex-direction: column;
`

const GridItem = styled.div<{ $selected?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${(props) => props.theme.spacing.md};
  border: 2px solid ${(props) => props.$selected ? props.theme.colors.primary : 'transparent'};
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  background: ${(props) => props.$selected ? props.theme.colors.primary + '10' : 'transparent'};
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.colors.surface};
    border-color: ${(props) => props.theme.colors.border};
  }
`

const ListItem = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  background: ${(props) => props.$selected ? props.theme.colors.primary + '10' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.colors.surface};
  }

  &:last-child {
    border-bottom: none;
  }
`

const FileThumbnail = styled.div<{ $url?: string; $size?: 'small' | 'large' }>`
  width: ${(props) => props.$size === 'small' ? '40px' : '80px'};
  height: ${(props) => props.$size === 'small' ? '40px' : '80px'};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  background: ${(props) => props.$url
    ? `url(${props.$url}) center/cover`
    : props.theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.$size === 'small' ? '20px' : '32px'};
  flex-shrink: 0;
`

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const FileName = styled.div<{ $center?: boolean }>`
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: ${(props) => props.$center ? 'center' : 'left'};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  margin-top: ${(props) => props.$center ? props.theme.spacing.sm : 0};
`

const FileMetadata = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  font-size: ${(props) => props.theme.typography.fontSize.xs};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-top: 2px;
`

const FileActions = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.xs};
  opacity: 0;
  transition: opacity 0.2s;

  ${ListItem}:hover &,
  ${GridItem}:hover & {
    opacity: 1;
  }
`

const EmptyState = styled.div`
  padding: ${(props) => props.theme.spacing.xxl};
  text-align: center;
  color: ${(props) => props.theme.colors.text.secondary};
`

const getFileIcon = (file: FileItem): string => {
  if (file.type === 'folder') return '📁'

  const ext = file.name.split('.').pop()?.toLowerCase()

  const iconMap: Record<string, string> = {
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    svg: '🖼️',
    mp4: '🎥',
    mov: '🎥',
    avi: '🎥',
    mp3: '🎵',
    wav: '🎵',
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    txt: '📝',
    zip: '📦',
    rar: '📦',
  }

  return iconMap[ext || ''] || '📄'
}

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const formatDate = (date?: Date): string => {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export const FileManager: React.FC<FileManagerProps> = ({
  files,
  onFileSelect,
  onFileDelete,
  onFileRename,
  viewMode: initialViewMode = 'grid',
  allowUpload = false,
  onUpload,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode)
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [renamingFile, setRenamingFile] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  const filteredFiles = useMemo(() => {
    if (!searchQuery) return files

    const query = searchQuery.toLowerCase()
    return files.filter(file =>
      file.name.toLowerCase().includes(query)
    )
  }, [files, searchQuery])

  const handleFileClick = (file: FileItem) => {
    setSelectedFile(file)
    onFileSelect?.(file)
  }

  const handleDelete = (e: React.MouseEvent, file: FileItem) => {
    e.stopPropagation()
    if (window.confirm(`Delete ${file.name}?`)) {
      onFileDelete?.(file)
      if (selectedFile?.id === file.id) {
        setSelectedFile(null)
      }
    }
  }

  const handleRenameStart = (e: React.MouseEvent, file: FileItem) => {
    e.stopPropagation()
    setRenamingFile(file.id)
    setRenameValue(file.name)
  }

  const handleRenameSubmit = (file: FileItem) => {
    if (renameValue && renameValue !== file.name) {
      onFileRename?.(file, renameValue)
    }
    setRenamingFile(null)
    setRenameValue('')
  }

  const handleUploadClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      if (target.files) {
        onUpload?.(Array.from(target.files))
      }
    }
    input.click()
  }

  return (
    <Container>
      <Toolbar>
        <ToolbarLeft>
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ maxWidth: '300px' }}
          />
        </ToolbarLeft>

        <ToolbarRight>
          {allowUpload && onUpload && (
            <Button size="sm" onClick={handleUploadClick}>
              Upload
            </Button>
          )}

          <ViewToggle>
            <ViewButton
              $active={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              Grid
            </ViewButton>
            <ViewButton
              $active={viewMode === 'list'}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              List
            </ViewButton>
          </ViewToggle>
        </ToolbarRight>
      </Toolbar>

      {filteredFiles.length === 0 ? (
        <EmptyState>
          {searchQuery ? 'No files found' : 'No files yet'}
        </EmptyState>
      ) : viewMode === 'grid' ? (
        <FileGrid>
          {filteredFiles.map((file) => (
            <GridItem
              key={file.id}
              $selected={selectedFile?.id === file.id}
              onClick={() => handleFileClick(file)}
            >
              <FileThumbnail
                $url={file.thumbnail}
                $size="large"
              >
                {!file.thumbnail && getFileIcon(file)}
              </FileThumbnail>

              {renamingFile === file.id ? (
                <Input
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => handleRenameSubmit(file)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRenameSubmit(file)
                    if (e.key === 'Escape') setRenamingFile(null)
                  }}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  style={{ width: '100%', marginTop: '8px' }}
                />
              ) : (
                <FileName $center title={file.name}>
                  {file.name}
                </FileName>
              )}

              <FileActions>
                {onFileRename && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleRenameStart(e, file)}
                  >
                    Rename
                  </Button>
                )}
                {onFileDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDelete(e, file)}
                  >
                    Delete
                  </Button>
                )}
              </FileActions>
            </GridItem>
          ))}
        </FileGrid>
      ) : (
        <FileList>
          {filteredFiles.map((file) => (
            <ListItem
              key={file.id}
              $selected={selectedFile?.id === file.id}
              onClick={() => handleFileClick(file)}
            >
              <FileThumbnail
                $url={file.thumbnail}
                $size="small"
              >
                {!file.thumbnail && getFileIcon(file)}
              </FileThumbnail>

              <FileInfo>
                {renamingFile === file.id ? (
                  <Input
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => handleRenameSubmit(file)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSubmit(file)
                      if (e.key === 'Escape') setRenamingFile(null)
                    }}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <FileName title={file.name}>{file.name}</FileName>
                    <FileMetadata>
                      {file.size && <span>{formatFileSize(file.size)}</span>}
                      {file.modifiedAt && <span>{formatDate(file.modifiedAt)}</span>}
                    </FileMetadata>
                  </>
                )}
              </FileInfo>

              <FileActions>
                {onFileRename && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleRenameStart(e, file)}
                  >
                    Rename
                  </Button>
                )}
                {onFileDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDelete(e, file)}
                  >
                    Delete
                  </Button>
                )}
              </FileActions>
            </ListItem>
          ))}
        </FileList>
      )}
    </Container>
  )
}
