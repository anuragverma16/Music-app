const { ImageKit } = require("@imagekit/nodejs");

const MUSIC_FOLDER = "spotify-app/music";

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

// Signed params that let the browser upload straight to ImageKit,
// so the audio file never has to pass through our server
function getUploadAuth() {
  const { token, expire, signature } = client.helper.getAuthenticationParameters();
  return {
    token,
    expire,
    signature,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    folder: MUSIC_FOLDER,
  };
}

async function uploadFile(file) {
  const originalName = file.originalname ? file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_") : "track.mp3";
  const fileName = `music_${Date.now()}_${originalName}`;

  const result = await client.files.upload({
    file: file.buffer.toString("base64"),
    fileName: fileName,
    folder: MUSIC_FOLDER,
  });

  return result;
}

module.exports = { uploadFile, getUploadAuth };
