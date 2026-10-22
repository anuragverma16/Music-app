import React, { useRef, useState } from 'react'
import {
  Minimize2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Volume2,
  VolumeX,
  Mic2,
  Disc3,
  Sparkles,
} from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import { popHeart } from '../utils/animations'

export default function FullscreenPlayer() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isFullscreenPlayer,
    setIsFullscreenPlayer,
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
    formatTime,
  } = useMusic()

  const [activeTab, setActiveTab] = useState('vinyl') // 'vinyl' | 'lyrics'
  const heartRef = useRef(null)
  const progressBarRef = useRef(null)

  if (!isFullscreenPlayer || !currentSong) return null

  const liked = isLiked(currentSong.id || currentSong._id)
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleSeek = (e) => {
    if (!progressBarRef.current || !duration) return
    const rect = progressBarRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percent = Math.max(0, Math.min(1, clickX / rect.width))
    seek(percent * duration)
  }

  const handleLike = () => {
    toggleLike(currentSong.id || currentSong._id)
    popHeart(heartRef.current)
  }

  // Parse lyrics
  const rawLyrics = (currentSong.lyrics || '').trim()

  const lines = (rawLyrics ? rawLyrics.split('\n') : []).map((line, idx) => {
    const match = line.match(/\[(\d+):(\d+)\]\s*(.*)/)
    if (match) {
      const minutes = parseInt(match[1], 10)
      const seconds = parseInt(match[2], 10)
      return { time: minutes * 60 + seconds, text: match[3] || line, id: idx }
    }
    return { time: idx * 8, text: line, id: idx }
  })

  let activeLineIdx = 0
  for (let i = 0; i < lines.length; i++) {
    if (currentTime >= lines[i].time) activeLineIdx = i
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between px-5 pt-safe pb-safe md:p-12 overflow-hidden select-none animate-fade-in">
      {/* Ambient Pulsing Background Glows */}
      <div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[160px] opacity-30 pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: currentSong.color || '#00d4ff' }}
      />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[180px] opacity-25 bg-accent pointer-events-none" />

      {/* Top Bar */}
      <div className="flex items-center justify-between z-10 pt-4 md:pt-0">
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setActiveTab('vinyl')}
            className={`px-3.5 md:px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'vinyl'
                ? 'bg-white text-black shadow'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            Visualizer
          </button>
          <button
            onClick={() => setActiveTab('lyrics')}
            className={`px-3.5 md:px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'lyrics'
                ? 'bg-white text-black shadow'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Mic2 size={14} /> Lyrics
          </button>
        </div>

        <button
          onClick={() => setIsFullscreenPlayer(false)}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 active:scale-95"
          title="Exit Fullscreen"
        >
          <Minimize2 size={20} />
        </button>
      </div>

      {/* Center Stage: Vinyl Visualizer or Live Lyrics */}
      <div className="flex-1 min-h-0 flex items-center justify-center my-4 md:my-6 z-10 overflow-hidden">
        {activeTab === 'vinyl' ? (
          <div className="flex flex-col items-center">
            {/* Giant Spinning Vinyl Record */}
            <div className="relative w-[min(72vw,42vh)] h-[min(72vw,42vh)] md:w-[min(24rem,45vh)] md:h-[min(24rem,45vh)] rounded-full bg-black/80 border-4 border-gray-800 shadow-2xl flex items-center justify-center p-3">
              {/* Vinyl Groove Rings */}
              <div className="absolute inset-4 rounded-full border border-white/5 pointer-events-none" />
              <div className="absolute inset-8 rounded-full border border-white/5 pointer-events-none" />
              <div className="absolute inset-12 rounded-full border border-white/5 pointer-events-none" />
              <div className="absolute inset-16 rounded-full border border-white/5 pointer-events-none" />

              {/* Artwork Center Disc */}
              <div
                className={`w-1/2 h-1/2 rounded-full overflow-hidden border-4 border-black shadow-inner ${
                  isPlaying ? 'animate-spin-slow' : ''
                }`}
              >
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Center Spindle Hole */}
              <div className="absolute w-6 h-6 rounded-full bg-black border-2 border-white/20 z-10" />
            </div>

            {/* Audio Waveform Equalizer Bars */}
            <div className="flex items-center gap-1.5 mt-6 md:mt-8 h-8 md:h-10">
              {[40, 65, 85, 45, 95, 70, 50, 80, 100, 60, 45, 75, 90, 55, 35].map(
                (h, idx) => (
                  <div
                    key={idx}
                    className="w-1.5 rounded-full bg-primary/80 transition-all duration-300"
                    style={{
                      height: isPlaying ? `${Math.max(15, (h * Math.sin(currentTime * 3 + idx)) % 100)}%` : '15%',
                      backgroundColor: idx % 2 === 0 ? currentSong.color || '#00d4ff' : '#ff006e',
                    }}
                  />
                )
              )}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl h-full overflow-y-auto space-y-6 text-center custom-scrollbar px-2 md:px-4 flex flex-col justify-center">
            {lines.length === 0 && (
              <p className="text-lg text-gray-500">Lyrics aren’t available for this song.</p>
            )}
            {lines.map((item, idx) => {
              const isActive = idx === activeLineIdx
              return (
                <p
                  key={item.id}
                  className={`transition-all duration-300 font-bold ${
                    isActive
                      ? 'text-2xl sm:text-4xl text-primary scale-105 drop-shadow-[0_0_15px_rgba(0,212,255,0.6)]'
                      : 'text-lg sm:text-2xl text-gray-500 opacity-50'
                  }`}
                >
                  {item.text}
                </p>
              )
            })}
          </div>
        )}
      </div>

      {/* Bottom Controls Area */}
      <div className="w-full max-w-3xl mx-auto space-y-5 md:space-y-6 z-10 pb-6 md:pb-0">
        {/* Track Title & Like */}
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-3xl font-extrabold text-white truncate">{currentSong.title}</h2>
            <p className="text-sm sm:text-lg text-gray-400 mt-0.5 truncate">
              {currentSong.artistName || currentSong.artist?.name} • {currentSong.album || 'Single'}
            </p>
          </div>

          <button
            ref={heartRef}
            onClick={handleLike}
            className={`p-3 rounded-full bg-white/5 hover:bg-white/10 transition-transform active:scale-90 flex-shrink-0 ${
              liked ? 'text-accent' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart size={26} fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Scrubber */}
        <div className="space-y-2">
          <div
            ref={progressBarRef}
            onClick={handleSeek}
            className="relative w-full h-2 bg-white/15 hover:h-3 rounded-full cursor-pointer transition-all overflow-hidden"
          >
            <div
              className="h-full bg-gradient-to-r from-primary via-cyan-300 to-accent rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={toggleShuffle}
            className={`p-2 transition-colors ${
              isShuffle ? 'text-primary' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shuffle size={22} />
          </button>

          <div className="flex items-center gap-6 md:gap-8">
            <button
              onClick={playPrev}
              className="text-gray-300 hover:text-white transition-transform active:scale-90"
            >
              <SkipBack size={30} />
            </button>

            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-primary text-black flex items-center justify-center shadow-xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? (
                <Pause size={28} fill="currentColor" />
              ) : (
                <Play size={28} fill="currentColor" className="ml-1" />
              )}
            </button>

            <button
              onClick={playNext}
              className="text-gray-300 hover:text-white transition-transform active:scale-90"
            >
              <SkipForward size={30} />
            </button>
          </div>

          <button
            onClick={toggleRepeat}
            className={`p-2 transition-colors ${
              repeatMode !== 'off' ? 'text-primary' : 'text-gray-400 hover:text-white'
            }`}
          >
            {repeatMode === 'one' ? <Repeat1 size={22} /> : <Repeat size={22} />}
          </button>
        </div>
      </div>
    </div>
  )
}
