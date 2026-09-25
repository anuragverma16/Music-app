const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema(
  {
    uri: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    artistName: {
      type: String,
      default: "Beatly Artist",
    },
    album: {
      type: String,
      default: "Single",
    },
    genre: {
      type: String,
      default: "Electronic",
    },
    coverUrl: {
      type: String,
      default: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    },
    duration: {
      type: Number,
      default: 180,
    },
    plays: {
      type: Number,
      default: 0,
    },
    lyrics: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const music = mongoose.model("music", musicSchema);

module.exports = music;