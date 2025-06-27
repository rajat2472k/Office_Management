const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Token error:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access only" });
  }
  next();
};

exports.isManager = (req, res, next) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ error: "Manager access only" });
  }
  next();
};

exports.isUser = (req, res, next) => {
  if (!req.user || req.user.role !== "user") {
    return res.status(403).json({ error: "User access only" });
  }
  next();
};
