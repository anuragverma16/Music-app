const jwt = require("jsonwebtoken");

const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return req.cookies?.token;
};

const authartist = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized access, please login as an artist",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (decode.role !== "artist") {
      return res.status(403).json({
        message: "You do not have access to upload music. Artist role required.",
      });
    }

    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const authUser = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next();
  }
};

module.exports = { authartist, authUser };
