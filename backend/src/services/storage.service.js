const { ImageKit } = require("@imagekit/nodejs");

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile(file) {
  const originalName = file.originalname ? file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_") : "track.mp3";
  const fileName = `music_${Date.now()}_${originalName}`;

  const result = await client.files.upload({
    file: file.buffer.toString("base64"),
    fileName: fileName,
    folder: "spotify-app/music",
  });

  return result;
}

module.exports = { uploadFile };