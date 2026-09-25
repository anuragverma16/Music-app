const mongoose = require("mongoose");

const MONGODB = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB);
    console.log("Database Connected");
  } catch (error) {
    console.log("Database error:", error.message);
  }
};

module.exports = connectDB ;