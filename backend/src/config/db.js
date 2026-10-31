const mongoose = require("mongoose");

const MAX_ATTEMPTS = 5;
const RETRY_DELAY_MS = 3000;

const options = {
  // fail in 5s instead of mongoose's default 30s when Atlas can't be reached
  serverSelectionTimeoutMS: 5000,
  // Render and some networks resolve IPv6 first and stall; force IPv4
  family: 4,
  // keep a small warm pool so requests don't wait on new TLS handshakes
  maxPoolSize: 10,
  minPoolSize: 2,
  socketTimeoutMS: 45000,
};

mongoose.connection.on("disconnected", () => console.warn("Database disconnected"));
mongoose.connection.on("reconnected", () => console.log("Database reconnected"));

const connectDB = async () => {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await mongoose.connect(process.env.MONGO_URI, options);
      console.log("Database Connected");
      return;
    } catch (error) {
      console.error(`Database error (attempt ${attempt}/${MAX_ATTEMPTS}):`, error.message);
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }
  // exit so Render marks the deploy as failed instead of serving a broken API
  process.exit(1);
};

module.exports = connectDB;
