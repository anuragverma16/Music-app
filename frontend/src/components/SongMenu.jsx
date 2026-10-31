import React, { useState } from 'react'
import { Plus, Disc, Heart, ChevronDown, MoreHorizontal } from 'lucide-react'
import { useMusic } from '../context/MusicContext'

// "⋯" menu for a song. Opens on tap/click (works on touch screens),
// closes on outside tap, and expands playlists inline so nothing goes off-screen.
export default function SongMenu({ song, placement = 'down', triggerClassName = '' }) {
  const { addToQueue, playlists, addTrackToPlaylist, toggleLike, isLiked } = useMusic()
  const [open, setOpen] = useState(false)
  const [showPlaylists, setShowPlaylists] = useState(false)

  const songId = song.id || song._id
  const liked = isLiked(songId)

  const close = () => {
    setOpen(false)
    setShowPlaylists(false)
  }

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all ${triggerClassName}`}
        aria-label="More options"
      >
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={close} />
          <div
            className={`absolute right-0 w-52 rounded-xl bg-secondary/95 backdrop-blur-xl border border-white/10 shadow-2xl p-1.5 z-50 text-sm text-gray-200 animate-fade-in ${
              placement === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'
            }`}
          >
            <button
              onClick={() => {
                toggleLike(song)
                close()
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/10 flex items-center gap-2.5"
            >
              <Heart size={15} className={liked ? 'text-accent' : ''} fill={liked ? 'currentColor' : 'none'} />
              {liked ? 'Remove from Liked' : 'Save to Liked Songs'}
            </button>

            <button
              onClick={() => {
                addToQueue(song)
                close()
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/10 flex items-center gap-2.5"
            >
              <Plus size={15} /> Add to Queue
            </button>

            <button
              onClick={() => setShowPlaylists((prev) => !prev)}
              className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/10 flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5">
                <Disc size={15} /> Add to Playlist
              </span>
              <ChevronDown size={14} className={`transition-transform ${showPlaylists ? 'rotate-180' : ''}`} />
            </button>

            {showPlaylists && (
              <div className="max-h-40 overflow-y-auto custom-scrollbar border-t border-white/10 mt-1 pt-1">
                {playlists.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-gray-500">No playlists yet</p>
                ) : (
                  playlists.map((pl) => (
                    <button
                      key={pl.id}
                      onClick={() => {
                        addTrackToPlaylist(pl.id, songId)
                        close()
                      }}
                      className="w-full text-left pl-9 pr-3 py-2 rounded-lg hover:bg-white/10 truncate text-xs"
                    >
                      {pl.title}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
