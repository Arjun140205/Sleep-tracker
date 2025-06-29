const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/firebase");

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const userRef = db.ref("users");
  const snapshot = await userRef.orderByChild("email").equalTo(email).once("value");

  if (snapshot.exists()) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { name, email, password: hashedPassword };
  const userKey = userRef.push().key;
  await userRef.child(userKey).set(newUser);

  const token = jwt.sign({ userId: userKey }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const userRef = db.ref("users");
  const snapshot = await userRef.orderByChild("email").equalTo(email).once("value");

  if (!snapshot.exists()) {
    return res.status(400).json({ message: "Invalid email" });
  }

  let userData, userKey;
  snapshot.forEach(child => {
    userData = child.val();
    userKey = child.key;
  });

  const match = await bcrypt.compare(password, userData.password);
  if (!match) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ userId: userKey }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
};

module.exports = { signup, login };