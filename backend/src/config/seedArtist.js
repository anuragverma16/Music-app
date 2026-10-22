const bcrypt = require("bcrypt");
const User = require("../models/User");

// The artist panel has a single account, defined by env vars.
// Sign-up can only create listeners, so this is the only way to get an artist.
const seedArtist = async () => {
  const email = process.env.ARTIST_EMAIL?.trim().toLowerCase();
  const password = process.env.ARTIST_PASSWORD;
  const name = process.env.ARTIST_NAME || "Beatly Artist";

  if (!email || !password) {
    console.warn("ARTIST_EMAIL / ARTIST_PASSWORD not set: artist panel login is disabled");
    return;
  }

  const hashpassword = await bcrypt.hash(password, 10);

  // create the artist, or keep it in sync with the env vars on every start
  await User.findOneAndUpdate(
    { email },
    { name, email, password: hashpassword, role: "artist" },
    { upsert: true, setDefaultsOnInsert: true },
  );

  // keep exactly one artist: if ARTIST_EMAIL changed, the old account becomes a listener
  await User.updateMany({ role: "artist", email: { $ne: email } }, { role: "user" });

  console.log(`Artist account ready: ${email}`);
};

module.exports = seedArtist;
