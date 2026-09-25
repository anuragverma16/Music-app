# Beatly - Complete Setup Guide

A full-stack music streaming platform with React Vite frontend and Node.js backend.

## 📋 Project Structure

```
Revision/Nodejs/spotify/
├── backend/              # Node.js/Express API
└── frontend/             # React Vite application
```

## 🚀 Getting Started

### Step 1: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file** with your configuration
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/beatly
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

### Step 2: Frontend Setup

1. **Navigate to frontend directory** (in another terminal)
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

## 🎯 Usage

### 1. **Register/Login**
   - Go to `http://localhost:3000`
   - Choose between "Listener" or "Artist" role
   - Complete registration

### 2. **Browse Music** (All Users)
   - **Home** - View recently added songs
   - **Explore** - Browse music by categories
   - **Library** - Access your liked songs

### 3. **Upload Music** (Artists Only)
   - Click "Upload Music" in sidebar
   - Fill in song details (title, artist, album, genre)
   - Upload audio file via drag & drop or file picker
   - Song will be available to all users

### 4. **Play Music**
   - Click play button on any song card
   - Use player controls at the bottom
   - Adjust volume and track progress

## 🎨 Features

### Frontend
✅ Modern, attractive UI with gradient designs
✅ Smooth GSAP animations throughout
✅ Fully responsive (mobile, tablet, desktop)
✅ Real-time music player with controls
✅ Song library management
✅ Artist upload functionality
✅ Category browsing
✅ Tailwind CSS styling

### Backend
✅ User authentication (JWT)
✅ Role-based access (User/Artist)
✅ Music file upload
✅ Album management
✅ MongoDB integration
✅ RESTful API

## 📱 API Endpoints

### Authentication
- `POST /api/register` - Create new account
- `GET /api/login` - Login to account

### Music
- `GET /api/getmusic` - Fetch all songs
- `POST /api/upload-music` - Upload new song (artist)
- `POST /api/album` - Create album (artist)
- `GET /api/getalbum` - Get all albums

## 🔑 Default Credentials

Test the app with these example credentials:

**Listener Account:**
- Email: `listener@test.com`
- Password: `password123`
- Role: user

**Artist Account:**
- Email: `artist@test.com`
- Password: `password123`
- Role: artist

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **GSAP 3** - Animations
- **Axios** - HTTP client
- **React Router v6** - Routing

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads

## ⚙️ Configuration

### Backend .env
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/beatly
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Frontend .env
```env
VITE_API_URL=http://localhost:5000/api
```

## 📦 Installation Issues

### Issue: Port 3000 or 5000 already in use
**Solution:** Change ports in:
- Frontend: `vite.config.js` - `server.port`
- Backend: `.env` - `PORT`

### Issue: MongoDB connection error
**Solution:** Ensure MongoDB is running:
```bash
mongod
```

### Issue: CORS error
**Solution:** Backend must have CORS enabled. Check backend middleware configuration.

## 🧪 Testing the Application

1. **Register as Artist**
   - Register with role "Artist"
   - Go to "Upload Music"
   - Upload a test song

2. **View as Listener**
   - Register/login as Listener
   - Go to "Explore" to see uploaded songs
   - Like and play songs

3. **Check Music Player**
   - Click play on any song
   - Test progress bar, volume control
   - Verify time display

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "user" | "artist",
  createdAt: Date
}
```

### Music Collection
```javascript
{
  _id: ObjectId,
  title: String,
  artist: String,
  album: String,
  genre: String,
  url: String,
  image: String,
  uploadedBy: ObjectId (User),
  createdAt: Date
}
```

### Album Collection
```javascript
{
  _id: ObjectId,
  name: String,
  artist: String,
  songs: [ObjectId],
  image: String,
  createdAt: Date
}
```

## 🚢 Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

### Deploy Frontend
- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod --dir=dist`
- **AWS S3**: Upload `dist` folder

### Deploy Backend
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo
- **Render**: Connect GitHub repo
- **AWS EC2**: Use PM2 for process management

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [GSAP Docs](https://gsap.com)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)

## 🤝 Support

If you encounter issues:
1. Check console for error messages
2. Verify both servers are running
3. Check `.env` file configuration
4. Ensure MongoDB is accessible
5. Review API responses in browser DevTools

## 📄 License

MIT License - Free to use and modify

---

**Happy music streaming! 🎵**
