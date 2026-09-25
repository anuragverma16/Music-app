const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");

const register = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json("All fields are required"); // in schema use required true if field is missing that give me error only not to know about what type of error so that that is required to what a error occour if field is missing
    }

    // check email is already existing or not

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json("Email already registered");
    }

    // bcrypted password
    const hashpassword = await bcrypt.hash(password, 10);

    // user create
    const createuser = await User.create({
      name,
      email,
      password: hashpassword,
      role,
    });

    // validate user
    const userrole = role == "user" ? "user" : "artist";

    //token create at register time
    const token = jwt.sign(
      {
        _id: createuser._id,
        role: createuser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    ); // token has 3 parts: header is algorithm || payload field is data || signature is standard of token

    // token store in browser cookies
    res.cookie("token", token); // small storage in browser that store token

    res.status(201).json({
      message: "User created successfully!",
      user: {
        _id: createuser._id,
        name: createuser.name,
        email: createuser.email,
        password: hashpassword,
        role: createuser.role,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internsl server error", error });
  }
};

//login

const login = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    const user =await User.findOne({ $or: [{ email }, { name }] });

    if (!user) {
      return res.status(400).json("User not found");
    }

    // compare password
    const match =await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json("Email or password not match");
    }

    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.cookie("token", token);

    return res.status(200).json({
      message: "User Login successfully!",
      token: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
    });

  } catch (error) {
    res.status(500).json({message:"Internal Server error",error})
  }
};

module.exports = { register, login };
