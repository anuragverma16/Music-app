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

router.post("/album", authartist, musicController.getalbum);

router.get("/getmusic", authUser, musicController.getallmusic);

router.get("/getalbum",authUser,musicController.getalbums)

module.exports = router;
