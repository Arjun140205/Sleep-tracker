const db = require("../config/firebase");

// Add a new entry
const addEntry = async (req, res) => {
  const startTime = Date.now();
  try {
    console.log("📝 Entry creation request started");
    console.log("📋 Request body:", req.body);
    console.log("👤 User ID:", req.userId);

    const { date, sleepTime, wakeTime, duration } = req.body;
    const userId = req.userId;

    // Validate required fields
    if (!date || !sleepTime || !wakeTime || !duration) {
      console.log("❌ Missing required fields:", { date, sleepTime, wakeTime, duration });
      return res.status(400).json({ 
        message: "All fields are required",
        received: { date, sleepTime, wakeTime, duration }
      });
    }

    // Validate userId from auth middleware
    if (!userId) {
      console.log("❌ No user ID from auth middleware");
      return res.status(401).json({ message: "Authentication required" });
    }

    console.log("💾 Saving entry to database...");
    const entryRef = db.ref(`entries/${userId}`);
    const newEntryKey = entryRef.push().key;

    const newEntry = { date, sleepTime, wakeTime, duration, id: newEntryKey };

    await entryRef.child(newEntryKey).set(newEntry);
    
    const duration_ms = Date.now() - startTime;
    console.log(`✅ Entry added successfully in ${duration_ms}ms`);
    
    res.json({ message: "Entry added", entry: newEntry });
  } catch (error) {
    const duration_ms = Date.now() - startTime;
    console.error(`❌ Entry creation error after ${duration_ms}ms:`, error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get all entries for user
const getEntries = async (req, res) => {
  const startTime = Date.now();
  try {
    console.log("📖 Fetching entries for user:", req.userId);
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const entryRef = db.ref(`entries/${userId}`);
    const snapshot = await entryRef.once("value");

    const entries = [];
    snapshot.forEach(child => {
      entries.push(child.val());
    });

    // Sort by date descending (latest first)
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    const duration = Date.now() - startTime;
    console.log(`✅ Retrieved ${entries.length} entries in ${duration}ms`);

    res.json(entries);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Get entries error after ${duration}ms:`, error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { addEntry, getEntries };