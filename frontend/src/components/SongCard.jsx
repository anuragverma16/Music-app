import React, { useRef } from 'react'
import { Play, Pause, Heart } from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import { popHeart } from '../utils/animations'
import SongMenu from './SongMenu'
import gsap from 'gsap'

const canHover = () => window.matchMedia('(hover: hover)').matches

export default function SongCard({ song, queue = null }) {
  const { currentSong, isPlaying, playSong, togglePlay, toggleLike, isLiked } = useMusic()
  const cardRef = useRef(null)
  const heartRef = useRef(null)

  const isCurrentTrack = (currentSong?.id || currentSong?._id) === (song.id || song._id)
  const isThisPlaying = isCurrentTrack && isPlaying
  const liked = isLiked(song.id || song._id)

  const handlePlayClick = (e) => {
    e.stopPropagation()
    if (isCurrentTrack) {
      togglePlay()
    } else {
      playSong(song, queue)
    }
  }

  const handleLikeClick = (e) => {
    e.stopPropagation()
    toggleLike(song)
    popHeart(heartRef.current)
  }

  // lift animation only on devices with a real mouse
  const handleMouseEnter = () => {
    if (!canHover()) return
    gsap.to(cardRef.current, { y: -6, scale: 1.02, duration: 0.25, ease: 'power2.out' })
  }

  const handleMouseLeave = () => {
    if (!canHover()) return
    gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.25, ease: 'power2.out' })
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handlePlayClick}
      className={`group relative p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-secondary/30 hover:bg-secondary/70 border border-white/5 hover:border-primary/40 backdrop-blur-md transition-colors duration-300 cursor-pointer flex flex-col justify-between select-none ${
        isCurrentTrack ? 'ring-1 ring-primary/60 bg-secondary/60' : ''
      }`}
    >
      {/* Artwork Container */}
      <div className="relative aspect-square w-full rounded-lg sm:rounded-xl overflow-hidden mb-2.5 sm:mb-3.5 shadow-lg bg-black/40">
        <img
          src={
            song.coverUrl ||
            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'
          }
          alt={song.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Ambient Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Genre Tag Badge */}
        {song.genre && (
          <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] sm:text-[10px] font-semibold text-gray-200 uppercase tracking-wider border border-white/10 max-w-[70%] truncate">
            {song.genre}
          </span>
        )}

        {/* Like Button (always shown when liked; on hover otherwise — touch users use the ⋯ menu) */}
        <button
          ref={heartRef}
          onClick={handleLikeClick}
          className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            liked
              ? 'text-accent bg-black/60'
              : 'hidden md:block text-white/80 bg-black/40 opacity-0 group-hover:opacity-100 hover:text-white hover:scale-110'
          }`}
          aria-label={liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
        >
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
        </button>

        {/* Floating Play/Pause Button */}
        <button
          onClick={handlePlayClick}
          className={`absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-xl shadow-primary/30 transition-all duration-300 transform ${
            isThisPlaying
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-75 translate-y-2 md:group-hover:opacity-100 md:group-hover:scale-100 md:group-hover:translate-y-0'
          } hover:scale-110 active:scale-95`}
          aria-label={isThisPlaying ? 'Pause' : 'Play'}
        >
          {isThisPlaying ? (
            <Pause size={18} fill="currentColor" />
          ) : (
            <Play size={18} fill="currentColor" className="ml-0.5" />
          )}
        </button>
      </div>

      {/* Track Metadata */}
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0 flex-1">
          <h4
            className={`font-semibold text-sm truncate transition-colors ${
              isCurrentTrack ? 'text-primary' : 'text-white group-hover:text-primary'
            }`}
          >
            {song.title}
          </h4>
          <p className="text-xs text-gray-400 truncate mt-0.5">
            {song.artistName || song.artist?.name || 'Beatly Artist'}
          </p>
        </div>

        <SongMenu song={song} placement="up" triggerClassName="-mr-1.5 can-hover:opacity-0 can-hover:group-hover:opacity-100" />
      </div>
    </div>
  )
}
