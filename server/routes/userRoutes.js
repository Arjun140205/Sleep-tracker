const express = require("express");
const router = express.Router();
const { 
  getUserGoals, 
  updateUserGoals, 
  getUserProfile, 
  updateUserProfile 
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// Goals routes
router.get("/goals", authMiddleware, getUserGoals);
router.put("/goals", authMiddleware, updateUserGoals);

// Profile routes
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);

module.exports = router;