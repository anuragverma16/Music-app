import React, { useRef, useState, useEffect } from 'react'
import {
  UploadCloud,
  Music,
  CheckCircle,
  Sparkles,
  FileAudio,
  Play,
  Pause,
  AlertCircle,
  Disc3,
  Radio,
} from 'lucide-react'
import gsap from 'gsap'
import { musicAPI } from '../utils/api'
import { useMusic } from '../context/MusicContext'
import { animateEntrance } from '../utils/animations'
import { useNavigate } from 'react-router-dom'

export default function Upload() {
  const { refreshTracks, playSong, tracks } = useMusic()
  const navigate = useNavigate()
  const formRef = useRef(null)
  const pageRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [uploadPercent, setUploadPercent] = useState(0)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)

  // Track Meta State
  const [title, setTitle] = useState('')
  const [artistName, setArtistName] = useState('')
  const [album, setAlbum] = useState('')
  const [genre, setGenre] = useState('Electronic')
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewAudioUrl, setPreviewAudioUrl] = useState(null)
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const previewAudioRef = useRef(new Audio())

  useEffect(() => {
    if (pageRef.current) {
      animateEntrance(pageRef.current.querySelectorAll('.stagger-reveal'), {
        y: 20,
        stagger: 0.08,
      })
    }

    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause()
      }
    }
  }, [])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleFileChange = (file) => {
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewAudioUrl(url)
      previewAudioRef.current.src = url
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''))
      }
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileChange(files[0])
    }
  }

  const togglePreviewPlay = () => {
    const audio = previewAudioRef.current
    if (isPreviewPlaying) {
      audio.pause()
      setIsPreviewPlaying(false)
    } else {
      audio.play().then(() => setIsPreviewPlaying(true)).catch(() => setIsPreviewPlaying(false))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setUploadPercent(0)
    setError('')
    setSuccess(false)

    if (!selectedFile) {
      setError('Please select an audio file (.mp3, .wav, .m4a) to upload')
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('music', selectedFile)
    formData.append('title', title.trim())
    if (artistName.trim()) formData.append('artist', artistName.trim())
    if (album.trim()) formData.append('album', album.trim())
    if (genre) formData.append('genre', genre)

    try {
      const response = await musicAPI.uploadMusic(formData, (percent) => {
        setUploadPercent(percent)
      })

      setSuccess(true)
      setSelectedFile(null)
      setTitle('')
      setArtistName('')
      setAlbum('')
      setPreviewAudioUrl(null)
      if (formRef.current) formRef.current.reset()

      // Refresh catalog in MusicContext
      await refreshTracks()

      const newSong = response.data?.music
      if (newSong) {
        gsap.fromTo(
          '.success-badge',
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' }
        )
      }

      setTimeout(() => {
        setSuccess(false)
        navigate('/')
      }, 2500)
    } catch (err) {
      console.error('Upload Error:', err)
      const errorMsg =
        err.response?.data?.message || err.message || 'Upload failed. Please verify server is running.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div ref={pageRef} className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="stagger-reveal">
        <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles size={14} />
          <span>Creator Studio</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">Upload Your Music</h1>
        <p className="text-gray-400 text-sm mt-1">
          Stream your tracks on Beatly with fast ImageKit audio delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="lg:col-span-2 stagger-reveal space-y-6 bg-secondary/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
        >
          {/* File Upload Drag & Drop Area */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Audio File (.mp3, .wav, .m4a) *
            </label>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('music-file-input').click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                dragActive
                  ? 'border-primary bg-primary/10 scale-[1.01]'
                  : selectedFile
                  ? 'border-primary/50 bg-secondary/60'
                  : 'border-white/15 hover:border-primary/50 hover:bg-white/5'
              }`}
            >
              <input
                id="music-file-input"
                type="file"
                name="music"
                accept="audio/*"
                onChange={(e) => handleFileChange(e.target.files[0])}
                className="hidden"
              />

              {selectedFile ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <FileAudio size={28} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm truncate max-w-xs">{selectedFile.name}</p>
                    <p className="text-xs text-primary mt-0.5">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for processing
                    </p>
                  </div>
                  {previewAudioUrl && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        togglePreviewPlay()
                      }}
                      className="mt-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center gap-1.5 hover:bg-primary/30"
                    >
                      {isPreviewPlaying ? <Pause size={14} /> : <Play size={14} />}
                      {isPreviewPlaying ? 'Pause Audio Preview' : 'Listen to Audio Preview'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadCloud
                    size={48}
                    className={`mb-3 transition-colors ${
                      dragActive ? 'text-primary' : 'text-gray-400'
                    }`}
                  />
                  <p className="text-white font-semibold text-sm">Drag & drop your audio track here</p>
                  <p className="text-xs text-gray-400 mt-1">or click to browse audio files</p>
                </div>
              )}
            </div>
          </div>

          {/* Track Metadata Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Song Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midnight Highway"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-primary rounded-xl text-white placeholder-gray-500 outline-none text-sm transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Artist Display Name
                </label>
                <input
                  type="text"
                  name="artist"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="Your artist name"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-primary rounded-xl text-white placeholder-gray-500 outline-none text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Album Name
                </label>
                <input
                  type="text"
                  name="album"
                  value={album}
                  onChange={(e) => setAlbum(e.target.value)}
                  placeholder="Single / EP Title"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-primary rounded-xl text-white placeholder-gray-500 outline-none text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Genre
              </label>
              <select
                name="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-primary rounded-xl text-white outline-none text-sm transition-all cursor-pointer"
              >
                <option value="Electronic" className="bg-secondary text-white">Electronic / EDM</option>
                <option value="Synthwave" className="bg-secondary text-white">Synthwave / Retro</option>
                <option value="Lo-Fi" className="bg-secondary text-white">Lo-Fi / Chill</option>
                <option value="Hip-Hop" className="bg-secondary text-white">Hip-Hop / Rap</option>
                <option value="Pop" className="bg-secondary text-white">Pop Hits</option>
                <option value="Rock" className="bg-secondary text-white">Rock / Alternative</option>
                <option value="Acoustic" className="bg-secondary text-white">Acoustic / Folk</option>
                <option value="Ambient" className="bg-secondary text-white">Ambient / Chillout</option>
              </select>
            </div>
          </div>

          {/* Upload Progress Bar */}
          {loading && (
            <div className="space-y-2 p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-xs text-gray-300 font-medium">
                <span>Uploading audio to CDN...</span>
                <span className="text-primary font-bold">{uploadPercent}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-cyan-300 transition-all duration-200"
                  style={{ width: `${uploadPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Feedback Messages */}
          {error && (
            <div className="p-4 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2.5">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="success-badge p-4 bg-green-500/15 border border-green-500/30 rounded-xl text-green-400 text-sm flex items-center gap-2.5">
              <CheckCircle size={18} className="flex-shrink-0" />
              <span>Song uploaded successfully! Redirecting to Home...</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 py-3.5 shadow-xl shadow-primary/25 text-base font-bold"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Publishing ({uploadPercent}%)...</span>
              </>
            ) : (
              <>
                <UploadCloud size={20} />
                <span>Publish Track Now</span>
              </>
            )}
          </button>
        </form>

        {/* Live Preview Card Column */}
        <div className="stagger-reveal space-y-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            Live Stream Card
          </span>

          <div className="p-5 rounded-3xl bg-secondary/50 border border-white/10 shadow-xl space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-lg bg-black/50">
              <img
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80"
                alt="Track Preview"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-primary uppercase border border-primary/30">
                {genre}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-lg text-white truncate">
                {title || 'Your Song Title'}
              </h4>
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {artistName || 'Artist Name'} • {album || 'Single'}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 text-xs text-gray-500 flex items-center justify-between">
              <span>Streaming CDN: ImageKit</span>
              <span className="text-primary font-medium">Lossless Audio</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
