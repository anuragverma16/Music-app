import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  Compass,
  Heart,
  Upload,
  Music,
  PlusCircle,
  ListMusic,
  Radio,
  Sparkles,
  Volume2,
  ChevronRight,
  Disc3,
} from 'lucide-react'
import { useMusic } from '../context/MusicContext'

export default function Sidebar({ userRole, onCreatePlaylist }) {
  const location = useLocation()
  const { playlists, currentSong, isPlaying, likedSongIds } = useMusic()

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore & Search', path: '/explore' },
    { icon: ListMusic, label: 'Your Library', path: '/library' },
  ]

  return (
    <aside className="w-64 bg-black/80 backdrop-blur-xl border-r border-white/10 flex flex-col h-full select-none text-gray-300">
      {/* Brand Header */}
      <div className="p-6 pb-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary via-cyan-400 to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            <Disc3 className={`text-black w-6 h-6 ${isPlaying ? 'animate-spin-slow' : ''}`} />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-gray-200 to-primary bg-clip-text text-transparent">
              Beatly
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Premium</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-primary/20 to-primary/5 text-primary shadow-sm border border-primary/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-glow"></div>
              )}
              <Icon
                size={20}
                className={`transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'text-primary' : 'text-gray-400 group-hover:text-white'
                }`}
              />
              <span>{item.label}</span>
            </Link>
          )
        })}

        {/* Artist Upload Link */}
        {userRole === 'artist' && (
          <Link
            to="/upload"
            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 group relative ${
              location.pathname === '/upload'
                ? 'bg-gradient-to-r from-accent/20 to-accent/5 text-accent border border-accent/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {location.pathname === '/upload' && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full"></div>
            )}
            <Upload size={20} className="text-accent group-hover:scale-110 transition-transform" />
            <div className="flex items-center justify-between flex-1">
              <span>Artist Studio</span>
              <span className="text-[10px] bg-accent/20 text-accent font-semibold px-2 py-0.5 rounded-full border border-accent/30">
                Creator
              </span>
            </div>
          </Link>
        )}
      </div>

      {/* Quick Liked Songs Banner */}
      <div className="px-3 pt-2">
        <Link
          to="/library?tab=liked"
          className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-900/30 to-pink-900/20 border border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-900/40 transition-all duration-300 group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
            <Heart size={16} fill="white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Liked Songs</p>
            <p className="text-xs text-gray-400">{likedSongIds.length} tracks</p>
          </div>
        </Link>
      </div>

      {/* Playlists Section */}
      <div className="flex-1 overflow-hidden flex flex-col mt-4 px-3">
        <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <span>Playlists</span>
          <button
            onClick={onCreatePlaylist}
            title="Create Playlist"
            className="hover:text-primary transition-colors p-1 rounded hover:bg-white/5 flex items-center gap-1"
          >
            <PlusCircle size={15} />
            <span className="text-[11px] lowercase first-letter:uppercase">New</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {playlists.map((pl) => (
            <Link
              key={pl.id}
              to={`/library?playlist=${pl.id}`}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
            >
              <div className="flex items-center gap-2.5 truncate">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: pl.color || '#00d4ff' }}
                ></div>
                <span className="truncate">{pl.title}</span>
              </div>
              <span className="text-xs text-gray-600 group-hover:text-gray-400">{pl.trackIds?.length || 0}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mini Active Track Preview in Sidebar if Playing */}
      {currentSong && (
        <div className="p-3 m-3 rounded-xl bg-secondary/50 border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <img
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className="w-10 h-10 rounded-lg object-cover shadow"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{currentSong.title}</p>
              <p className="text-[11px] text-gray-400 truncate">{currentSong.artistName || currentSong.artist?.name}</p>
            </div>
            {isPlaying && (
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-full bg-primary animate-bounce"></span>
                <span className="w-0.5 h-2/3 bg-primary animate-bounce delay-75"></span>
                <span className="w-0.5 h-4/5 bg-primary animate-bounce delay-150"></span>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  )
}
