import React, { useEffect, useRef } from 'react'
import { X, Mic2, Music } from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import gsap from 'gsap'

export default function LyricsModal() {
  const { currentSong, showLyrics, setShowLyrics, currentTime } = useMusic()
  const modalRef = useRef(null)

  useEffect(() => {
    if (showLyrics && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' }
      )
    }
  }, [showLyrics])

  if (!showLyrics || !currentSong) return null

  // Parse sample lyrics lines with timestamp markers if available
  const rawLyrics = currentSong.lyrics || `[00:05] Instrumental Intro
[00:15] Lost in the rhythm of the neon lights
[00:25] Chasing the melody through endless nights
[00:35] Feel the vibration, let your spirit fly
[00:48] Underneath the starlight in the velvet sky
[01:00] Beatly streams your heartbeat every second of the day`

  const lines = rawLyrics.split('\n').map((line, idx) => {
    const match = line.match(/\[(\d+):(\d+)\]\s*(.*)/)
    if (match) {
      const minutes = parseInt(match[1], 10)
      const seconds = parseInt(match[2], 10)
      const totalSeconds = minutes * 60 + seconds
      return { time: totalSeconds, text: match[3] || line, id: idx }
    }
    return { time: idx * 8, text: line, id: idx }
  })

  // Find active line
  let activeIndex = 0
  for (let i = 0; i < lines.length; i++) {
    if (currentTime >= lines[i].time) {
      activeIndex = i
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div
        ref={modalRef}
        className="w-full max-w-4xl h-[85vh] rounded-3xl bg-gradient-to-br from-secondary/90 via-dark/95 to-black/90 border border-white/10 shadow-2xl flex flex-col overflow-hidden relative"
      >
        {/* Ambient Top Glow */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-40"
          style={{ backgroundColor: currentSong.color || '#00d4ff' }}
        />

        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/20 text-primary">
              <Mic2 size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Live Synced Lyrics
              </h3>
              <p className="text-xs text-gray-400">
                {currentSong.title} — {currentSong.artistName || currentSong.artist?.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowLyrics(false)}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Lyrics Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 text-center custom-scrollbar z-10">
          {lines.map((item, idx) => {
            const isActive = idx === activeIndex
            const isPast = idx < activeIndex

            return (
              <p
                key={item.id}
                className={`transition-all duration-300 font-bold ${
                  isActive
                    ? 'text-3xl md:text-4xl text-primary scale-105 shadow-glow'
                    : isPast
                    ? 'text-xl md:text-2xl text-gray-400 opacity-60'
                    : 'text-xl md:text-2xl text-gray-600 opacity-40 hover:opacity-80'
                }`}
              >
                {item.text}
              </p>
            )
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-white/5 bg-black/40 text-center text-xs text-gray-500 z-10">
          Beatly Real-time Lyrics Synchronization Engine
        </div>
      </div>
    </div>
  )
}
