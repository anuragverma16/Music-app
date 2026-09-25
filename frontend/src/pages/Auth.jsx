import React, { useState, useEffect, useRef } from 'react'
import {
  Music,
  Headphones,
  Sparkles,
  Lock,
  Mail,
  User,
  Disc3,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import gsap from 'gsap'
import { authAPI } from '../utils/api'
import { setToken } from '../utils/auth'

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [role, setRole] = useState('user') // 'user' | 'artist'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const containerRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    // GSAP Floating Particles & Entrance
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
      )
    }

    const floatingNotes = containerRef.current?.querySelectorAll('.floating-note')
    if (floatingNotes) {
      floatingNotes.forEach((el, idx) => {
        gsap.to(el, {
          y: -20,
          rotation: idx % 2 === 0 ? 15 : -15,
          duration: 2 + idx * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: idx * 0.2,
        })
      })
    }
  }, [isLogin])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        // Login Request
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password,
        })

        const user = response.data?.user
        const token = response.data?.token || response.data?.user?.token || 'authenticated-token'
        const userRole = user?.role || 'user'

        setToken(token)
        onLogin(userRole)
      } else {
        // Register Request
        const response = await authAPI.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: role,
        })

        const user = response.data?.user
        const token = response.data?.token || user?.token || 'authenticated-token'
        const userRole = user?.role || role

        setToken(token)
        onLogin(userRole)
      }
    } catch (err) {
      console.warn('Auth API error:', err)
      const errorMsg =
        typeof err.response?.data === 'string'
          ? err.response?.data
          : err.response?.data?.message || err.message || 'Authentication failed. Try demo login.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  // Quick Instant Demo Login
  const handleDemoLogin = (demoRole) => {
    setToken(`demo-token-${demoRole}`)
    onLogin(demoRole)
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-dark via-gray-950 to-black flex items-center justify-center p-4 relative overflow-hidden font-poppins"
    >
      {/* Ambient Neon Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/20 blur-[160px] pointer-events-none" />

      {/* Floating Animated Graphic Accents */}
      <div className="floating-note absolute top-20 left-16 text-primary/30 hidden lg:block pointer-events-none">
        <Disc3 size={60} />
      </div>
      <div className="floating-note absolute bottom-24 right-20 text-accent/30 hidden lg:block pointer-events-none">
        <Headphones size={70} />
      </div>

      {/* Auth Card Container */}
      <div
        ref={cardRef}
        className="w-full max-w-md bg-secondary/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary via-cyan-400 to-accent mx-auto flex items-center justify-center shadow-lg shadow-primary/30">
            <Disc3 className="text-black w-8 h-8 animate-spin-slow" />
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-white via-gray-100 to-primary bg-clip-text text-transparent">
            Beatly Music
          </h1>
          <p className="text-xs text-gray-400">
            {isLogin ? 'Welcome back! Jump into your rhythm.' : 'Create an account and start listening.'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true)
              setError('')
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              isLogin ? 'bg-primary text-black shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false)
              setError('')
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              !isLogin ? 'bg-primary text-black shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 focus:border-primary rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 focus:border-primary rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 focus:border-primary rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Role Selection (on Register) */}
          {!isLogin && (
            <div className="pt-1">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                I am joining as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    role === 'user'
                      ? 'border-primary bg-primary/10 text-primary shadow'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <Headphones size={20} className="mx-auto mb-1" />
                  <span className="text-xs font-bold block">Listener</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('artist')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    role === 'artist'
                      ? 'border-accent bg-accent/10 text-accent shadow'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <Sparkles size={20} className="mx-auto mb-1" />
                  <span className="text-xs font-bold block">Artist / Creator</span>
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 shadow-lg shadow-primary/25 text-sm font-bold mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLogin ? 'Sign In to Beatly' : 'Create My Account'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Instant Demo Access Options */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <p className="text-[11px] text-gray-400 text-center font-medium uppercase tracking-wider">
            Quick 1-Click Demo Login
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin('user')}
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-200 hover:text-white flex items-center justify-center gap-1.5 transition-all"
            >
              <Headphones size={14} className="text-primary" />
              <span>Listener Demo</span>
            </button>
            <button
              onClick={() => handleDemoLogin('artist')}
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-200 hover:text-white flex items-center justify-center gap-1.5 transition-all"
            >
              <Sparkles size={14} className="text-accent" />
              <span>Artist Studio Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
