const db = require("../config/firebase");

// Get user goals
const getUserGoals = async (req, res) => {
  try {
    const userId = req.userId;
    const goalsRef = db.ref(`userGoals/${userId}`);
    const snapshot = await goalsRef.once("value");

    if (snapshot.exists()) {
      res.json(snapshot.val());
    } else {
      // Return default goals if none exist
      const defaultGoals = {
        targetSleepHours: 7,
        targetBedtime: "23:00",
        targetWakeTime: "07:00",
        reminderEnabled: true
      };
      res.json(defaultGoals);
    }
  } catch (error) {
    console.error("Get goals error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Update user goals
const updateUserGoals = async (req, res) => {
  try {
    const userId = req.userId;
    const { targetSleepHours, targetBedtime, targetWakeTime, reminderEnabled } = req.body;

    if (!targetSleepHours || !targetBedtime || !targetWakeTime) {
      return res.status(400).json({ message: "All goal fields are required" });
    }

    const goals = {
      targetSleepHours: parseFloat(targetSleepHours),
      targetBedtime,
      targetWakeTime,
      reminderEnabled: Boolean(reminderEnabled),
      updatedAt: new Date().toISOString()
    };

    const goalsRef = db.ref(`userGoals/${userId}`);
    await goalsRef.set(goals);

    res.json({ message: "Goals updated successfully", goals });
  } catch (error) {
    console.error("Update goals error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const userRef = db.ref(`users/${userId}`);
    const snapshot = await userRef.once("value");

    if (snapshot.exists()) {
      const userData = snapshot.val();
      // Don't send password
      delete userData.password;
      res.json(userData);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const updates = {
      name,
      email,
      updatedAt: new Date().toISOString()
    };

    const userRef = db.ref(`users/${userId}`);
    await userRef.update(updates);

    res.json({ message: "Profile updated successfully", user: updates });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { 
  getUserGoals, 
  updateUserGoals, 
  getUserProfile, 
  updateUserProfile 
};