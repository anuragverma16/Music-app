const mongoose = require("mongoose");
const Music = require("../models/music");
const album = require("../models/album");
const { uploadFile } = require("../services/storage.service.js");

const createmusic = async (req, res) => {
  try {
    const file = req.file;
    const { title, artist, album: albumName, genre, lyrics } = req.body;
    const artistId = req.user?._id;

    if (!file) {
      return res.status(400).json({
        message: "Music audio file is required",
      });
    }

    if (!title) {
      return res.status(400).json({
        message: "Music title is required",
      });
    }

    console.log("Starting ImageKit upload for file:", file.originalname, "size:", file.size);

    // Upload music to ImageKit
    const result = await uploadFile(file);

    console.log("ImageKit Upload Successful. URL:", result.url);

    // Determine artist display name
    const artistDisplayName = artist || req.user?.name || "Beatly Artist";

    // Random aesthetic album cover for uploaded music if not provided
    const DEFAULT_COVERS = [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
    ];
    const randomCover = DEFAULT_COVERS[Math.floor(Math.random() * DEFAULT_COVERS.length)];

    const musicData = {
      uri: result.url,
      title: title.trim(),
      artistName: artistDisplayName,
      album: albumName ? albumName.trim() : "Single",
      genre: genre || "Electronic",
      coverUrl: randomCover,
      lyrics: lyrics || "",
      duration: 200,
    };

    if (artistId && mongoose.Types.ObjectId.isValid(artistId)) {
      musicData.artist = artistId;
    }

    const createdSong = await Music.create(musicData);

    return res.status(201).json({
      message: "Music created successfully",
      music: createdSong,
    });
  } catch (error) {
    console.error("Error creating music:", error);
    return res.status(500).json({
      message: error.message || "Failed to upload music",
      error: error.message,
    });
  }
};

const getalbum = async (req, res) => {
  try {
    const { title, musics } = req.body;
    const artistId = req.user?._id;

    const result = await album.create({
      title,
      artist: artistId,
      music: musics,
    });

    return res.status(201).json({
      message: "Album created successfully!",
      album: result,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create album", error: error.message });
  }
};

const getallmusic = async (req, res) => {
  try {
    const musics = await Music.find().populate("artist", "name email").sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Music fetched successfully",
      music: {
        musics: musics || [],
      },
    });
  } catch (error) {
    console.error("Error fetching music:", error);
    return res.status(500).json({
      message: "Failed to fetch music",
      error: error.message,
    });
  }
};

const getalbums = async (req, res) => {
  try {
    const albums = await album.find().populate("music");
    return res.status(200).json({
      message: "Albums fetched successfully!",
      albums: albums || [],
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch albums", error: error.message });
  }
};

module.exports = { createmusic, getalbum, getallmusic, getalbums };
