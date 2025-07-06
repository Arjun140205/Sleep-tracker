const express = require("express");
const router = express.Router();
const { addEntry, getEntries } = require("../controllers/entryController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, addEntry);
router.get("/", authMiddleware, getEntries);

module.exports = router;