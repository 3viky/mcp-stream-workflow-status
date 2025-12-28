import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { Button } from '../primitives/Button'
import { Spinner } from '../primitives/Spinner'

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  progress?: number
}

export interface MediaUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  maxFiles?: number
  onUpload: (files: File[]) => Promise<UploadedFile[]>
  onRemove?: (fileId: string) => void
  value?: UploadedFile[]
  disabled?: boolean
}

const Container = styled.div`
  width: 100%;
`

const DropZone = styled.div<{ $isDragging: boolean; $disabled?: boolean }>`
  border: 2px dashed ${(props) => props.$isDragging ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.xl};
  text-align: center;
  background: ${(props) => props.$isDragging ? props.theme.colors.primary + '10' : props.theme.colors.background};
  cursor: ${(props) => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  opacity: ${(props) => props.$disabled ? 0.5 : 1};

  &:hover {
    border-color: ${(props) => !props.$disabled && props.theme.colors.primary};
    background: ${(props) => !props.$disabled && props.theme.colors.primary + '05'};
  }
`

const DropZoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
`

const DropZoneIcon = styled.div`
  font-size: 48px;
  color: ${(props) => props.theme.colors.text.secondary};
`

const DropZoneText = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
`

const DropZoneHint = styled.div`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
`

const FileList = styled.div`
  margin-top: ${(props) => props.theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.sm};
`

const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
  padding: ${(props) => props.theme.spacing.sm};
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
`

const FilePreview = styled.div<{ $url?: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  background: ${(props) => props.$url ? `url(${props.$url})` : props.theme.colors.background};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const FileName = styled.div`
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const FileSize = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`

const ProgressBar = styled.div`
  height: 4px;
  background: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  margin-top: ${(props) => props.theme.spacing.xs};
  overflow: hidden;
`

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${(props) => props.$progress}%;
  background: ${(props) => props.theme.colors.primary};
  transition: width 0.3s;
`

export const MediaUpload: React.FC<MediaUploadProps> = ({
  accept,
  multiple = true,
  maxSize,
  maxFiles,
  onUpload,
  onRemove,
  value = [],
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const errors: string[] = []
    const valid: File[] = []

    for (const file of files) {
      if (maxSize && file.size > maxSize) {
        errors.push(`${file.name} exceeds maximum size of ${formatFileSize(maxSize)}`)
        continue
      }
      if (accept) {
        const acceptedTypes = accept.split(',').map(t => t.trim())
        const isAccepted = acceptedTypes.some(type => {
          if (type.endsWith('/*')) {
            return file.type.startsWith(type.slice(0, -1))
          }
          return file.type === type || file.name.endsWith(type)
        })
        if (!isAccepted) {
          errors.push(`${file.name} is not an accepted file type`)
          continue
        }
      }
      valid.push(file)
    }

    if (maxFiles && valid.length + value.length > maxFiles) {
      const allowed = maxFiles - value.length
      errors.push(`Maximum ${maxFiles} files allowed (${allowed} more can be added)`)
      return { valid: valid.slice(0, allowed), errors }
    }

    return { valid, errors }
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files || disabled) return

    const fileArray = Array.from(files)
    const { valid, errors } = validateFiles(fileArray)

    if (errors.length > 0) {
      alert(errors.join('\n'))
    }

    if (valid.length > 0) {
      setUploading(true)
      try {
        await onUpload(valid)
      } finally {
        setUploading(false)
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Container>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      <DropZone
        $isDragging={isDragging}
        $disabled={disabled}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <DropZoneContent>
          {uploading ? (
            <>
              <Spinner />
              <DropZoneText>Uploading files...</DropZoneText>
            </>
          ) : (
            <>
              <DropZoneIcon>📁</DropZoneIcon>
              <DropZoneText>
                Drag & drop files here, or click to select
              </DropZoneText>
              <DropZoneHint>
                {accept && `Accepted: ${accept}`}
                {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
                {maxFiles && ` • Max files: ${maxFiles}`}
              </DropZoneHint>
            </>
          )}
        </DropZoneContent>
      </DropZone>

      {value.length > 0 && (
        <FileList>
          {value.map((file) => (
            <FileItem key={file.id}>
              <FilePreview $url={file.type.startsWith('image/') ? file.url : undefined} />
              <FileInfo>
                <FileName>{file.name}</FileName>
                <FileSize>{formatFileSize(file.size)}</FileSize>
                {file.progress !== undefined && file.progress < 100 && (
                  <ProgressBar>
                    <ProgressFill $progress={file.progress} />
                  </ProgressBar>
                )}
              </FileInfo>
              {onRemove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(file.id)}
                >
                  Remove
                </Button>
              )}
            </FileItem>
          ))}
        </FileList>
      )}
    </Container>
  )
}
