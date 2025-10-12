const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    console.log("🔐 Auth middleware checking token...");
    const authHeader = req.headers.authorization;
    console.log("📋 Auth header:", authHeader ? "Present" : "Missing");
    
    const token = authHeader?.split(" ")[1];
    if (!token) {
      console.log("❌ No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

    console.log("🔍 Verifying JWT token...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified, user ID:", decoded.userId);
    
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log("❌ Token verification failed:", err.message);
    res.status(403).json({ message: "Invalid token", error: err.message });
  }
};

module.exports = authMiddleware;