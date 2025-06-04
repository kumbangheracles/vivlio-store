const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/me", authMiddleware, authController.me);
module.exports = router;
