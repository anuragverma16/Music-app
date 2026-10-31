const express = require("express");
const musicController = require("../controllers/musicController");
const multer = require("multer");
const { authartist, authUser } = require("../middleware/auth.middleware");

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

router.post(
  "/upload-music",
  authartist,
  upload.single("music"),
  musicController.createmusic,
);

// fast path: browser uploads to ImageKit directly, then saves the details here
router.get("/upload-auth", authartist, musicController.uploadauth);
router.post("/music", authartist, musicController.savemusic);

router.post("/album", authartist, musicController.getalbum);

router.get("/getmusic", authUser, musicController.getallmusic);

router.get("/getalbum",authUser,musicController.getalbums)

// search any song from free catalogs (Deezer, plus Jamendo full tracks when keyed)
router.get("/search", authUser, musicController.searchmusic)

module.exports = router;
