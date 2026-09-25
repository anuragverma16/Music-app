import React, { useRef, useEffect } from 'react'
import {
  Search,
  Sparkles,
  Play,
  Pause,
  Filter,
  Disc3,
  Music2,
  TrendingUp,
} from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import SongCard from '../components/SongCard'
import SongListRow from '../components/SongListRow'
import { GENRES } from '../data/mockTracks'
import { animateEntrance } from '../utils/animations'

export default function Explore() {
  const {
    tracks,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    playSong,
    currentSong,
    isPlaying,
  } = useMusic()

  const pageRef = useRef(null)

  useEffect(() => {
    if (pageRef.current) {
      animateEntrance(pageRef.current.querySelectorAll('.stagger-reveal'), {
        y: 16,
        stagger: 0.05,
      })
    }
  }, [selectedGenre, searchQuery])

  // Filter tracks by search query and genre
  const filteredTracks = tracks.filter((track) => {
    const matchesSearch =
      !searchQuery.trim() ||
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (track.artistName || track.artist?.name || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (track.album || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (track.genre || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesGenre =
      selectedGenre === 'all' ||
      (track.genre && track.genre.toLowerCase() === selectedGenre.toLowerCase())

    return matchesSearch && matchesGenre
  })

  const topResult = filteredTracks[0] || null

  return (
    <div ref={pageRef} className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header & Big Search Field */}
      <div className="stagger-reveal space-y-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Explore & Search</h1>
          <p className="text-gray-400 text-sm">Find tracks, albums, genres, and artists</p>
        </div>

        {/* Big Search Bar */}
        <div className="relative max-w-2xl">
          <Search
            size={22}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by song name, artist, album, or genre..."
            className="w-full pl-12 pr-4 py-3.5 bg-secondary/60 focus:bg-secondary border border-white/10 focus:border-primary/80 rounded-2xl text-base text-white placeholder-gray-400 outline-none transition-all shadow-lg shadow-black/40"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white bg-white/10 px-2 py-1 rounded-md"
            >
              Clear
            </button>
          )}
        </div>

        {/* Genre Pill Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {GENRES.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGenre(g.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedGenre === g.id
                  ? 'bg-primary text-black shadow-md shadow-primary/20 scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* If Search Query is Active: Show Top Result + Songs Table */}
      {searchQuery.trim().length > 0 ? (
        <div className="stagger-reveal space-y-6">
          <h2 className="text-xl font-bold text-white">Search Results for "{searchQuery}"</h2>

          {filteredTracks.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-secondary/30 border border-white/5 space-y-2">
              <Music2 size={36} className="mx-auto text-gray-500" />
              <p className="text-lg font-semibold text-white">No tracks found</p>
              <p className="text-sm text-gray-400">Try searching for something else or clearing filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Result Card */}
              {topResult && (
                <div
                  onClick={() => playSong(topResult, filteredTracks)}
                  className="p-6 rounded-2xl bg-secondary/60 border border-white/10 hover:border-primary/50 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-4">
                      Top Result
                    </span>
                    <img
                      src={topResult.coverUrl}
                      alt={topResult.title}
                      className="w-28 h-28 rounded-xl object-cover shadow-lg mb-4"
                    />
                    <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                      {topResult.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Song • {topResult.artistName || topResult.artist?.name}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
                      {topResult.genre || 'Music'}
                    </span>
                    <button className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                      <Play size={20} fill="currentColor" className="ml-0.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Songs List Column */}
              <div className="lg:col-span-2 space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 px-3">
                  Songs ({filteredTracks.length})
                </span>
                <div className="space-y-1">
                  {filteredTracks.map((song, idx) => (
                    <SongListRow
                      key={song.id}
                      song={song}
                      index={idx}
                      queue={filteredTracks}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* If Search is Empty: Show Colorful Genre Tiles + All Tracks Grid */
        <>
          {/* Genre Gradient Grid (Spotify Style) */}
          <div className="stagger-reveal space-y-4">
            <h2 className="text-xl font-bold text-white">Browse All Categories</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {GENRES.filter((g) => g.id !== 'all').map((g) => (
                <div
                  key={g.id}
                  onClick={() => setSelectedGenre(g.id)}
                  className={`relative h-28 rounded-2xl p-4 bg-gradient-to-br ${g.color} shadow-lg cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl group`}
                >
                  <h3 className="font-extrabold text-base md:text-lg text-white leading-tight">
                    {g.name}
                  </h3>
                  <Disc3
                    size={54}
                    className="absolute -right-2 -bottom-2 text-white/20 group-hover:rotate-45 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* All Tracks Grid */}
          <div className="stagger-reveal space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {selectedGenre === 'all' ? 'All Songs' : `${selectedGenre} Tracks`} ({filteredTracks.length})
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredTracks.map((song) => (
                <SongCard key={song.id} song={song} queue={filteredTracks} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
