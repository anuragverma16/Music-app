const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  music: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "music",
    },
  ],

  artist: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
});

const album = mongoose.model("album", albumSchema);

module.exports = album;