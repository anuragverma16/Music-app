const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const connectDB  = require("./config/db");
const userRoutes=require("./routes/UserRoutes.js")
const musicroutes=require("./routes/musicRoutes")

const PORT = process.env.PORT || 5000;

// DB connection
connectDB();

//middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use("/api",userRoutes);
app.use("/api",musicroutes);


app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
