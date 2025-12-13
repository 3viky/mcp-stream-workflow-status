import React, { useRef, useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Button } from '../primitives/Button'

export interface ImageCropperProps {
  src: string
  onCrop: (croppedImage: string) => void
  aspectRatio?: number
  cropShape?: 'rect' | 'circle'
  minWidth?: number
  minHeight?: number
}

const Container = styled.div`
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  background: ${(props) => props.theme.colors.background};
  overflow: hidden;
`

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => props.theme.spacing.md};
  background: ${(props) => props.theme.colors.surface};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  gap: ${(props) => props.theme.spacing.md};
  flex-wrap: wrap;
`

const ZoomControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`

const ZoomLabel = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  min-width: 50px;
`

const ZoomSlider = styled.input`
  width: 150px;
`

const CanvasContainer = styled.div`
  position: relative;
  overflow: hidden;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  cursor: move;
  user-select: none;
`

const Canvas = styled.canvas`
  display: block;
  max-width: 100%;
  max-height: 600px;
`

const CropOverlay = styled.div`
  position: absolute;
  border: 2px solid ${(props) => props.theme.colors.primary};
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  cursor: move;
  touch-action: none;
`

const ResizeHandle = styled.div<{ $position: string }>`
  position: absolute;
  width: 12px;
  height: 12px;
  background: ${(props) => props.theme.colors.primary};
  border: 2px solid #fff;
  border-radius: 50%;

  ${(props) => {
    const pos = props.$position
    if (pos === 'tl') return 'top: -6px; left: -6px; cursor: nw-resize;'
    if (pos === 'tr') return 'top: -6px; right: -6px; cursor: ne-resize;'
    if (pos === 'bl') return 'bottom: -6px; left: -6px; cursor: sw-resize;'
    if (pos === 'br') return 'bottom: -6px; right: -6px; cursor: se-resize;'
    if (pos === 't') return 'top: -6px; left: 50%; transform: translateX(-50%); cursor: n-resize;'
    if (pos === 'b') return 'bottom: -6px; left: 50%; transform: translateX(-50%); cursor: s-resize;'
    if (pos === 'l') return 'left: -6px; top: 50%; transform: translateY(-50%); cursor: w-resize;'
    if (pos === 'r') return 'right: -6px; top: 50%; transform: translateY(-50%); cursor: e-resize;'
    return ''
  }}
