import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import MusicPlayer from './MusicPlayer'
import MobileNav from './MobileNav'
import LyricsModal from './LyricsModal'
import QueueDrawer from './QueueDrawer'
import CreatePlaylistModal from './CreatePlaylistModal'
import FullscreenPlayer from './FullscreenPlayer'

export default function Layout({ children, userRole, onLogout }) {
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false)

  return (
    <div className="flex h-[100dvh] bg-black text-white overflow-hidden font-poppins">
      {/* 1. Sidebar Navigation (tablet/desktop) */}
      <div className="hidden md:flex">
        <Sidebar
          userRole={userRole}
          onCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
        />
      </div>

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-dark via-gray-950 to-black overflow-hidden relative">
        {/* Top Header */}
        <Header userRole={userRole} onLogout={onLogout} />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pb-6 md:pb-8">
          {children}
        </main>

        {/* Bottom Persistent Music Player */}
        <MusicPlayer />

        {/* Bottom Tab Bar (phones) */}
        <MobileNav userRole={userRole} />
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
