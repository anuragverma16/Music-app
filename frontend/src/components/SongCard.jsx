import React, { useRef, useState } from 'react'
import { Play, Pause, Heart, MoreVertical, Plus, Radio, Disc } from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import { popHeart } from '../utils/animations'
import gsap from 'gsap'

export default function SongCard({ song, queue = null }) {
  const { currentSong, isPlaying, playSong, togglePlay, toggleLike, isLiked, addToQueue, playlists, addTrackToPlaylist } = useMusic()
  const cardRef = useRef(null)
  const heartRef = useRef(null)
  const [showMenu, setShowMenu] = useState(false)
  const [showPlaylistSubmenu, setShowPlaylistSubmenu] = useState(false)

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
    toggleLike(song.id || song._id)
    popHeart(heartRef.current)
  }

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -6,
      scale: 1.02,
      duration: 0.25,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.25,
      ease: 'power2.out',
    })
    setShowMenu(false)
    setShowPlaylistSubmenu(false)
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handlePlayClick}
      className={`group relative p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/70 border border-white/5 hover:border-primary/40 backdrop-blur-md transition-colors duration-300 cursor-pointer flex flex-col justify-between select-none ${
        isCurrentTrack ? 'ring-1 ring-primary/60 bg-secondary/60' : ''
      }`}
    >
      {/* Artwork Container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3.5 shadow-lg bg-black/40">
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
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-semibold text-gray-200 uppercase tracking-wider border border-white/10">
            {song.genre}
          </span>
        )}

        {/* Like Button */}
        <button
          ref={heartRef}
          onClick={handleLikeClick}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            liked
              ? 'text-accent bg-black/60 opacity-100'
              : 'text-white/80 bg-black/40 opacity-0 group-hover:opacity-100 hover:text-white hover:scale-110'
          }`}
        >
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
        </button>

        {/* Floating Play/Pause Button */}
        <button
          onClick={handlePlayClick}
          className={`absolute bottom-3 right-3 w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-xl shadow-primary/30 transition-all duration-300 transform ${
            isThisPlaying
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-75 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0'
          } hover:scale-110 active:scale-95`}
          title={isThisPlaying ? 'Pause' : 'Play'}
        >
          {isThisPlaying ? (
            <Pause size={20} fill="currentColor" />
          ) : (
            <Play size={20} fill="currentColor" className="ml-0.5" />
          )}
        </button>
      </div>

      {/* Track Metadata */}
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-1">
          <h4
            className={`font-semibold text-sm truncate transition-colors ${
              isCurrentTrack ? 'text-primary' : 'text-white group-hover:text-primary'
            }`}
          >
            {song.title}
          </h4>

          {/* Context Options Menu Trigger */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <MoreVertical size={15} />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 bottom-full mb-1 w-44 rounded-xl bg-secondary/95 backdrop-blur-xl border border-white/10 shadow-2xl p-1.5 z-40 text-xs text-gray-200 animate-fade-in">
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
                  className="relative group/sub"
                  onMouseEnter={() => setShowPlaylistSubmenu(true)}
                  onMouseLeave={() => setShowPlaylistSubmenu(false)}
                >
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Disc size={14} /> Add to Playlist
                    </span>
                  </button>

                  {showPlaylistSubmenu && (
                    <div className="absolute left-full bottom-0 ml-1 w-40 rounded-xl bg-secondary/95 backdrop-blur-xl border border-white/10 shadow-2xl p-1.5 z-50">
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

        <p className="text-xs text-gray-400 truncate">
          {song.artistName || song.artist?.name || 'Beatly Artist'}
        </p>
      </div>
    </div>
  )
}
