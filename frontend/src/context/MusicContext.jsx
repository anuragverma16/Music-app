import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { musicAPI } from '../utils/api'

const MusicContext = createContext(null)

export const MusicProvider = ({ children }) => {
  // Catalog State - purely from Database / Backend
  const [tracks, setTracks] = useState([])
  const [loadingTracks, setLoadingTracks] = useState(true)
  const [likedSongIds, setLikedSongIds] = useState(() => {
    try {
      const saved = localStorage.getItem('beatly_liked_songs')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Playlists State - stored per user
  const [playlists, setPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem('beatly_custom_playlists')
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return []
  })

  // Playback State
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [queue, setQueue] = useState([])
  const [queueIndex, setQueueIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState('all') // 'off' | 'all' | 'one'
  const [recentlyPlayed, setRecentlyPlayed] = useState([])

  // UI Overlays
  const [showLyrics, setShowLyrics] = useState(false)
  const [showQueue, setShowQueue] = useState(false)
  const [isFullscreenPlayer, setIsFullscreenPlayer] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')

  // Audio HTML Element Ref
  const audioRef = useRef(new Audio())

  // Save Liked Songs to localStorage
  useEffect(() => {
    localStorage.setItem('beatly_liked_songs', JSON.stringify(likedSongIds))
  }, [likedSongIds])

  // Save Playlists to localStorage
  useEffect(() => {
    localStorage.setItem('beatly_custom_playlists', JSON.stringify(playlists))
  }, [playlists])

  // Load Tracks from Backend API
  const refreshTracks = async () => {
    setLoadingTracks(true)
    try {
      const response = await musicAPI.getAllMusic()
      const backendMusics = response.data?.music?.musics || []

      const formattedTracks = backendMusics.map((m, idx) => {
        const artistName = m.artist?.name || m.artistName || (typeof m.artist === 'string' ? m.artist : 'Beatly Artist')
        return {
          _id: m._id || `backend-${idx}`,
          id: m._id || `backend-${idx}`,
          title: m.title || 'Untitled Track',
          artist: m.artist || { name: artistName },
          artistName: artistName,
          album: m.album || 'Single',
          genre: m.genre || 'Electronic',
          duration: m.duration || 180,
          formattedDuration: formatTime(m.duration || 180),
          uri: m.uri,
          coverUrl:
            m.coverUrl ||
            `https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80`,
          color: '#00d4ff',
          plays: m.plays || 0,
          lyrics: m.lyrics || '',
          liked: false,
        }
      })

      setTracks(formattedTracks)

      // Set initial song if none is playing and tracks exist
      if (formattedTracks.length > 0 && !currentSong) {
        setCurrentSong(formattedTracks[0])
        setQueue(formattedTracks)
      }
    } catch (err) {
      console.warn('Backend music API unavailable or empty:', err.message)
      setTracks([])
    } finally {
      setLoadingTracks(false)
    }
  }

  useEffect(() => {
    refreshTracks()
  }, [])

  // Setup Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || currentSong?.duration || 0)
    }

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0
        audio.play().catch(() => {})
      } else {
        playNext()
      }
    }

    const handleError = (e) => {
      console.warn('Audio playback error encountered:', e)
      setIsPlaying(false)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [repeatMode, queue, queueIndex, currentSong])

  // Play a specific song
  const playSong = (song, newQueue = null) => {
    if (!song) return

    const trackQueue = newQueue || (queue.length > 0 ? queue : [song])
    const index = trackQueue.findIndex((t) => (t.id || t._id) === (song.id || song._id))

    setQueue(trackQueue)
    setQueueIndex(index !== -1 ? index : 0)
    setCurrentSong(song)
    setIsPlaying(true)

    // Add to recently played (uniquely at front)
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((t) => (t.id || t._id) !== (song.id || song._id))
      return [song, ...filtered].slice(0, 10)
    })

    const audio = audioRef.current
    if (audio.src !== song.uri) {
      audio.src = song.uri
      audio.load()
    }

    audio.play().catch((err) => {
      console.warn('Audio play prevented (user gesture required):', err)
      setIsPlaying(false)
    })
  }

  // Toggle Play/Pause
  const togglePlay = () => {
    const audio = audioRef.current
    if (!currentSong) {
      if (tracks.length > 0) playSong(tracks[0])
      return
    }

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      if (!audio.src && currentSong.uri) {
        audio.src = currentSong.uri
      }
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    }
  }

  // Next Track
  const playNext = () => {
    if (queue.length === 0) return

    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
      return
    }

    let nextIdx
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length)
    } else {
      nextIdx = queueIndex + 1
      if (nextIdx >= queue.length) {
        if (repeatMode === 'all') {
          nextIdx = 0
        } else {
          setIsPlaying(false)
          return
        }
      }
    }

    const nextSong = queue[nextIdx]
    if (nextSong) {
      setQueueIndex(nextIdx)
      playSong(nextSong, queue)
    }
  }

  // Previous Track
  const playPrev = () => {
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0
      return
    }

    if (queue.length === 0) return

    let prevIdx = queueIndex - 1
    if (prevIdx < 0) {
      prevIdx = queue.length - 1
    }

    const prevSong = queue[prevIdx]
    if (prevSong) {
      setQueueIndex(prevIdx)
      playSong(prevSong, queue)
    }
  }

  // Seek time
  const seek = (time) => {
    const audio = audioRef.current
    audio.currentTime = time
    setCurrentTime(time)
  }

  // Volume & Mute
  const setVolume = (val) => {
    const clamped = Math.max(0, Math.min(1, val))
    setVolumeState(clamped)
    audioRef.current.volume = clamped
    if (clamped > 0 && isMuted) {
      setIsMuted(false)
      audioRef.current.muted = false
    }
  }

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.muted = false
      setIsMuted(false)
    } else {
      audioRef.current.muted = true
      setIsMuted(true)
    }
  }

  // Toggles
  const toggleShuffle = () => setIsShuffle((prev) => !prev)

  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all'
      if (prev === 'all') return 'one'
      return 'off'
    })
  }

  // Like Song
  const toggleLike = (songId) => {
    setLikedSongIds((prev) => {
      if (prev.includes(songId)) {
        return prev.filter((id) => id !== songId)
      } else {
        return [...prev, songId]
      }
    })
  }

  const isLiked = (songId) => likedSongIds.includes(songId)

  // Queue Operations
  const addToQueue = (song) => {
    setQueue((prev) => [...prev, song])
  }

  const removeFromQueue = (index) => {
    setQueue((prev) => prev.filter((_, i) => i !== index))
  }

  const clearQueue = () => {
    if (currentSong) {
      setQueue([currentSong])
      setQueueIndex(0)
    } else {
      setQueue([])
      setQueueIndex(0)
    }
  }

  // Playlist Management
  const createPlaylist = ({ title, description = '', color = '#00d4ff' }) => {
    const newPlaylist = {
      id: `pl-${Date.now()}`,
      title: title || 'New Playlist',
      description,
      color,
      trackIds: [],
      createdAt: new Date().toISOString(),
    }
    setPlaylists((prev) => [newPlaylist, ...prev])
    return newPlaylist
  }

  const deletePlaylist = (playlistId) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId))
  }

  const addTrackToPlaylist = (playlistId, trackId) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          if (pl.trackIds.includes(trackId)) return pl
          return { ...pl, trackIds: [...pl.trackIds, trackId] }
        }
        return pl
      })
    )
  }

  const removeTrackFromPlaylist = (playlistId, trackId) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          return { ...pl, trackIds: pl.trackIds.filter((id) => id !== trackId) }
        }
        return pl
      })
    )
  }

  // Helper time formatter (mm:ss)
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  // Liked tracks full objects
  const likedTracks = tracks.filter((t) => likedSongIds.includes(t.id || t._id))

  const value = {
    tracks,
    loadingTracks,
    refreshTracks,
    currentSong,
    isPlaying,
    queue,
    queueIndex,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    recentlyPlayed,
    likedSongIds,
    likedTracks,
    playlists,
    showLyrics,
    showQueue,
    isFullscreenPlayer,
    searchQuery,
    selectedGenre,
    setSearchQuery,
    setSelectedGenre,
    setShowLyrics,
    setShowQueue,
    setIsFullscreenPlayer,
    playSong,
    togglePlay,
    playNext,
    playPrev,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    isLiked,
    addToQueue,
    removeFromQueue,
    clearQueue,
    createPlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    formatTime,
  }

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
}

export const useMusic = () => {
  const context = useContext(MusicContext)
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider')
  }
  return context
}

export default MusicContext
