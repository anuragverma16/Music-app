require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const seedArtist = require("./config/seedArtist");
const userRoutes = require("./routes/UserRoutes.js");
const musicroutes = require("./routes/musicRoutes");

const REQUIRED_ENV = ["MONGO_URI", "JWT_SECRET", "IMAGEKIT_PRIVATE_KEY", "IMAGEKIT_PUBLIC_KEY"];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// FRONTEND_URL can be a comma separated list, e.g.
// https://beatly.vercel.app,http://localhost:3000
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""))
  .filter(Boolean);

// Render sits behind a proxy; needed for secure cookies
app.set("trust proxy", 1);

//middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser requests (curl, health checks) and whitelisted origins
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }));

app.use("/api", userRoutes);
app.use("/api", musicroutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

connectDB()
  .then(seedArtist)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Startup error:", error.message);
    process.exit(1);
  });
