import React, { useRef, useState } from 'react'
import { Play, Pause, Heart, MoreHorizontal, Plus, Disc, Volume2 } from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import { popHeart } from '../utils/animations'

export default function SongListRow({ song, index, queue = null, showAlbum = true }) {
  const {
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
    toggleLike,
    isLiked,
    addToQueue,
    playlists,
    addTrackToPlaylist,
    formatTime,
  } = useMusic()

  const heartRef = useRef(null)
  const [showMenu, setShowMenu] = useState(false)
  const [showPlaylistSubmenu, setShowPlaylistSubmenu] = useState(false)

  const isCurrentTrack = (currentSong?.id || currentSong?._id) === (song.id || song._id)
  const isThisPlaying = isCurrentTrack && isPlaying
  const liked = isLiked(song.id || song._id)

  const handlePlayClick = () => {
    if (isCurrentTrack) {
      togglePlay()
    } else {
      playSong(song, queue)
    }
  }

  const handleLikeClick = (e) => {
    e.stopPropagation()
    toggleLike(song.id || song._id)
    popHeart(heartRef.current)
  }

  return (
    <div
      onClick={handlePlayClick}
      onMouseLeave={() => {
        setShowMenu(false)
        setShowPlaylistSubmenu(false)
      }}
      className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer select-none text-sm ${
        isCurrentTrack
          ? 'bg-white/10 text-primary font-medium'
          : 'hover:bg-white/5 text-gray-300 hover:text-white'
      }`}
    >
      {/* Index or Play Button / Animated Equalizer */}
      <div className="w-7 flex items-center justify-center flex-shrink-0 text-xs text-gray-400">
        {isThisPlaying ? (
          <div className="flex items-end gap-0.5 h-3.5">
            <span className="w-0.5 h-full bg-primary animate-bounce"></span>
            <span className="w-0.5 h-2/3 bg-primary animate-bounce delay-75"></span>
            <span className="w-0.5 h-4/5 bg-primary animate-bounce delay-150"></span>
          </div>
        ) : (
          <>
            <span className="group-hover:hidden">{index !== undefined ? index + 1 : '•'}</span>
            <Play size={14} className="hidden group-hover:block text-white" fill="white" />
          </>
        )}
      </div>

      {/* Song Cover & Title & Artist */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <img
          src={
            song.coverUrl ||
            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'
          }
          alt={song.title}
          className="w-10 h-10 rounded-lg object-cover flex-shrink-0 shadow"
        />
        <div className="min-w-0 flex-1">
          <p
            className={`truncate font-medium ${
              isCurrentTrack ? 'text-primary font-semibold' : 'text-white'
            }`}
          >
            {song.title}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {song.artistName || song.artist?.name || 'Beatly Artist'}
          </p>
        </div>
      </div>

      {/* Album Name */}
      {showAlbum && (
        <div className="hidden md:block flex-1 min-w-0 text-xs text-gray-400 truncate">
          {song.album || 'Single'}
        </div>
      )}

      {/* Genre Tag */}
      {song.genre && (
        <div className="hidden lg:block">
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10">
            {song.genre}
          </span>
        </div>
      )}

      {/* Like Button */}
      <button
        ref={heartRef}
        onClick={handleLikeClick}
        className={`p-1.5 rounded-full transition-colors ${
          liked
            ? 'text-accent opacity-100'
            : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:text-white'
        }`}
      >
        <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
      </button>

      {/* Duration */}
      <div className="text-xs text-gray-400 w-12 text-right">
        {song.formattedDuration || formatTime(song.duration || 195)}
      </div>

      {/* Context Menu */}
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className="p-1.5 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-white/10 transition-all"
        >
          <MoreHorizontal size={16} />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-secondary/95 backdrop-blur-xl border border-white/10 shadow-2xl p-1.5 z-40 text-xs text-gray-200 animate-fade-in">
            <button
              onClick={() => {
                addToQueue(song)
                setShowMenu(false)
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2"
            >
              <Plus size={14} /> Add to Queue
            </button>
            <div
              className="relative"
              onMouseEnter={() => setShowPlaylistSubmenu(true)}
              onMouseLeave={() => setShowPlaylistSubmenu(false)}
            >
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Disc size={14} /> Add to Playlist
                </span>
              </button>

              {showPlaylistSubmenu && (
                <div className="absolute right-full top-0 mr-1 w-40 rounded-xl bg-secondary/95 backdrop-blur-xl border border-white/10 shadow-2xl p-1.5 z-50">
                  {playlists.map((pl) => (
                    <button
                      key={pl.id}
                      onClick={() => {
                        addTrackToPlaylist(pl.id, song.id || song._id)
                        setShowMenu(false)
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/10 truncate"
                    >
                      {pl.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