`

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  src,
  onCrop,
  aspectRatio,
  cropShape = 'rect',
  minWidth = 50,
  minHeight = 50,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  const [zoom, setZoom] = useState(1)
  const [cropArea, setCropArea] = useState<CropArea>({ x: 50, y: 50, width: 200, height: 200 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState<string | null>(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const img = imageRef.current
    if (!canvas || !img) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = img.width * zoom
    canvas.height = img.height * zoom

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }, [zoom])

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      imageRef.current = img
      setImageLoaded(true)
      drawCanvas()

      const initialWidth = Math.min(img.width * 0.6, 300)
      const initialHeight = aspectRatio ? initialWidth / aspectRatio : Math.min(img.height * 0.6, 300)

      setCropArea({
        x: (img.width - initialWidth) / 2,
        y: (img.height - initialHeight) / 2,
        width: initialWidth,
        height: initialHeight,
      })
    }
    img.src = src
  }, [src, aspectRatio, drawCanvas])

  useEffect(() => {
    if (imageLoaded) {
      drawCanvas()
    }
  }, [zoom, imageLoaded, drawCanvas])

  const handleMouseDown = (e: React.MouseEvent, handle?: string) => {
    e.preventDefault()

    if (handle) {
      setIsResizing(handle)
    } else {
      setIsDragging(true)
    }

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging && !isResizing) return

    const deltaX = (e.clientX - dragStart.x) / zoom
    const deltaY = (e.clientY - dragStart.y) / zoom

    if (isDragging) {
      setCropArea(prev => ({
        ...prev,
        x: Math.max(0, Math.min(prev.x + deltaX, (imageRef.current?.width || 0) - prev.width)),
        y: Math.max(0, Math.min(prev.y + deltaY, (imageRef.current?.height || 0) - prev.height)),
      }))
    } else if (isResizing) {
      setCropArea(prev => {
        const newArea = { ...prev }
        const img = imageRef.current
        if (!img) return prev

        if (isResizing.includes('r')) {
          newArea.width = Math.max(minWidth, Math.min(prev.width + deltaX, img.width - prev.x))
        }
        if (isResizing.includes('l')) {
          const newWidth = Math.max(minWidth, prev.width - deltaX)
          const diff = prev.width - newWidth
          newArea.x = Math.max(0, prev.x + diff)
          newArea.width = newWidth
        }
        if (isResizing.includes('b')) {
          newArea.height = Math.max(minHeight, Math.min(prev.height + deltaY, img.height - prev.y))
        }
        if (isResizing.includes('t')) {
          const newHeight = Math.max(minHeight, prev.height - deltaY)
          const diff = prev.height - newHeight
          newArea.y = Math.max(0, prev.y + diff)
          newArea.height = newHeight
        }

        if (aspectRatio) {
          if (isResizing.includes('r') || isResizing.includes('l')) {
            newArea.height = newArea.width / aspectRatio
          } else {
            newArea.width = newArea.height * aspectRatio
          }

          newArea.width = Math.min(newArea.width, img.width - newArea.x)
          newArea.height = Math.min(newArea.height, img.height - newArea.y)
        }

        return newArea
      })
    }

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(null)
  }

  const handleCrop = () => {
    const img = imageRef.current
    if (!img) return

    const canvas = document.createElement('canvas')
    canvas.width = cropArea.width
    canvas.height = cropArea.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(
      img,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      cropArea.width,
      cropArea.height
    )

    if (cropShape === 'circle') {
      const circleCanvas = document.createElement('canvas')
      circleCanvas.width = cropArea.width
      circleCanvas.height = cropArea.height
      const circleCtx = circleCanvas.getContext('2d')
      if (!circleCtx) return

      circleCtx.beginPath()
      circleCtx.arc(cropArea.width / 2, cropArea.height / 2, cropArea.width / 2, 0, Math.PI * 2)
      circleCtx.clip()
      circleCtx.drawImage(canvas, 0, 0)

      onCrop(circleCanvas.toDataURL('image/png'))
    } else {
      onCrop(canvas.toDataURL('image/png'))
    }
  }

  return (
    <Container>
      <Controls>
        <ZoomControls>
          <ZoomLabel>{Math.round(zoom * 100)}%</ZoomLabel>
          <ZoomSlider
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            aria-label="Zoom level"
          />
        </ZoomControls>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button onClick={() => setZoom(1)} variant="ghost" size="sm">
            Reset Zoom
          </Button>
          <Button onClick={handleCrop}>
            Crop Image
          </Button>
        </div>
      </Controls>

      <CanvasContainer
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <Canvas ref={canvasRef} />

        {imageLoaded && (
          <CropOverlay
            style={{
              left: `${cropArea.x * zoom}px`,
              top: `${cropArea.y * zoom}px`,
              width: `${cropArea.width * zoom}px`,
              height: `${cropArea.height * zoom}px`,
              borderRadius: cropShape === 'circle' ? '50%' : '0',
            }}
            onMouseDown={(e) => handleMouseDown(e)}
          >
            {!aspectRatio && (
              <>
                <ResizeHandle $position="tl" onMouseDown={(e) => handleMouseDown(e, 'tl')} />
                <ResizeHandle $position="tr" onMouseDown={(e) => handleMouseDown(e, 'tr')} />
                <ResizeHandle $position="bl" onMouseDown={(e) => handleMouseDown(e, 'bl')} />
                <ResizeHandle $position="br" onMouseDown={(e) => handleMouseDown(e, 'br')} />
                <ResizeHandle $position="t" onMouseDown={(e) => handleMouseDown(e, 't')} />
                <ResizeHandle $position="b" onMouseDown={(e) => handleMouseDown(e, 'b')} />
                <ResizeHandle $position="l" onMouseDown={(e) => handleMouseDown(e, 'l')} />
                <ResizeHandle $position="r" onMouseDown={(e) => handleMouseDown(e, 'r')} />
              </>
            )}
            {aspectRatio && (
              <>
                <ResizeHandle $position="tl" onMouseDown={(e) => handleMouseDown(e, 'tl')} />
                <ResizeHandle $position="tr" onMouseDown={(e) => handleMouseDown(e, 'tr')} />
                <ResizeHandle $position="bl" onMouseDown={(e) => handleMouseDown(e, 'bl')} />
                <ResizeHandle $position="br" onMouseDown={(e) => handleMouseDown(e, 'br')} />
              </>
            )}
          </CropOverlay>
        )}
      </CanvasContainer>
    </Container>
  )
}
