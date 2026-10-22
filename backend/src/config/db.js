const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected");
  } catch (error) {
    console.error("Database error:", error.message);
    // exit so Render marks the deploy as failed instead of serving a broken API
    process.exit(1);
  }
};

module.exports = connectDB;
