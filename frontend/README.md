# Beatly Frontend

A modern, attractive music streaming platform frontend built with React, Vite, Tailwind CSS, and GSAP animations.

## 🎵 Features

- **Modern UI/UX** - Beautiful gradient designs and smooth animations
- **GSAP Animations** - Smooth transitions and dynamic visual effects
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Music Player** - Built-in player with controls and progress tracking
- **User Authentication** - Login and registration for listeners and artists
- **Song Library** - Browse, search, and like songs
- **Artist Upload** - Artists can upload their music directly
- **Dynamic Content** - Real-time integration with backend API

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create .env file** (in root directory)
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Main layout wrapper
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   ├── MusicPlayer.jsx     # Music player component
│   │   └── SongCard.jsx        # Reusable song card
│   ├── pages/
│   │   ├── Auth.jsx            # Login/Register page
│   │   ├── Home.jsx            # Home page with featured songs
│   │   ├── Explore.jsx         # Explore songs by category
│   │   ├── Library.jsx         # Liked songs library
│   │   └── Upload.jsx          # Artist upload page
│   ├── utils/
│   │   ├── auth.js             # Authentication utilities
│   │   └── api.js              # API calls with axios
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles with Tailwind
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
└── postcss.config.js           # PostCSS config
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to change brand colors:
```javascript
colors: {
  primary: '#00d4ff',    // Cyan
  secondary: '#1a1a2e',  // Dark blue
  accent: '#ff006e',     // Pink
}
```

### Fonts
Modify `index.css` to use different fonts from Google Fonts.

### API Endpoint
Update the `API_BASE_URL` in `src/utils/api.js`:
```javascript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api'
```

## 🔗 Backend Integration

The frontend expects the following API endpoints:

### Authentication
- `POST /api/register` - User registration
- `GET /api/login` - User login

### Music
- `POST /api/upload-music` - Upload song (artist only)
- `GET /api/getmusic` - Get all songs
- `POST /api/album` - Create album
- `GET /api/getalbum` - Get all albums

## 🎯 Key Technologies

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **GSAP** - Animations
- **React Router** - Routing
- **Axios** - HTTP client
- **Lucide React** - Icons

## 📝 Usage Examples

### Playing a Song
Click the play button on any song card to play it in the player.

### Uploading Music (Artists)
1. Navigate to "Upload Music" (visible only for artists)
2. Fill in song details
3. Drag or click to upload audio file
4. Click "Upload Song"

### Liking Songs
Click the heart icon on any song card to add it to your library.

## 🐛 Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your backend has proper CORS configuration:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
```

### API Connection
Check that:
1. Backend is running on the correct port (5000)
2. Environment variables are set correctly
3. Network requests are visible in browser DevTools

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.18.0",
  "axios": "^1.6.0",
  "gsap": "^3.12.2",
  "lucide-react": "^0.294.0"
}
```

## 🚢 Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

**Made with ❤️ for music lovers**
