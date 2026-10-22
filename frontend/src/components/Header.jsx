import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Search, LogOut, Sparkles, Music2, Disc3 } from 'lucide-react'
import { useMusic } from '../context/MusicContext'

export default function Header({ userRole, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { searchQuery, setSearchQuery } = useMusic()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const isArtist = userRole === 'artist'

  return (
    <header className="h-14 md:h-16 px-4 md:px-6 bg-dark/40 backdrop-blur-md border-b border-white/5 flex items-center justify-between gap-3 sticky top-0 z-30 pt-safe">
      {/* Brand (phones only — the sidebar shows it on larger screens) */}
      <Link to="/" className="md:hidden flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary via-cyan-400 to-accent flex items-center justify-center">
          <Disc3 className="text-black w-5 h-5" />
        </div>
        <span className="text-lg font-bold text-white">Beatly</span>
      </Link>

      {/* Navigation & Search (tablet/desktop) */}
      <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-black/40 border border-white/10 hover:border-white/25 flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200"
            title="Go Back"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => navigate(1)}
            className="w-9 h-9 rounded-full bg-black/40 border border-white/10 hover:border-white/25 flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200"
            title="Go Forward"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              if (location.pathname !== '/explore' && e.target.value.trim().length > 0) {
                navigate('/explore')
              }
            }}
            placeholder="What do you want to listen to?"
            className="w-full pl-10 pr-4 py-2 bg-white/5 hover:bg-white/10 focus:bg-secondary/80 border border-white/10 focus:border-primary/60 rounded-full text-sm text-white placeholder-gray-400 outline-none transition-all duration-300 shadow-inner"
          />
        </div>
      </div>

      {/* Right Controls / User Profile */}
      <div className="flex items-center gap-3">
        {isArtist ? (
          <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-semibold">
            <Sparkles size={13} />
            Artist
          </span>
        ) : (
          <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Music2 size={13} />
            Listener
          </span>
        )}

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1 md:p-1.5 md:pr-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
            aria-label="Account menu"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-black font-bold text-xs shadow">
              {isArtist ? 'A' : 'L'}
            </div>
            <span className="hidden md:inline text-sm font-medium text-gray-200 group-hover:text-white">
              {isArtist ? 'Artist' : 'Listener'}
            </span>
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-secondary/95 border border-white/10 backdrop-blur-xl shadow-2xl p-2 z-50 animate-fade-in text-sm text-gray-200">
                <div className="p-3 border-b border-white/10 mb-1">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="font-semibold text-white">{isArtist ? 'Artist' : 'Listener'}</p>
                </div>

                <button
                  onClick={() => {
                    setDropdownOpen(false)
                    onLogout()
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors font-medium mt-1"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
