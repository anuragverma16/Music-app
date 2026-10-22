# Quick Start Guide

## 🎯 Local Development (5 Minutes)

### 1️⃣ Start Backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

### 2️⃣ Start Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### 3️⃣ Test
- Open http://localhost:3000
- Backend API: http://localhost:5000/api

---

## 🌐 Production Deployment (Render + Vercel)

### Backend on Render
```
URL: https://your-backend.onrender.com
Environment Variables:
  - MONGO_URI (MongoDB Atlas connection)
  - JWT_SECRET
  - IMAGEKIT_PRIVATE_KEY
  - FRONTEND_URL = https://your-frontend.vercel.app
```

### Frontend on Vercel
```
URL: https://your-frontend.vercel.app
Environment Variables:
  - VITE_API_URL = https://your-backend.onrender.com/api
```

---

## 📝 Environment Variables Summary

### Backend (.env)
| Variable | Local | Production |
|----------|-------|------------|
| PORT | 5000 | 5000 |
| NODE_ENV | development | production |
| MONGO_URI | localhost:27017 | MongoDB Atlas |
| JWT_SECRET | your_secret | strong_key |
| FRONTEND_URL | http://localhost:3000 | https://vercel.app |

### Frontend (.env)
| Variable | Local | Production |
|----------|-------|------------|
| VITE_API_URL | http://localhost:5000/api | https://render.onrender.com/api |

---

## 🔗 API Endpoints

All endpoints require authentication (JWT token in headers)

```
POST   /api/register          - User registration
POST   /api/login             - User login
POST   /api/upload-music      - Upload music file
POST   /api/album             - Create album
GET    /api/getmusic          - Get all music
GET    /api/getalbum          - Get all albums
```

---

## ✨ Key Features Configured

✅ Express + MongoDB backend  
✅ React + Vite frontend  
✅ JWT authentication  
✅ File upload with ImageKit  
✅ CORS properly configured  
✅ Cookie-based sessions  
✅ Production-ready deployment  

---

## 📚 Full Guide
See `DEPLOYMENT_GUIDE.md` for detailed instructions
