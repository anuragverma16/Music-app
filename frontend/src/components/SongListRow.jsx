import React, { useRef } from 'react'
import { Play, Heart } from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import { popHeart } from '../utils/animations'
import SongMenu from './SongMenu'

export default function SongListRow({ song, index, queue = null, showAlbum = true }) {
  const { currentSong, isPlaying, playSong, togglePlay, toggleLike, isLiked, formatTime } = useMusic()

  const heartRef = useRef(null)

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
      className={`group flex items-center gap-3 sm:gap-4 px-2 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-200 cursor-pointer select-none text-sm ${
        isCurrentTrack
          ? 'bg-white/10 text-primary font-medium'
          : 'hover:bg-white/5 active:bg-white/5 text-gray-300 hover:text-white'
      }`}
    >
      {/* Index or Play Button / Animated Equalizer */}
      <div className="hidden sm:flex w-7 items-center justify-center flex-shrink-0 text-xs text-gray-400">
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
          className="w-11 h-11 sm:w-10 sm:h-10 rounded-lg object-cover flex-shrink-0 shadow"
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

      {/* Like Button (desktop; on phones it lives in the ⋯ menu) */}
      <button
        ref={heartRef}
        onClick={handleLikeClick}
        className={`p-1.5 rounded-full transition-colors ${
          liked
            ? 'text-accent'
            : 'hidden sm:block text-gray-400 opacity-0 group-hover:opacity-100 hover:text-white'
        }`}
        aria-label={liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
      >
        <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
      </button>

      {/* Duration */}
      <div className="hidden sm:block text-xs text-gray-400 w-12 text-right">
        {song.formattedDuration || formatTime(song.duration || 195)}
      </div>

      <SongMenu song={song} triggerClassName="can-hover:opacity-0 can-hover:group-hover:opacity-100" />
    </div>
  )
}
