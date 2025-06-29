const express = require("express");
const router = express.Router();
const { addEntry, getEntries } = require("../controllers/entryController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/entries", authMiddleware, addEntry);
router.get("/entries", authMiddleware, getEntries);

module.exports = router;