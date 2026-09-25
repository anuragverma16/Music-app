import React, { useEffect, useRef } from 'react'
import {
  Play,
  Pause,
  Sparkles,
  Flame,
  Radio,
  Clock,
  Heart,
  TrendingUp,
  Disc3,
  ChevronRight,
  Upload,
  Music2,
} from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import SongCard from '../components/SongCard'
import { animateEntrance } from '../utils/animations'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const { tracks, loadingTracks, currentSong, isPlaying, playSong, togglePlay } = useMusic()
  const pageRef = useRef(null)
  const navigate = useNavigate()

  // Dynamic greeting based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const spotlightTrack = tracks[0] || null

  useEffect(() => {
    if (pageRef.current) {
      animateEntrance(pageRef.current.querySelectorAll('.stagger-reveal'), {
        y: 20,
        stagger: 0.08,
      })
    }
  }, [tracks])

  // Extract unique artists dynamically from real tracks
  const dynamicArtists = Array.from(
    new Set(tracks.map((t) => t.artistName || t.artist?.name || 'Beatly Artist'))
  ).map((name, idx) => ({
    id: `art-${idx}`,
    name,
    trackCount: tracks.filter((t) => (t.artistName || t.artist?.name) === name).length,
    coverUrl: tracks.find((t) => (t.artistName || t.artist?.name) === name)?.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
  }))

  const quickTracks = tracks.slice(0, 6)
  const trendingTracks = tracks.slice(0, 10)

  return (
    <div ref={pageRef} className="p-6 md:p-8 space-y-10 max-w-7xl mx-auto">
      {/* 1. Header Greeting & Hero Spotlight */}
      <div className="stagger-reveal">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {getGreeting()}
          </h1>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
            <Sparkles size={14} />
            <span>Discover Real Sound</span>
          </div>
        </div>

        {/* Hero Spotlight Banner */}
        {spotlightTrack ? (
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-cyan-900/60 via-secondary/80 to-purple-900/40 border border-white/10 p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 group">
            {/* Ambient Back Glow */}
            <div
              className="absolute -right-10 -top-10 w-80 h-80 rounded-full blur-[100px] opacity-40 pointer-events-none"
              style={{ backgroundColor: spotlightTrack.color || '#00d4ff' }}
            />

            <div className="space-y-3 max-w-xl z-10">
              <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-bold uppercase tracking-wider">
                Featured Release
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                {spotlightTrack.title}
              </h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-2">
                By {spotlightTrack.artistName || spotlightTrack.artist?.name}. Stream high-definition audio uploaded directly by creators.
              </p>

              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => playSong(spotlightTrack, tracks)}
                  className="btn-primary flex items-center gap-2 shadow-lg shadow-primary/30"
                >
                  <Play size={18} fill="currentColor" />
                  <span>Play Now</span>
                </button>
                <button
                  onClick={() => navigate('/explore')}
                  className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium text-sm transition-all"
                >
                  Explore All Tracks
                </button>
              </div>
            </div>

            {/* Hero Track Artwork */}
            <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
              <img
                src={spotlightTrack.coverUrl}
                alt={spotlightTrack.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-secondary/30 border border-white/10 text-center space-y-4">
            <Music2 size={48} className="mx-auto text-primary opacity-80" />
            <h3 className="text-xl font-bold text-white">No tracks uploaded yet</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Be the first artist to publish music! Head over to Artist Studio to upload your songs.
            </p>
            <button
              onClick={() => navigate('/upload')}
              className="btn-primary inline-flex items-center gap-2 text-sm"
            >
              <Upload size={16} /> Go to Artist Studio
            </button>
          </div>
        )}
      </div>

      {/* 2. Quick Play Grid */}
      {quickTracks.length > 0 && (
        <div className="stagger-reveal space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            Jump Back In
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickTracks.map((song) => {
              const isCurrent = (currentSong?.id || currentSong?._id) === (song.id || song._id)
              return (
                <div
                  key={song.id}
                  onClick={() => playSong(song, tracks)}
                  className={`group flex items-center gap-3.5 p-2 pr-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/40 backdrop-blur-md transition-all duration-200 cursor-pointer ${
                    isCurrent ? 'bg-white/10 border-primary/50' : ''
                  }`}
                >
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-14 h-14 rounded-lg object-cover shadow flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-white truncate group-hover:text-primary transition-colors">
                      {song.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {song.artistName || song.artist?.name}
                    </p>
                  </div>
                  <button
                    className={`w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center shadow-lg shadow-primary/20 transition-all ${
                      isCurrent && isPlaying
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100'
                    }`}
                  >
                    {isCurrent && isPlaying ? (
                      <Pause size={16} fill="currentColor" />
                    ) : (
                      <Play size={16} fill="currentColor" className="ml-0.5" />
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 3. Trending Tracks Grid */}
      {trendingTracks.length > 0 && (
        <div className="stagger-reveal space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Flame size={22} className="text-accent" />
              Latest Released Music
            </h2>
            <button
              onClick={() => navigate('/explore')}
              className="text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              See All <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {trendingTracks.map((song) => (
              <SongCard key={song.id} song={song} queue={tracks} />
            ))}
          </div>
        </div>
      )}

      {/* 4. Real Artists Section */}
      {dynamicArtists.length > 0 && (
        <div className="stagger-reveal space-y-4">
          <h2 className="text-2xl font-bold text-white">Featured Artists</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {dynamicArtists.map((artist) => (
              <div
                key={artist.id}
                onClick={() => navigate('/explore')}
                className="group p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/60 border border-white/5 hover:border-white/20 transition-all text-center cursor-pointer"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden mb-3 shadow-lg border-2 border-transparent group-hover:border-primary transition-all">
                  <img
                    src={artist.coverUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <p className="font-bold text-sm text-white truncate group-hover:text-primary">
                  {artist.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{artist.trackCount} {artist.trackCount === 1 ? 'track' : 'tracks'}</p>
                <span className="inline-block mt-2 text-[10px] uppercase font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Artist
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
