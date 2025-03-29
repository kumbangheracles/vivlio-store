const express = require("express");
const path = require("path");
const router = express.Router();
const User = require("../models/user");
const { route } = require("./image");

// create user
router.post("/create", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update user
router.put("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    await User.update(req.body, { where: { username } });
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete User
router.delete("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    await Book.destroy({ where: { username } });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
