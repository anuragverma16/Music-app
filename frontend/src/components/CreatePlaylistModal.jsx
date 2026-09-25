import React, { useState } from 'react'
import { X, Plus, Sparkles, FolderPlus } from 'lucide-react'
import { useMusic } from '../context/MusicContext'

export default function CreatePlaylistModal({ isOpen, onClose }) {
  const { createPlaylist } = useMusic()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedColor, setSelectedColor] = useState('#00d4ff')

  if (!isOpen) return null

  const COLORS = ['#00d4ff', '#ff006e', '#8338ec', '#ffbe0b', '#06d6a0', '#3a86ff', '#e63946']

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    createPlaylist({
      title: title.trim(),
      description: description.trim(),
      color: selectedColor,
    })

    setTitle('')
    setDescription('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-secondary/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/20 text-primary">
              <FolderPlus size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Create New Playlist</h3>
              <p className="text-xs text-gray-400">Add custom music collections</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Playlist Name
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. My Favorite Bangers"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-primary rounded-xl text-white placeholder-gray-500 outline-none text-sm transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Give your playlist a cool description..."
              rows={2}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-primary rounded-xl text-white placeholder-gray-500 outline-none text-sm transition-all resize-none"
            />
          </div>

          {/* Color Tag Picker */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Theme Accent Color
            </label>
            <div className="flex items-center gap-3">
              {COLORS.map((col) => (
                <button
                  type="button"
                  key={col}
                  onClick={() => setSelectedColor(col)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    selectedColor === col ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-primary text-black hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              Create Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
