const db = require("../config/firebase");

// Add a new entry
const addEntry = async (req, res) => {
  const { date, sleepTime, wakeTime, duration } = req.body;
  const userId = req.userId;

  if (!date || !sleepTime || !wakeTime || !duration) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const entryRef = db.ref(`entries/${userId}`);
  const newEntryKey = entryRef.push().key;

  const newEntry = { date, sleepTime, wakeTime, duration, id: newEntryKey };

  await entryRef.child(newEntryKey).set(newEntry);
  res.json({ message: "Entry added", entry: newEntry });
};

// Get all entries for user
const getEntries = async (req, res) => {
  const userId = req.userId;
  const entryRef = db.ref(`entries/${userId}`);
  const snapshot = await entryRef.once("value");

  const entries = [];
  snapshot.forEach(child => {
    entries.push(child.val());
  });

  // Sort by date descending (latest first)
  entries.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json(entries);
};

module.exports = { addEntry, getEntries };