import React, { useRef, useState } from 'react'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  ListMusic,
  Mic2,
  Maximize2,
  Disc3,
} from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import { popHeart } from '../utils/animations'

export default function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    showLyrics,
    showQueue,
    togglePlay,
    playNext,
    playPrev,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    isLiked,
    setShowLyrics,
    setShowQueue,
    setIsFullscreenPlayer,
    formatTime,
  } = useMusic()

  const heartRef = useRef(null)
  const progressBarRef = useRef(null)
  const [isHoveringProgress, setIsHoveringProgress] = useState(false)
  const [hoverProgressPercent, setHoverProgressPercent] = useState(0)

  if (!currentSong) return null

  const liked = isLiked(currentSong.id || currentSong._id)
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleSeek = (e) => {
    if (!progressBarRef.current || !duration) return
    const rect = progressBarRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percent = Math.max(0, Math.min(1, clickX / rect.width))
    seek(percent * duration)
  }

  const handleProgressMouseMove = (e) => {
    if (!progressBarRef.current) return
    const rect = progressBarRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percent = Math.max(0, Math.min(1, clickX / rect.width))
    setHoverProgressPercent(percent * 100)
  }

  const handleLike = () => {
    toggleLike(currentSong.id || currentSong._id)
    popHeart(heartRef.current)
  }

  return (
    <footer className="h-24 bg-dark/95 backdrop-blur-2xl border-t border-white/10 px-4 md:px-6 flex items-center justify-between z-40 select-none shadow-2xl relative">
      {/* 1. Track Info (Left) */}
      <div className="flex items-center gap-3.5 w-1/4 min-w-[180px] max-w-[280px]">
        {/* Album Artwork & Rotating Vinyl Badge */}
        <div
          onClick={() => setIsFullscreenPlayer(true)}
          className="relative group cursor-pointer w-14 h-14 rounded-xl overflow-hidden shadow-md flex-shrink-0"
        >
          <img
            src={
              currentSong.coverUrl ||
              'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'
            }
            alt={currentSong.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Maximize2 size={16} className="text-white" />
          </div>
        </div>

        {/* Title & Artist */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p
              onClick={() => setIsFullscreenPlayer(true)}
              className="text-sm font-semibold text-white truncate cursor-pointer hover:underline"
            >
              {currentSong.title}
            </p>
          </div>
          <p className="text-xs text-gray-400 truncate">
            {currentSong.artistName || currentSong.artist?.name || 'Beatly Artist'}
          </p>
        </div>

        {/* Like Button */}
        <button
          ref={heartRef}
          onClick={handleLike}
          className={`p-2 rounded-full transition-transform active:scale-90 ${
            liked ? 'text-accent' : 'text-gray-400 hover:text-white'
          }`}
          title={liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
        >
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* 2. Main Playback Controls & Progress Bar (Center) */}
      <div className="flex flex-col items-center justify-center flex-1 max-w-2xl px-4">
        {/* Buttons Row */}
        <div className="flex items-center gap-5 mb-1.5">
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            className={`p-1.5 rounded-full transition-colors relative ${
              isShuffle ? 'text-primary' : 'text-gray-400 hover:text-white'
            }`}
            title={`Shuffle ${isShuffle ? 'On' : 'Off'}`}
          >
            <Shuffle size={17} />
            {isShuffle && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />}
          </button>

          {/* Previous */}
          <button
            onClick={playPrev}
            className="text-gray-300 hover:text-white transition-transform active:scale-90"
            title="Previous"
          >
            <SkipBack size={20} />
          </button>

          {/* Big Play / Pause Button */}
          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-gradient-to-tr from-primary to-cyan-400 text-black flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" className="ml-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            onClick={playNext}
            className="text-gray-300 hover:text-white transition-transform active:scale-90"
            title="Next"
          >
            <SkipForward size={20} />
          </button>

          {/* Repeat */}
          <button
            onClick={toggleRepeat}
            className={`p-1.5 rounded-full transition-colors relative ${
              repeatMode !== 'off' ? 'text-primary' : 'text-gray-400 hover:text-white'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === 'one' ? <Repeat1 size={17} /> : <Repeat size={17} />}
            {repeatMode !== 'off' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
            )}
          </button>
        </div>

        {/* Timeline Scrubber */}
        <div className="w-full flex items-center gap-3 text-xs text-gray-400 font-mono">
          <span className="w-10 text-right">{formatTime(currentTime)}</span>

          <div
            ref={progressBarRef}
            onClick={handleSeek}
            onMouseEnter={() => setIsHoveringProgress(true)}
            onMouseLeave={() => setIsHoveringProgress(false)}
            onMouseMove={handleProgressMouseMove}
            className="relative flex-1 h-1.5 hover:h-2.5 bg-white/10 rounded-full cursor-pointer transition-all group overflow-visible"
          >
            {/* Progress Fill */}
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-cyan-300 rounded-full group-hover:shadow-[0_0_8px_#00d4ff]"
              style={{ width: `${progressPercent}%` }}
            >
              {/* Scrub Handle dot */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform" />
            </div>

            {/* Hover preview ghost bar */}
            {isHoveringProgress && (
              <div
                className="absolute top-0 left-0 h-full bg-white/20 rounded-full pointer-events-none"
                style={{ width: `${hoverProgressPercent}%` }}
              />
            )}
          </div>

          <span className="w-10">{formatTime(duration)}</span>
        </div>
      </div>

      {/* 3. Extra Tools & Volume Control (Right) */}
      <div className="flex items-center justify-end gap-3 w-1/4 min-w-[180px]">
        {/* Lyrics Button */}
        <button
          onClick={() => setShowLyrics((prev) => !prev)}
          className={`p-2 rounded-full transition-colors ${
            showLyrics ? 'text-primary bg-primary/10' : 'text-gray-400 hover:text-white'
          }`}
          title="Lyrics"
        >
          <Mic2 size={18} />
        </button>

        {/* Queue Drawer Button */}
        <button
          onClick={() => setShowQueue((prev) => !prev)}
          className={`p-2 rounded-full transition-colors ${
            showQueue ? 'text-primary bg-primary/10' : 'text-gray-400 hover:text-white'
          }`}
          title="Queue"
        >
          <ListMusic size={18} />
        </button>

        {/* Volume Control */}
        <div className="flex items-center gap-2 group">
          <button
            onClick={toggleMute}
            className="text-gray-400 hover:text-white transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 md:w-24 h-1.5 bg-white/10 accent-primary rounded-full cursor-pointer hover:accent-cyan-300 transition-all"
          />
        </div>

        {/* Fullscreen Player Mode */}
        <button
          onClick={() => setIsFullscreenPlayer(true)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          title="Fullscreen Visualizer"
        >
          <Maximize2 size={18} />
        </button>
      </div>
    </footer>
  )
}
