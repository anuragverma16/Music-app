import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Heart,
  ListMusic,
  Play,
  Pause,
  Plus,
  Trash2,
  Music,
  Sparkles,
  FolderPlus,
  Clock,
} from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import SongListRow from '../components/SongListRow'
import CreatePlaylistModal from '../components/CreatePlaylistModal'
import { animateEntrance } from '../utils/animations'

export default function Library() {
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    tracks,
    likedTracks,
    likedSongIds,
    playlists,
    deletePlaylist,
    removeTrackFromPlaylist,
    playSong,
    currentSong,
    isPlaying,
  } = useMusic()

  const [activeTab, setActiveTab] = useState('all') // 'all' | 'liked' | 'playlists'
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const pageRef = useRef(null)

  // Handle URL query parameters (?tab=liked or ?playlist=...)
  useEffect(() => {
    const tab = searchParams.get('tab')
    const pl = searchParams.get('playlist')
    if (tab === 'liked') {
      setActiveTab('liked')
      setSelectedPlaylistId(null)
    } else if (pl) {
      setSelectedPlaylistId(pl)
    }
  }, [searchParams])

  useEffect(() => {
    if (pageRef.current) {
      animateEntrance(pageRef.current.querySelectorAll('.stagger-reveal'), {
        y: 16,
        stagger: 0.06,
      })
    }
  }, [activeTab, selectedPlaylistId])

  const selectedPlaylist = playlists.find((p) => p.id === selectedPlaylistId)
  const selectedPlaylistTracks = selectedPlaylist
    ? tracks.filter((t) => selectedPlaylist.trackIds.includes(t.id || t._id))
    : []

  return (
    <div ref={pageRef} className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* If a custom Playlist is selected: show playlist detail view */}
      {selectedPlaylist ? (
        <div className="space-y-6 stagger-reveal">
          {/* Playlist Hero Banner */}
          <div
            className="p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-end gap-6 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${selectedPlaylist.color}33 0%, rgba(15, 12, 41, 0.9) 100%)`,
            }}
          >
            <div
              className="w-44 h-44 rounded-2xl flex items-center justify-center text-white shadow-2xl flex-shrink-0"
              style={{ backgroundColor: selectedPlaylist.color }}
            >
              <ListMusic size={64} />
            </div>

            <div className="space-y-2 flex-1 min-w-0">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Custom Playlist
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white truncate">
                {selectedPlaylist.title}
              </h1>
              <p className="text-sm text-gray-300">
                {selectedPlaylist.description || 'Curated music collection'}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400 pt-2">
                <span>{selectedPlaylistTracks.length} tracks</span>
                <span>•</span>
                <span>Created by You</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (selectedPlaylistTracks.length > 0) {
                    playSong(selectedPlaylistTracks[0], selectedPlaylistTracks)
                  }
                }}
                disabled={selectedPlaylistTracks.length === 0}
                className="w-14 h-14 rounded-full bg-primary text-black flex items-center justify-center shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <Play size={24} fill="currentColor" className="ml-1" />
              </button>

              <button
                onClick={() => {
                  deletePlaylist(selectedPlaylist.id)
                  setSelectedPlaylistId(null)
                  setSearchParams({})
                }}
                className="p-3 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                title="Delete Playlist"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          {/* Back button */}
          <button
            onClick={() => {
              setSelectedPlaylistId(null)
              setSearchParams({})
            }}
            className="text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            ← Back to All Playlists
          </button>

          {/* Tracks Table */}
          <div className="space-y-1">
            {selectedPlaylistTracks.length === 0 ? (
              <div className="text-center py-16 rounded-2xl bg-secondary/30 border border-white/5 space-y-2">
                <Music size={36} className="mx-auto text-gray-500" />
                <p className="text-lg font-semibold text-white">This playlist is empty</p>
                <p className="text-sm text-gray-400">Add songs using the 3-dot menu on any song card!</p>
              </div>
            ) : (
              selectedPlaylistTracks.map((song, idx) => (
                <SongListRow
                  key={song.id}
                  song={song}
                  index={idx}
                  queue={selectedPlaylistTracks}
                />
              ))
            )}
          </div>
        </div>
      ) : (
        /* Standard Library Overview */
        <>
          {/* Header & Filter Tabs */}
          <div className="stagger-reveal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">Your Library</h1>
              <p className="text-gray-400 text-sm">Your favorite tracks and custom collections</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCreateOpen(true)}
                className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5 shadow-md shadow-primary/20"
              >
                <Plus size={16} /> Create Playlist
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="stagger-reveal flex items-center gap-2 border-b border-white/10 pb-3">
            {[
              { id: 'all', label: 'All' },
              { id: 'liked', label: `Liked Songs (${likedTracks.length})` },
              { id: 'playlists', label: `Playlists (${playlists.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-black shadow'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Liked Songs Section */}
          {(activeTab === 'all' || activeTab === 'liked') && (
            <div className="stagger-reveal space-y-4">
              <div
                onClick={() => {
                  if (likedTracks.length > 0) playSong(likedTracks[0], likedTracks)
                }}
                className="group relative p-6 md:p-8 rounded-3xl bg-gradient-to-br from-purple-700 via-indigo-900 to-black border border-purple-500/30 cursor-pointer shadow-xl transition-all hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg">
                      <Heart size={28} fill="white" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-white">Liked Songs</h2>
                      <p className="text-sm text-purple-200 mt-1">
                        {likedTracks.length} auto-saved favorite tracks
                      </p>
                    </div>
                  </div>

                  <button className="w-14 h-14 rounded-full bg-primary text-black flex items-center justify-center shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform">
                    <Play size={24} fill="currentColor" className="ml-1" />
                  </button>
                </div>
              </div>

              {activeTab === 'liked' && (
                <div className="space-y-1 pt-2">
                  {likedTracks.map((song, idx) => (
                    <SongListRow
                      key={song.id}
                      song={song}
                      index={idx}
                      queue={likedTracks}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Custom User Playlists Grid */}
          {(activeTab === 'all' || activeTab === 'playlists') && (
            <div className="stagger-reveal space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Playlists</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Create Playlist Quick Tile */}
                <div
                  onClick={() => setIsCreateOpen(true)}
                  className="p-6 rounded-2xl border-2 border-dashed border-white/15 hover:border-primary bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center justify-center text-center cursor-pointer group min-h-[180px]"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Plus size={24} />
                  </div>
                  <p className="font-bold text-sm text-white">Create Playlist</p>
                  <p className="text-xs text-gray-400 mt-1">Add tracks & customize</p>
                </div>

                {playlists.map((pl) => (
                  <div
                    key={pl.id}
                    onClick={() => setSelectedPlaylistId(pl.id)}
                    className="group p-5 rounded-2xl bg-secondary/40 hover:bg-secondary/70 border border-white/5 hover:border-primary/40 backdrop-blur-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: pl.color }}
                      >
                        <ListMusic size={26} />
                      </div>
                      <h4 className="font-bold text-base text-white group-hover:text-primary transition-colors truncate">
                        {pl.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {pl.description || 'Playlist'}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                      <span>{pl.trackIds?.length || 0} tracks</span>
                      <span className="text-primary font-medium group-hover:underline">Open →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Playlist Modal */}
      <CreatePlaylistModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  )
}
