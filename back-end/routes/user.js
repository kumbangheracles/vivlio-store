const express = require("express");
const path = require("path");
const router = express.Router();
const User = require("../models/user");
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");

router.use(authMiddleware);

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
router.patch(
  "/:username",
  authMiddleware,
  checkRole("admin"),
  async (req, res) => {
    try {
      const { username } = req.params;
      await User.update(req.body, { where: { username } });
      res.json({ message: "User updated successfully" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Delete User
router.delete(
  "/:username",
  authMiddleware,
  checkRole("admin"),
  async (req, res) => {
    try {
      const { username } = req.params;
      await Book.destroy({ where: { username } });
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get("/", authMiddleware, checkRole("admin"), async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

module.exports = router;
