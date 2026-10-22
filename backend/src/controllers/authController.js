const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const TOKEN_EXPIRY = process.env.JWT_EXPIRES_IN || "7d";
const isProduction = process.env.NODE_ENV === "production";

// frontend (Vercel) and backend (Render) live on different domains,
// so the cookie must be SameSite=None + Secure in production
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const signToken = (user) =>
  jwt.sign({ _id: user._id, name: user.name, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role || "user",
});

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // check email is already existing or not
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const createuser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashpassword,
      // sign-up always creates a listener; the artist account comes from env (see seedArtist)
      role: "user",
    });

    const token = signToken(createuser);
    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "User created successfully!",
      token,
      user: publicUser(createuser),
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    // same message for both cases so emails can't be enumerated
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = signToken(user);
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "User Login successfully!",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", { ...cookieOptions, maxAge: undefined });
  return res.status(200).json({ message: "Logged out" });
};

module.exports = { register, login, logout };
