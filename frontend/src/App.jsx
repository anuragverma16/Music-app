import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Library from './pages/Library'
import Upload from './pages/Upload'
import Layout from './components/Layout'
import { MusicProvider } from './context/MusicContext'
import { getToken, removeToken } from './utils/auth'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState('user')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    const role = localStorage.getItem('beatly_user_role') || 'user'

    if (token) {
      setIsAuthenticated(true)
      setUserRole(role)
    }
    setLoading(false)
  }, [])

  const handleLogin = (role) => {
    setIsAuthenticated(true)
    const normalizedRole = role || 'user'
    setUserRole(normalizedRole)
    localStorage.setItem('beatly_user_role', normalizedRole)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserRole('user')
    removeToken()
    localStorage.removeItem('beatly_user_role')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-800 border-t-primary rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
            Loading Beatly...
          </p>
        </div>
      </div>
    )
  }

  return (
    <MusicProvider>
      <Router>
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </>
          ) : (
            <Route
              path="/*"
              element={
                <Layout userRole={userRole} onLogout={handleLogout}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/library" element={<Library />} />
                    {userRole === 'artist' && (
                      <Route path="/upload" element={<Upload />} />
                    )}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              }
            />
          )}
        </Routes>
      </Router>
    </MusicProvider>
  )
}

export default App
