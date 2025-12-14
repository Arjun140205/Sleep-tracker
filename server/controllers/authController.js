const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Switched to bcryptjs for better Vercel compatibility
const db = require("../config/firebase");

const signup = async (req, res) => {
  const startTime = Date.now();
  console.log("🔐 Signup request received");

  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }

    console.log("📧 Checking if user exists...");
    const userRef = db.ref("users");
    const snapshot = await userRef.orderByChild("email").equalTo(email).once("value");

    if (snapshot.exists()) {
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("🔒 Hashing password...");
    // Use fewer rounds for development (faster), more for production
    const saltRounds = process.env.NODE_ENV === 'production' ? 12 : 8;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = {
      name: name || email.split('@')[0], // Use email username if name not provided
      email,
      password: hashedPassword
    };

    console.log("💾 Saving user to database...");
    const userKey = userRef.push().key;
    await userRef.child(userKey).set(newUser);

    console.log("🎫 Generating JWT token...");
    const token = jwt.sign({ userId: userKey }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const duration = Date.now() - startTime;
    console.log(`✅ Signup completed in ${duration}ms`);

    res.json({ token, user: { id: userKey, email, name: newUser.name } });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Signup error after ${duration}ms:`, error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const login = async (req, res) => {
  const startTime = Date.now();
  try {
    console.log("🔐 Login request started");
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    console.log("🔍 Looking up user...");
    const userRef = db.ref("users");
    const snapshot = await userRef.orderByChild("email").equalTo(email).once("value");

    if (!snapshot.exists()) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    let userData, userKey;
    snapshot.forEach(child => {
      userData = child.val();
      userKey = child.key;
    });

    console.log("🔒 Verifying password...");
    const match = await bcrypt.compare(password, userData.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("🎫 Generating JWT token...");
    const token = jwt.sign({ userId: userKey }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const duration = Date.now() - startTime;
    console.log(`✅ Login completed in ${duration}ms`);

    res.json({ token, user: { id: userKey, email: userData.email, name: userData.name } });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Login error after ${duration}ms:`, error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { signup, login };