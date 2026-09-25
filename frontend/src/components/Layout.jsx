import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import MusicPlayer from './MusicPlayer'
import LyricsModal from './LyricsModal'
import QueueDrawer from './QueueDrawer'
import CreatePlaylistModal from './CreatePlaylistModal'
import FullscreenPlayer from './FullscreenPlayer'

export default function Layout({ children, userRole, onLogout }) {
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false)

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-poppins">
      {/* 1. Spotify Sidebar Navigation */}
      <Sidebar
        userRole={userRole}
        onCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-dark via-gray-950 to-black overflow-hidden relative">
        {/* Top Header */}
        <Header userRole={userRole} onLogout={onLogout} />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto custom-scrollbar pb-8">
          {children}
        </main>

        {/* Bottom Persistent Music Player */}
        <MusicPlayer />
      </div>

      {/* 3. Global Overlays & Modals */}
      <LyricsModal />
      <QueueDrawer />
      <FullscreenPlayer />
      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
      />
    </div>
  )
}
