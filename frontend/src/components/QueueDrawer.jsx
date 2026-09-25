import React, { useRef, useEffect } from 'react'
import { X, Trash2, Play, Music, ListMusic } from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import gsap from 'gsap'

export default function QueueDrawer() {
  const {
    queue,
    queueIndex,
    currentSong,
    showQueue,
    setShowQueue,
    playSong,
    removeFromQueue,
    clearQueue,
    formatTime,
  } = useMusic()

  const drawerRef = useRef(null)

  useEffect(() => {
    if (showQueue && drawerRef.current) {
      gsap.fromTo(
        drawerRef.current,
        { x: '100%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 0.35, ease: 'power3.out' }
      )
    }
  }, [showQueue])

  if (!showQueue) return null

  const upcomingTracks = queue.slice(queueIndex + 1)

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        ref={drawerRef}
        className="w-full max-w-md h-full bg-secondary/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col z-10"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ListMusic className="text-primary" size={20} />
            <h3 className="font-bold text-white text-base">Play Queue</h3>
            <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-gray-300">
              {queue.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {queue.length > 1 && (
              <button
                onClick={clearQueue}
                title="Clear Queue"
                className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors text-xs flex items-center gap-1"
              >
                <Trash2 size={15} /> Clear
              </button>
            )}
            <button
              onClick={() => setShowQueue(false)}
              className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {/* Now Playing Section */}
          {currentSong && (
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2.5 px-1">
                Now Playing
              </p>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-sm">
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className="w-12 h-12 rounded-xl object-cover shadow"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white text-sm truncate">{currentSong.title}</p>
                  <p className="text-xs text-gray-300 truncate">
                    {currentSong.artistName || currentSong.artist?.name}
                  </p>
                </div>
                <div className="flex items-end gap-0.5 h-3 mr-2">
                  <span className="w-0.5 h-full bg-primary animate-bounce"></span>
                  <span className="w-0.5 h-2/3 bg-primary animate-bounce delay-75"></span>
                  <span className="w-0.5 h-4/5 bg-primary animate-bounce delay-150"></span>
                </div>
              </div>
            </div>
          )}

          {/* Up Next List */}
          <div>
            <div className="flex items-center justify-between mb-2.5 px-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Next In Queue
              </p>
              <span className="text-xs text-gray-500">{upcomingTracks.length} tracks</span>
            </div>

            {upcomingTracks.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-white/10 text-gray-500 text-sm">
                <Music size={28} className="mx-auto mb-2 opacity-40" />
                <p>No more songs in queue</p>
                <p className="text-xs text-gray-600 mt-1">Add tracks from Explore or Library</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {upcomingTracks.map((song, idx) => {
                  const actualIndex = queueIndex + 1 + idx
                  return (
                    <div
                      key={`${song.id}-${actualIndex}`}
                      onClick={() => playSong(song, queue)}
                      className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-all cursor-pointer text-sm text-gray-300 hover:text-white"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img
                          src={song.coverUrl}
                          alt={song.title}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-white truncate text-xs">{song.title}</p>
                          <p className="text-[11px] text-gray-400 truncate">
                            {song.artistName || song.artist?.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {song.formattedDuration || formatTime(song.duration || 180)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFromQueue(actualIndex)
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-400 rounded-md transition-all"
                          title="Remove from queue"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
