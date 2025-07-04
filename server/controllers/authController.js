const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/firebase");

const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const userRef = db.ref("users");
    const snapshot = await userRef.orderByChild("email").equalTo(email).once("value");

    if (snapshot.exists()) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { 
      name: name || email.split('@')[0], // Use email username if name not provided
      email, 
      password: hashedPassword 
    };
    
    const userKey = userRef.push().key;
    await userRef.child(userKey).set(newUser);

    const token = jwt.sign({ userId: userKey }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: userKey, email, name: newUser.name } });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

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

    const match = await bcrypt.compare(password, userData.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: userKey }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: userKey, email: userData.email, name: userData.name } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { signup, login };