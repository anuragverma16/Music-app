import axios from 'axios'
import { getToken, removeToken } from './auth'

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Session expired or token invalid: clear it and send the user back to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = /\/(login|register)$/.test(error.config?.url || '')
    if (error.response?.status === 401 && !isAuthRoute && getToken()) {
      removeToken()
      localStorage.removeItem('beatly_user_role')
      window.location.replace('/auth')
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  logout: () => api.post('/logout'),
}

export const musicAPI = {
  uploadMusic: (formData, onProgress) =>
    api.post('/upload-music', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percentCompleted)
        }
      },
    }),
  // Fast upload: get signed params from our backend, send the file straight
  // to ImageKit (no trip through Render), then save the track details.
  uploadTrack: async (file, details, onProgress) => {
    const { data: auth } = await api.get('/upload-auth')

    const form = new FormData()
    form.append('file', file)
    form.append('fileName', file.name.replace(/[^a-zA-Z0-9._-]/g, '_'))
    form.append('publicKey', auth.publicKey)
    form.append('signature', auth.signature)
    form.append('expire', auth.expire)
    form.append('token', auth.token)
    form.append('folder', auth.folder)
    form.append('useUniqueFileName', 'true')

    const { data: uploaded } = await axios.post('https://upload.imagekit.io/api/v1/files/upload', form, {
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
        }
      },
    })

    return api.post('/music', { ...details, uri: uploaded.url })
  },
  getAllMusic: () => api.get('/getmusic'),
  getAlbums: () => api.get('/getalbum'),
  createAlbum: (data) => api.post('/album', data),
}

export default api
