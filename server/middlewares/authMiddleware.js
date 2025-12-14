const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    console.log(`🔐 Auth middleware checking token for ${req.method} ${req.originalUrl}`);

    // Check both standard Authorization header and custom x-auth-token
    const authHeader = req.headers.authorization || req.headers['x-auth-token'];

    // Log simplified header info safely
    console.log("📋 Auth header found:", authHeader ? `Yes (${authHeader.substring(0, 10)}...)` : "Missing");

    let token;
    if (authHeader) {
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      } else {
        token = authHeader;
      }
    }

    if (!token) {
      console.log("❌ No token provided in headers");
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