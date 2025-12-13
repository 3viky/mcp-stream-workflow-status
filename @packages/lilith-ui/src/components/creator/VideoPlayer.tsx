import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'

export interface VideoPlayerProps {
  src: string
  poster?: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
}

const Container = styled.div`
  position: relative;
  width: 100%;
  background: #000;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.colors.border};
`

const Video = styled.video`
  width: 100%;
  display: block;
`

const ControlsOverlay = styled.div<{ $visible: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: ${(props) => props.theme.spacing.lg} ${(props) => props.theme.spacing.md};
  opacity: ${(props) => props.$visible ? 1 : 0};
  transition: opacity 0.3s;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.sm};
`

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  cursor: pointer;
  position: relative;
`

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${(props) => props.$progress}%;
  background: ${(props) => props.theme.colors.primary};
  border-radius: 3px;
  transition: width 0.1s linear;
`

const ProgressHandle = styled.div<{ $position: number }>`
  position: absolute;
  top: 50%;
  left: ${(props) => props.$position}%;
  width: 14px;
  height: 14px;
  background: #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
`

const ControlButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: ${(props) => props.theme.spacing.xs};
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

const TimeDisplay = styled.div`
  color: #fff;
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-family: monospace;
  white-space: nowrap;
`

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  margin-left: auto;
`

const VolumeSlider = styled.input`
  width: 80px;
  cursor: pointer;
`

const Spacer = styled.div`
  flex: 1;
`

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  autoPlay = false,
  loop = false,
  muted = false,
  controls: showControls = true,
  onPlay,
  onPause,
  onEnded,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(muted ? 0 : 1)
  const [isMuted, setIsMuted] = useState(muted)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControlsOverlay, setShowControlsOverlay] = useState(true)
  const [hideControlsTimeout, setHideControlsTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleDurationChange = () => setDuration(video.duration)
    const handlePlay = () => {
      setIsPlaying(true)
      onPlay?.()
    }
    const handlePause = () => {
      setIsPlaying(false)
      onPause?.()
    }
    const handleEnded = () => {
      setIsPlaying(false)
      onEnded?.()
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('durationchange', handleDurationChange)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('durationchange', handleDurationChange)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [onPlay, onPause, onEnded])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handlePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video) return

    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    video.currentTime = pos * video.duration
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
    video.volume = newVolume
  }

  const handleMuteToggle = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      const newVolume = volume === 0 ? 1 : volume
      setVolume(newVolume)
      setIsMuted(false)
      video.volume = newVolume
    } else {
      setIsMuted(true)
      video.volume = 0
    }
  }

  const handleFullscreenToggle = () => {
    const container = containerRef.current
    if (!container) return

    if (!isFullscreen) {
      container.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const handleMouseMove = () => {
    setShowControlsOverlay(true)

    if (hideControlsTimeout) {
      clearTimeout(hideControlsTimeout)
    }

    if (isPlaying) {
      const timeout = setTimeout(() => {
        setShowControlsOverlay(false)
      }, 3000)
      setHideControlsTimeout(timeout)
    }
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <Container
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControlsOverlay(false)}
    >
      <Video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        onClick={handlePlayPause}
      />

      {showControls && (
        <ControlsOverlay $visible={showControlsOverlay}>
          <ProgressBar onClick={handleProgressClick}>
            <ProgressFill $progress={progress} />
            <ProgressHandle $position={progress} />
          </ProgressBar>

          <Controls>
            <ControlButton
              onClick={handlePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '⏸' : '▶'}
            </ControlButton>

            <TimeDisplay>
              {formatTime(currentTime)} / {formatTime(duration)}
            </TimeDisplay>

            <Spacer />

            <VolumeControl>
              <ControlButton
                onClick={handleMuteToggle}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
              </ControlButton>
              <VolumeSlider
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume"
              />
            </VolumeControl>

            <ControlButton
              onClick={handleFullscreenToggle}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? '⏹' : '⛶'}
            </ControlButton>
          </Controls>
        </ControlsOverlay>
      )}
    </Container>
  )
}
