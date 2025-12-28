import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'

export interface AudioPlayerProps {
  src: string
  title?: string
  artist?: string
  albumArt?: string
  autoplay?: boolean
  loop?: boolean
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  showWaveform?: boolean
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
  padding: ${(props) => props.theme.spacing.md};
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
`

const Header = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  align-items: center;
`

const AlbumArt = styled.div<{ $url?: string }>`
  width: 60px;
  height: 60px;
  border-radius: ${(props) => props.theme.borderRadius.md};
  background: ${(props) => props.$url ? `url(${props.$url})` : props.theme.colors.background};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
`

const TrackInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const TrackTitle = styled.div`
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.fontSize.base};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TrackArtist = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const WaveformContainer = styled.div`
  width: 100%;
  height: 60px;
  background: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  overflow: hidden;
  position: relative;
  cursor: pointer;
`

const Waveform = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  padding: 0 ${(props) => props.theme.spacing.xs};
  gap: 2px;
`

const WaveformBar = styled.div<{ $height: number; $active: boolean }>`
  flex: 1;
  max-width: 4px;
  height: ${(props) => props.$height}%;
  background: ${(props) => props.$active ? props.theme.colors.primary : props.theme.colors.text.secondary};
  border-radius: 2px;
  transition: all 0.1s;
  opacity: ${(props) => props.$active ? 1 : 0.5};
`

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${(props) => props.theme.colors.background};
  border-radius: 2px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    height: 6px;
  }
`

const ProgressFill = styled.div<{ $progress: number }>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${(props) => props.$progress}%;
  background: ${(props) => props.theme.colors.primary};
  border-radius: 2px;
  transition: width 0.1s;
`

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
`

const PlayButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.primary};
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px ${(props) => props.theme.colors.primary}40;
  }

  &:active {
    transform: scale(0.95);
  }
`

const TimeDisplay = styled.div`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  font-family: monospace;
  white-space: nowrap;
`

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  margin-left: auto;
`

const VolumeButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.text};
  font-size: 18px;
  cursor: pointer;
  padding: ${(props) => props.theme.spacing.xs};
  display: flex;
  align-items: center;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`

const VolumeSlider = styled.input`
  width: 80px;
  cursor: pointer;
`

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title = 'Untitled',
  artist,
  albumArt,
  autoplay = false,
  loop = false,
  onPlay,
  onPause,
  onEnded,
  showWaveform = true
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [waveformData, setWaveformData] = useState<number[]>([])

  useEffect(() => {
    // Generate pseudo-random waveform data
    const data = Array.from({ length: 50 }, () => 20 + Math.random() * 80)
    setWaveformData(data)
  }, [src])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

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

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [onPlay, onPause, onEnded])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    audio.currentTime = pos * audio.duration
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
    audio.volume = newVolume
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume || 0.5
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const progress = (currentTime / duration) * 100 || 0

  return (
    <Container>
      <audio ref={audioRef} src={src} autoPlay={autoplay} loop={loop} />

      <Header>
        <AlbumArt $url={albumArt}>
          {!albumArt && '🎵'}
        </AlbumArt>
        <TrackInfo>
          <TrackTitle>{title}</TrackTitle>
          {artist && <TrackArtist>{artist}</TrackArtist>}
        </TrackInfo>
      </Header>

      {showWaveform && waveformData.length > 0 ? (
        <WaveformContainer onClick={handleProgressClick}>
          <Waveform>
            {waveformData.map((height, index) => (
              <WaveformBar
                key={index}
                $height={height}
                $active={index / waveformData.length <= currentTime / duration}
              />
            ))}
          </Waveform>
        </WaveformContainer>
      ) : (
        <ProgressBar onClick={handleProgressClick}>
          <ProgressFill $progress={progress} />
        </ProgressBar>
      )}

      <Controls>
        <PlayButton onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? '⏸' : '▶'}
        </PlayButton>

        <TimeDisplay>
          {formatTime(currentTime)} / {formatTime(duration)}
        </TimeDisplay>

        <VolumeControl>
          <VolumeButton onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
          </VolumeButton>
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
      </Controls>
    </Container>
  )
}
